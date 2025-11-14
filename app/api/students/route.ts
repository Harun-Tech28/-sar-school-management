import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

const createStudentSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  rollNumber: z.string().min(3),
  classId: z.string(),
  dateOfBirth: z.string(),
  gender: z.enum(["Male", "Female", "Other"]),
  address: z.string().min(10),
  phone: z.string().optional(),
  parentId: z.string().optional(),
  admissionType: z.enum(["NEW", "CONTINUING"]).default("NEW"),
  previousSchool: z.string().optional(),
  previousClass: z.string().optional(),
  transferCertificate: z.boolean().default(false),
  medicalRecords: z.boolean().default(false),
})

// GET /api/students - List all students
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("classId")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const where: any = {}

    if (classId) {
      where.classId = classId
    }

    if (search) {
      where.OR = [
        { user: { fullName: { contains: search, mode: "insensitive" } } },
        { rollNumber: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ]
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
          class: {
            select: {
              id: true,
              name: true,
              form: true,
              academicYear: true,
            },
          },
          parent: {
            select: {
              id: true,
              user: {
                select: {
                  fullName: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          rollNumber: "asc",
        },
      }),
      prisma.student.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[students] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch students" },
      { status: 500 }
    )
  }
}

// POST /api/students - Create new student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createStudentSchema.parse(body)

    // Check if roll number already exists
    const existingStudent = await prisma.student.findUnique({
      where: { rollNumber: data.rollNumber },
    })

    if (existingStudent) {
      return NextResponse.json(
        { success: false, error: "Student with this roll number already exists" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Create user first with hashed default password
    const hashedPassword = await bcrypt.hash("student123", 10)
    const user = await prisma.user.create({
      data: {
        email: data.email,
        fullName: data.fullName,
        password: hashedPassword,
        role: "STUDENT",
      },
    })

    // Then create student
    const student = await prisma.student.create({
      data: {
        userId: user.id,
        rollNumber: data.rollNumber,
        classId: data.classId,
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        address: data.address,
        phone: data.phone,
        parentId: data.parentId,
        admissionType: data.admissionType,
        previousSchool: data.previousSchool,
        previousClass: data.previousClass,
        transferCertificate: data.transferCertificate,
        medicalRecords: data.medicalRecords,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        class: true,
      },
    })

    return NextResponse.json(
      { success: true, message: "Student created successfully", data: student },
      { status: 201 }
    )
  } catch (error) {
    console.error("[students] POST error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to create student" },
      { status: 500 }
    )
  }
}
