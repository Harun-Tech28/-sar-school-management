import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/students/[id]/attendance - Get student attendance records
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const status = searchParams.get("status")

    const whereClause: any = {
      studentId: id,
    }

    if (startDate || endDate) {
      whereClause.date = {}
      if (startDate) {
        whereClause.date.gte = new Date(startDate)
      }
      if (endDate) {
        whereClause.date.lte = new Date(endDate)
      }
    }

    if (status) {
      whereClause.status = status
    }

    const attendance = await prisma.attendance.findMany({
      where: whereClause,
      include: {
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
    console.error("[students/id/attendance] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch attendance" },
      { status: 500 }
    )
  }
}
