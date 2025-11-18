import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/teachers/me/students - Get all students in the logged-in teacher's classes
export async function GET(request: NextRequest) {
  try {
    const teacherId = request.nextUrl.searchParams.get("teacherId")
    
    if (!teacherId) {
      return NextResponse.json(
        { success: false, error: "Teacher ID is required" },
        { status: 400 }
      )
    }

    await prisma.$connect()

    // Get all students from classes where this teacher is the primary teacher
    const students = await prisma.student.findMany({
      where: {
        class: {
          teacherId: teacherId,
        },
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
            form: true,
          },
        },
      },
      orderBy: [
        {
          class: {
            name: "asc",
          },
        },
        {
          user: {
            fullName: "asc",
          },
        },
      ],
    })

    // Format response
    const formattedStudents = students.map((student) => ({
      id: student.id,
      name: student.user.fullName,
      email: student.user.email,
      rollNumber: student.rollNumber,
      class: student.class?.name || "No Class",
      classId: student.classId,
      form: student.class?.form || "",
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      createdAt: student.createdAt,
    }))

    return NextResponse.json({
      success: true,
      data: formattedStudents,
      total: formattedStudents.length,
    })
  } catch (error) {
    console.error("[teachers/me/students] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch teacher's students" },
      { status: 500 }
    )
  }
}
