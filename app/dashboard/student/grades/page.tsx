"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { BookOpen, TrendingUp, Award } from "lucide-react"

export default function StudentGradesPage() {
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

  const subjects: Array<{ name: string; grade: number; trend: string; color: string }> = []

  const overallAverage = subjects.length > 0 ? Math.round(subjects.reduce((sum, s) => sum + s.grade, 0) / subjects.length) : 0

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="student" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Student" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">My Grades</h1>
              <p className="text-muted-foreground mt-1">View your academic performance across all subjects</p>
            </div>

            {subjects.length > 0 ? (
              <>
                {/* Overall Performance */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="p-6 bg-card border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Overall Average</p>
                        <p className="text-4xl font-bold text-accent">{overallAverage}%</p>
                      </div>
                      <Award className="text-accent" size={40} />
                    </div>
                  </Card>

                  <Card className="p-6 bg-card border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Class Rank</p>
                        <p className="text-4xl font-bold text-primary">-</p>
                      </div>
                      <TrendingUp className="text-primary" size={40} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Rank will be calculated</p>
                  </Card>

                  <Card className="p-6 bg-card border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Subjects</p>
                        <p className="text-4xl font-bold text-foreground">{subjects.length}</p>
                      </div>
                      <BookOpen className="text-chart-3" size={40} />
                    </div>
                  </Card>
                </div>

                {/* Subject Grades */}
                <Card className="p-6 bg-card border-border">
                  <h2 className="text-xl font-semibold mb-4 text-foreground">Subject Performance</h2>
                  <div className="space-y-4">
                    {subjects.map((subject, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <BookOpen size={20} className="text-primary" />
                            <span className="font-semibold text-foreground">{subject.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`text-xs font-medium ${
                              subject.trend.startsWith("+") ? "text-accent" : "text-destructive"
                            }`}>
                              {subject.trend}% from last term
                            </span>
                            <span className={`text-2xl font-bold ${subject.color}`}>
                              {subject.grade}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`rounded-full h-2 ${
                              subject.grade >= 85 ? "bg-accent" : 
                              subject.grade >= 70 ? "bg-chart-3" : 
                              "bg-destructive"
                            }`}
                            style={{ width: `${subject.grade}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-12 bg-card border-border text-center">
                <BookOpen className="mx-auto mb-4 text-muted-foreground" size={48} />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Grades Available</h3>
                <p className="text-muted-foreground">Your grades will appear here once your teachers have entered them into the system.</p>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
