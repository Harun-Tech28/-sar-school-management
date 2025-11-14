import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateIncomeSchema = z.object({
  category: z.enum(["FEES", "DONATIONS", "GRANTS", "EVENTS", "SALES", "FUNDRAISING", "INTEREST", "OTHER"]).optional(),
  subcategory: z.string().optional(),
  amount: z.number().positive().optional(),
  date: z.string().optional(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "MOBILE_MONEY", "CHEQUE", "CARD"]).optional(),
  source: z.string().optional(),
  sourceId: z.string().optional(),
  description: z.string().optional(),
  academicYear: z.string().optional(),
  term: z.string().optional(),
  verified: z.boolean().optional(),
  verifiedBy: z.string().optional(),
  attachments: z.array(z.string()).optional(),
})

// GET /api/finance/income/[id] - Get single income record
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const income = await prisma.income.findUnique({
      where: { id },
    })

    if (!income) {
      return NextResponse.json(
        { success: false, error: "Income record not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: income,
    })
  } catch (error) {
    console.error("[income] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch income record" },
      { status: 500 }
    )
  }
}

// PUT /api/finance/income/[id] - Update income record
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateIncomeSchema.parse(body)

    const existing = await prisma.income.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Income record not found" },
        { status: 404 }
      )
    }

    const updateData: any = { ...data }
    if (data.date) {
      updateData.date = new Date(data.date)
    }
    if (data.verified) {
      updateData.verifiedAt = new Date()
    }

    const income = await prisma.income.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: "Income record updated successfully",
      data: income,
    })
  } catch (error) {
    console.error("[income] PUT error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to update income record" },
      { status: 500 }
    )
  }
}

// DELETE /api/finance/income/[id] - Delete income record
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await prisma.income.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Income record not found" },
        { status: 404 }
      )
    }

    await prisma.income.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Income record deleted successfully",
    })
  } catch (error) {
    console.error("[income] DELETE error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete income record" },
      { status: 500 }
    )
  }
}
