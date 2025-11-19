import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/homework/[id] - Get single homework
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.$connect()

    const homework = await prisma.homework.findUnique({
      where: { id },
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
        class: {
          select: {
            name: true,
            form: true,
          },
        },
        submissions: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    fullName: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!homework) {
      return NextResponse.json(
        { success: false, error: "Homework not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: homework,
    })
  } catch (error) {
    console.error("[homework] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch homework" },
      { status: 500 }
    )
  }
}

// PUT /api/homework/[id] - Update homework
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, dueDate, subject, attachments } = body

    await prisma.$connect()

    const homework = await prisma.homework.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(subject !== undefined && { subject }),
        ...(attachments !== undefined && { attachments }),
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
        class: {
          select: {
            name: true,
            form: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: homework,
      message: "Homework updated successfully",
    })
  } catch (error) {
    console.error("[homework] PUT error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update homework" },
      { status: 500 }
    )
  }
}

// DELETE /api/homework/[id] - Delete homework
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.$connect()

    // Delete all submissions first
    await prisma.homeworkSubmission.deleteMany({
      where: { homeworkId: id },
    })

    // Delete homework
    await prisma.homework.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Homework deleted successfully",
    })
  } catch (error) {
    console.error("[homework] DELETE error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete homework" },
      { status: 500 }
    )
  }
}
