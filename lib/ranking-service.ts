// Class ranking service for calculating student rankings

import { calculatePercentage } from "./grade-calculator"

export interface StudentRankingData {
  studentId: string
  studentName: string
  totalMarks: number
  marksObtained: number
  average: number
}

export interface RankingResult {
  studentId: string
  studentName: string
  rank: number
  average: number
  totalStudents: number
}

// Calculate rankings for a list of students
export function calculateRankings(
  students: StudentRankingData[]
): RankingResult[] {
  if (students.length === 0) return []

  // Sort students by average in descending order
  const sorted = [...students].sort((a, b) => b.average - a.average)

  // Assign ranks (handle ties)
  const rankings: RankingResult[] = []
  let currentRank = 1

  for (let i = 0; i < sorted.length; i++) {
    const student = sorted[i]

    // Check if this student has the same average as the previous one (tie)
    if (i > 0 && sorted[i - 1].average === student.average) {
      // Same rank as previous student
      rankings.push({
        studentId: student.studentId,
        studentName: student.studentName,
        rank: rankings[i - 1].rank,
        average: Math.round(student.average * 10) / 10,
        totalStudents: students.length,
      })
    } else {
      // New rank
      rankings.push({
        studentId: student.studentId,
        studentName: student.studentName,
        rank: currentRank,
        average: Math.round(student.average * 10) / 10,
        totalStudents: students.length,
      })
    }

    currentRank++
  }

  return rankings
}

// Get rank for a specific student
export function getStudentRank(
  studentId: string,
  students: StudentRankingData[]
): RankingResult | null {
  const rankings = calculateRankings(students)
  return rankings.find((r) => r.studentId === studentId) || null
}

// Get top N students
export function getTopPerformers(
  students: StudentRankingData[],
  count: number = 5
): RankingResult[] {
  const rankings = calculateRankings(students)
  return rankings.slice(0, count)
}

// Get bottom N students (students needing support)
export function getBottomPerformers(
  students: StudentRankingData[],
  count: number = 5
): RankingResult[] {
  const rankings = calculateRankings(students)
  return rankings.slice(-count).reverse()
}

// Get students by rank range
export function getStudentsByRankRange(
  students: StudentRankingData[],
  startRank: number,
  endRank: number
): RankingResult[] {
  const rankings = calculateRankings(students)
  return rankings.filter((r) => r.rank >= startRank && r.rank <= endRank)
}

// Get students by average range
export function getStudentsByAverageRange(
  students: StudentRankingData[],
  minAverage: number,
  maxAverage: number
): RankingResult[] {
  const rankings = calculateRankings(students)
  return rankings.filter((r) => r.average >= minAverage && r.average <= maxAverage)
}

// Calculate percentile for a student
export function calculatePercentile(
  studentId: string,
  students: StudentRankingData[]
): number {
  const rankings = calculateRankings(students)
  const studentRanking = rankings.find((r) => r.studentId === studentId)

  if (!studentRanking) return 0

  // Percentile = (Number of students below + 0.5 * Number of students at same rank) / Total students * 100
  const studentsBelow = rankings.filter((r) => r.rank > studentRanking.rank).length
  const studentsAtSameRank = rankings.filter(
    (r) => r.rank === studentRanking.rank
  ).length

  const percentile =
    ((studentsBelow + 0.5 * studentsAtSameRank) / rankings.length) * 100

  return Math.round(percentile * 10) / 10
}

// Get ranking statistics
export interface RankingStatistics {
  totalStudents: number
  averageScore: number
  highestScore: number
  lowestScore: number
  medianRank: number
  studentsAboveAverage: number
  studentsBelowAverage: number
}

export function getRankingStatistics(
  students: StudentRankingData[]
): RankingStatistics {
  if (students.length === 0) {
    return {
      totalStudents: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      medianRank: 0,
      studentsAboveAverage: 0,
      studentsBelowAverage: 0,
    }
  }

  const rankings = calculateRankings(students)
  const averages = rankings.map((r) => r.average)

  const sum = averages.reduce((a, b) => a + b, 0)
  const averageScore = sum / averages.length

  const highestScore = Math.max(...averages)
  const lowestScore = Math.min(...averages)

  const sorted = [...averages].sort((a, b) => a - b)
  const medianRank =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)]

  const studentsAboveAverage = averages.filter((a) => a > averageScore).length
  const studentsBelowAverage = averages.filter((a) => a < averageScore).length

  return {
    totalStudents: students.length,
    averageScore: Math.round(averageScore * 10) / 10,
    highestScore: Math.round(highestScore * 10) / 10,
    lowestScore: Math.round(lowestScore * 10) / 10,
    medianRank: Math.round(medianRank * 10) / 10,
    studentsAboveAverage,
    studentsBelowAverage,
  }
}

// Compare student performance across terms
export interface TermComparison {
  studentId: string
  studentName: string
  previousRank: number
  currentRank: number
  rankChange: number
  previousAverage: number
  currentAverage: number
  averageChange: number
  trend: "improving" | "declining" | "stable"
}

export function compareTermPerformance(
  previousTermStudents: StudentRankingData[],
  currentTermStudents: StudentRankingData[]
): TermComparison[] {
  const previousRankings = calculateRankings(previousTermStudents)
  const currentRankings = calculateRankings(currentTermStudents)

  const comparisons: TermComparison[] = []

  currentRankings.forEach((current) => {
    const previous = previousRankings.find((p) => p.studentId === current.studentId)

    if (previous) {
      const rankChange = previous.rank - current.rank // Positive means improved
      const averageChange = current.average - previous.average

      let trend: "improving" | "declining" | "stable" = "stable"
      if (averageChange > 2) trend = "improving"
      else if (averageChange < -2) trend = "declining"

      comparisons.push({
        studentId: current.studentId,
        studentName: current.studentName,
        previousRank: previous.rank,
        currentRank: current.rank,
        rankChange,
        previousAverage: previous.average,
        currentAverage: current.average,
        averageChange: Math.round(averageChange * 10) / 10,
        trend,
      })
    }
  })

  return comparisons
}
