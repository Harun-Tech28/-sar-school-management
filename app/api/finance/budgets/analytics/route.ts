import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { calculateBudgetStatus, calculateBurnRate, getBudgetRecommendations } from "@/lib/budget-calculator"

const analyticsSchema = z.object({
  academicYear: z.string(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    const data = analyticsSchema.parse(params)

    const budgets = await prisma.budget.findMany({
      where: {
        academicYear: data.academicYear,
      },
    })

    const analytics = await Promise.all(
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
        const budgetStatus = calculateBudgetStatus(budget.amount, spentAmount)

        const yearStart = new Date(`${data.academicYear}-09-01`)
        const now = new Date()
        
        const burnRate = calculateBurnRate(spentAmount, yearStart, now)
        const recommendations = getBudgetRecommendations(budgetStatus)

        return {
          category: budget.category,
          subcategory: budget.subcategory,
          ...budgetStatus,
          burnRate,
          recommendations,
        }
      })
    )

    const summary = {
      totalBudgets: budgets.length,
      totalAllocated: budgets.reduce((sum, b) => sum + b.amount, 0),
      totalSpent: analytics.reduce((sum, a) => sum + a.spentAmount, 0),
      totalRemaining: analytics.reduce((sum, a) => sum + a.remainingAmount, 0),
      averageUtilization: analytics.reduce((sum, a) => sum + a.utilizationPercentage, 0) / analytics.length,
      budgetsByStatus: {
        healthy: analytics.filter(a => a.status === 'HEALTHY').length,
        warning: analytics.filter(a => a.status === 'WARNING').length,
        critical: analytics.filter(a => a.status === 'CRITICAL').length,
        exceeded: analytics.filter(a => a.status === 'EXCEEDED').length,
      },
      topSpendingCategories: analytics
        .sort((a, b) => b.spentAmount - a.spentAmount)
        .slice(0, 5)
        .map(a => ({
          category: a.category,
          subcategory: a.subcategory,
          spent: a.spentAmount,
          utilization: a.utilizationPercentage,
        })),
    }

    return NextResponse.json({
      success: true,
      data: {
        analytics,
        summary,
      },
    })
  } catch (error) {
    console.error("[budgets/analytics] GET error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: "Failed to fetch budget analytics" }, { status: 500 })
  }
}
