import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/homework/[id]/submit - Submit homework
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { studentId, content, attachments } = body

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: "Student ID is required" },
        { status: 400 }
      )
    }

    await prisma.$connect()

    // Check if homework exists
    const homework = await prisma.homework.findUnique({
      where: { id },
    })

    if (!homework) {
      return NextResponse.json(
        { success: false, error: "Homework not found" },
        { status: 404 }
      )
    }

    // Check if already submitted
    const existingSubmission = await prisma.homeworkSubmission.findFirst({
      where: {
        homeworkId: id,
        studentId,
      },
    })

    if (existingSubmission) {
      // Update existing submission
      const submission = await prisma.homeworkSubmission.update({
        where: { id: existingSubmission.id },
        data: {
          submittedAt: new Date(),
          status: "SUBMITTED",
        },
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
      })

      return NextResponse.json({
        success: true,
        data: submission,
        message: "Homework resubmitted successfully",
      })
    }

    // Create new submission
    const submission = await prisma.homeworkSubmission.create({
      data: {
        homeworkId: id,
        studentId,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
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
    })

    return NextResponse.json({
      success: true,
      data: submission,
      message: "Homework submitted successfully",
    })
  } catch (error) {
    console.error("[homework] submit error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to submit homework" },
      { status: 500 }
    )
  }
}
