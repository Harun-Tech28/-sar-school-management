"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import Link from "next/link"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart,
  Plus,
  Download,
  Filter
} from "lucide-react"

interface FinancialSummary {
  income: {
    total: number
    verified: number
    unverified: number
    count: number
    byCategory: Array<{ category: string; amount: number; count: number }>
  }
  expenses: {
    total: number
    approved: number
    pending: number
    count: number
    byCategory: Array<{ category: string; amount: number; count: number }>
  }
  netBalance: number
  profitMargin: string
}

export default function FinanceDashboard() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [academicYear, setAcademicYear] = useState("2025")

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
    fetchSummary()
  }, [academicYear])

  const fetchSummary = async () => {
    try {
      const response = await fetch(`/api/finance/summary?academicYear=${academicYear}`)
      const data = await response.json()
      if (data.success) {
        setSummary(data.data)
      }
    } catch (error) {
      console.error("Error fetching financial summary:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `GHS ${amount.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="flex flex-col md:flex-row bg-background min-h-screen">
      <Sidebar userRole="admin" />
      <div className="flex-1 flex flex-col w-full">
        <Header userName={userName} userRole="Admin" userId={userId} />

        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Page Header - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Financial Management</h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  Track all income and expenses
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Link
                  href="/dashboard/admin/finance/income/add"
                  className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm sm:text-base shadow-md hover:shadow-lg"
                >
                  <Plus size={18} />
                  <span className="font-medium">Record Income</span>
                </Link>
                <Link
                  href="/dashboard/admin/finance/expenses/add"
                  className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 text-sm sm:text-base shadow-md hover:shadow-lg"
                >
                  <Plus size={18} />
                  <span className="font-medium">Record Expense</span>
                </Link>
              </div>
            </div>

            {/* Summary Cards */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading financial data...</p>
              </div>
            ) : summary ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  {/* Total Income - Enhanced Mobile */}
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="bg-white/20 p-2.5 sm:p-3 rounded-lg backdrop-blur-sm">
                        <TrendingUp size={20} className="sm:w-6 sm:h-6" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium bg-white/20 px-2.5 sm:px-3 py-1 rounded-full">
                        Income
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                      {formatCurrency(summary.income.total)}
                    </h3>
                    <p className="text-green-100 text-xs sm:text-sm">
                      {summary.income.count} transactions
                    </p>
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Verified:</span>
                        <span className="font-semibold">{formatCurrency(summary.income.verified)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Total Expenses - Enhanced Mobile */}
                  <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-5 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="bg-white/20 p-2.5 sm:p-3 rounded-lg backdrop-blur-sm">
                        <TrendingDown size={20} className="sm:w-6 sm:h-6" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium bg-white/20 px-2.5 sm:px-3 py-1 rounded-full">
                        Expenses
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                      {formatCurrency(summary.expenses.total)}
                    </h3>
                    <p className="text-red-100 text-xs sm:text-sm">
                      {summary.expenses.count} transactions
                    </p>
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Approved:</span>
                        <span className="font-semibold">{formatCurrency(summary.expenses.approved)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Net Balance - Enhanced Mobile */}
                  <div className={`bg-gradient-to-br ${
                    summary.netBalance >= 0 
                      ? 'from-blue-500 to-blue-600' 
                      : 'from-orange-500 to-orange-600'
                  } rounded-xl p-5 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1`}>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="bg-white/20 p-2.5 sm:p-3 rounded-lg backdrop-blur-sm">
                        <DollarSign size={20} className="sm:w-6 sm:h-6" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium bg-white/20 px-2.5 sm:px-3 py-1 rounded-full">
                        Net Balance
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                      {formatCurrency(summary.netBalance)}
                    </h3>
                    <p className="text-blue-100 text-xs sm:text-sm">
                      Profit Margin: {summary.profitMargin}%
                    </p>
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20">
                      <div className="text-xs sm:text-sm font-medium">
                        {summary.netBalance >= 0 ? '✓ Surplus' : '⚠ Deficit'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Income & Expense Breakdown - Responsive */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  {/* Income by Category - Mobile Optimized */}
                  <div className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                      <PieChart size={18} className="text-green-600 sm:w-5 sm:h-5" />
                      <span>Income by Category</span>
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {summary.income.byCategory.map((cat, index) => (
                        <div key={index} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-medium text-foreground truncate max-w-[60%]">{cat.category}</span>
                            <span className="text-xs sm:text-sm font-semibold text-green-600 whitespace-nowrap">
                              {formatCurrency(cat.amount)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500 ease-out"
                              style={{ 
                                width: `${(cat.amount / summary.income.total) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {((cat.amount / summary.income.total) * 100).toFixed(1)}% of total
                          </p>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/dashboard/admin/finance/income"
                      className="mt-4 sm:mt-5 block text-center text-xs sm:text-sm text-primary hover:underline font-medium py-2 hover:bg-primary/5 rounded-lg transition"
                    >
                      View All Income →
                    </Link>
                  </div>

                  {/* Expenses by Category - Mobile Optimized */}
                  <div className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                      <PieChart size={18} className="text-red-600 sm:w-5 sm:h-5" />
                      <span>Expenses by Category</span>
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {summary.expenses.byCategory.map((cat, index) => (
                        <div key={index} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-medium text-foreground truncate max-w-[60%]">{cat.category}</span>
                            <span className="text-xs sm:text-sm font-semibold text-red-600 whitespace-nowrap">
                              {formatCurrency(cat.amount)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500 ease-out"
                              style={{ 
                                width: `${(cat.amount / summary.expenses.total) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {((cat.amount / summary.expenses.total) * 100).toFixed(1)}% of total
                          </p>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/dashboard/admin/finance/expenses"
                      className="mt-4 sm:mt-5 block text-center text-xs sm:text-sm text-primary hover:underline font-medium py-2 hover:bg-primary/5 rounded-lg transition"
                    >
                      View All Expenses →
                    </Link>
                  </div>
                </div>

                {/* Quick Actions - Mobile Responsive */}
                <div className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-sm">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <Link
                      href="/dashboard/admin/finance/income"
                      className="p-3 sm:p-4 border-2 border-border rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-center group"
                    >
                      <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">💰</div>
                      <div className="text-xs sm:text-sm font-medium text-foreground">View Income</div>
                    </Link>
                    <Link
                      href="/dashboard/admin/finance/expenses"
                      className="p-3 sm:p-4 border-2 border-border rounded-xl hover:border-red-500 hover:bg-red-50 transition-all text-center group"
                    >
                      <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">💸</div>
                      <div className="text-xs sm:text-sm font-medium text-foreground">View Expenses</div>
                    </Link>
                    <Link
                      href="/dashboard/admin/finance/budget"
                      className="p-3 sm:p-4 border-2 border-border rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center group"
                    >
                      <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">📊</div>
                      <div className="text-xs sm:text-sm font-medium text-foreground">Budget Planning</div>
                    </Link>
                    <Link
                      href="/dashboard/admin/finance/reports"
                      className="p-3 sm:p-4 border-2 border-border rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-center group"
                    >
                      <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">📈</div>
                      <div className="text-xs sm:text-sm font-medium text-foreground">Financial Reports</div>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No financial data available</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
