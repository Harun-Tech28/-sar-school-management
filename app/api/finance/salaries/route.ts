import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { calculateSalary } from "@/lib/salary-calculator"

const createSalarySchema = z.object({
  employeeId: z.string(),
  employeeType: z.enum(["TEACHER", "STAFF"]),
  month: z.string(), // YYYY-MM format
  basicSalary: z.number().positive(),
  allowances: z.number().default(0),
  bonuses: z.number().default(0),
  deductions: z.number().default(0),
  remarks: z.string().optional(),
})

// GET /api/finance/salaries - List all salary records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get("employeeId")
    const employeeType = searchParams.get("employeeType")
    const month = searchParams.get("month")
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    const where: any = {}

    if (employeeId) where.employeeId = employeeId
    if (employeeType) where.employeeType = employeeType
    if (month) where.month = month
    if (status) where.status = status

    const [salaries, total, totalAmount] = await Promise.all([
      prisma.salary.findMany({
        where,
        skip,
        take: limit,
        orderBy: { month: "desc" },
      }),
      prisma.salary.count({ where }),
      prisma.salary.aggregate({
        where,
        _sum: { netSalary: true },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: salaries,
      summary: {
        totalNetSalary: totalAmount._sum.netSalary || 0,
        totalRecords: total,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[salaries] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch salary records" },
      { status: 500 }
    )
  }
}

// POST /api/finance/salaries - Create new salary record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createSalarySchema.parse(body)

    // Check if salary already exists for this employee and month
    const existing = await prisma.salary.findUnique({
      where: {
        employeeId_month: {
          employeeId: data.employeeId,
          month: data.month,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Salary record already exists for this employee and month" },
        { status: 400 }
      )
    }

    // Calculate gross and net salary
    const calculated = calculateSalary({
      basicSalary: data.basicSalary,
      allowances: data.allowances,
      bonuses: data.bonuses,
      deductions: data.deductions,
    })

    const salary = await prisma.salary.create({
      data: {
        employeeId: data.employeeId,
        employeeType: data.employeeType,
        month: data.month,
        basicSalary: calculated.basicSalary,
        allowances: calculated.allowances,
        bonuses: calculated.bonuses,
        grossSalary: calculated.grossSalary,
        deductions: calculated.deductions,
        netSalary: calculated.netSalary,
        remarks: data.remarks,
        status: "PENDING",
      },
    })

    return NextResponse.json(
      { success: true, message: "Salary record created successfully", data: salary },
      { status: 201 }
    )
  } catch (error) {
    console.error("[salaries] POST error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to create salary record" },
      { status: 500 }
    )
  }
}
