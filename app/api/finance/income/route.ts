import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { generateReceiptNumber } from "@/lib/receipt-generator"

const createIncomeSchema = z.object({
  category: z.enum(["FEES", "DONATIONS", "GRANTS", "EVENTS", "SALES", "FUNDRAISING", "INTEREST", "OTHER"]),
  subcategory: z.string().optional(),
  amount: z.number().positive(),
  date: z.string(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "MOBILE_MONEY", "CHEQUE", "CARD"]),
  source: z.string(),
  sourceId: z.string().optional(),
  receiptNumber: z.string().optional(), // Auto-generated if not provided
  description: z.string(),
  academicYear: z.string(),
  term: z.string().optional(),
  recordedBy: z.string(),
  attachments: z.array(z.string()).optional(),
})

// GET /api/finance/income - List all income
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const academicYear = searchParams.get("academicYear")
    const verified = searchParams.get("verified")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    const where: any = {}

    if (category) where.category = category
    if (academicYear) where.academicYear = academicYear
    if (verified) where.verified = verified === "true"
    
    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate)
      if (endDate) where.date.lte = new Date(endDate)
    }

    const [income, total, totalAmount] = await Promise.all([
      prisma.income.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "desc" },
      }),
      prisma.income.count({ where }),
      prisma.income.aggregate({
        where,
        _sum: { amount: true },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: income,
      summary: {
        totalAmount: totalAmount._sum.amount || 0,
        totalRecords: total,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[income] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch income records" },
      { status: 500 }
    )
  }
}

// POST /api/finance/income - Create new income record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createIncomeSchema.parse(body)

    // Generate receipt number if not provided
    const receiptNumber = data.receiptNumber || await generateReceiptNumber()

    // Check if receipt number already exists
    const existing = await prisma.income.findUnique({
      where: { receiptNumber },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Receipt number already exists" },
        { status: 400 }
      )
    }

    const income = await prisma.income.create({
      data: {
        ...data,
        receiptNumber,
        date: new Date(data.date),
        attachments: data.attachments || [],
      },
    })

    return NextResponse.json(
      { success: true, message: "Income recorded successfully", data: income },
      { status: 201 }
    )
  } catch (error) {
    console.error("[income] POST error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to record income" },
      { status: 500 }
    )
  }
}
