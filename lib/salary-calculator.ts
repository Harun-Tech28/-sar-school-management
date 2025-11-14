/**
 * Salary calculation utilities
 */

export interface SalaryComponents {
  basicSalary: number
  allowances: number
  bonuses: number
  deductions: number
}

export interface CalculatedSalary extends SalaryComponents {
  grossSalary: number
  netSalary: number
}

/**
 * Calculate gross and net salary
 * Gross = Basic + Allowances + Bonuses
 * Net = Gross - Deductions
 */
export function calculateSalary(components: SalaryComponents): CalculatedSalary {
  const { basicSalary, allowances, bonuses, deductions } = components

  const grossSalary = basicSalary + allowances + bonuses
  const netSalary = grossSalary - deductions

  return {
    basicSalary,
    allowances,
    bonuses,
    deductions,
    grossSalary,
    netSalary,
  }
}

/**
 * Calculate common deductions (example calculations)
 */
export function calculateDeductions(grossSalary: number): {
  tax: number
  ssnit: number // Social Security
  total: number
} {
  // Ghana tax brackets (simplified example - adjust to actual rates)
  let tax = 0
  if (grossSalary <= 365) {
    tax = 0 // First GHS 365 is tax-free
  } else if (grossSalary <= 475) {
    tax = (grossSalary - 365) * 0.05
  } else if (grossSalary <= 585) {
    tax = 110 * 0.05 + (grossSalary - 475) * 0.10
  } else if (grossSalary <= 3825) {
    tax = 110 * 0.05 + 110 * 0.10 + (grossSalary - 585) * 0.175
  } else {
    tax = 110 * 0.05 + 110 * 0.10 + 3240 * 0.175 + (grossSalary - 3825) * 0.25
  }

  // SSNIT contribution (5.5% of basic salary - simplified)
  const ssnit = grossSalary * 0.055

  return {
    tax: Math.round(tax * 100) / 100,
    ssnit: Math.round(ssnit * 100) / 100,
    total: Math.round((tax + ssnit) * 100) / 100,
  }
}

/**
 * Format month string (YYYY-MM)
 */
export function formatMonth(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

/**
 * Get current month string
 */
export function getCurrentMonth(): string {
  return formatMonth(new Date())
}

/**
 * Parse month string to Date
 */
export function parseMonth(monthString: string): Date {
  const [year, month] = monthString.split("-").map(Number)
  return new Date(year, month - 1, 1)
}
