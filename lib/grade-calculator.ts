// Grade calculation utilities for exam management and report cards

export interface GradeData {
  marks: number
  totalMarks: number
}

export interface StudentGrade extends GradeData {
  subject: string
  examType: string
  term: string
  academicYear: string
}

export interface GradeResult {
  percentage: number
  letterGrade: string
  remarks: string
}

// Calculate percentage from marks
export function calculatePercentage(marks: number, totalMarks: number): number {
  if (totalMarks === 0) return 0
  return (marks / totalMarks) * 100
}

// Calculate letter grade based on percentage
export function calculateLetterGrade(percentage: number): string {
  if (percentage >= 80) return "A"
  if (percentage >= 70) return "B"
  if (percentage >= 60) return "C"
  if (percentage >= 50) return "D"
  return "F"
}

// Get grade remarks based on letter grade
export function getGradeRemarks(letterGrade: string): string {
  const remarksMap: Record<string, string> = {
    A: "Excellent",
    B: "Very Good",
    C: "Good",
    D: "Satisfactory",
    F: "Needs Improvement",
  }
  return remarksMap[letterGrade] || "N/A"
}

// Calculate complete grade result
export function calculateGradeResult(marks: number, totalMarks: number): GradeResult {
  const percentage = calculatePercentage(marks, totalMarks)
  const letterGrade = calculateLetterGrade(percentage)
  const remarks = getGradeRemarks(letterGrade)

  return {
    percentage: Math.round(percentage * 10) / 10,
    letterGrade,
    remarks,
  }
}

// Calculate overall average from multiple grades
export function calculateOverallAverage(grades: GradeData[]): number {
  if (grades.length === 0) return 0

  const totalMarks = grades.reduce((sum, grade) => sum + grade.totalMarks, 0)
  const marksObtained = grades.reduce((sum, grade) => sum + grade.marks, 0)

  if (totalMarks === 0) return 0
  return (marksObtained / totalMarks) * 100
}

// Calculate weighted average (if subjects have different weights)
export function calculateWeightedAverage(
  grades: Array<GradeData & { weight?: number }>
): number {
  if (grades.length === 0) return 0

  const totalWeight = grades.reduce((sum, grade) => sum + (grade.weight || 1), 0)
  const weightedSum = grades.reduce((sum, grade) => {
    const percentage = calculatePercentage(grade.marks, grade.totalMarks)
    return sum + percentage * (grade.weight || 1)
  }, 0)

  return weightedSum / totalWeight
}

// Calculate GPA (4.0 scale)
export function calculateGPA(grades: GradeData[]): number {
  if (grades.length === 0) return 0

  const gradePoints: Record<string, number> = {
    A: 4.0,
    B: 3.0,
    C: 2.0,
    D: 1.0,
    F: 0.0,
  }

  const totalPoints = grades.reduce((sum, grade) => {
    const percentage = calculatePercentage(grade.marks, grade.totalMarks)
    const letterGrade = calculateLetterGrade(percentage)
    return sum + gradePoints[letterGrade]
  }, 0)

  return Math.round((totalPoints / grades.length) * 100) / 100
}

// Validate grade data
export function validateGrade(marks: number, totalMarks: number): {
  valid: boolean
  error?: string
} {
  if (marks < 0) {
    return { valid: false, error: "Marks must be a positive number" }
  }

  if (totalMarks <= 0) {
    return { valid: false, error: "Total marks must be greater than zero" }
  }

  if (marks > totalMarks) {
    return { valid: false, error: "Marks cannot exceed total marks" }
  }

  return { valid: true }
}

// Get grade statistics for a set of grades
export interface GradeStatistics {
  average: number
  highest: number
  lowest: number
  median: number
  standardDeviation: number
  passRate: number
}

export function calculateGradeStatistics(grades: GradeData[]): GradeStatistics {
  if (grades.length === 0) {
    return {
      average: 0,
      highest: 0,
      lowest: 0,
      median: 0,
      standardDeviation: 0,
      passRate: 0,
    }
  }

  // Calculate percentages
  const percentages = grades.map((g) => calculatePercentage(g.marks, g.totalMarks))

  // Average
  const sum = percentages.reduce((a, b) => a + b, 0)
  const average = sum / percentages.length

  // Highest and lowest
  const highest = Math.max(...percentages)
  const lowest = Math.min(...percentages)

  // Median
  const sorted = [...percentages].sort((a, b) => a - b)
  const median =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)]

  // Standard deviation
  const squaredDiffs = percentages.map((p) => Math.pow(p - average, 2))
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / percentages.length
  const standardDeviation = Math.sqrt(variance)

  // Pass rate (50% and above)
  const passCount = percentages.filter((p) => p >= 50).length
  const passRate = (passCount / percentages.length) * 100

  return {
    average: Math.round(average * 10) / 10,
    highest: Math.round(highest * 10) / 10,
    lowest: Math.round(lowest * 10) / 10,
    median: Math.round(median * 10) / 10,
    standardDeviation: Math.round(standardDeviation * 10) / 10,
    passRate: Math.round(passRate * 10) / 10,
  }
}

// Get grade distribution
export interface GradeDistribution {
  A: number
  B: number
  C: number
  D: number
  F: number
}

export function calculateGradeDistribution(grades: GradeData[]): GradeDistribution {
  const distribution: GradeDistribution = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    F: 0,
  }

  grades.forEach((grade) => {
    const percentage = calculatePercentage(grade.marks, grade.totalMarks)
    const letterGrade = calculateLetterGrade(percentage)
    distribution[letterGrade as keyof GradeDistribution]++
  })

  return distribution
}
