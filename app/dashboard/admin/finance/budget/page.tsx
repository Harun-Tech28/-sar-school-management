"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import Link from "next/link"
import { ArrowLeft, Plus, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"

export default function BudgetPage() {
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
                  <h1 className="text-3xl font-bold text-foreground">Budget Management</h1>
                  <p className="text-muted-foreground mt-1">
                    Plan and track your annual budget
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/admin/finance/budget/create"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
              >
                <Plus size={18} />
                Create Budget
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Total Allocated</h3>
                  <TrendingUp className="text-blue-600" size={20} />
                </div>
                <p className="text-3xl font-bold">GHS 0.00</p>
                <p className="text-sm text-muted-foreground mt-2">Across all categories</p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Total Spent</h3>
                  <TrendingUp className="text-red-600" size={20} />
                </div>
                <p className="text-3xl font-bold">GHS 0.00</p>
                <p className="text-sm text-muted-foreground mt-2">Year to date</p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Remaining</h3>
                  <TrendingUp className="text-green-600" size={20} />
                </div>
                <p className="text-3xl font-bold">GHS 0.00</p>
                <p className="text-sm text-muted-foreground mt-2">Available budget</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Budget Planning & Tracking</h3>
              <p className="text-muted-foreground mb-6">
                Create annual budgets, track spending, and get alerts when approaching limits
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/dashboard/admin/finance/budget/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                >
                  <Plus size={20} />
                  Create New Budget
                </Link>
                <Link
                  href="/dashboard/admin/finance"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-gray-50 transition"
                >
                  Back to Finance
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
