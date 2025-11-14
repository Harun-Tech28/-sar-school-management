import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/parents/[id]/link-children - Link children to parent
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { parentId, studentIds } = body

    if (!parentId || !Array.isArray(studentIds)) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      )
    }

    // Verify parent exists
    const parent = await prisma.parent.findUnique({
      where: { id: parentId },
    })

    if (!parent) {
      return NextResponse.json(
        { error: "Parent record not found" },
        { status: 404 }
      )
    }

    // Get all current children of this parent
    const currentChildren = await prisma.student.findMany({
      where: { parentId },
      select: { id: true },
    })

    const currentChildIds = currentChildren.map(c => c.id)

    // Determine which students to link and unlink
    const toLink = studentIds.filter((id: string) => !currentChildIds.includes(id))
    const toUnlink = currentChildIds.filter(id => !studentIds.includes(id))

    // Update students in a transaction
    await prisma.$transaction([
      // Link new students
      ...toLink.map((studentId: string) =>
        prisma.student.update({
          where: { id: studentId },
          data: { parentId },
        })
      ),
      // Unlink removed students
      ...toUnlink.map((studentId: string) =>
        prisma.student.update({
          where: { id: studentId },
          data: { parentId: null },
        })
      ),
    ])

    return NextResponse.json({
      message: "Children linked successfully",
      linked: toLink.length,
      unlinked: toUnlink.length,
    })
  } catch (error) {
    console.error("Error linking children:", error)
    return NextResponse.json(
      { error: "Failed to link children" },
      { status: 500 }
    )
  }
}
