import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/homework - Get all homework
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("classId")
    const teacherId = searchParams.get("teacherId")
    const studentId = searchParams.get("studentId")

    await prisma.$connect()

    const where: any = {}
    
    if (classId) {
      where.classId = classId
    }
    
    if (teacherId) {
      where.teacherId = teacherId
    }

    const homework = await prisma.homework.findMany({
      where,
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
            form: true,
          },
        },
        submissions: studentId ? {
          where: {
            studentId: studentId,
          },
        } : true,
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: {
        dueDate: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      data: homework,
    })
  } catch (error) {
    console.error("[homework] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch homework" },
      { status: 500 }
    )
  }
}

// POST /api/homework - Create new homework
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, classId, teacherId, dueDate, subject, attachments, totalMarks } = body

    if (!title || !classId || !teacherId || !dueDate) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    await prisma.$connect()

    const homework = await prisma.homework.create({
      data: {
        title,
        description: description || "",
        classId,
        teacherId,
        dueDate: new Date(dueDate),
        subject: subject || "",
        attachments: attachments || [],
        totalMarks: totalMarks || null,
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
        class: {
          select: {
            name: true,
            form: true,
          },
        },
      },
    })

    // Create pending submissions for all students in the class
    const students = await prisma.student.findMany({
      where: { classId },
      select: { id: true },
    })

    if (students.length > 0) {
      await prisma.homeworkSubmission.createMany({
        data: students.map(student => ({
          homeworkId: homework.id,
          studentId: student.id,
          status: "PENDING",
        })),
      })
    }

    return NextResponse.json({
      success: true,
      data: homework,
      message: "Homework created successfully",
    })
  } catch (error) {
    console.error("[homework] POST error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create homework" },
      { status: 500 }
    )
  }
}
