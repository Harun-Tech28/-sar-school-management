import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/reports/cases/[id] - Get a specific report
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const report = await prisma.report.findUnique({
      where: { id },
    })

    if (!report) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: report,
    })
  } catch (error) {
    console.error("Error fetching report:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch report" },
      { status: 500 }
    )
  }
}

// PUT /api/reports/cases/[id] - Update a report
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, assignedTo, resolution, resolvedBy } = body

    const updateData: any = {}
    if (status) updateData.status = status
    if (assignedTo) updateData.assignedTo = assignedTo
    if (resolution) updateData.resolution = resolution
    if (resolvedBy) updateData.resolvedBy = resolvedBy

    // If status is RESOLVED or CLOSED, set resolvedAt
    if (status === "RESOLVED" || status === "CLOSED") {
      updateData.resolvedAt = new Date()
    }

    const report = await prisma.report.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: "Report updated successfully",
      data: report,
    })
  } catch (error) {
    console.error("Error updating report:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update report" },
      { status: 500 }
    )
  }
}

// DELETE /api/reports/cases/[id] - Delete a report
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.report.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Report deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting report:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete report" },
      { status: 500 }
    )
  }
}
