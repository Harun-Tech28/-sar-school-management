import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateAttendanceSchema = z.object({
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
  remarks: z.string().optional(),
})

// GET /api/attendance/[id] - Get single attendance record
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const attendance = await prisma.attendance.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
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
    })

    if (!attendance) {
      return NextResponse.json(
        { success: false, error: "Attendance record not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: attendance })
  } catch (error) {
    console.error("[attendance/id] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch attendance" },
      { status: 500 }
    )
  }
}

// PUT /api/attendance/[id] - Update attendance record
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateAttendanceSchema.parse(body)

    const attendance = await prisma.attendance.findUnique({
      where: { id },
    })

    if (!attendance) {
      return NextResponse.json(
        { success: false, error: "Attendance record not found" },
        { status: 404 }
      )
    }

    const updatedAttendance = await prisma.attendance.update({
      where: { id },
      data: {
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
        class: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: "Attendance updated successfully",
      data: updatedAttendance,
    })
  } catch (error) {
    console.error("[attendance/id] PUT error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to update attendance" },
      { status: 500 }
    )
  }
}

// DELETE /api/attendance/[id] - Delete attendance record
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const attendance = await prisma.attendance.findUnique({
      where: { id },
    })

    if (!attendance) {
      return NextResponse.json(
        { success: false, error: "Attendance record not found" },
        { status: 404 }
      )
    }

    await prisma.attendance.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Attendance record deleted successfully",
    })
  } catch (error) {
    console.error("[attendance/id] DELETE error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete attendance" },
      { status: 500 }
    )
  }
}
