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

// GET /api/report-cards/[studentId] - Get report card data for a student
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
        parent: {
          include: {
            user: true,
          },
        },
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
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
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

    // Calculate grades with percentages
    const gradesWithDetails = grades.map((grade) => {
      const percentage = (grade.marks / grade.totalMarks) * 100
      return {
        subject: grade.subject,
        marks: grade.marks,
        totalMarks: grade.totalMarks,
        percentage: Math.round(percentage * 10) / 10,
        grade: calculateLetterGrade(percentage),
        remarks: grade.remarks,
        teacher: grade.teacher.user.fullName,
      }
    })

    // Calculate overall statistics
    const totalMarks = grades.reduce((sum, g) => sum + g.totalMarks, 0)
    const marksObtained = grades.reduce((sum, g) => sum + g.marks, 0)
    const overallPercentage = (marksObtained / totalMarks) * 100
    const overallGrade = calculateLetterGrade(overallPercentage)

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

    // Fetch attendance data
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        studentId,
        date: {
          gte: new Date(`${academicYear}-01-01`),
          lte: new Date(`${academicYear}-12-31`),
        },
      },
    })

    const totalDays = attendanceRecords.length
    const presentDays = attendanceRecords.filter((a) => a.status === "PRESENT").length
    const absentDays = attendanceRecords.filter((a) => a.status === "ABSENT").length
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0

    // Build report card data
    const reportCardData = {
      student: {
        id: student.id,
        name: student.user.fullName,
        rollNumber: student.rollNumber,
        class: student.class.name,
        dateOfBirth: student.dateOfBirth.toISOString().split("T")[0],
      },
      term,
      academicYear,
      grades: gradesWithDetails,
      summary: {
        totalMarks,
        marksObtained: Math.round(marksObtained * 10) / 10,
        percentage: Math.round(overallPercentage * 10) / 10,
        overallGrade,
        classRank: rank,
        totalStudents,
      },
      attendance: {
        totalDays,
        present: presentDays,
        absent: absentDays,
        percentage: Math.round(attendancePercentage * 10) / 10,
      },
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, data: reportCardData })
  } catch (error) {
    console.error("[report-cards/studentId] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch report card" },
      { status: 500 }
    )
  }
}
