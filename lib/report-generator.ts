/**
 * Financial report generation utilities
 */

export interface IncomeStatementData {
  period: string
  revenue: {
    studentFees: number
    donations: number
    grants: number
    other: number
    total: number
  }
  expenses: {
    salaries: number
    utilities: number
    maintenance: number
    supplies: number
    transport: number
    food: number
    events: number
    equipment: number
    other: number
    total: number
  }
  netIncome: number
  profitMargin: number
}

export interface CashFlowData {
  period: string
  operatingActivities: {
    cashFromOperations: number
    cashPaidToSuppliers: number
    cashPaidToEmployees: number
    netOperatingCash: number
  }
  investingActivities: {
    equipmentPurchases: number
    assetSales: number
    netInvestingCash: number
  }
  financingActivities: {
    loansReceived: number
    loansRepaid: number
    netFinancingCash: number
  }
  netCashFlow: number
  openingBalance: number
  closingBalance: number
}

export interface BalanceSheetData {
  asOfDate: string
  assets: {
    cash: number
    bankAccounts: number
    accountsReceivable: number
    equipment: number
    buildings: number
    other: number
    totalAssets: number
  }
  liabilities: {
    accountsPayable: number
    loansPayable: number
    salariesPayable: number
    other: number
    totalLiabilities: number
  }
  equity: {
    retainedEarnings: number
    currentYearIncome: number
    totalEquity: number
  }
}

/**
 * Generate income statement from financial data
 */
export function generateIncomeStatement(
  income: any[],
  expenses: any[],
  period: string
): IncomeStatementData {
  // Calculate revenue by category
  const revenue = {
    studentFees: income.filter(i => i.category === 'STUDENT_FEES').reduce((sum, i) => sum + i.amount, 0),
    donations: income.filter(i => i.category === 'DONATIONS').reduce((sum, i) => sum + i.amount, 0),
    grants: income.filter(i => i.category === 'GRANTS').reduce((sum, i) => sum + i.amount, 0),
    other: income.filter(i => !['STUDENT_FEES', 'DONATIONS', 'GRANTS'].includes(i.category)).reduce((sum, i) => sum + i.amount, 0),
    total: 0,
  }
  revenue.total = revenue.studentFees + revenue.donations + revenue.grants + revenue.other

  // Calculate expenses by category
  const expenseData = {
    salaries: expenses.filter(e => e.category === 'SALARIES').reduce((sum, e) => sum + e.amount, 0),
    utilities: expenses.filter(e => e.category === 'UTILITIES').reduce((sum, e) => sum + e.amount, 0),
    maintenance: expenses.filter(e => e.category === 'MAINTENANCE').reduce((sum, e) => sum + e.amount, 0),
    supplies: expenses.filter(e => e.category === 'SUPPLIES').reduce((sum, e) => sum + e.amount, 0),
    transport: expenses.filter(e => e.category === 'TRANSPORT').reduce((sum, e) => sum + e.amount, 0),
    food: expenses.filter(e => e.category === 'FOOD').reduce((sum, e) => sum + e.amount, 0),
    events: expenses.filter(e => e.category === 'EVENTS').reduce((sum, e) => sum + e.amount, 0),
    equipment: expenses.filter(e => e.category === 'EQUIPMENT').reduce((sum, e) => sum + e.amount, 0),
    other: expenses.filter(e => e.category === 'OTHER').reduce((sum, e) => sum + e.amount, 0),
    total: 0,
  }
  expenseData.total = Object.values(expenseData).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0) - expenseData.total

  const netIncome = revenue.total - expenseData.total
  const profitMargin = revenue.total > 0 ? (netIncome / revenue.total) * 100 : 0

  return {
    period,
    revenue,
    expenses: expenseData,
    netIncome,
    profitMargin: Math.round(profitMargin * 100) / 100,
  }
}

/**
 * Generate cash flow statement
 */
