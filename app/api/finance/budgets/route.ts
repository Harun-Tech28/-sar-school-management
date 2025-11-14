import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { calculateBudgetStatus, generateBudgetAlerts } from "@/lib/budget-calculator"

const createBudgetSchema = z.object({
  academicYear: z.string(),
  category: z.enum(["SALARIES", "UTILITIES", "MAINTENANCE", "SUPPLIES", "TRANSPORT", "FOOD", "EVENTS", "EQUIPMENT", "OTHER"]),
  subcategory: z.string().optional(),
  amount: z.number().positive(),
  term: z.string().optional(),
  description: z.string().optional(),
  createdBy: z.string(),
})

const listBudgetsSchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  academicYear: z.string().optional(),
  category: z.enum(["SALARIES", "UTILITIES", "MAINTENANCE", "SUPPLIES", "TRANSPORT", "FOOD", "EVENTS", "EQUIPMENT", "OTHER"]).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    const data = listBudgetsSchema.parse(params)

    const page = parseInt(data.page)
    const limit = parseInt(data.limit)
    const skip = (page - 1) * limit

    const where: any = {}
    if (data.academicYear) where.academicYear = data.academicYear
    if (data.category) where.category = data.category

    const [budgets, total] = await Promise.all([
      prisma.budget.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ academicYear: "desc" }, { category: "asc" }],
      }),
      prisma.budget.count({ where }),
    ])

    const budgetsWithStatus = await Promise.all(
      budgets.map(async (budget) => {
        const expenses = await prisma.expense.aggregate({
          where: {
            category: budget.category,
            subcategory: budget.subcategory || undefined,
            academicYear: budget.academicYear,
            approved: true,
          },
          _sum: { amount: true },
        })

        const spentAmount = expenses._sum.amount || 0
        const remainingAmount = budget.amount - spentAmount
        const budgetStatus = calculateBudgetStatus(budget.amount, spentAmount)
        const alerts = generateBudgetAlerts(budgetStatus)

        // Update spent amount in database
        await prisma.budget.update({
          where: { id: budget.id },
          data: { spent: spentAmount },
        })

        return {
          ...budget,
          allocatedAmount: budget.amount,
          spentAmount,
          remainingAmount,
          utilizationPercentage: budgetStatus.utilizationPercentage,
          budgetStatus: budgetStatus.status,
          alerts,
        }
      })
    )

    const summary = {
      totalAllocated: budgetsWithStatus.reduce((sum, b) => sum + b.allocatedAmount, 0),
      totalSpent: budgetsWithStatus.reduce((sum, b) => sum + b.spentAmount, 0),
      totalRemaining: budgetsWithStatus.reduce((sum, b) => sum + b.remainingAmount, 0),
      budgetsOverLimit: budgetsWithStatus.filter(b => b.budgetStatus === 'EXCEEDED').length,
      budgetsApproachingLimit: budgetsWithStatus.filter(b => b.budgetStatus === 'WARNING' || b.budgetStatus === 'CRITICAL').length,
    }

    return NextResponse.json({
      success: true,
      data: budgetsWithStatus,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      summary,
    })
  } catch (error) {
    console.error("[budgets] GET error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: "Failed to fetch budget records" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createBudgetSchema.parse(body)

    const existing = await prisma.budget.findFirst({
      where: {
        academicYear: data.academicYear,
        category: data.category,
        subcategory: data.subcategory || null,
        term: data.term || null,
      },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Budget already exists for this category, term, and year" },
        { status: 400 }
      )
    }

    const budget = await prisma.budget.create({
      data: {
        academicYear: data.academicYear,
        category: data.category,
        subcategory: data.subcategory,
        amount: data.amount,
        spent: 0,
        term: data.term,
        description: data.description,
        createdBy: data.createdBy,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Budget created successfully",
      data: budget,
    })
  } catch (error) {
    console.error("[budgets] POST error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: "Failed to create budget" }, { status: 500 })
  }
}
