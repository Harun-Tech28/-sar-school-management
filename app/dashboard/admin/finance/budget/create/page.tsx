"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CreateBudgetPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    fiscalYear: new Date().getFullYear().toString(),
    startDate: "",
    endDate: "",
    totalAmount: "",
    categories: [
      { name: "Salaries & Wages", amount: "" },
      { name: "Utilities", amount: "" },
      { name: "Supplies & Materials", amount: "" },
      { name: "Maintenance", amount: "" },
      { name: "Transportation", amount: "" },
      { name: "Other Expenses", amount: "" },
    ],
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)

    // Set default dates for current fiscal year
    const currentYear = new Date().getFullYear()
    setFormData(prev => ({
      ...prev,
      startDate: `${currentYear}-01-01`,
      endDate: `${currentYear}-12-31`,
    }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/finance/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Budget created successfully!")
        router.push("/dashboard/admin/finance/budget")
      } else {
        const error = await response.json()
        alert(`Error: ${error.message || "Failed to create budget"}`)
      }
    } catch (error) {
      console.error("Error creating budget:", error)
      alert("Failed to create budget. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (index: number, field: string, value: string) => {
    const newCategories = [...formData.categories]
    newCategories[index] = { ...newCategories[index], [field]: value }
    setFormData({ ...formData, categories: newCategories })
  }

  const calculateTotal = () => {
    return formData.categories.reduce((sum, cat) => {
      return sum + (parseFloat(cat.amount) || 0)
    }, 0)
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="admin" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Admin" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link
                href="/dashboard/admin/finance/budget"
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Create New Budget</h1>
                <p className="text-muted-foreground mt-1">
                  Set up your annual budget plan
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Budget Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 2024 Annual Budget"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Fiscal Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fiscalYear}
                      onChange={(e) => setFormData({ ...formData, fiscalYear: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Budget Categories */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold mb-4">Budget Categories</h2>
                <div className="space-y-4">
                  {formData.categories.map((category, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Category Name
                        </label>
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => handleCategoryChange(index, "name", e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Allocated Amount (GHS)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={category.amount}
                          onChange={(e) => handleCategoryChange(index, "amount", e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Budget:</span>
                    <span className="text-2xl font-bold text-primary">
                      GHS {calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 justify-end">
                <Link
                  href="/dashboard/admin/finance/budget"
                  className="px-6 py-3 border border-border rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={20} />
                  {loading ? "Creating..." : "Create Budget"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
