// Budget calculation utilities

export interface BudgetStatus {
  status: "HEALTHY" | "WARNING" | "CRITICAL" | "EXCEEDED"
  utilizationPercentage: number
  remainingAmount: number
  spentAmount: number
}

export interface BudgetAlert {
  type: "INFO" | "WARNING" | "CRITICAL"
  message: string
  timestamp: Date
}

export interface BudgetVariance {
  amount: number
  percentage: number
  isPositive: boolean
}

/**
 * Calculate budget status based on allocated and spent amounts
 */
export function calculateBudgetStatus(
  allocatedAmount: number,
  spentAmount: number
): BudgetStatus {
  const utilizationPercentage = allocatedAmount > 0 
    ? (spentAmount / allocatedAmount) * 100 
    : 0
  
  const remainingAmount = allocatedAmount - spentAmount

  let status: BudgetStatus["status"] = "HEALTHY"
  
  if (utilizationPercentage >= 100) {
    status = "EXCEEDED"
  } else if (utilizationPercentage >= 90) {
    status = "CRITICAL"
  } else if (utilizationPercentage >= 75) {
    status = "WARNING"
  }

  return {
    status,
    utilizationPercentage: Math.round(utilizationPercentage * 100) / 100,
    remainingAmount,
    spentAmount,
  }
}

/**
 * Generate alerts based on budget status
 */
export function generateBudgetAlerts(budgetStatus: BudgetStatus): BudgetAlert[] {
  const alerts: BudgetAlert[] = []
  const now = new Date()

  if (budgetStatus.status === "EXCEEDED") {
    alerts.push({
      type: "CRITICAL",
      message: `Budget exceeded by ${Math.abs(budgetStatus.remainingAmount).toFixed(2)}`,
      timestamp: now,
    })
  } else if (budgetStatus.status === "CRITICAL") {
    alerts.push({
      type: "CRITICAL",
      message: `Budget utilization at ${budgetStatus.utilizationPercentage.toFixed(1)}% - immediate action required`,
      timestamp: now,
    })
  } else if (budgetStatus.status === "WARNING") {
    alerts.push({
      type: "WARNING",
      message: `Budget utilization at ${budgetStatus.utilizationPercentage.toFixed(1)}% - monitor closely`,
      timestamp: now,
    })
  } else {
    alerts.push({
      type: "INFO",
      message: `Budget is healthy with ${budgetStatus.remainingAmount.toFixed(2)} remaining`,
      timestamp: now,
    })
  }

  return alerts
}

/**
 * Calculate budget variance
 */
export function calculateBudgetVariance(
  allocatedAmount: number,
  spentAmount: number
): BudgetVariance {
  const amount = allocatedAmount - spentAmount
  const percentage = allocatedAmount > 0 
    ? (amount / allocatedAmount) * 100 
    : 0

  return {
    amount,
    percentage: Math.round(percentage * 100) / 100,
    isPositive: amount >= 0,
  }
}

/**
 * Calculate burn rate (spending per day)
 */
export function calculateBurnRate(
  spentAmount: number,
  startDate: Date,
  endDate: Date = new Date()
): number {
  const daysDiff = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
  return spentAmount / daysDiff
}

/**
 * Get budget recommendations based on current status
 */
export function getBudgetRecommendations(budgetStatus: BudgetStatus): string[] {
  const recommendations: string[] = []

  if (budgetStatus.status === "EXCEEDED") {
    recommendations.push("Immediate budget revision required")
    recommendations.push("Review and approve all pending expenses")
    recommendations.push("Consider reallocating funds from other categories")
  } else if (budgetStatus.status === "CRITICAL") {
    recommendations.push("Freeze non-essential spending")
    recommendations.push("Review upcoming expenses and prioritize")
    recommendations.push("Prepare budget revision request")
  } else if (budgetStatus.status === "WARNING") {
    recommendations.push("Monitor spending closely")
    recommendations.push("Review and optimize recurring expenses")
    recommendations.push("Plan for potential budget adjustment")
  } else {
    recommendations.push("Continue monitoring spending patterns")
    recommendations.push("Maintain current spending controls")
  }

  return recommendations
}

/**
 * Project budget depletion date based on current burn rate
 */
export function projectDepletionDate(
  remainingAmount: number,
  burnRate: number
): Date | null {
  if (burnRate <= 0 || remainingAmount <= 0) {
    return null
  }

  const daysRemaining = Math.floor(remainingAmount / burnRate)
  const depletionDate = new Date()
  depletionDate.setDate(depletionDate.getDate() + daysRemaining)

  return depletionDate
}
