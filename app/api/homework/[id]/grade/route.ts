import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/homework/[id]/grade - Grade homework submission
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { submissionId, grade, feedback } = body

    if (!submissionId) {
      return NextResponse.json(
        { success: false, error: "Submission ID is required" },
        { status: 400 }
      )
    }

    await prisma.$connect()

    const submission = await prisma.homeworkSubmission.update({
      where: { id: submissionId },
      data: {
        grade: grade || null,
        feedback: feedback || "",
        status: "GRADED",
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
      message: "Homework graded successfully",
    })
  } catch (error) {
    console.error("[homework] grade error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to grade homework" },
      { status: 500 }
    )
  }
}
