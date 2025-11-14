import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PUT /api/finance/salaries/[id]/pay - Mark salary as paid
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { paymentDate, paymentMethod } = body

    if (!paymentDate || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: "paymentDate and paymentMethod are required" },
        { status: 400 }
      )
    }

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
        { success: false, error: "Salary already marked as paid" },
        { status: 400 }
      )
    }

    const salary = await prisma.salary.update({
      where: { id },
      data: {
        status: "PAID",
        paymentDate: new Date(paymentDate),
        paymentMethod,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Salary marked as paid successfully",
      data: salary,
    })
  } catch (error) {
    console.error("[salary] PAY error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to mark salary as paid" },
      { status: 500 }
    )
  }
}
