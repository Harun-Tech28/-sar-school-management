import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { z } from "zod"

// Validation schema
const teacherSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  subject: z.string().min(1, "Subject is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  joinDate: z.string().optional(),
})

// GET /api/teachers - Get all teachers OR get teacher by userId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    
    // If userId is provided, return just that teacher (fast query)
    if (userId) {
      const teacher = await prisma.teacher.findUnique({
        where: { userId },
        select: {
          id: true,
          userId: true,
          subject: true,
          user: {
            select: {
              fullName: true,
              email: true,
            },
          },
        },
      })

      if (!teacher) {
        return NextResponse.json({
          success: true,
          teachers: [],
        })
      }

      return NextResponse.json({
        success: true,
        teachers: [{
          id: teacher.id,
          userId: teacher.userId,
          name: teacher.user.fullName,
          email: teacher.user.email,
          subject: teacher.subject,
        }],
      })
    }

    // Otherwise, fetch all teachers (slower query)
    const search = searchParams.get("search") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    // Build where clause for search
    const where = search
      ? {
          user: {
            OR: [
              { fullName: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          },
        }
      : {}

    // Fetch teachers with class count
    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              createdAt: true,
            },
          },
          classes: {
            include: {
              class: {
                select: {
                  id: true,
                  name: true,
                  form: true,
                },
              },
            },
          },
          _count: {
            select: {
              classes: true,
            },
          },
        },
        orderBy: {
          user: {
            fullName: "asc",
          },
        },
      }),
      prisma.teacher.count({ where }),
    ])

    // Format response
    const formattedTeachers = teachers.map((teacher) => ({
      id: teacher.id,
      userId: teacher.user.id,
      name: teacher.user.fullName,
      email: teacher.user.email,
      phone: teacher.user.phone,
      subject: teacher.subject,
      classes: teacher.classes.map((ct) => ct.class.name).join(", ") || "No classes assigned",
      classCount: teacher._count.classes,
      joinDate: teacher.joinDate,
      status: "Active", // You can add a status field to the schema if needed
      createdAt: teacher.user.createdAt,
    }))

    return NextResponse.json({
      success: true,
      data: formattedTeachers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[teachers] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch teachers" },
      { status: 500 }
    )
  }
}

// POST /api/teachers - Create a new teacher
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = teacherSchema.parse(body)

    await prisma.$connect()

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 10)

    // Create user and teacher in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          fullName: validatedData.fullName,
          phone: validatedData.phone,
          role: "TEACHER",
        },
      })

      // Create teacher
      const teacher = await tx.teacher.create({
        data: {
          userId: user.id,
          subject: validatedData.subject,
          joinDate: validatedData.joinDate ? new Date(validatedData.joinDate) : new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
            },
          },
        },
      })

      return teacher
    })

    return NextResponse.json({
      success: true,
      data: {
        id: result.id,
        userId: result.user.id,
        name: result.user.fullName,
        email: result.user.email,
        phone: result.user.phone,
        subject: result.subject,
        joinDate: result.joinDate,
      },
      message: "Teacher created successfully",
    })
  } catch (error) {
    console.error("[teachers] POST error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to create teacher" },
      { status: 500 }
    )
  }
}
