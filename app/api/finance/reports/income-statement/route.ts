import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { generateIncomeStatement } from "@/lib/report-generator"

const incomeStatementSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  academicYear: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    const data = incomeStatementSchema.parse(params)

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

    return NextResponse.json({
      success: true,
      data: incomeStatement,
    })
  } catch (error) {
    console.error("[income-statement] GET error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: "Failed to generate income statement" }, { status: 500 })
  }
}
