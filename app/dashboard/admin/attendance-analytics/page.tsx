"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Calendar, FileText } from "lucide-react"
import Link from "next/link"

export default function AttendanceAnalyticsPage() {
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
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">Attendance Analytics</h1>
              <p className="text-muted-foreground mt-1">View attendance statistics and trends</p>
            </div>

            {/* Empty State */}
            <Card className="p-12 bg-card border-border">
              <div className="text-center max-w-md mx-auto">
                <div className="flex justify-center mb-4">
                  <Calendar className="text-muted-foreground" size={64} />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  No Attendance Data Yet
                </h2>
                <p className="text-muted-foreground mb-6">
                  Start marking attendance to see analytics, trends, and insights about student attendance patterns.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/dashboard/admin/attendance">
                    <Button className="gap-2">
                      <FileText size={18} />
                      Mark Attendance
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="p-6 bg-card border-border">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Daily Tracking</h3>
                    <p className="text-sm text-muted-foreground">
                      Mark attendance for each class every day to build comprehensive records
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <FileText className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Analytics & Reports</h3>
                    <p className="text-sm text-muted-foreground">
                      View trends, patterns, and generate reports once attendance data is available
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <AlertTriangle className="text-destructive" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Early Warnings</h3>
                    <p className="text-sm text-muted-foreground">
                      Identify students at risk with low attendance rates automatically
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
