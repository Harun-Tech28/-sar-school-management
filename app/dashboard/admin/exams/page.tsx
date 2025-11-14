"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, FileText, Trash2, Edit, Eye } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EmptyState } from "@/components/ui/empty-state"

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
  createdAt: string
}

export default function ExamsPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    term: "",
    academicYear: "2025",
    status: "",
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
    fetchExams()
  }, [filter])

  const fetchExams = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter.term) params.append("term", filter.term)
      if (filter.academicYear) params.append("academicYear", filter.academicYear)
      if (filter.status) params.append("status", filter.status)

      const response = await fetch(`/api/exams?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setExams(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch exams:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteExam = async (id: string) => {
    if (!confirm("Are you sure you want to delete this exam?")) return

    try {
      const response = await fetch(`/api/exams/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchExams()
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
                <h1 className="text-3xl font-bold text-foreground">Exam Management</h1>
                <p className="text-muted-foreground mt-1">
                  Create and manage exams for different classes
                </p>
              </div>
              <Link href="/dashboard/admin/exams/create">
                <Button className="gap-2">
                  <Plus size={18} />
                  Create Exam
                </Button>
              </Link>
            </div>

            {/* Filters */}
            <Card className="p-4 mb-6 bg-card border-border">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Term
                  </label>
                  <select
                    value={filter.term}
                    onChange={(e) => setFilter({ ...filter, term: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="">All Terms</option>
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Academic Year
                  </label>
                  <select
                    value={filter.academicYear}
                    onChange={(e) =>
                      setFilter({ ...filter, academicYear: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Status
                  </label>
                  <select
                    value={filter.status}
                    onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="">All Status</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilter({ term: "", academicYear: "2025", status: "" })
                    }
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </Card>

            {/* Exams List */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading exams...</p>
              </div>
            ) : exams.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No Exams Found"
                description="Create your first exam to get started with exam management."
                action={{
                  label: "Create Exam",
                  onClick: () => router.push("/dashboard/admin/exams/create"),
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam) => (
                  <Card key={exam.id} className="p-6 bg-card border-border">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {exam.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {exam.examType} • {exam.term}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          exam.status
                        )}`}
                      >
                        {exam.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar size={16} className="mr-2" />
                        {new Date(exam.startDate).toLocaleDateString()} -{" "}
                        {new Date(exam.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FileText size={16} className="mr-2" />
                        {exam.subjects.length} Subjects • {exam.classes.length} Classes
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/dashboard/admin/exams/${exam.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <Eye size={16} />
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteExam(exam.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
