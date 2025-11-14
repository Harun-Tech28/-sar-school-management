import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PUT /api/grades/[id] - Update a grade entry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { marks, totalMarks, remarks } = body

    // Validation
    if (marks !== undefined && marks < 0) {
      return NextResponse.json(
        { success: false, error: "Marks must be a positive number" },
        { status: 400 }
      )
    }

    if (marks !== undefined && totalMarks !== undefined && marks > totalMarks) {
      return NextResponse.json(
        { success: false, error: "Marks cannot exceed total marks" },
        { status: 400 }
      )
    }

    const updateData: any = {}

    if (marks !== undefined) updateData.marks = parseFloat(marks)
    if (totalMarks !== undefined) updateData.totalMarks = parseFloat(totalMarks)
    if (remarks !== undefined) updateData.remarks = remarks

    const grade = await prisma.grade.update({
      where: { id },
      data: updateData,
      include: {
        student: {
          include: {
            user: true,
          },
        },
        teacher: {
          include: {
            user: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: grade })
  } catch (error) {
    console.error("[grades/id] PUT error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update grade" },
      { status: 500 }
    )
  }
}

// DELETE /api/grades/[id] - Delete a grade entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.grade.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[grades/id] DELETE error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete grade" },
      { status: 500 }
    )
  }
}
