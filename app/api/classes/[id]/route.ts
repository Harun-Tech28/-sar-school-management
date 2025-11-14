import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validation schema
const classUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  form: z.string().min(1).optional(),
  teacherId: z.string().nullable().optional(),
  room: z.string().min(1).optional(),
  capacity: z.number().min(1).optional(),
})

// GET /api/classes/[id] - Get a specific class
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const classData = await prisma.class.findUnique({
      where: { id },
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
        students: {
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
    })

    if (!classData) {
      return NextResponse.json(
        { success: false, error: "Class not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: classData.id,
        name: classData.name,
        form: classData.form,
        teacher: classData.teacher?.user.fullName || "Unassigned",
        teacherId: classData.teacherId,
        studentCount: classData._count.students,
        room: classData.room,
        capacity: classData.capacity,
        students: classData.students.map((s) => ({
          id: s.id,
          name: s.user.fullName,
          email: s.user.email,
        })),
        createdAt: classData.createdAt,
        updatedAt: classData.updatedAt,
      },
    })
  } catch (error) {
    console.error("[classes/id] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch class" },
      { status: 500 }
    )
  }
}

// PUT /api/classes/[id] - Update a class
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate input
    const validatedData = classUpdateSchema.parse(body)

    // Check if class exists
    const existingClass = await prisma.class.findUnique({
      where: { id },
    })

    if (!existingClass) {
      return NextResponse.json(
        { success: false, error: "Class not found" },
        { status: 404 }
      )
    }

    // Update class
    const updatedClass = await prisma.class.update({
      where: { id },
      data: validatedData,
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
        _count: {
          select: {
            students: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedClass.id,
        name: updatedClass.name,
        form: updatedClass.form,
        teacher: updatedClass.teacher?.user.fullName || "Unassigned",
        teacherId: updatedClass.teacherId,
        studentCount: updatedClass._count.students,
        room: updatedClass.room,
        capacity: updatedClass.capacity,
      },
      message: "Class updated successfully",
    })
  } catch (error) {
    console.error("[classes/id] PUT error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to update class" },
      { status: 500 }
    )
  }
}

// DELETE /api/classes/[id] - Delete a class
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if class exists
    const existingClass = await prisma.class.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    })

    if (!existingClass) {
      return NextResponse.json(
        { success: false, error: "Class not found" },
        { status: 404 }
      )
    }

    // Check if class has students
    if (existingClass._count.students > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete class with enrolled students. Please reassign students first.",
        },
        { status: 400 }
      )
    }

    // Delete class
    await prisma.class.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Class deleted successfully",
    })
  } catch (error) {
    console.error("[classes/id] DELETE error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete class" },
      { status: 500 }
    )
  }
}
