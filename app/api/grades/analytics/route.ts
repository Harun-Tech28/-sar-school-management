import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/grades/analytics - Get grade analytics and statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("classId")
    const term = searchParams.get("term")
    const academicYear = searchParams.get("academicYear")
    const subject = searchParams.get("subject")

    const whereClause: any = {}

    if (classId) {
      whereClause.student = {
        classId,
      }
    }

    if (term) {
      whereClause.term = term
    }

    if (academicYear) {
      whereClause.academicYear = academicYear
    }

    if (subject) {
      whereClause.subject = subject
    }

    // Fetch all grades matching the criteria
    const grades = await prisma.grade.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    })

    if (grades.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          statistics: {
            average: 0,
            highest: 0,
            lowest: 0,
            median: 0,
            standardDeviation: 0,
          },
          distribution: {
            A: 0,
            B: 0,
            C: 0,
            D: 0,
            F: 0,
          },
          topPerformers: [],
          needsSupport: [],
          totalStudents: 0,
        },
      })
    }

    // Calculate percentages
    const percentages = grades.map((g) => (g.marks / g.totalMarks) * 100)

    // Calculate statistics
    const sum = percentages.reduce((a, b) => a + b, 0)
    const average = sum / percentages.length
    const highest = Math.max(...percentages)
    const lowest = Math.min(...percentages)

    // Calculate median
    const sorted = [...percentages].sort((a, b) => a - b)
    const median =
      sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)]

    // Calculate standard deviation
    const squaredDiffs = percentages.map((p) => Math.pow(p - average, 2))
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / percentages.length
    const standardDeviation = Math.sqrt(variance)

    // Calculate grade distribution
    const distribution = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      F: 0,
    }

    percentages.forEach((p) => {
      if (p >= 80) distribution.A++
      else if (p >= 70) distribution.B++
      else if (p >= 60) distribution.C++
      else if (p >= 50) distribution.D++
      else distribution.F++
    })

    // Get top performers (top 5)
    const gradesWithPercentage = grades.map((g) => ({
      ...g,
      percentage: (g.marks / g.totalMarks) * 100,
    }))

    const topPerformers = gradesWithPercentage
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5)
      .map((g) => ({
        studentId: g.studentId,
        name: g.student.user.fullName,
        marks: g.marks,
        totalMarks: g.totalMarks,
        percentage: Math.round(g.percentage * 10) / 10,
      }))

    // Get students needing support (below 50%)
    const needsSupport = gradesWithPercentage
      .filter((g) => g.percentage < 50)
      .sort((a, b) => a.percentage - b.percentage)
      .map((g) => ({
        studentId: g.studentId,
        name: g.student.user.fullName,
        marks: g.marks,
        totalMarks: g.totalMarks,
        percentage: Math.round(g.percentage * 10) / 10,
      }))

    return NextResponse.json({
      success: true,
      data: {
        statistics: {
          average: Math.round(average * 10) / 10,
          highest: Math.round(highest * 10) / 10,
          lowest: Math.round(lowest * 10) / 10,
          median: Math.round(median * 10) / 10,
          standardDeviation: Math.round(standardDeviation * 10) / 10,
        },
        distribution,
        topPerformers,
        needsSupport,
        totalStudents: grades.length,
      },
    })
  } catch (error) {
    console.error("[grades/analytics] GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}
