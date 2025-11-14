import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { generateCashFlowStatement } from "@/lib/report-generator"

const cashFlowSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  academicYear: z.string().optional(),
  openingBalance: z.string().optional().default("0"),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    const data = cashFlowSchema.parse(params)

    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)
    const openingBalance = parseFloat(data.openingBalance)

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
    const cashFlow = generateCashFlowStatement(income, expenses, period, openingBalance)

    return NextResponse.json({
      success: true,
      data: cashFlow,
    })
  } catch (error) {
    console.error("[cash-flow] GET error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: "Failed to generate cash flow statement" }, { status: 500 })
  }
}
