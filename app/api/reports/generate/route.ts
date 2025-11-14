import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reportType, filters } = body

    let reportData: any = {}

    switch (reportType) {
      case "attendance":
        reportData = await generateAttendanceReport(filters)
        break
      case "financial":
        reportData = await generateFinancialReport(filters)
        break
      case "academic":
        reportData = await generateAcademicReport(filters)
        break
      case "class-analysis":
        reportData = await generateClassAnalysisReport(filters)
        break
      case "teacher-performance":
        reportData = await generateTeacherPerformanceReport(filters)
        break
      case "exam-results":
        reportData = await generateExamResultsReport(filters)
        break
      default:
        return NextResponse.json(
          { success: false, error: "Invalid report type" },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: reportData,
    })
  } catch (error) {
    console.error("[reports/generate] Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to generate report" },
      { status: 500 }
    )
  }
}

// Generate Attendance Report
async function generateAttendanceReport(filters: any) {
  const { startDate, endDate, classId } = filters || {}

  const where: any = {}
  if (startDate && endDate) {
    where.date = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    }
  }
  if (classId) {
    where.student = {
      classId,
    }
  }

  const attendance = await prisma.attendance.findMany({
    where,
    include: {
      student: {
        include: {
          user: true,
          class: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  })

  const totalRecords = attendance.length
  const presentCount = attendance.filter((a) => a.status === "PRESENT").length
  const absentCount = attendance.filter((a) => a.status === "ABSENT").length
  const lateCount = attendance.filter((a) => a.status === "LATE").length

  return {
    period: `${startDate || "All time"} to ${endDate || "Present"}`,
    totalRecords,
    presentCount,
    absentCount,
    lateCount,
    attendanceRate: totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : 0,
    records: attendance.map((a) => ({
      date: a.date.toISOString().split("T")[0],
      studentName: a.student.user.fullName,
      studentId: a.student.rollNumber,
      class: a.student.class?.name || "N/A",
      status: a.status,
      time: a.createdAt.toLocaleTimeString(),
    })),
  }
}

// Generate Financial Report
async function generateFinancialReport(filters: any) {
  const classes = await prisma.class.findMany({
    include: {
      students: {
        include: {
          user: true,
        },
      },
    },
  })

  const details = classes.map((cls) => {
    const totalStudents = cls.students.length
    const feePerStudent = 500 // Default fee amount
    const expected = totalStudents * feePerStudent
    const collected = Math.floor(expected * 0.75) // Simulated 75% collection
    const outstanding = expected - collected
    const collectionRate = expected > 0 ? ((collected / expected) * 100).toFixed(1) : 0

    return {
      class: cls.name,
      totalStudents,
      expected: `GH₵ ${expected.toLocaleString()}`,
      collected: `GH₵ ${collected.toLocaleString()}`,
      outstanding: `GH₵ ${outstanding.toLocaleString()}`,
      collectionRate: `${collectionRate}%`,
    }
  })

  const totalExpected = details.reduce((sum, d) => sum + parseInt(d.expected.replace(/[^0-9]/g, "")), 0)
  const totalCollected = details.reduce((sum, d) => sum + parseInt(d.collected.replace(/[^0-9]/g, "")), 0)

  return {
    period: filters?.period || "Current Term",
    totalExpected,
    totalCollected,
    totalOutstanding: totalExpected - totalCollected,
    collectionRate: totalExpected > 0 ? ((totalCollected / totalExpected) * 100).toFixed(1) : 0,
    details,
  }
}

// Generate Academic Progress Report
async function generateAcademicReport(filters: any) {
  const students = await prisma.student.findMany({
    include: {
      user: true,
      class: true,
    },
    take: 50,
  })

  return {
    period: filters?.period || "Current Academic Year",
    totalStudents: students.length,
    students: students.map((s) => ({
      name: s.user.fullName,
      studentId: s.rollNumber,
      class: s.class?.name || "N/A",
      averageScore: "N/A",
      grade: "N/A",
      status: "Active",
    })),
  }
}

// Generate Class Analysis Report
async function generateClassAnalysisReport(filters: any) {
  const classes = await prisma.class.findMany({
    include: {
      students: true,
      teacher: {
        include: {
          user: true,
        },
      },
    },
  })

  return {
    period: filters?.period || "Current Term",
    classes: classes.map((cls) => ({
      className: cls.name,
      form: cls.form,
      teacher: cls.teacher?.user.fullName || "Unassigned",
      totalStudents: cls.students.length,
      capacity: cls.capacity,
      utilizationRate: cls.capacity > 0 ? ((cls.students.length / cls.capacity) * 100).toFixed(1) : 0,
    })),
  }
}

// Generate Teacher Performance Report
async function generateTeacherPerformanceReport(filters: any) {
  const teachers = await prisma.teacher.findMany({
    include: {
      user: true,
      classes: {
        include: {
          class: {
            include: {
              students: true,
            },
          },
        },
      },
    },
  })

  return {
    period: filters?.period || "Current Term",
    teachers: teachers.map((t) => ({
      name: t.user.fullName,
      email: t.user.email,
      subject: t.subject,
      classesAssigned: t.classes.length,
      totalStudents: t.classes.reduce((sum, c) => sum + c.class.students.length, 0),
      joinDate: t.joinDate?.toISOString().split("T")[0] || "N/A",
    })),
  }
}

// Generate Exam Results Report
async function generateExamResultsReport(filters: any) {
  const students = await prisma.student.findMany({
    where: filters?.classId ? { classId: filters.classId } : {},
    include: {
      user: true,
      class: true,
    },
    take: 50,
  })

  return {
    examName: filters?.examName || "End of Term Examination",
    examDate: filters?.examDate || new Date().toISOString().split("T")[0],
    className: filters?.className || "All Classes",
    totalStudents: students.length,
    results: students.map((s, index) => ({
      position: index + 1,
      studentName: s.user.fullName,
      studentId: s.rollNumber,
      class: s.class?.name || "N/A",
      totalScore: "N/A",
      average: "N/A",
      grade: "N/A",
    })),
    highestScore: "N/A",
    lowestScore: "N/A",
    classAverage: "N/A",
    passRate: "N/A",
  }
}
