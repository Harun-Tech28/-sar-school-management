import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/attendance/analytics - Get attendance analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("classId")
    const studentId = searchParams.get("studentId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const where: any = {}

    if (classId) where.classId = classId
    if (studentId) where.studentId = studentId
    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate)
      if (endDate) where.date.lte = new Date(endDate)
    }

    // Get all attendance records
    const records = await prisma.attendance.findMany({
      where,
      select: {
        status: true,
        studentId: true,
      },
    })

    // Calculate statistics
    const total = records.length
    const present = records.filter((r) => r.status === "PRESENT").length
    const absent = records.filter((r) => r.status === "ABSENT").length
    const late = records.filter((r) => r.status === "LATE").length
    const excused = records.filter((r) => r.status === "EXCUSED").length

    const attendanceRate =
      total > 0 ? (((present + late) / total) * 100).toFixed(2) : "0"

    // Get per-student statistics if querying a class
    let studentStats = null
    if (classId && !studentId) {
      const students = await prisma.student.findMany({
        where: { classId },
        include: {
          user: {
            select: {
              fullName: true,
            },
          },
          attendance: {
            where: {
              date: where.date,
            },
          },
        },
      })

      studentStats = students.map((student) => {
        const studentRecords = student.attendance
        const studentTotal = studentRecords.length
        const studentPresent = studentRecords.filter(
          (r) => r.status === "PRESENT"
        ).length
        const studentLate = studentRecords.filter(
          (r) => r.status === "LATE"
        ).length

        return {
          studentId: student.id,
          studentName: student.user.fullName,
          rollNumber: student.rollNumber,
          total: studentTotal,
          present: studentPresent,
          absent: studentRecords.filter((r) => r.status === "ABSENT").length,
          late: studentLate,
          excused: studentRecords.filter((r) => r.status === "EXCUSED").length,
          attendanceRate:
            studentTotal > 0
              ? (((studentPresent + studentLate) / studentTotal) * 100).toFixed(2)
              : "0",
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          total,
          present,
          absent,
          late,
          excused,
          attendanceRate: `${attendanceRate}%`,
        },
        studentStats,
      },
    })
  } catch (error) {
    console.error("[attendance/analytics] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch attendance analytics" },
      { status: 500 }
    )
  }
}
