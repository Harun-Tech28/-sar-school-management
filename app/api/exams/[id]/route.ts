import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/exams/[id] - Get exam details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const exam = await prisma.exam.findUnique({
      where: { id },
    })

    if (!exam) {
      return NextResponse.json(
        { success: false, error: "Exam not found" },
        { status: 404 }
      )
    }

    // Get grade entry progress for this exam
    const gradeCount = await prisma.grade.count({
      where: {
        examType: exam.examType,
        term: exam.term,
        academicYear: exam.academicYear,
      },
    })

    // Calculate expected grades (students × subjects)
    const studentCount = await prisma.student.count({
      where: {
        classId: {
          in: exam.classes,
        },
      },
    })

    const expectedGrades = studentCount * exam.subjects.length

    return NextResponse.json({
      success: true,
      data: {
        ...exam,
        gradeProgress: {
          entered: gradeCount,
          expected: expectedGrades,
          percentage: expectedGrades > 0 ? Math.round((gradeCount / expectedGrades) * 100) : 0,
        },
      },
    })
  } catch (error) {
    console.error("[exams/id] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch exam" },
      { status: 500 }
    )
  }
}

// PUT /api/exams/[id] - Update exam details
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, examType, startDate, endDate, subjects, classes, status } = body

    // Validation
    if (name && name.length < 3) {
      return NextResponse.json(
        { success: false, error: "Exam name must be at least 3 characters" },
        { status: 400 }
      )
    }

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json(
        { success: false, error: "Start date must be before end date" },
        { status: 400 }
      )
    }

    const updateData: any = {}

    if (name) updateData.name = name
    if (examType) updateData.examType = examType
    if (startDate) updateData.startDate = new Date(startDate)
    if (endDate) updateData.endDate = new Date(endDate)
    if (subjects) updateData.subjects = subjects
    if (classes) updateData.classes = classes
    if (status) updateData.status = status

    const exam = await prisma.exam.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, data: exam })
  } catch (error) {
    console.error("[exams/id] PUT error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update exam" },
      { status: 500 }
    )
  }
}

// DELETE /api/exams/[id] - Delete an exam
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.exam.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[exams/id] DELETE error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete exam" },
      { status: 500 }
    )
  }
}
