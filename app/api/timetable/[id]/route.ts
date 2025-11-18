import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PUT - Update timetable entry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const updatedEntry = await prisma.timetable.update({
      where: { id },
      data: body,
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
      data: updatedEntry,
    })
  } catch (error) {
    console.error("Error updating timetable entry:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update timetable entry" },
      { status: 500 }
    )
  }
}

// DELETE - Delete timetable entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.timetable.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Timetable entry deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting timetable entry:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete timetable entry" },
      { status: 500 }
    )
  }
}
