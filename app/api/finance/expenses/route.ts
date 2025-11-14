import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { generateVoucherNumber } from "@/lib/receipt-generator"

const createExpenseSchema = z.object({
  category: z.enum(["SALARIES", "UTILITIES", "MAINTENANCE", "SUPPLIES", "TRANSPORT", "FOOD", "EVENTS", "EQUIPMENT", "OTHER"]),
  subcategory: z.string().optional(),
  amount: z.number().positive(),
  date: z.string(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "MOBILE_MONEY", "CHEQUE", "CARD"]),
  vendor: z.string(),
  invoiceNumber: z.string().optional(),
  description: z.string(),
  academicYear: z.string(),
  term: z.string().optional(),
  recordedBy: z.string(),
  attachments: z.array(z.string()).optional(),
})

// GET /api/finance/expenses - List all expenses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const academicYear = searchParams.get("academicYear")
    const approved = searchParams.get("approved")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    const where: any = {}

    if (category) where.category = category
    if (academicYear) where.academicYear = academicYear
    if (approved) where.approved = approved === "true"
    
    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate)
      if (endDate) where.date.lte = new Date(endDate)
    }

    const [expenses, total, totalAmount] = await Promise.all([
      prisma.expense.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "desc" },
      }),
      prisma.expense.count({ where }),
      prisma.expense.aggregate({
        where,
        _sum: { amount: true },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: expenses,
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
    console.error("[expenses] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch expense records" },
      { status: 500 }
    )
  }
}

// POST /api/finance/expenses - Create new expense record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createExpenseSchema.parse(body)

    // Generate voucher number if invoice number not provided
    const invoiceNumber = data.invoiceNumber || await generateVoucherNumber()

    const expense = await prisma.expense.create({
      data: {
        ...data,
        invoiceNumber,
        date: new Date(data.date),
        attachments: data.attachments || [],
      },
    })

    return NextResponse.json(
      { success: true, message: "Expense recorded successfully", data: expense },
      { status: 201 }
    )
  } catch (error) {
    console.error("[expenses] POST error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to record expense" },
      { status: 500 }
    )
  }
}
