import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get counts from database
    const [studentsCount, teachersCount, parentsCount, classesCount] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.parent.count(),
      prisma.class.count(),
    ])

    return NextResponse.json({
      success: true,
      data: {
        students: studentsCount,
        teachers: teachersCount,
        parents: parentsCount,
        classes: classesCount,
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard statistics",
        data: {
          students: 0,
          teachers: 0,
          parents: 0,
          classes: 0,
        },
      },
      { status: 500 }
    )
  }
}
