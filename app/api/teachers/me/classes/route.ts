import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/teachers/me/classes - Get classes for the logged-in teacher
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const teacherId = request.nextUrl.searchParams.get("teacherId")
    
    if (!teacherId) {
      return NextResponse.json(
        { success: false, error: "Teacher ID is required" },
        { status: 400 }
      )
    }

    console.log(`[teachers/me/classes] Fetching classes for teacher: ${teacherId}`)

    // Simplified query - removed unnecessary includes
    const classes = await prisma.class.findMany({
      where: {
        teacherId: teacherId,
      },
      select: {
        id: true,
        name: true,
        form: true,
        room: true,
        capacity: true,
        teacherId: true,
        teacher: {
          select: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    const formattedClasses = classes.map((cls) => ({
      id: cls.id,
      name: cls.name,
      form: cls.form,
      teacher: cls.teacher?.user.fullName || "Unassigned",
      teacherId: cls.teacherId,
      studentCount: cls._count.students,
      room: cls.room,
      capacity: cls.capacity,
    }))

    const duration = Date.now() - startTime
    console.log(`[teachers/me/classes] Query completed in ${duration}ms, found ${formattedClasses.length} classes`)

    return NextResponse.json({
      success: true,
      data: formattedClasses,
      total: formattedClasses.length,
    })
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[teachers/me/classes] GET error after ${duration}ms:`, error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch teacher's classes" },
      { status: 500 }
    )
  }
}
