import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/grades - Create a single grade entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      studentId,
      teacherId,
      subject,
      examType,
      marks,
      totalMarks,
      term,
      academicYear,
      remarks,
    } = body

    // Validation
    if (!studentId || !teacherId || !subject || !examType) {
      return NextResponse.json(
        { success: false, error: "Student, teacher, subject, and exam type are required" },
        { status: 400 }
      )
    }

    if (marks === undefined || marks === null) {
      return NextResponse.json(
        { success: false, error: "Marks are required" },
        { status: 400 }
      )
    }

    if (marks < 0) {
      return NextResponse.json(
        { success: false, error: "Marks must be a positive number" },
        { status: 400 }
      )
    }

    if (marks > totalMarks) {
      return NextResponse.json(
        { success: false, error: "Marks cannot exceed total marks" },
        { status: 400 }
      )
    }

    if (!term || !academicYear) {
      return NextResponse.json(
        { success: false, error: "Term and academic year are required" },
        { status: 400 }
      )
    }

    // Check for duplicate grade
    const existingGrade = await prisma.grade.findFirst({
      where: {
        studentId,
        subject,
        examType,
        term,
        academicYear,
      },
    })

    if (existingGrade) {
      return NextResponse.json(
        { success: false, error: "Grade already exists for this student and subject" },
        { status: 400 }
      )
    }

    // Create grade
    const grade = await prisma.grade.create({
      data: {
        studentId,
        teacherId,
        subject,
        examType,
        marks: parseFloat(marks),
        totalMarks: parseFloat(totalMarks),
        term,
        academicYear,
        remarks: remarks || null,
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        teacher: {
          include: {
            user: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: grade })
  } catch (error) {
    console.error("[grades] POST error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create grade" },
      { status: 500 }
    )
  }
}

// GET /api/grades - List grades with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    const classId = searchParams.get("classId")
    const term = searchParams.get("term")
    const academicYear = searchParams.get("academicYear")
    const subject = searchParams.get("subject")
    const teacherId = searchParams.get("teacherId")

    const whereClause: any = {}

    if (studentId) {
      whereClause.studentId = studentId
    }

    if (classId) {
      whereClause.student = {
        classId,
      }
    }

    if (term) {
      whereClause.term = term
    }

    if (academicYear) {
      whereClause.academicYear = academicYear
    }

    if (subject) {
      whereClause.subject = subject
    }

    if (teacherId) {
      whereClause.teacherId = teacherId
    }

    const grades = await prisma.grade.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            user: true,
            class: true,
          },
        },
        teacher: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ success: true, data: grades })
  } catch (error) {
    console.error("[grades] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch grades" },
      { status: 500 }
    )
  }
}
