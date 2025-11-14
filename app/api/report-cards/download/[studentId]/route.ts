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

// GET /api/report-cards/download/[studentId] - Get report card data formatted for PDF generation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params
    const { searchParams } = new URL(request.url)
    const term = searchParams.get("term")
    const academicYear = searchParams.get("academicYear")

    if (!term || !academicYear) {
      return NextResponse.json(
        { success: false, error: "Term and academic year are required" },
        { status: 400 }
      )
    }

    // Fetch student details
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: true,
        class: true,
      },
    })

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      )
    }

    // Fetch all grades for the student in the specified term
    const grades = await prisma.grade.findMany({
      where: {
        studentId,
        term,
        academicYear,
      },
      orderBy: {
        subject: "asc",
      },
    })

    if (grades.length === 0) {
      return NextResponse.json(
        { success: false, error: "No grades available for this term" },
        { status: 404 }
      )
    }

    // Format grades for PDF table
    const gradesForPDF = grades.map((grade) => {
      const percentage = (grade.marks / grade.totalMarks) * 100
      return [
        grade.subject,
        `${grade.marks}/${grade.totalMarks}`,
        calculateLetterGrade(percentage),
        grade.remarks || "-",
      ]
    })

    // Calculate overall statistics
    const totalMarks = grades.reduce((sum, g) => sum + g.totalMarks, 0)
    const marksObtained = grades.reduce((sum, g) => sum + g.marks, 0)
    const overallPercentage = (marksObtained / totalMarks) * 100

    // Calculate class rank
    const allStudentsInClass = await prisma.student.findMany({
      where: {
        classId: student.classId,
      },
      include: {
        grades: {
          where: {
            term,
            academicYear,
          },
        },
      },
    })

    // Calculate average for each student
    const studentAverages = allStudentsInClass
      .map((s) => {
        if (s.grades.length === 0) return null
        const total = s.grades.reduce((sum, g) => sum + g.totalMarks, 0)
        const obtained = s.grades.reduce((sum, g) => sum + g.marks, 0)
        return {
          studentId: s.id,
          average: (obtained / total) * 100,
        }
      })
      .filter((s) => s !== null) as { studentId: string; average: number }[]

    // Sort by average descending
    studentAverages.sort((a, b) => b.average - a.average)

    // Find rank
    const rank = studentAverages.findIndex((s) => s.studentId === studentId) + 1
    const totalStudents = studentAverages.length

    // Format data for PDF generation (matching existing generateReportCard format)
    const pdfData = {
      name: student.user.fullName,
      studentId: student.rollNumber,
      class: student.class.name,
      academicYear: academicYear,
      term: term,
      grades: gradesForPDF,
      totalScore: Math.round(marksObtained * 10) / 10,
      average: Math.round(overallPercentage * 10) / 10,
      position: `${rank} of ${totalStudents}`,
    }

    return NextResponse.json({ success: true, data: pdfData })
  } catch (error) {
    console.error("[report-cards/download/studentId] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch report card data" },
      { status: 500 }
    )
  }
}
