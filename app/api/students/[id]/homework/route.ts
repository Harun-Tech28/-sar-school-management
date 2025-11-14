import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/students/[id]/homework - Get student homework assignments
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const whereClause: any = {
      studentId: id,
    }

    if (status) {
      whereClause.status = status
    }

    const homework = await prisma.homeworkSubmission.findMany({
      where: whereClause,
      include: {
        homework: {
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
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ success: true, data: homework })
  } catch (error) {
    console.error("[students/id/homework] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch homework" },
      { status: 500 }
    )
  }
}
