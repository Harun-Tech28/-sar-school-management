import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateStudentSchema = z.object({
  fullName: z.string().min(2).optional(),
  classId: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  address: z.string().min(10).optional(),
  phone: z.string().optional(),
  parentId: z.string().optional(),
})

// GET /api/students/[id] - Get single student
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            createdAt: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
            form: true,
            academicYear: true,
          },
        },
        parent: {
          select: {
            id: true,
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
            phone: true,
          },
        },
        attendance: {
          take: 10,
          orderBy: {
            date: "desc",
          },
          select: {
            id: true,
            date: true,
            status: true,
          },
        },
        grades: {
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            subject: true,
            marks: true,
            totalMarks: true,
            examType: true,
            term: true,
          },
        },
      },
    })

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: student })
  } catch (error) {
    console.error("[students/id] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch student" },
      { status: 500 }
    )
  }
}

// PUT /api/students/[id] - Update student
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateStudentSchema.parse(body)

    const student = await prisma.student.findUnique({
      where: { id },
    })

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      )
    }

    const updateData: any = {}

    if (data.classId) updateData.classId = data.classId
    if (data.dateOfBirth) updateData.dateOfBirth = new Date(data.dateOfBirth)
    if (data.gender) updateData.gender = data.gender
    if (data.address) updateData.address = data.address
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.parentId !== undefined) updateData.parentId = data.parentId

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        class: true,
      },
    })

    // Update user fullName if provided
    if (data.fullName) {
      await prisma.user.update({
        where: { id: student.userId },
        data: { fullName: data.fullName },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    })
  } catch (error) {
    console.error("[students/id] PUT error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to update student" },
      { status: 500 }
    )
  }
}

// DELETE /api/students/[id] - Delete student
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const student = await prisma.student.findUnique({
      where: { id },
    })

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      )
    }

    // Delete student (cascade will handle user deletion)
    await prisma.student.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Student deleted successfully",
    })
  } catch (error) {
    console.error("[students/id] DELETE error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete student" },
      { status: 500 }
    )
  }
}
