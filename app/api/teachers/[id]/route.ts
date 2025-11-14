import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validation schema for updates
const teacherUpdateSchema = z.object({
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  subject: z.string().min(1).optional(),
  joinDate: z.string().optional(),
})

// GET /api/teachers/[id] - Get a specific teacher
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.$connect()

    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            createdAt: true,
          },
        },
        classes: {
          include: {
            class: {
              include: {
                _count: {
                  select: {
                    students: true,
                  },
                },
              },
            },
          },
        },
        primaryClasses: {
          include: {
            _count: {
              select: {
                students: true,
              },
            },
          },
        },
      },
    })

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: "Teacher not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: teacher.id,
        userId: teacher.user.id,
        name: teacher.user.fullName,
        email: teacher.user.email,
        phone: teacher.user.phone,
        subject: teacher.subject,
        joinDate: teacher.joinDate,
        classes: teacher.classes.map((ct) => ({
          id: ct.class.id,
          name: ct.class.name,
          form: ct.class.form,
          subject: ct.subject,
          studentCount: ct.class._count.students,
        })),
        primaryClasses: teacher.primaryClasses.map((c) => ({
          id: c.id,
          name: c.name,
          form: c.form,
          studentCount: c._count.students,
        })),
        createdAt: teacher.user.createdAt,
      },
    })
  } catch (error) {
    console.error("[teachers/id] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch teacher" },
      { status: 500 }
    )
  }
}

// PUT /api/teachers/[id] - Update a teacher
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate input
    const validatedData = teacherUpdateSchema.parse(body)

    await prisma.$connect()

    // Check if teacher exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!existingTeacher) {
      return NextResponse.json(
        { success: false, error: "Teacher not found" },
        { status: 404 }
      )
    }

    // If email is being updated, check if it's already taken
    if (validatedData.email && validatedData.email !== existingTeacher.user.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email },
      })

      if (emailExists) {
        return NextResponse.json(
          { success: false, error: "Email already exists" },
          { status: 400 }
        )
      }
    }

    // Update user and teacher in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update user fields
      const userUpdateData: any = {}
      if (validatedData.fullName) userUpdateData.fullName = validatedData.fullName
      if (validatedData.email) userUpdateData.email = validatedData.email
      if (validatedData.phone) userUpdateData.phone = validatedData.phone

      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: existingTeacher.userId },
          data: userUpdateData,
        })
      }

      // Update teacher fields
      const teacherUpdateData: any = {}
      if (validatedData.subject) teacherUpdateData.subject = validatedData.subject
      if (validatedData.joinDate) teacherUpdateData.joinDate = new Date(validatedData.joinDate)

      const updatedTeacher = await tx.teacher.update({
        where: { id },
        data: teacherUpdateData,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
            },
          },
        },
      })

      return updatedTeacher
    })

    return NextResponse.json({
      success: true,
      data: {
        id: result.id,
        userId: result.user.id,
        name: result.user.fullName,
        email: result.user.email,
        phone: result.user.phone,
        subject: result.subject,
        joinDate: result.joinDate,
      },
      message: "Teacher updated successfully",
    })
  } catch (error) {
    console.error("[teachers/id] PUT error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to update teacher" },
      { status: 500 }
    )
  }
}

// DELETE /api/teachers/[id] - Delete a teacher
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.$connect()

    // Check if teacher exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            classes: true,
          },
        },
      },
    })

    if (!existingTeacher) {
      return NextResponse.json(
        { success: false, error: "Teacher not found" },
        { status: 404 }
      )
    }

    // Check if teacher has assigned classes
    if (existingTeacher._count.classes > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete teacher with assigned classes. Please reassign classes first.",
        },
        { status: 400 }
      )
    }

    // Delete teacher and user in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.teacher.delete({
        where: { id },
      })

      await tx.user.delete({
        where: { id: existingTeacher.userId },
      })
    })

    return NextResponse.json({
      success: true,
      message: "Teacher deleted successfully",
    })
  } catch (error) {
    console.error("[teachers/id] DELETE error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete teacher" },
      { status: 500 }
    )
  }
}
