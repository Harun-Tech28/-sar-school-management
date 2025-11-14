"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import Link from "next/link"
import { Plus, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"

export default function ExpensesPage() {
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
                  <h1 className="text-3xl font-bold text-foreground">Expense Records</h1>
                  <p className="text-muted-foreground mt-1">
                    View and manage all expense transactions
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/admin/finance/expenses/add"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                <Plus size={18} />
                Record Expense
              </Link>
            </div>

            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <div className="text-6xl mb-4">💸</div>
              <h3 className="text-xl font-semibold mb-2">Expense Management</h3>
              <p className="text-muted-foreground mb-6">
                Track all expenses including salaries, utilities, and supplies
              </p>
              <Link
                href="/dashboard/admin/finance/expenses/add"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <Plus size={20} />
                Record New Expense
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
