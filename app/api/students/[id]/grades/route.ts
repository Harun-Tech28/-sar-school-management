import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/students/[id]/grades - Get student grades
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const term = searchParams.get("term")
    const academicYear = searchParams.get("academicYear")

    const whereClause: any = {
      studentId: id,
    }

    if (term) {
      whereClause.term = term
    }

    if (academicYear) {
      whereClause.academicYear = academicYear
    }

    const grades = await prisma.grade.findMany({
      where: whereClause,
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
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ success: true, data: grades })
  } catch (error) {
    console.error("[students/id/grades] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch grades" },
      { status: 500 }
    )
  }
}
