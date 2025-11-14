"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText } from "lucide-react"
import Link from "next/link"

export default function TeacherPerformancePage() {
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
              <Link
                href="/dashboard/admin/reports"
                className="text-primary hover:text-primary/80 text-sm mb-2 inline-block"
              >
                ← Back to Reports
              </Link>
              <h1 className="text-3xl font-bold text-foreground">Teacher Performance</h1>
              <p className="text-muted-foreground mt-1">
                Review teacher effectiveness and class management
              </p>
            </div>

            {/* Empty State */}
            <Card className="p-12 bg-card border-border">
              <div className="text-center max-w-md mx-auto">
                <div className="flex justify-center mb-4">
                  <Users className="text-muted-foreground" size={64} />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  No Performance Data Yet
                </h2>
                <p className="text-muted-foreground mb-6">
                  Teacher performance metrics will be available once classes are conducted and student results are recorded.
                </p>
                <Link href="/dashboard/admin/teachers">
                  <Button className="gap-2">
                    <Users size={18} />
                    View Teachers
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
