"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, CheckCircle, XCircle } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { generateAndDownloadPDF } from "@/lib/pdf-generator"

interface Class {
  id: string
  name: string
}

interface Student {
  id: string
  rollNumber: string
  user: {
    fullName: string
  }
  hasGrades: boolean
}

export default function ReportCardsPage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [filter, setFilter] = useState({
    classId: "",
    term: "Term 1",
    academicYear: "2025",
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
    fetchClasses()
  }, [])

  useEffect(() => {
    if (filter.classId) {
      fetchStudents()
    }
  }, [filter])

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/classes")
      const data = await response.json()
      if (data.success) {
        setClasses(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error)
    }
  }

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/students?classId=${filter.classId}`)
      const data = await response.json()

      if (data.success) {
        // Check which students have grades
        const studentsWithGradeStatus = await Promise.all(
          data.data.map(async (student: any) => {
            try {
              const gradeResponse = await fetch(
                `/api/grades?studentId=${student.id}&term=${filter.term}&academicYear=${filter.academicYear}`
              )
              const gradeData = await gradeResponse.json()
              return {
                ...student,
                hasGrades: gradeData.success && gradeData.data.length > 0,
              }
            } catch {
              return { ...student, hasGrades: false }
            }
          })
        )
        setStudents(studentsWithGradeStatus)
      }
    } catch (error) {
      console.error("Failed to fetch students:", error)
    } finally {
      setLoading(false)
    }
  }

  const downloadReportCard = async (studentId: string) => {
    try {
      setDownloading(studentId)
      const response = await fetch(
        `/api/report-cards/download/${studentId}?term=${filter.term}&academicYear=${filter.academicYear}`
      )
      const data = await response.json()

      if (data.success) {
        generateAndDownloadPDF(
          "reportCard",
          data.data,
          `Report_Card_${data.data.studentId}_${filter.term}_${filter.academicYear}.pdf`
        )
      } else {
        alert(data.error || "Failed to generate report card")
      }
    } catch (error) {
      console.error("Failed to download report card:", error)
      alert("Failed to download report card")
    } finally {
      setDownloading(null)
    }
  }

  const downloadBulkReportCards = async () => {
    if (!filter.classId) {
      alert("Please select a class")
      return
    }

    try {
      setDownloading("bulk")
      const response = await fetch("/api/report-cards/bulk-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: filter.classId,
          term: filter.term,
          academicYear: filter.academicYear,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Generate PDFs for each student
        data.data.reportCards.forEach((reportCard: any) => {
          if (reportCard.hasGrades) {
            setTimeout(() => {
              generateAndDownloadPDF(
                "reportCard",
                reportCard.data,
                `Report_Card_${reportCard.data.studentId}_${filter.term}_${filter.academicYear}.pdf`
              )
            }, 500)
          }
        })
        alert(
          `Generated ${data.data.studentsWithGrades} report cards out of ${data.data.totalStudents} students`
        )
      } else {
        alert(data.error || "Failed to generate bulk report cards")
      }
    } catch (error) {
      console.error("Failed to download bulk report cards:", error)
      alert("Failed to download bulk report cards")
    } finally {
      setDownloading(null)
    }
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
                <h1 className="text-3xl font-bold text-foreground">Report Cards</h1>
                <p className="text-muted-foreground mt-1">
                  Generate and download student report cards
                </p>
              </div>
              {students.length > 0 && (
                <Button
                  onClick={downloadBulkReportCards}
                  disabled={downloading === "bulk"}
                  className="gap-2"
                >
                  <Download size={18} />
                  {downloading === "bulk" ? "Generating..." : "Download All"}
                </Button>
              )}
            </div>

            {/* Filters */}
            <Card className="p-4 mb-6 bg-card border-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Class *
                  </label>
                  <select
                    value={filter.classId}
                    onChange={(e) => setFilter({ ...filter, classId: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Term
                  </label>
                  <select
                    value={filter.term}
                    onChange={(e) => setFilter({ ...filter, term: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
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
              </div>
            </Card>

            {/* Students List */}
            {!filter.classId ? (
              <EmptyState
                icon={FileText}
                title="Select a Class"
                description="Choose a class from the filter above to view students and generate report cards."
              />
            ) : loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading students...</p>
              </div>
            ) : students.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No Students Found"
                description="There are no students in this class."
              />
            ) : (
              <Card className="bg-card border-border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Roll Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Student Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Grade Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {students.map((student) => (
                        <tr key={student.id} className="hover:bg-muted/50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {student.rollNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                            {student.user.fullName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {student.hasGrades ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                <CheckCircle size={14} />
                                Grades Available
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                <XCircle size={14} />
                                No Grades
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadReportCard(student.id)}
                              disabled={
                                !student.hasGrades || downloading === student.id
                              }
                              className="gap-2"
                            >
                              <Download size={16} />
                              {downloading === student.id
                                ? "Generating..."
                                : "Download"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
