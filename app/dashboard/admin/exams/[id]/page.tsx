"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, FileText, Users, Edit, Trash2, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Exam {
  id: string
  name: string
  examType: string
  term: string
  academicYear: string
  startDate: string
  endDate: string
  subjects: string[]
  classes: string[]
  status: string
  gradeProgress?: {
    entered: number
    expected: number
    percentage: number
  }
}

export default function ExamDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [exam, setExam] = useState<Exam | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
    fetchExam()
  }, [])

  const fetchExam = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/exams/${params.id}`)
      const data = await response.json()

      if (data.success) {
        setExam(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch exam:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteExam = async () => {
    if (!confirm("Are you sure you want to delete this exam? This action cannot be undone."))
      return

    try {
      const response = await fetch(`/api/exams/${params.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/dashboard/admin/exams")
      }
    } catch (error) {
      console.error("Failed to delete exam:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      SCHEDULED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      ONGOING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    }
    return styles[status as keyof typeof styles] || styles.SCHEDULED
  }

  if (loading) {
    return (
      <div className="flex bg-background min-h-screen">
        <Sidebar userRole="admin" />
        <div className="flex-1 flex flex-col">
          <Header userName={userName} userRole="Admin" userId={userId} />
          <main className="flex-1 p-6 overflow-auto">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading exam details...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!exam) {
    return (
      <div className="flex bg-background min-h-screen">
        <Sidebar userRole="admin" />
        <div className="flex-1 flex flex-col">
          <Header userName={userName} userRole="Admin" userId={userId} />
          <main className="flex-1 p-6 overflow-auto">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Exam not found</p>
              <Link href="/dashboard/admin/exams">
                <Button className="mt-4">Back to Exams</Button>
              </Link>
            </div>
          </main>
        </div>
      </div>
    )
  }

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
                href="/dashboard/admin/exams"
                className="text-primary hover:text-primary/80 text-sm mb-2 inline-flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Exams
              </Link>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{exam.name}</h1>
                  <p className="text-muted-foreground mt-1">
                    {exam.examType} • {exam.term} • {exam.academicYear}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit size={16} />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deleteExam}
                    className="text-red-600 hover:text-red-700 gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              </div>
            </div>

            {/* Status and Progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="p-6 bg-card border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(
                        exam.status
                      )}`}
                    >
                      {exam.status}
                    </span>
                  </div>
                  <Calendar size={32} className="text-primary opacity-50" />
                </div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Grade Entry Progress</p>
                    <p className="text-2xl font-bold text-foreground">
                      {exam.gradeProgress?.percentage || 0}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {exam.gradeProgress?.entered || 0} of {exam.gradeProgress?.expected || 0}{" "}
                      grades
                    </p>
                  </div>
                  <FileText size={32} className="text-primary opacity-50" />
                </div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Classes & Subjects</p>
                    <p className="text-2xl font-bold text-foreground">
                      {exam.classes.length} / {exam.subjects.length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Classes / Subjects
                    </p>
                  </div>
                  <Users size={32} className="text-primary opacity-50" />
                </div>
              </Card>
            </div>

            {/* Exam Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6 bg-card border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Exam Period</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="text-foreground font-medium">
                      {new Date(exam.startDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="text-foreground font-medium">
                      {new Date(exam.endDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="text-foreground font-medium">
                      {Math.ceil(
                        (new Date(exam.endDate).getTime() -
                          new Date(exam.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link href={`/dashboard/teacher/grades?examId=${exam.id}`}>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <FileText size={18} />
                      Enter Grades
                    </Button>
                  </Link>
                  <Link href={`/dashboard/admin/report-cards?examId=${exam.id}`}>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <FileText size={18} />
                      Generate Report Cards
                    </Button>
                  </Link>
                  <Link href={`/dashboard/admin/reports/exam-results?examId=${exam.id}`}>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <BarChart3 size={18} />
                      View Results Report
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>

            {/* Subjects */}
            <Card className="p-6 bg-card border-border mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Subjects ({exam.subjects.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {exam.subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-muted rounded-md text-foreground text-sm"
                  >
                    {subject}
                  </div>
                ))}
              </div>
            </Card>

            {/* Classes */}
            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Classes ({exam.classes.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {exam.classes.map((classId, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-muted rounded-md text-foreground text-sm"
                  >
                    Class {classId}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
