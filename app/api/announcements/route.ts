import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validation schema
const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.enum(["General", "Academic", "Event", "Administrative", "Sports"]),
  priority: z.enum(["Low", "Normal", "High", "Urgent"]),
  targetAudience: z.enum(["All", "Students", "Parents", "Teachers", "Staff"]),
  date: z.string().optional(),
  authorId: z.string(),
})

// GET /api/announcements - Get all announcements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category")
    const priority = searchParams.get("priority")
    const audience = searchParams.get("audience")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    await prisma.$connect()

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" as const } },
        { content: { contains: search, mode: "insensitive" as const } },
      ]
    }

    if (category) where.category = category
    if (priority) where.priority = priority
    if (audience) where.targetAudience = audience

    // Fetch announcements
    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: [
          { priority: "desc" }, // Urgent first
          { date: "desc" }, // Most recent first
        ],
      }),
      prisma.announcement.count({ where }),
    ])

    // Format response
    const formattedAnnouncements = announcements.map((announcement) => ({
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
    }))

    return NextResponse.json({
      success: true,
      data: formattedAnnouncements,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[announcements] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch announcements" },
      { status: 500 }
    )
  }
}

// POST /api/announcements - Create a new announcement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = announcementSchema.parse(body)

    await prisma.$connect()

    // Create announcement
    const newAnnouncement = await prisma.announcement.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        category: validatedData.category,
        priority: validatedData.priority,
        targetAudience: validatedData.targetAudience,
        date: validatedData.date ? new Date(validatedData.date) : new Date(),
        authorId: validatedData.authorId,
      },
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
        id: newAnnouncement.id,
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        category: newAnnouncement.category,
        priority: newAnnouncement.priority,
        targetAudience: newAnnouncement.targetAudience,
        date: newAnnouncement.date,
        author: newAnnouncement.author?.fullName || "System",
        authorId: newAnnouncement.authorId,
      },
      message: "Announcement created successfully",
    })
  } catch (error) {
    console.error("[announcements] POST error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to create announcement" },
      { status: 500 }
    )
  }
}
