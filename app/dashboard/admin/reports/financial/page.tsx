"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard, Loader2 } from "lucide-react"
import Link from "next/link"

interface FinancialData {
  totalIncome: number
  totalExpenses: number
  netBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  recentPayments: any[]
}

export default function FinancialReportPage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [financialData, setFinancialData] = useState<FinancialData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
    
    // Fetch financial data
    fetchFinancialData()
  }, [])

  const fetchFinancialData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch income, expenses, and analytics
      const [incomeRes, expensesRes, analyticsRes] = await Promise.all([
        fetch('/api/finance/income'),
        fetch('/api/finance/expenses'),
        fetch('/api/dashboard/analytics')
      ])

      const incomeData = await incomeRes.json()
      const expensesData = await expensesRes.json()
      const analyticsData = await analyticsRes.json()

      // Calculate totals
      const totalIncome = incomeData.success && incomeData.data 
        ? incomeData.data.reduce((sum: number, item: any) => sum + (item.amount || 0), 0)
        : 0

      const totalExpenses = expensesData.success && expensesData.data
        ? expensesData.data.reduce((sum: number, item: any) => sum + (item.amount || 0), 0)
        : 0

      const monthlyIncome = analyticsData.success 
        ? analyticsData.data.financialNet || 0
        : 0

      setFinancialData({
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
        monthlyIncome,
        monthlyExpenses: 0, // Can be calculated from monthly expenses
        recentPayments: incomeData.data?.slice(0, 5) || []
      })
    } catch (error) {
      console.error('Error fetching financial data:', error)
      setFinancialData({
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        recentPayments: []
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount)
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="admin" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Admin" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <Link
                href="/dashboard/admin/reports"
                className="text-primary hover:text-primary/80 text-sm mb-2 inline-block"
              >
                ← Back to Reports
              </Link>
              <h1 className="text-3xl font-bold text-foreground">Financial Reports</h1>
              <p className="text-muted-foreground mt-1">
                Income, expenditure, and financial analysis
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            )}

            {/* Financial Data */}
            {!isLoading && financialData && (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-green-700">Total Income</p>
                      <TrendingUp className="text-green-600" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-green-900">
                      {formatCurrency(financialData.totalIncome)}
                    </p>
                    <p className="text-xs text-green-600 mt-2">All time</p>
                  </Card>

                  <Card className="p-6 bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-red-700">Total Expenses</p>
                      <TrendingDown className="text-red-600" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-red-900">
                      {formatCurrency(financialData.totalExpenses)}
                    </p>
                    <p className="text-xs text-red-600 mt-2">All time</p>
                  </Card>

                  <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-blue-700">Net Balance</p>
                      <Wallet className="text-blue-600" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-blue-900">
                      {formatCurrency(financialData.netBalance)}
                    </p>
                    <p className="text-xs text-blue-600 mt-2">
                      {financialData.netBalance >= 0 ? 'Surplus' : 'Deficit'}
                    </p>
                  </Card>

                  <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-purple-700">This Month</p>
                      <CreditCard className="text-purple-600" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-purple-900">
                      {formatCurrency(financialData.monthlyIncome)}
                    </p>
                    <p className="text-xs text-purple-600 mt-2">Fee payments</p>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Link href="/dashboard/admin/finance/income">
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="text-green-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">View Income</h3>
                          <p className="text-sm text-muted-foreground">All income records</p>
                        </div>
                      </div>
                    </Card>
                  </Link>

                  <Link href="/dashboard/admin/finance/expenses">
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <TrendingDown className="text-red-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">View Expenses</h3>
                          <p className="text-sm text-muted-foreground">All expense records</p>
                        </div>
                      </div>
                    </Card>
                  </Link>

                  <Link href="/dashboard/admin/fee-management">
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">Manage Fees</h3>
                          <p className="text-sm text-muted-foreground">Fee structure & payments</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>

                {/* Recent Payments */}
                {financialData.recentPayments.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Recent Transactions</h2>
                    <div className="space-y-3">
                      {financialData.recentPayments.map((payment: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium text-foreground">{payment.description || 'Income'}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(payment.date || payment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-lg font-semibold text-green-600">
                            +{formatCurrency(payment.amount)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Empty State for No Data */}
                {financialData.totalIncome === 0 && financialData.totalExpenses === 0 && (
                  <Card className="p-12 bg-card border-border mt-6">
                    <div className="text-center max-w-md mx-auto">
                      <div className="flex justify-center mb-4">
                        <DollarSign className="text-muted-foreground" size={64} />
                      </div>
                      <h2 className="text-2xl font-semibold text-foreground mb-2">
                        No Financial Records Yet
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        Financial reports will be available once income and expense records are added to the system.
                      </p>
                      <Link href="/dashboard/admin/finance/income/add">
                        <Button className="gap-2">
                          <DollarSign size={18} />
                          Add Income Record
                        </Button>
                      </Link>
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
