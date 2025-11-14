import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { generateBalanceSheet } from "@/lib/report-generator"

const balanceSheetSchema = z.object({
  asOfDate: z.string(),
  academicYear: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    const data = balanceSheetSchema.parse(params)

    const asOfDate = new Date(data.asOfDate)

    // Get cash balance (sum of all income - expenses up to date)
    const incomeSum = await prisma.income.aggregate({
      where: { date: { lte: asOfDate } },
      _sum: { amount: true },
    })

    const expenseSum = await prisma.expense.aggregate({
      where: { 
        date: { lte: asOfDate },
        approved: true,
      },
      _sum: { amount: true },
    })

    const cashBalance = (incomeSum._sum.amount || 0) - (expenseSum._sum.amount || 0)

    // For now, use simplified balance sheet
    // In production, you'd have separate models for assets, liabilities, etc.
    const balanceSheet = generateBalanceSheet(
      cashBalance,
      0, // Bank balance - would come from BankAccount model
      0, // Receivables - would come from fee system
      [], // Assets - would come from Asset model
      [], // Liabilities - would come from Liability model
      0, // Retained earnings - would be calculated from previous years
      cashBalance, // Current year income
      asOfDate.toLocaleDateString()
    )

    return NextResponse.json({
      success: true,
      data: balanceSheet,
    })
  } catch (error) {
    console.error("[balance-sheet] GET error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: "Failed to generate balance sheet" }, { status: 500 })
  }
}
