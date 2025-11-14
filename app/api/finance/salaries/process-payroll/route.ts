import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculateSalary, getCurrentMonth } from "@/lib/salary-calculator"

// POST /api/finance/salaries/process-payroll - Process monthly payroll for all employees
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { month, employeeType } = body

    const targetMonth = month || getCurrentMonth()

    // Check if payroll already processed for this month
    const existing = await prisma.salary.findFirst({
      where: {
        month: targetMonth,
        ...(employeeType && { employeeType }),
      },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: `Payroll already processed for ${targetMonth}` },
        { status: 400 }
      )
    }

    // Get all teachers
    const teachers = await prisma.teacher.findMany({
      include: {
        user: true,
      },
    })

    const salaryRecords = []

    // Create salary records for each teacher
    // Note: In production, you'd have a separate salary structure table
    // For now, using a default basic salary
    for (const teacher of teachers) {
      const basicSalary = 3000 // Default basic salary - should come from salary structure
      const allowances = 500 // Default allowances
      const bonuses = 0
      const deductions = 0

      const calculated = calculateSalary({
        basicSalary,
        allowances,
        bonuses,
        deductions,
      })

      const salary = await prisma.salary.create({
        data: {
          employeeId: teacher.id,
          employeeType: "TEACHER",
          month: targetMonth,
          basicSalary: calculated.basicSalary,
          allowances: calculated.allowances,
          bonuses: calculated.bonuses,
          grossSalary: calculated.grossSalary,
          deductions: calculated.deductions,
          netSalary: calculated.netSalary,
          status: "PENDING",
        },
      })

      salaryRecords.push(salary)
    }

    return NextResponse.json({
      success: true,
      message: `Payroll processed for ${salaryRecords.length} employees`,
      data: {
        month: targetMonth,
        count: salaryRecords.length,
        totalGross: salaryRecords.reduce((sum, s) => sum + s.grossSalary, 0),
        totalNet: salaryRecords.reduce((sum, s) => sum + s.netSalary, 0),
      },
    })
  } catch (error) {
    console.error("[salaries] PROCESS error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process payroll" },
      { status: 500 }
    )
  }
}