export function generateCashFlowStatement(
  income: any[],
  expenses: any[],
  period: string,
  openingBalance: number
): CashFlowData {
  const cashFromOperations = income.reduce((sum, i) => sum + i.amount, 0)
  const cashPaidToSuppliers = expenses.filter(e => !['SALARIES'].includes(e.category)).reduce((sum, e) => sum + e.amount, 0)
  const cashPaidToEmployees = expenses.filter(e => e.category === 'SALARIES').reduce((sum, e) => sum + e.amount, 0)
  const netOperatingCash = cashFromOperations - cashPaidToSuppliers - cashPaidToEmployees

  const equipmentPurchases = expenses.filter(e => e.category === 'EQUIPMENT').reduce((sum, e) => sum + e.amount, 0)
  const assetSales = income.filter(i => i.category === 'ASSET_SALES').reduce((sum, i) => sum + i.amount, 0)
  const netInvestingCash = assetSales - equipmentPurchases

  const loansReceived = income.filter(i => i.category === 'LOANS').reduce((sum, i) => sum + i.amount, 0)
  const loansRepaid = expenses.filter(e => e.category === 'LOAN_REPAYMENT').reduce((sum, e) => sum + e.amount, 0)
  const netFinancingCash = loansReceived - loansRepaid

  const netCashFlow = netOperatingCash + netInvestingCash + netFinancingCash
  const closingBalance = openingBalance + netCashFlow

  return {
    period,
    operatingActivities: {
      cashFromOperations,
      cashPaidToSuppliers,
      cashPaidToEmployees,
      netOperatingCash,
    },
    investingActivities: {
      equipmentPurchases,
      assetSales,
      netInvestingCash,
    },
    financingActivities: {
      loansReceived,
      loansRepaid,
      netFinancingCash,
    },
    netCashFlow,
    openingBalance,
    closingBalance,
  }
}

/**
 * Generate balance sheet
 */
export function generateBalanceSheet(
  cashBalance: number,
  bankBalance: number,
  receivables: number,
  assets: any[],
  liabilities: any[],
  retainedEarnings: number,
  currentYearIncome: number,
  asOfDate: string
): BalanceSheetData {
  const assetData = {
    cash: cashBalance,
    bankAccounts: bankBalance,
    accountsReceivable: receivables,
    equipment: assets.filter(a => a.type === 'EQUIPMENT').reduce((sum, a) => sum + a.currentValue, 0),
    buildings: assets.filter(a => a.type === 'BUILDING').reduce((sum, a) => sum + a.currentValue, 0),
    other: assets.filter(a => !['EQUIPMENT', 'BUILDING'].includes(a.type)).reduce((sum, a) => sum + a.currentValue, 0),
    totalAssets: 0,
  }
  assetData.totalAssets = Object.values(assetData).reduce((sum, val) => sum + val, 0) - assetData.totalAssets

  const liabilityData = {
    accountsPayable: liabilities.filter(l => l.type === 'ACCOUNTS_PAYABLE').reduce((sum, l) => sum + l.amount, 0),
    loansPayable: liabilities.filter(l => l.type === 'LOAN').reduce((sum, l) => sum + l.amount, 0),
    salariesPayable: liabilities.filter(l => l.type === 'SALARY_PAYABLE').reduce((sum, l) => sum + l.amount, 0),
    other: liabilities.filter(l => !['ACCOUNTS_PAYABLE', 'LOAN', 'SALARY_PAYABLE'].includes(l.type)).reduce((sum, l) => sum + l.amount, 0),
    totalLiabilities: 0,
  }
  liabilityData.totalLiabilities = Object.values(liabilityData).reduce((sum, val) => sum + val, 0) - liabilityData.totalLiabilities

  const equity = {
    retainedEarnings,
    currentYearIncome,
    totalEquity: retainedEarnings + currentYearIncome,
  }

  return {
    asOfDate,
    assets: assetData,
    liabilities: liabilityData,
    equity,
  }
}

/**
 * Format currency for reports
 */
export function formatReportCurrency(amount: number): string {
  return `GHS ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

/**
 * Calculate financial ratios
 */
export function calculateFinancialRatios(incomeStatement: IncomeStatementData, balanceSheet: BalanceSheetData) {
  const currentRatio = balanceSheet.liabilities.totalLiabilities > 0 
    ? balanceSheet.assets.totalAssets / balanceSheet.liabilities.totalLiabilities 
    : 0

  const debtToEquityRatio = balanceSheet.equity.totalEquity > 0
    ? balanceSheet.liabilities.totalLiabilities / balanceSheet.equity.totalEquity
    : 0

  const returnOnAssets = balanceSheet.assets.totalAssets > 0
    ? (incomeStatement.netIncome / balanceSheet.assets.totalAssets) * 100
    : 0

  const returnOnEquity = balanceSheet.equity.totalEquity > 0
    ? (incomeStatement.netIncome / balanceSheet.equity.totalEquity) * 100
    : 0

  return {
    currentRatio: Math.round(currentRatio * 100) / 100,
    debtToEquityRatio: Math.round(debtToEquityRatio * 100) / 100,
    returnOnAssets: Math.round(returnOnAssets * 100) / 100,
    returnOnEquity: Math.round(returnOnEquity * 100) / 100,
    profitMargin: incomeStatement.profitMargin,
  }
}
