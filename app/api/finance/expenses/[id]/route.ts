import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateExpenseSchema = z.object({
  category: z.enum(["SALARIES", "UTILITIES", "MAINTENANCE", "SUPPLIES", "TRANSPORT", "FOOD", "EVENTS", "EQUIPMENT", "OTHER"]).optional(),
  subcategory: z.string().optional(),
  amount: z.number().positive().optional(),
  date: z.string().optional(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "MOBILE_MONEY", "CHEQUE", "CARD"]).optional(),
  vendor: z.string().optional(),
  invoiceNumber: z.string().optional(),
  description: z.string().optional(),
  academicYear: z.string().optional(),
  term: z.string().optional(),
  approved: z.boolean().optional(),
  approvedBy: z.string().optional(),
  attachments: z.array(z.string()).optional(),
})

// GET /api/finance/expenses/[id] - Get single expense record
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const expense = await prisma.expense.findUnique({
      where: { id },
    })

    if (!expense) {
      return NextResponse.json(
        { success: false, error: "Expense record not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: expense,
    })
  } catch (error) {
    console.error("[expense] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch expense record" },
      { status: 500 }
    )
  }
}

// PUT /api/finance/expenses/[id] - Update expense record
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateExpenseSchema.parse(body)

    const existing = await prisma.expense.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Expense record not found" },
        { status: 404 }
      )
    }

    const updateData: any = { ...data }
    if (data.date) {
      updateData.date = new Date(data.date)
    }
    if (data.approved) {
      updateData.approvedAt = new Date()
    }

    const expense = await prisma.expense.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: "Expense record updated successfully",
      data: expense,
    })
  } catch (error) {
    console.error("[expense] PUT error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to update expense record" },
      { status: 500 }
    )
  }
}

// DELETE /api/finance/expenses/[id] - Delete expense record
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await prisma.expense.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Expense record not found" },
        { status: 404 }
      )
    }

    await prisma.expense.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Expense record deleted successfully",
    })
  } catch (error) {
    console.error("[expense] DELETE error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete expense record" },
      { status: 500 }
    )
  }
}
