import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teacherId: string }> }
) {
  try {
    const { teacherId } = await params

    if (!teacherId) {
      return NextResponse.json(
        { error: "Teacher ID is required" },
        { status: 400 }
      )
    }

    // Fetch all timetable entries for this teacher
    const timetable = await prisma.timetable.findMany({
      where: {
        teacherId: teacherId
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: timetable
    })
  } catch (error) {
    console.error("Error fetching teacher timetable:", error)
    return NextResponse.json(
      { error: "Failed to fetch timetable" },
      { status: 500 }
    )
  }
}
