import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { calculateSalary } from "@/lib/salary-calculator"

const updateSalarySchema = z.object({
  basicSalary: z.number().positive().optional(),
  allowances: z.number().optional(),
  bonuses: z.number().optional(),
  deductions: z.number().optional(),
  status: z.enum(["PENDING", "PAID", "OVERDUE"]).optional(),
  paymentDate: z.string().optional(),
  paymentMethod: z.string().optional(),
  remarks: z.string().optional(),
})

// GET /api/finance/salaries/[id] - Get single salary record
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const salary = await prisma.salary.findUnique({
      where: { id },
    })

    if (!salary) {
      return NextResponse.json(
        { success: false, error: "Salary record not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: salary,
    })
  } catch (error) {
    console.error("[salary] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch salary record" },
      { status: 500 }
    )
  }
}

// PUT /api/finance/salaries/[id] - Update salary record
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateSalarySchema.parse(body)

    const existing = await prisma.salary.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Salary record not found" },
        { status: 404 }
      )
    }

    const updateData: any = { ...data }

    // Recalculate if salary components changed
    if (data.basicSalary || data.allowances || data.bonuses || data.deductions) {
      const calculated = calculateSalary({
        basicSalary: data.basicSalary || existing.basicSalary,
        allowances: data.allowances !== undefined ? data.allowances : existing.allowances,
        bonuses: data.bonuses !== undefined ? data.bonuses : existing.bonuses,
        deductions: data.deductions !== undefined ? data.deductions : existing.deductions,
      })

      updateData.grossSalary = calculated.grossSalary
      updateData.netSalary = calculated.netSalary
    }

    if (data.paymentDate) {
      updateData.paymentDate = new Date(data.paymentDate)
    }

    const salary = await prisma.salary.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: "Salary record updated successfully",
      data: salary,
    })
  } catch (error) {
    console.error("[salary] PUT error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to update salary record" },
      { status: 500 }
    )
  }
}

// DELETE /api/finance/salaries/[id] - Delete salary record
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await prisma.salary.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Salary record not found" },
        { status: 404 }
      )
    }

    if (existing.status === "PAID") {
      return NextResponse.json(
        { success: false, error: "Cannot delete paid salary record" },
        { status: 400 }
      )
    }

    await prisma.salary.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Salary record deleted successfully",
    })
  } catch (error) {
    console.error("[salary] DELETE error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete salary record" },
      { status: 500 }
    )
  }
}
