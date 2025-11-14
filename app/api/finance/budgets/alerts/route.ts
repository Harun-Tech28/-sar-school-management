import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { calculateBudgetStatus, generateBudgetAlerts } from "@/lib/budget-calculator"

const alertsSchema = z.object({
  academicYear: z.string().optional(),
  severity: z.enum(["WARNING", "CRITICAL", "EXCEEDED"]).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    const data = alertsSchema.parse(params)

    const where: any = { status: "ACTIVE" }
    if (data.academicYear) {
      where.academicYear = data.academicYear
    }

    const budgets = await prisma.budget.findMany({ where })

    const allAlerts = await Promise.all(
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
        const alerts = generateBudgetAlerts(budgetStatus)

        return alerts.map(alert => ({
          ...alert,
          budgetId: budget.id,
          category: budget.category,
          subcategory: budget.subcategory,
          academicYear: budget.academicYear,
          allocatedAmount: budget.amount,
          spentAmount,
          remainingAmount: budgetStatus.remainingAmount,
        }))
      })
    )

    let flatAlerts = allAlerts.flat()

    if (data.severity) {
      flatAlerts = flatAlerts.filter(alert => alert.type === data.severity)
    }

    flatAlerts.sort((a, b) => {
      const severityOrder: Record<string, number> = { CRITICAL: 2, WARNING: 1, INFO: 0 }
      return (severityOrder[b.type] || 0) - (severityOrder[a.type] || 0)
    })

    return NextResponse.json({
      success: true,
      data: flatAlerts,
      summary: {
        total: flatAlerts.length,
        critical: flatAlerts.filter(a => a.type === 'CRITICAL').length,
        warning: flatAlerts.filter(a => a.type === 'WARNING').length,
        info: flatAlerts.filter(a => a.type === 'INFO').length,
      },
    })
  } catch (error) {
    console.error("[budgets/alerts] GET error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: "Failed to fetch budget alerts" }, { status: 500 })
  }
}
