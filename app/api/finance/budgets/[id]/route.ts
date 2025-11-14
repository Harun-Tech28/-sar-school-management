import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateBudgetSchema = z.object({
  amount: z.number().positive().optional(),
  description: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const budget = await prisma.budget.findUnique({
      where: { id },
    })

    if (!budget) {
      return NextResponse.json(
        { error: "Budget not found" },
        { status: 404 }
      )
    }

    // Calculate utilization percentage
    const utilizationRate = budget.amount > 0 
      ? (budget.spent / budget.amount) * 100 
      : 0

    const remaining = budget.amount - budget.spent
    const isOverBudget = budget.spent > budget.amount
    const isNearLimit = utilizationRate >= 80 && !isOverBudget

    return NextResponse.json({
      ...budget,
      utilizationRate: Math.round(utilizationRate * 100) / 100,
      remaining,
      isOverBudget,
      isNearLimit,
    })
  } catch (error) {
    console.error("Error fetching budget:", error)
    return NextResponse.json(
      { error: "Failed to fetch budget" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateBudgetSchema.parse(body)

    const existing = await prisma.budget.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Budget not found" },
        { status: 404 }
      )
    }

    // Validation
    if (data.amount !== undefined && data.amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (data.amount !== undefined) updateData.amount = data.amount
    if (data.description !== undefined) updateData.description = data.description

    const budget = await prisma.budget.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(budget)
  } catch (error) {
    console.error("Error updating budget:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update budget" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const budget = await prisma.budget.findUnique({
      where: { id },
    })

    if (!budget) {
      return NextResponse.json(
        { error: "Budget not found" },
        { status: 404 }
      )
    }

    // Check if budget has been used (spent > 0)
    if (budget.spent > 0) {
      return NextResponse.json(
        { error: "Cannot delete budget with recorded expenses" },
        { status: 400 }
      )
    }

    await prisma.budget.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Budget deleted successfully" })
  } catch (error) {
    console.error("Error deleting budget:", error)
    return NextResponse.json(
      { error: "Failed to delete budget" },
      { status: 500 }
    )
  }
}
