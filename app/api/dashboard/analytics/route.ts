import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Calculate financial net (total payments received this month)
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    const payments = await prisma.feePayment.aggregate({
      where: {
        paymentDate: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      _sum: {
        amount: true
      }
    })

    const financialNet = payments._sum.amount || 0

    // Calculate performance average (average of all grades as percentage)
    const gradesAvg = await prisma.grade.aggregate({
      _avg: {
        marks: true,
        totalMarks: true
      }
    })

    const performanceAverage = gradesAvg._avg.marks && gradesAvg._avg.totalMarks 
      ? (gradesAvg._avg.marks / gradesAvg._avg.totalMarks) * 100 
      : 0

    // Count recent grades (as proxy for reports in last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentReports = await prisma.grade.groupBy({
      by: ['studentId'],
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        financialNet,
        performanceAverage,
        recentReports: recentReports.length
      }
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch analytics data"
      },
      { status: 500 }
    )
  }
}
