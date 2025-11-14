import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validation schema
const classSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  form: z.string().min(1, "Form level is required"),
  teacherId: z.string().optional(),
  room: z.string().min(1, "Room number is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
})

// GET /api/classes - Get all classes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    await prisma.$connect()

    // Build where clause for search
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { form: { contains: search, mode: "insensitive" as const } },
            { room: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}

    // Fetch classes with student count
    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        where,
        skip,
        take: limit,
        include: {
          teacher: {
            include: {
              user: {
                select: {
                  fullName: true,
                  email: true,
                },
              },
            },
          },
          _count: {
            select: {
              students: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.class.count({ where }),
    ])

    // Format response
    const formattedClasses = classes.map((cls) => ({
      id: cls.id,
      name: cls.name,
      form: cls.form,
      teacher: cls.teacher?.user.fullName || "Unassigned",
      teacherId: cls.teacherId,
      studentCount: cls._count.students,
      room: cls.room,
      capacity: cls.capacity,
      createdAt: cls.createdAt,
      updatedAt: cls.updatedAt,
    }))

    return NextResponse.json({
      success: true,
      data: formattedClasses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[classes] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch classes" },
      { status: 500 }
    )
  }
}

// POST /api/classes - Create a new class
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = classSchema.parse(body)

    await prisma.$connect()

    // Create class
    const newClass = await prisma.class.create({
      data: {
        name: validatedData.name,
        form: validatedData.form,
        teacherId: validatedData.teacherId || null,
        room: validatedData.room,
        capacity: validatedData.capacity,
      },
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
        _count: {
          select: {
            students: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: newClass.id,
        name: newClass.name,
        form: newClass.form,
        teacher: newClass.teacher?.user.fullName || "Unassigned",
        teacherId: newClass.teacherId,
        studentCount: newClass._count.students,
        room: newClass.room,
        capacity: newClass.capacity,
      },
      message: "Class created successfully",
    })
  } catch (error) {
    console.error("[classes] POST error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to create class" },
      { status: 500 }
    )
  }
}
