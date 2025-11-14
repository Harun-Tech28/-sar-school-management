import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { generateIncomeStatement, generateBalanceSheet, calculateFinancialRatios } from "@/lib/report-generator"

const ratiosSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  academicYear: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    const data = ratiosSchema.parse(params)

    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)

    const where: any = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    }

    if (data.academicYear) {
      where.academicYear = data.academicYear
    }

    const [income, expenses] = await Promise.all([
      prisma.income.findMany({ where }),
      prisma.expense.findMany({ 
        where: {
          ...where,
          approved: true,
        },
      }),
    ])

    const period = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
    const incomeStatement = generateIncomeStatement(income, expenses, period)

    const incomeSum = await prisma.income.aggregate({
      where: { date: { lte: endDate } },
      _sum: { amount: true },
    })

    const expenseSum = await prisma.expense.aggregate({
      where: { 
        date: { lte: endDate },
        approved: true,
      },
      _sum: { amount: true },
    })

    const cashBalance = (incomeSum._sum.amount || 0) - (expenseSum._sum.amount || 0)

    const balanceSheet = generateBalanceSheet(
      cashBalance,
      0,
      0,
      [],
      [],
      0,
      incomeStatement.netIncome,
      endDate.toLocaleDateString()
    )

    const ratios = calculateFinancialRatios(incomeStatement, balanceSheet)

    return NextResponse.json({
      success: true,
      data: {
        ratios,
        period,
        interpretation: {
          currentRatio: ratios.currentRatio >= 1.5 ? 'Good' : ratios.currentRatio >= 1 ? 'Fair' : 'Poor',
          debtToEquityRatio: ratios.debtToEquityRatio <= 1 ? 'Good' : ratios.debtToEquityRatio <= 2 ? 'Fair' : 'High Risk',
          profitMargin: ratios.profitMargin >= 10 ? 'Excellent' : ratios.profitMargin >= 5 ? 'Good' : ratios.profitMargin >= 0 ? 'Fair' : 'Loss',
        },
      },
    })
  } catch (error) {
    console.error("[financial-ratios] GET error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: "Failed to calculate financial ratios" }, { status: 500 })
  }
}
