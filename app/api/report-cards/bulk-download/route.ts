import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Helper function to calculate letter grade
function calculateLetterGrade(percentage: number): string {
  if (percentage >= 80) return "A"
  if (percentage >= 70) return "B"
  if (percentage >= 60) return "C"
  if (percentage >= 50) return "D"
  return "F"
}

// POST /api/report-cards/bulk-download - Get report card data for multiple students
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { classId, term, academicYear } = body

    if (!classId || !term || !academicYear) {
      return NextResponse.json(
        { success: false, error: "Class ID, term, and academic year are required" },
        { status: 400 }
      )
    }

    // Fetch all students in the class
    const students = await prisma.student.findMany({
      where: {
        classId,
      },
      include: {
        user: true,
        class: true,
      },
      orderBy: {
        rollNumber: "asc",
      },
    })

    if (students.length === 0) {
      return NextResponse.json(
        { success: false, error: "No students found in this class" },
        { status: 404 }
      )
    }

    // Fetch all grades for all students in the class for the specified term
    const allGrades = await prisma.grade.findMany({
      where: {
        student: {
          classId,
        },
        term,
        academicYear,
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    })

    // Group grades by student
    const gradesByStudent = allGrades.reduce((acc, grade) => {
      if (!acc[grade.studentId]) {
        acc[grade.studentId] = []
      }
      acc[grade.studentId].push(grade)
      return acc
    }, {} as Record<string, typeof allGrades>)

    // Calculate averages for ranking
    const studentAverages = students
      .map((student) => {
        const studentGrades = gradesByStudent[student.id] || []
        if (studentGrades.length === 0) return null

        const total = studentGrades.reduce((sum, g) => sum + g.totalMarks, 0)
        const obtained = studentGrades.reduce((sum, g) => sum + g.marks, 0)
        return {
          studentId: student.id,
          average: (obtained / total) * 100,
        }
      })
      .filter((s) => s !== null) as { studentId: string; average: number }[]

    // Sort by average descending for ranking
    studentAverages.sort((a, b) => b.average - a.average)

    // Generate report card data for each student
    const reportCards = students.map((student) => {
      const studentGrades = gradesByStudent[student.id] || []

      if (studentGrades.length === 0) {
        return {
          studentId: student.id,
          hasGrades: false,
          data: null,
        }
      }

      // Format grades for PDF
      const gradesForPDF = studentGrades
        .sort((a, b) => a.subject.localeCompare(b.subject))
        .map((grade) => {
          const percentage = (grade.marks / grade.totalMarks) * 100
          return [
            grade.subject,
            `${grade.marks}/${grade.totalMarks}`,
            calculateLetterGrade(percentage),
            grade.remarks || "-",
          ]
        })

      // Calculate statistics
      const totalMarks = studentGrades.reduce((sum, g) => sum + g.totalMarks, 0)
      const marksObtained = studentGrades.reduce((sum, g) => sum + g.marks, 0)
      const overallPercentage = (marksObtained / totalMarks) * 100

      // Find rank
      const rank =
        studentAverages.findIndex((s) => s.studentId === student.id) + 1

      return {
        studentId: student.id,
        hasGrades: true,
        data: {
          name: student.user.fullName,
          studentId: student.rollNumber,
          class: student.class.name,
          academicYear: academicYear,
          term: term,
          grades: gradesForPDF,
          totalScore: Math.round(marksObtained * 10) / 10,
          average: Math.round(overallPercentage * 10) / 10,
          position: `${rank} of ${studentAverages.length}`,
        },
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        reportCards,
        totalStudents: students.length,
        studentsWithGrades: reportCards.filter((r) => r.hasGrades).length,
      },
    })
  } catch (error) {
    console.error("[report-cards/bulk-download] POST error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to generate bulk report cards" },
      { status: 500 }
    )
  }
}
