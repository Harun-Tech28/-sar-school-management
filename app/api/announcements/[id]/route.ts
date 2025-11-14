import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validation schema for updates
const announcementUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  category: z.enum(["General", "Academic", "Event", "Administrative", "Sports"]).optional(),
  priority: z.enum(["Low", "Normal", "High", "Urgent"]).optional(),
  targetAudience: z.enum(["All", "Students", "Parents", "Teachers", "Staff"]).optional(),
  date: z.string().optional(),
})

// GET /api/announcements/[id] - Get a specific announcement
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.$connect()

    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    })

    if (!announcement) {
      return NextResponse.json(
        { success: false, error: "Announcement not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        category: announcement.category,
        priority: announcement.priority,
        targetAudience: announcement.targetAudience,
        date: announcement.date,
        author: announcement.author?.fullName || "System",
        authorId: announcement.authorId,
        createdAt: announcement.createdAt,
        updatedAt: announcement.updatedAt,
      },
    })
  } catch (error) {
    console.error("[announcements/id] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch announcement" },
      { status: 500 }
    )
  }
}

// PUT /api/announcements/[id] - Update an announcement
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate input
    const validatedData = announcementUpdateSchema.parse(body)

    await prisma.$connect()

    // Check if announcement exists
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id },
    })

    if (!existingAnnouncement) {
      return NextResponse.json(
        { success: false, error: "Announcement not found" },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {}
    if (validatedData.title) updateData.title = validatedData.title
    if (validatedData.content) updateData.content = validatedData.content
    if (validatedData.category) updateData.category = validatedData.category
    if (validatedData.priority) updateData.priority = validatedData.priority
    if (validatedData.targetAudience) updateData.targetAudience = validatedData.targetAudience
    if (validatedData.date) updateData.date = new Date(validatedData.date)

    // Update announcement
    const updatedAnnouncement = await prisma.announcement.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            fullName: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedAnnouncement.id,
        title: updatedAnnouncement.title,
        content: updatedAnnouncement.content,
        category: updatedAnnouncement.category,
        priority: updatedAnnouncement.priority,
        targetAudience: updatedAnnouncement.targetAudience,
        date: updatedAnnouncement.date,
        author: updatedAnnouncement.author?.fullName || "System",
        authorId: updatedAnnouncement.authorId,
      },
      message: "Announcement updated successfully",
    })
  } catch (error) {
    console.error("[announcements/id] PUT error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to update announcement" },
      { status: 500 }
    )
  }
}

// DELETE /api/announcements/[id] - Delete an announcement
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.$connect()

    // Check if announcement exists
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id },
    })

    if (!existingAnnouncement) {
      return NextResponse.json(
        { success: false, error: "Announcement not found" },
        { status: 404 }
      )
    }

    // Delete announcement
    await prisma.announcement.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Announcement deleted successfully",
    })
  } catch (error) {
    console.error("[announcements/id] DELETE error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete announcement" },
      { status: 500 }
    )
  }
}
