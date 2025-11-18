import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch timetable for a class
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("classId")
    const academicYear = searchParams.get("academicYear") || "2025"
    const term = searchParams.get("term") || "Term 1"

    if (!classId) {
      return NextResponse.json(
        { success: false, error: "Class ID is required" },
        { status: 400 }
      )
    }

    const timetable = await prisma.timetable.findMany({
      where: {
        classId,
        academicYear,
        term,
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
      orderBy: [
        { dayOfWeek: "asc" },
        { startTime: "asc" },
      ],
    })

    return NextResponse.json({
      success: true,
      data: timetable,
    })
  } catch (error) {
    console.error("Error fetching timetable:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch timetable" },
      { status: 500 }
    )
  }
}

// POST - Create timetable entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      classId,
      dayOfWeek,
      startTime,
      endTime,
      subject,
      teacherId,
      room,
      academicYear,
      term,
      isBreak,
    } = body

    // Validate required fields
    if (!classId || !dayOfWeek || !startTime || !endTime || !subject) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const timetableEntry = await prisma.timetable.create({
      data: {
        classId,
        dayOfWeek,
        startTime,
        endTime,
        subject,
        teacherId: teacherId || null,
        room: room || null,
        academicYear: academicYear || "2025",
        term: term || "Term 1",
        isBreak: isBreak || false,
      },
      include: {
        teacher: {
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

    return NextResponse.json({
      success: true,
      data: timetableEntry,
    })
  } catch (error) {
    console.error("Error creating timetable entry:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create timetable entry" },
      { status: 500 }
    )
  }
}
