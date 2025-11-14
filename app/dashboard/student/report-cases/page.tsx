"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Plus, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"

interface Report {
  id: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  reportedBy: string
  location?: string
  createdAt: string
  resolvedAt?: string
}

export default function StudentReportCasesPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
    fetchMyReports(user.id)
  }, [])

  const fetchMyReports = async (userId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reports/cases?reportedBy=${userId}`)
      const data = await response.json()
      if (data.success) {
        setReports(data.data)
      }
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "OPEN":
        return <AlertCircle className="text-red-500" size={18} />
      case "IN_PROGRESS":
        return <Clock className="text-yellow-500" size={18} />
      case "RESOLVED":
        return <CheckCircle className="text-green-500" size={18} />
      case "CLOSED":
        return <XCircle className="text-gray-500" size={18} />
      default:
        return <AlertCircle className="text-gray-500" size={18} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-red-100 text-red-800"
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800"
      case "RESOLVED":
        return "bg-green-100 text-green-800"
      case "CLOSED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-500 text-white"
      case "HIGH":
        return "bg-orange-500 text-white"
      case "MEDIUM":
        return "bg-blue-500 text-white"
      case "LOW":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="student" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="student" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Reports</h1>
                <p className="text-gray-600">View and track your submitted reports</p>
              </div>
              <button
                onClick={() => router.push("/dashboard/student/report-cases/submit")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={20} />
                Submit Report
              </button>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : reports.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
                  <AlertCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
                  <p className="text-gray-600 mb-6">You haven't submitted any reports</p>
                  <button
                    onClick={() => router.push("/dashboard/student/report-cases/submit")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 inline-flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Submit Your First Report
                  </button>
                </div>
              ) : (
                reports.map((report) => (
                  <div key={report.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                              report.priority
                            )}`}
                          >
                            {report.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{report.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            📁 {report.category}
                          </span>
                          {report.location && (
                            <span className="flex items-center gap-1">
                              📍 {report.location}
                            </span>
                          )}
                          <span>
                            📅 {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(report.status)}
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {report.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                    {report.resolvedAt && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-green-600 font-medium">
                          ✓ Resolved on {new Date(report.resolvedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

