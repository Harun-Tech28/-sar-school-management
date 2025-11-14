"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { useState, useEffect } from "react"

export default function AddExpensePage() {
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
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link
                href="/dashboard/admin/finance/expenses"
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Record Expense</h1>
                <p className="text-muted-foreground mt-1">
                  Add a new expense transaction
                </p>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select className="w-full px-4 py-2 border border-border rounded-lg">
                      <option>Salaries</option>
                      <option>Utilities</option>
                      <option>Maintenance</option>
                      <option>Supplies</option>
                      <option>Transport</option>
                      <option>Food</option>
                      <option>Events</option>
                      <option>Equipment</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Amount (GHS)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full px-4 py-2 border border-border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Payment Method</label>
                    <select className="w-full px-4 py-2 border border-border rounded-lg">
                      <option>Cash</option>
                      <option>Bank Transfer</option>
                      <option>Mobile Money</option>
                      <option>Cheque</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Vendor/Payee</label>
                    <input
                      type="text"
                      placeholder="e.g., Supplier Name, Employee Name"
                      className="w-full px-4 py-2 border border-border rounded-lg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Purpose</label>
                    <input
                      type="text"
                      placeholder="Brief description of expense"
                      className="w-full px-4 py-2 border border-border rounded-lg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Additional details..."
                      className="w-full px-4 py-2 border border-border rounded-lg"
                    ></textarea>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Link
                    href="/dashboard/admin/finance/expenses"
                    className="px-6 py-2 border border-border rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                  >
                    <Save size={18} />
                    Save Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
