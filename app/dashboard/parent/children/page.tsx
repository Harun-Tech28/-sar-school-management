"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, User, GraduationCap, Calendar } from "lucide-react"
import { Loader } from "@/components/ui/loader"
import { generateAndDownloadPDF } from "@/lib/pdf-generator"
import Link from "next/link"

interface Child {
  id: string
  rollNumber: string
  dateOfBirth: string
  user: {
    fullName: string
    email: string
  }
  class: {
    name: string
  }
}

export default function ParentChildrenPage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [parentId, setParentId] = useState("")
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [filter, setFilter] = useState({
    term: "Term 1",
    academicYear: "2025",
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/auth/login"
      return
    }
    
    if (user.role !== "parent") {
      window.location.href = `/dashboard/${user.role}`
      return
    }

    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
    
    // Fetch parent ID and children
    fetchParentData(user.email)
  }, [])

  const fetchParentData = async (email: string) => {
    try {
      // First, get parent ID
      const parentResponse = await fetch(`/api/parents?email=${email}`)
      const parentData = await parentResponse.json()

      if (parentData.success && parentData.data.length > 0) {
        const parent = parentData.data[0]
        setParentId(parent.id)
        
        // Fetch children
        const childrenResponse = await fetch(`/api/students?parentId=${parent.id}`)
        const childrenData = await childrenResponse.json()

        if (childrenData.success) {
          setChildren(childrenData.data)
        }
      }
    } catch (error) {
      console.error("Failed to fetch parent data:", error)
    } finally {
      setLoading(false)
    }
  }

  const downloadReportCard = async (studentId: string, studentName: string) => {
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
          `Report_Card_${studentName.replace(/\s+/g, '_')}_${filter.term}_${filter.academicYear}.pdf`
        )
      } else {
        alert(data.error || "No grades available for this term")
      }
    } catch (error) {
      console.error("Failed to download report card:", error)
      alert("Failed to download report card")
    } finally {
      setDownloading(null)
    }
  }

  if (loading) {
    return <Loader size="lg" text="Loading..." fullScreen />
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="parent" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Parent" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">My Children</h1>
              <p className="text-muted-foreground mt-1">View and download report cards for your children</p>
            </div>

            {/* Filter Section */}
            <Card className="p-6 bg-card border-border mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Report Card Filters</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Term</label>
                  <select
                    value={filter.term}
                    onChange={(e) => setFilter({ ...filter, term: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Academic Year</label>
                  <select
                    value={filter.academicYear}
                    onChange={(e) => setFilter({ ...filter, academicYear: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Children List */}
            {children.length === 0 ? (
              <Card className="p-12 bg-card border-border text-center">
                <User size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Children Linked</h3>
                <p className="text-muted-foreground">
                  Please contact the school administrator to link your children to your account.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {children.map((child) => (
                  <Card key={child.id} className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                          <GraduationCap size={24} className="text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">{child.user.fullName}</h3>
                          <p className="text-sm text-muted-foreground">{child.class.name}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText size={16} className="text-muted-foreground" />
                        <span className="text-foreground">Roll No: {child.rollNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={16} className="text-muted-foreground" />
                        <span className="text-foreground">
                          DOB: {new Date(child.dateOfBirth).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/dashboard/parent/student-report?studentId=${child.id}`} className="flex-1">
                        <Button variant="outline" className="w-full gap-2">
                          <FileText size={16} />
                          View Report
                        </Button>
                      </Link>
                      <Button
                        onClick={() => downloadReportCard(child.id, child.user.fullName)}
                        disabled={downloading === child.id}
                        className="gap-2"
                      >
                        {downloading === child.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download size={16} />
                            Download
                          </>
                        )}
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
