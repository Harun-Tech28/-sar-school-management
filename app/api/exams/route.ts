import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/exams - Create a new exam
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      examType,
      term,
      academicYear,
      startDate,
      endDate,
      subjects,
      classes,
      createdBy,
    } = body

    // Validation
    if (!name || name.length < 3) {
      return NextResponse.json(
        { success: false, error: "Exam name must be at least 3 characters" },
        { status: 400 }
      )
    }

    if (!examType || !term || !academicYear) {
      return NextResponse.json(
        { success: false, error: "Exam type, term, and academic year are required" },
        { status: 400 }
      )
    }

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: "Start date and end date are required" },
        { status: 400 }
      )
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json(
        { success: false, error: "Start date must be before end date" },
        { status: 400 }
      )
    }

    if (!subjects || subjects.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one subject is required" },
        { status: 400 }
      )
    }

    if (!classes || classes.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one class is required" },
        { status: 400 }
      )
    }

    // Create exam
    const exam = await prisma.exam.create({
      data: {
        name,
        examType,
        term,
        academicYear,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        subjects,
        classes,
        createdBy: createdBy || "system",
        status: "SCHEDULED",
      },
    })

    return NextResponse.json({ success: true, data: exam })
  } catch (error) {
    console.error("[exams] POST error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create exam" },
      { status: 500 }
    )
  }
}

// GET /api/exams - List all exams with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const term = searchParams.get("term")
    const academicYear = searchParams.get("academicYear")
    const status = searchParams.get("status")
    const classId = searchParams.get("classId")

    const whereClause: any = {}

    if (term) {
      whereClause.term = term
    }

    if (academicYear) {
      whereClause.academicYear = academicYear
    }

    if (status) {
      whereClause.status = status
    }

    if (classId) {
      whereClause.classes = {
        has: classId,
      }
    }

    const exams = await prisma.exam.findMany({
      where: whereClause,
      orderBy: {
        startDate: "desc",
      },
    })

    return NextResponse.json({ success: true, data: exams })
  } catch (error) {
    console.error("[exams] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch exams" },
      { status: 500 }
    )
  }
}
