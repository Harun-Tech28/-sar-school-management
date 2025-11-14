import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const feeStructureSchema = z.object({
  className: z.string().min(1, "Class name is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  tuition: z.number().min(0),
  textbooks: z.number().min(0),
  uniform: z.number().min(0),
  pta: z.number().min(0),
  other: z.number().min(0).optional(),
})

// GET /api/fees/structure - Get fee structures
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const className = searchParams.get("className")
    const term = searchParams.get("term")

    const where: any = {}
    if (className) where.className = className
    if (term) where.term = term

    const structures = await prisma.feeStructure.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      data: structures,
    })
  } catch (error) {
    console.error("[fees/structure] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch fee structures" },
      { status: 500 }
    )
  }
}

// POST /api/fees/structure - Create fee structure
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = feeStructureSchema.parse(body)

    const total =
      validatedData.tuition +
      validatedData.textbooks +
      validatedData.uniform +
      validatedData.pta +
      (validatedData.other || 0)

    const structure = await prisma.feeStructure.create({
      data: {
        ...validatedData,
        total,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: structure,
        message: "Fee structure created successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[fees/structure] POST error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to create fee structure" },
      { status: 500 }
    )
  }
}
