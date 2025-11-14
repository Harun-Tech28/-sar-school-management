"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import Link from "next/link"
import { ArrowLeft, Download, FileText, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"

export default function FinancialReportsPage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
  }, [])

  const reports = [
    {
      title: "Income Statement",
      description: "Revenue vs Expenses with profit margin analysis",
      icon: "📊",
      color: "blue"
    },
    {
      title: "Cash Flow Statement",
      description: "Track cash inflows and outflows",
      icon: "💵",
      color: "green"
    },
    {
      title: "Balance Sheet",
      description: "Assets, liabilities, and equity overview",
      icon: "⚖️",
      color: "purple"
    },
    {
      title: "Budget vs Actual",
      description: "Compare planned budget with actual spending",
      icon: "📈",
      color: "orange"
    },
    {
      title: "Expense Analysis",
      description: "Detailed breakdown of all expenses",
      icon: "💸",
      color: "red"
    },
    {
      title: "Income Analysis",
      description: "Detailed breakdown of all income sources",
      icon: "💰",
      color: "teal"
    }
  ]

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="admin" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Admin" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard/admin/finance"
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ArrowLeft size={20} />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Financial Reports</h1>
                  <p className="text-muted-foreground mt-1">
                    Generate comprehensive financial reports
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition cursor-pointer"
                >
                  <div className="text-4xl mb-4">{report.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {report.description}
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2 text-sm">
                      <FileText size={16} />
                      View
                    </button>
                    <button className="px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm">
                      <Download size={16} />
                      Export
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
              <div className="flex items-center gap-4 mb-4">
                <TrendingUp size={32} />
                <div>
                  <h3 className="text-2xl font-bold">Financial Analytics</h3>
                  <p className="text-blue-100">
                    Get insights into your financial performance
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm text-blue-100">Current Ratio</p>
                  <p className="text-2xl font-bold">N/A</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm text-blue-100">Profit Margin</p>
                  <p className="text-2xl font-bold">N/A</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm text-blue-100">ROI</p>
                  <p className="text-2xl font-bold">N/A</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
