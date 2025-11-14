import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validation schema for fee payment
const feePaymentSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  amount: z.number().min(0, "Amount must be positive"),
  paymentMethod: z.enum(["CASH", "MOBILE_MONEY", "BANK_TRANSFER", "CHEQUE"]),
  term: z.string().min(1, "Term is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  receiptNumber: z.string().optional(),
  notes: z.string().optional(),
})

// GET /api/fees - Get all fee payments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    const classId = searchParams.get("classId")
    const term = searchParams.get("term")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    const where: any = {}

    if (studentId) {
      where.studentId = studentId
    }

    if (classId) {
      where.student = {
        classId,
      }
    }

    if (term) {
      where.term = term
    }

    const [payments, total] = await Promise.all([
      prisma.feePayment.findMany({
        where,
        skip,
        take: limit,
        include: {
          student: {
            include: {
              user: true,
              class: true,
            },
          },
        },
        orderBy: {
          paymentDate: "desc",
        },
      }),
      prisma.feePayment.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[fees] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch fee payments" },
      { status: 500 }
    )
  }
}

// POST /api/fees - Record a new fee payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = feePaymentSchema.parse(body)

    const payment = await prisma.feePayment.create({
      data: {
        studentId: validatedData.studentId,
        amount: validatedData.amount,
        paymentMethod: validatedData.paymentMethod,
        term: validatedData.term,
        academicYear: validatedData.academicYear,
        receiptNumber: validatedData.receiptNumber || `RCP-${Date.now()}`,
        remarks: validatedData.notes,
        paymentDate: new Date(),
      },
      include: {
        student: {
          include: {
            user: true,
            class: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: payment,
        message: "Payment recorded successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[fees] POST error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to record payment" },
      { status: 500 }
    )
  }
}
