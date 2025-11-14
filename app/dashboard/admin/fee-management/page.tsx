"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, DollarSign, Download, Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { toast } from "sonner"
import { ExportButton } from "@/components/ui/export-button"
import { exportToExcel, exportToCSV } from "@/lib/export-utils"

interface FeePayment {
  id: string
  amount: number
  paymentMethod: string
  term: string
  academicYear: string
  receiptNumber: string
  paymentDate: string
  student: {
    rollNumber: string
    user: {
      fullName: string
    }
    class: {
      name: string
    } | null
  }
}

export default function FeeManagementPage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [payments, setPayments] = useState<FeePayment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [stats, setStats] = useState({
    totalCollected: 0,
    totalStudents: 0,
    pendingPayments: 0,
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/fees")
      const data = await response.json()

      if (data.success) {
        setPayments(data.data || [])
        calculateStats(data.data || [])
      } else {
        toast.error("Failed to load payments")
      }
    } catch (error) {
      console.error("Error fetching payments:", error)
      toast.error("Failed to load payments")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (paymentsData: FeePayment[]) => {
    const total = paymentsData.reduce((sum, p) => sum + p.amount, 0)
    const uniqueStudents = new Set(paymentsData.map((p) => p.student.rollNumber)).size

    setStats({
      totalCollected: total,
      totalStudents: uniqueStudents,
      pendingPayments: 0, // Would need additional logic
    })
  }

  const filteredPayments = payments.filter(
    (payment) =>
      payment.student.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="admin" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Admin" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Fee Management</h1>
                <p className="text-muted-foreground mt-1">Track student fee payments and balances</p>
              </div>
              <div className="flex gap-3">
                {payments.length > 0 && (
                  <ExportButton
                    data={payments}
                    filename="Fee_Payments"
                    onExportExcel={() => {
                      const data = payments.map((p, i) => ({
                        '#': i + 1,
                        'Receipt No': p.receiptNumber,
                        'Student Name': p.student.user.fullName,
                        'Roll Number': p.student.rollNumber,
                        'Class': p.student.class?.name || 'N/A',
                        'Amount (GH₵)': p.amount,
                        'Payment Method': p.paymentMethod,
                        'Term': p.term,
                        'Academic Year': p.academicYear,
                        'Payment Date': new Date(p.paymentDate).toLocaleDateString(),
                      }))
                      exportToExcel(data, 'Fee_Payments', 'Payments')
                    }}
                    onExportCSV={() => {
                      const data = payments.map((p) => ({
                        'Receipt': p.receiptNumber,
                        'Student': p.student.user.fullName,
                        'Amount': `GH₵ ${p.amount}`,
                        'Method': p.paymentMethod,
                        'Date': new Date(p.paymentDate).toLocaleDateString(),
                      }))
                      exportToCSV(data, 'Fee_Payments')
                    }}
                    onPrint={() => window.print()}
                  />
                )}
                <Link href="/dashboard/admin/fee-management/record-payment">
                  <Button className="gap-2">
                    <Plus size={18} />
                    Record Payment
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-6 bg-card border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Collected</p>
                    <p className="text-3xl font-bold text-accent">
                      GH₵ {stats.totalCollected.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="text-accent" size={32} />
                </div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Students Paid</p>
                    <p className="text-3xl font-bold text-foreground">{stats.totalStudents}</p>
                  </div>
                  <DollarSign className="text-primary" size={32} />
                </div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Payments</p>
                    <p className="text-3xl font-bold text-foreground">{payments.length}</p>
                  </div>
                  <DollarSign className="text-chart-3" size={32} />
                </div>
              </Card>
            </div>

            {/* Search Bar */}
            <div className="bg-card rounded-lg border border-border p-4 mb-6">
              <div className="flex items-center gap-2">
                <Search size={20} className="text-muted-foreground" />
                <Input
                  placeholder="Search by student name, roll number, or receipt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            )}

            {/* Payments Table */}
            {!isLoading && (
              <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Receipt No</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead>Payment Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.receiptNumber}</TableCell>
                        <TableCell>{payment.student.user.fullName}</TableCell>
                        <TableCell>{payment.student.class?.name || "N/A"}</TableCell>
                        <TableCell className="font-semibold text-accent">
                          GH₵ {payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                            {payment.paymentMethod}
                          </span>
                        </TableCell>
                        <TableCell>{payment.term}</TableCell>
                        <TableCell>
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredPayments.length === 0 && !searchQuery && (
              <div className="text-center py-12">
                <DollarSign className="mx-auto text-muted-foreground mb-4" size={64} />
                <p className="text-muted-foreground mb-4">No fee payments recorded yet</p>
                <Link href="/dashboard/admin/fee-management/record-payment">
                  <Button>
                    <Plus size={18} className="mr-2" />
                    Record First Payment
                  </Button>
                </Link>
              </div>
            )}

            {/* No Search Results */}
            {!isLoading && filteredPayments.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No payments found matching "{searchQuery}"
                </p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
