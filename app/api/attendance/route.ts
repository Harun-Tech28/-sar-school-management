import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const markAttendanceSchema = z.object({
  studentId: z.string().cuid(),
  classId: z.string().cuid(),
  date: z.string(),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
  remarks: z.string().optional(),
})

// GET /api/attendance - List attendance records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("classId")
    const studentId = searchParams.get("studentId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const date = searchParams.get("date")

    const where: any = {}

    if (classId) where.classId = classId
    if (studentId) where.studentId = studentId
    if (date) {
      where.date = new Date(date)
    } else if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate)
      if (endDate) where.date.lte = new Date(endDate)
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
        class: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    })

    return NextResponse.json({ success: true, data: attendance })
  } catch (error) {
    console.error("[attendance] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch attendance" },
      { status: 500 }
    )
  }
}

// POST /api/attendance - Mark attendance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = markAttendanceSchema.parse(body)

    // Check if attendance already exists for this student on this date
    const existing = await prisma.attendance.findUnique({
      where: {
        studentId_date: {
          studentId: data.studentId,
          date: new Date(data.date),
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Attendance already marked for this student on this date" },
        { status: 400 }
      )
    }

    const attendance = await prisma.attendance.create({
      data: {
        studentId: data.studentId,
        classId: data.classId,
        date: new Date(data.date),
        status: data.status,
        remarks: data.remarks,
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(
      { success: true, message: "Attendance marked successfully", data: attendance },
      { status: 201 }
    )
  } catch (error) {
    console.error("[attendance] POST error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to mark attendance" },
      { status: 500 }
    )
  }
}
