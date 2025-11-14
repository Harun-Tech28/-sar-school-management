"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, Clock, XCircle, FileText, Calendar } from "lucide-react"

interface Homework {
  id: string
  subject: string
  title: string
  description: string
  dueDate: string
  status: "submitted" | "pending" | "overdue"
  grade?: number
  submittedDate?: string
}

export default function ParentHomeworkPage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [homeworkList] = useState<Homework[]>([
    {
      id: "1",
      subject: "Mathematics",
      title: "Algebra Practice Problems",
      description: "Complete exercises 1-20 from Chapter 5",
      dueDate: "2025-01-20",
      status: "submitted",
      grade: 85,
      submittedDate: "2025-01-18"
    },
    {
      id: "2",
      subject: "English",
      title: "Essay on Climate Change",
      description: "Write a 500-word essay on climate change impacts",
      dueDate: "2025-01-22",
      status: "pending",
    },
    {
      id: "3",
      subject: "Science",
      title: "Lab Report - Photosynthesis",
      description: "Complete lab report based on class experiment",
      dueDate: "2025-01-19",
      status: "overdue",
    },
    {
      id: "4",
      subject: "History",
      title: "Ghana Independence Research",
      description: "Research and present key events of Ghana's independence",
      dueDate: "2025-01-25",
      status: "pending",
    },
    {
      id: "5",
      subject: "Mathematics",
      title: "Geometry Worksheet",
      description: "Complete geometry problems on triangles",
      dueDate: "2025-01-15",
      status: "submitted",
      grade: 92,
      submittedDate: "2025-01-14"
    },
  ])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
  }, [])

  const submittedCount = homeworkList.filter((h) => h.status === "submitted").length
  const pendingCount = homeworkList.filter((h) => h.status === "pending").length
  const overdueCount = homeworkList.filter((h) => h.status === "overdue").length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-accent text-accent-foreground">
            <CheckCircle size={14} />
            Submitted
          </span>
        )
      case "pending":
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-chart-3 text-accent-foreground">
            <Clock size={14} />
            Pending
          </span>
        )
      case "overdue":
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-destructive text-destructive-foreground">
            <XCircle size={14} />
            Overdue
          </span>
        )
    }
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="parent" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Parent" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">Child's Homework</h1>
              <p className="text-muted-foreground mt-1">View your child's homework assignments and submissions</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4 bg-card border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Submitted</p>
                    <p className="text-3xl font-bold text-accent">{submittedCount}</p>
                  </div>
                  <CheckCircle className="text-accent" size={32} />
                </div>
              </Card>

              <Card className="p-4 bg-card border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Pending</p>
                    <p className="text-3xl font-bold text-chart-3">{pendingCount}</p>
                  </div>
                  <Clock className="text-chart-3" size={32} />
                </div>
              </Card>

              <Card className="p-4 bg-card border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Overdue</p>
                    <p className="text-3xl font-bold text-destructive">{overdueCount}</p>
                  </div>
                  <XCircle className="text-destructive" size={32} />
                </div>
              </Card>
            </div>

            {/* Subject Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6 bg-card border-border">
                <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                  <FileText size={24} />
                  Assignments by Subject
                </h2>
                <div className="space-y-4">
                  {["Mathematics", "English", "Science", "History"].map((subject) => {
                    const subjectHomework = homeworkList.filter(h => h.subject === subject)
                    const subjectSubmitted = subjectHomework.filter(h => h.status === "submitted").length
                    const subjectTotal = subjectHomework.length
                    const percentage = subjectTotal > 0 ? Math.round((subjectSubmitted / subjectTotal) * 100) : 0
                    
                    return (
                      <div key={subject} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-foreground">{subject}</span>
                          <span className="text-sm text-muted-foreground">{subjectSubmitted}/{subjectTotal} completed</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div
                            className={`rounded-full h-3 transition-all ${
                              percentage >= 80 ? "bg-accent" : 
                              percentage >= 50 ? "bg-chart-3" : 
                              "bg-destructive"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Activity</h2>
                <div className="space-y-3">
                  {homeworkList.slice(0, 4).map((homework) => (
                    <div key={homework.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="mt-1">
                        {homework.status === "submitted" ? (
                          <CheckCircle size={18} className="text-accent" />
                        ) : homework.status === "overdue" ? (
                          <XCircle size={18} className="text-destructive" />
                        ) : (
                          <Clock size={18} className="text-chart-3" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{homework.title}</p>
                        <p className="text-xs text-muted-foreground">{homework.subject}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Due: {new Date(homework.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      {homework.grade && (
                        <div className={`font-bold text-lg ${
                          homework.grade >= 80 ? "text-accent" : 
                          homework.grade >= 60 ? "text-chart-3" : 
                          "text-destructive"
                        }`}>
                          {homework.grade}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Performance Overview */}
            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Performance Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg bg-accent/10">
                  <p className="text-sm text-muted-foreground mb-2">Average Grade</p>
                  <p className="text-4xl font-bold text-accent">
                    {Math.round(homeworkList.filter(h => h.grade).reduce((sum, h) => sum + (h.grade || 0), 0) / homeworkList.filter(h => h.grade).length)}%
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-chart-3/10">
                  <p className="text-sm text-muted-foreground mb-2">Completion Rate</p>
                  <p className="text-4xl font-bold text-chart-3">
                    {Math.round((submittedCount / homeworkList.length) * 100)}%
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/10">
                  <p className="text-sm text-muted-foreground mb-2">Total Assignments</p>
                  <p className="text-4xl font-bold text-primary">{homeworkList.length}</p>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
