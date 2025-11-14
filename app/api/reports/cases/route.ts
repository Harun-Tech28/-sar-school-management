import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/reports/cases - Get all reports/cases
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const reportedBy = searchParams.get("reportedBy")

    const where: any = {}
    if (status) where.status = status
    if (category) where.category = category
    if (reportedBy) where.reportedBy = reportedBy

    const reports = await prisma.report.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      data: reports,
    })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch reports" },
      { status: 500 }
    )
  }
}

// POST /api/reports/cases - Create a new report/case
export async function POST(request: Request) {
  try {
    console.log("[REPORT API] Received POST request")
    
    const body = await request.json()
    console.log("[REPORT API] Request body:", JSON.stringify(body, null, 2))
    
    const {
      title,
      description,
      category,
      priority,
      reportedBy,
      location,
      attachments,
    } = body

    // Validate required fields
    if (!title || !description || !category || !reportedBy) {
      console.log("[REPORT API] Validation failed - missing fields:", {
        hasTitle: !!title,
        hasDescription: !!description,
        hasCategory: !!category,
        hasReportedBy: !!reportedBy
      })
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    console.log("[REPORT API] Checking if user exists:", reportedBy)
    
    // Verify that the user exists
    const user = await prisma.user.findUnique({
      where: { id: reportedBy },
    })

    if (!user) {
      console.log("[REPORT API] User not found:", reportedBy)
      return NextResponse.json(
        { success: false, error: "User not found. Please log in again." },
        { status: 404 }
      )
    }

    console.log("[REPORT API] User found:", user.email, user.role)
    console.log("[REPORT API] Creating report...")

    const report = await prisma.report.create({
      data: {
        title,
        description,
        category,
        priority: priority || "MEDIUM",
        reportedBy,
        location: location || null,
        attachments: attachments || [],
        status: "OPEN",
      },
    })

    console.log("[REPORT API] Report created successfully:", report.id)

    return NextResponse.json(
      {
        success: true,
        message: "Report submitted successfully",
        data: report,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[REPORT API] Error creating report:", error)
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Failed to create report"
    return NextResponse.json(
      { success: false, error: errorMessage, details: error instanceof Error ? error.stack : undefined },
      { status: 500 }
    )
  }
}
