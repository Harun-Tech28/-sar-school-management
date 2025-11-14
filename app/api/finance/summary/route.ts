import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/finance/summary - Get financial summary
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const academicYear = searchParams.get("academicYear")
    const term = searchParams.get("term")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const where: any = {}
    if (academicYear) where.academicYear = academicYear
    if (term) where.term = term
    
    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate)
      if (endDate) where.date.lte = new Date(endDate)
    }

    // Get income summary
    const [totalIncome, incomeByCategory, verifiedIncome] = await Promise.all([
      prisma.income.aggregate({
        where,
        _sum: { amount: true },
        _count: true,
      }),
      prisma.income.groupBy({
        by: ['category'],
        where,
        _sum: { amount: true },
        _count: true,
      }),
      prisma.income.aggregate({
        where: { ...where, verified: true },
        _sum: { amount: true },
      }),
    ])

    // Get expense summary
    const [totalExpenses, expensesByCategory, approvedExpenses] = await Promise.all([
      prisma.expense.aggregate({
        where,
        _sum: { amount: true },
        _count: true,
      }),
      prisma.expense.groupBy({
        by: ['category'],
        where,
        _sum: { amount: true },
        _count: true,
      }),
      prisma.expense.aggregate({
        where: { ...where, approved: true },
        _sum: { amount: true },
      }),
    ])

    const income = totalIncome._sum.amount || 0
    const expenses = totalExpenses._sum.amount || 0
    const netBalance = income - expenses

    return NextResponse.json({
      success: true,
      data: {
        income: {
          total: income,
          verified: verifiedIncome._sum.amount || 0,
          unverified: income - (verifiedIncome._sum.amount || 0),
          count: totalIncome._count,
          byCategory: incomeByCategory.map(cat => ({
            category: cat.category,
            amount: cat._sum.amount || 0,
            count: cat._count,
          })),
        },
        expenses: {
          total: expenses,
          approved: approvedExpenses._sum.amount || 0,
          pending: expenses - (approvedExpenses._sum.amount || 0),
          count: totalExpenses._count,
          byCategory: expensesByCategory.map(cat => ({
            category: cat.category,
            amount: cat._sum.amount || 0,
            count: cat._count,
          })),
        },
        netBalance,
        profitMargin: income > 0 ? ((netBalance / income) * 100).toFixed(2) : 0,
      },
    })
  } catch (error) {
    console.error("[finance/summary] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch financial summary" },
      { status: 500 }
    )
  }
}
