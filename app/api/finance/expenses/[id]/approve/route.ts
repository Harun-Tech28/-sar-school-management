import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PUT /api/finance/expenses/[id]/approve - Approve expense
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { approvedBy } = body

    if (!approvedBy) {
      return NextResponse.json(
        { success: false, error: "approvedBy is required" },
        { status: 400 }
      )
    }

    const existing = await prisma.expense.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Expense record not found" },
        { status: 404 }
      )
    }

    if (existing.approved) {
      return NextResponse.json(
        { success: false, error: "Expense already approved" },
        { status: 400 }
      )
    }

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        approved: true,
        approvedBy,
        approvedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: "Expense approved successfully",
      data: expense,
    })
  } catch (error) {
    console.error("[expense] APPROVE error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to approve expense" },
      { status: 500 }
    )
  }
}
