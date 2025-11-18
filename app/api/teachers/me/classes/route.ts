import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/teachers/me/classes - Get classes for the logged-in teacher
export async function GET(request: NextRequest) {
  try {
    // Get user from session/localStorage (you'll need to implement proper auth)
    // For now, we'll get it from the request headers or query params
    const teacherId = request.nextUrl.searchParams.get("teacherId")
    
    if (!teacherId) {
      return NextResponse.json(
        { success: false, error: "Teacher ID is required" },
        { status: 400 }
      )
    }

    await prisma.$connect()

    // Get teacher's classes where they are the primary teacher
    const classes = await prisma.class.findMany({
      where: {
        teacherId: teacherId,
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
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

    // Format response
    const formattedClasses = classes.map((cls) => ({
      id: cls.id,
      name: cls.name,
      form: cls.form,
      teacher: cls.teacher?.user.fullName || "Unassigned",
      teacherId: cls.teacherId,
      studentCount: cls._count.students,
      room: cls.room,
      capacity: cls.capacity,
      createdAt: cls.createdAt,
      updatedAt: cls.updatedAt,
    }))

    return NextResponse.json({
      success: true,
      data: formattedClasses,
      total: formattedClasses.length,
    })
  } catch (error) {
    console.error("[teachers/me/classes] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch teacher's classes" },
      { status: 500 }
    )
  }
}
