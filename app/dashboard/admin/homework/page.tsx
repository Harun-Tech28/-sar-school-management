"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { FileText, Eye, Trash2, Calendar, Clock } from "lucide-react"
import { toast } from "react-hot-toast"

interface Homework {
  id: string
  title: string
  description: string
  subject: string
  dueDate: string
  class: {
    name: string
    form: string
  }
  teacher: {
    user: {
      fullName: string
    }
  }
  _count: {
    submissions: number
  }
}

export default function AdminHomeworkPage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [homework, setHomework] = useState<Homework[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
    
    fetchHomework()
  }, [])

  const fetchHomework = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/homework")
      if (response.ok) {
        const data = await response.json()
        setHomework(data.data || [])
      } else {
        toast.error("Failed to load homework")
      }
    } catch (error) {
      console.error("Error fetching homework:", error)
      toast.error("Failed to load homework")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this homework?")) return

    try {
      const response = await fetch(`/api/homework/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Homework deleted successfully")
        fetchHomework()
      } else {
        toast.error("Failed to delete homework")
      }
    } catch (error) {
      console.error("Error deleting homework:", error)
      toast.error("Failed to delete homework")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="admin" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Admin" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="text-[#E31E24]" size={32} />
                Homework Management
              </h1>
              <p className="text-gray-600 mt-2">
                Monitor and manage homework assignments across all classes
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Assignments</p>
                    <p className="text-3xl font-bold text-gray-900">{homework.length}</p>
                  </div>
                  <FileText className="text-[#E31E24]" size={40} />
                </div>
              </Card>

              <Card className="p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Submissions</p>
                    <p className="text-3xl font-bold text-green-600">
                      {homework.reduce((sum, hw) => sum + hw._count.submissions, 0)}
                    </p>
                  </div>
                  <Clock className="text-green-600" size={40} />
                </div>
              </Card>

              <Card className="p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Overdue</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {homework.filter(hw => isOverdue(hw.dueDate)).length}
                    </p>
                  </div>
                  <Calendar className="text-orange-600" size={40} />
                </div>
              </Card>
            </div>

            {/* Homework List */}
            <Card className="p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">All Homework Assignments</h2>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E31E24] border-t-transparent"></div>
                </div>
              ) : homework.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto text-gray-400 mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Homework Assignments
                  </h3>
                  <p className="text-gray-500">
                    Teachers haven't created any homework assignments yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {homework.map((hw) => (
                    <div
                      key={hw.id}
                      className={`p-4 rounded-lg border-2 ${
                        isOverdue(hw.dueDate)
                          ? "border-orange-300 bg-orange-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {hw.title}
                            </h3>
                            {isOverdue(hw.dueDate) && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
                                OVERDUE
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{hw.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">Class:</span>
                              <span className="text-gray-600">
                                {hw.class.name} - {hw.class.form}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">Subject:</span>
                              <span className="text-gray-600">{hw.subject}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">Teacher:</span>
                              <span className="text-gray-600">{hw.teacher.user.fullName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-gray-500" />
                              <span className="text-gray-600">
                                Due: {formatDate(hw.dueDate)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">Submissions:</span>
                              <span className="text-green-600 font-semibold">
                                {hw._count.submissions}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => window.location.href = `/dashboard/admin/homework/${hw.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={20} />
                          </button>
                          <button
                            onClick={() => handleDelete(hw.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
