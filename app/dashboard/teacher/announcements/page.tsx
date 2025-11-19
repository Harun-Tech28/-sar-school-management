"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { Clock, Users, Bell, AlertCircle } from "lucide-react"

interface Announcement {
  id: string
  title: string
  content: string
  category: string
  priority: string
  targetAudience: string
  date: string
  author: string
  createdAt: string
  updatedAt: string
}

export default function TeacherAnnouncementsPage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/auth/login"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)

    fetchAnnouncements()
  }, [isMounted])

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/announcements?audience=Teachers")
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Filter for teachers and all
          const teacherAnnouncements = result.data.filter(
            (ann: Announcement) => 
              ann.targetAudience === "Teachers" || ann.targetAudience === "All"
          )
          setAnnouncements(teacherAnnouncements)
          setError("")
        } else {
          setError("Failed to load announcements")
        }
      } else {
        setError("Failed to load announcements")
      }
    } catch (err) {
      console.error("Error fetching announcements:", err)
      setError("Network error. Please check your connection.")
    } finally {
      setIsLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Normal":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Low":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Academic":
        return "bg-purple-100 text-purple-800"
      case "Event":
        return "bg-green-100 text-green-800"
      case "Administrative":
        return "bg-yellow-100 text-yellow-800"
      case "Sports":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isMounted || isLoading) {
    return (
      <div className="flex bg-background min-h-screen">
        <Sidebar userRole="teacher" />
        <div className="flex-1 flex flex-col">
          <Header userName={userName} userRole="Teacher" userId={userId} />
          <main className="flex-1 p-6 overflow-auto">
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E31E24] border-t-transparent mb-4"></div>
              <p className="text-gray-600">Loading announcements...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="teacher" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Teacher" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Bell className="text-[#E31E24]" size={32} />
                School Announcements
              </h1>
              <p className="text-muted-foreground mt-1">Latest updates from the school administration</p>
            </div>

            {/* Error State */}
            {error && (
              <Card className="p-6 mb-6 bg-red-50 border-red-200">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-red-600" size={24} />
                  <div>
                    <h3 className="font-semibold text-red-900">Error Loading Announcements</h3>
                    <p className="text-sm text-red-700">{error}</p>
                    <button
                      onClick={fetchAnnouncements}
                      className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                    >
                      Click here to retry
                    </button>
                  </div>
                </div>
              </Card>
            )}

            {/* Stats Card */}
            {!error && announcements.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-6 bg-card border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Announcements</p>
                      <p className="text-2xl font-bold text-foreground">{announcements.length}</p>
                    </div>
                    <Bell className="text-[#E31E24]" size={24} />
                  </div>
                </Card>

                <Card className="p-6 bg-card border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Urgent</p>
                      <p className="text-2xl font-bold text-red-600">
                        {announcements.filter(a => a.priority === "Urgent").length}
                      </p>
                    </div>
                    <AlertCircle className="text-red-600" size={24} />
                  </div>
                </Card>

                <Card className="p-6 bg-card border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">This Week</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {announcements.filter(a => {
                          const weekAgo = new Date()
                          weekAgo.setDate(weekAgo.getDate() - 7)
                          return new Date(a.createdAt) > weekAgo
                        }).length}
                      </p>
                    </div>
                    <Clock className="text-blue-600" size={24} />
                  </div>
                </Card>
              </div>
            )}

            {/* Announcements List */}
            <div className="space-y-4">
              {!error && announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <Card key={announcement.id} className="p-6 bg-card border-border hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-foreground">{announcement.title}</h3>
                          <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${getPriorityColor(announcement.priority)}`}>
                            {announcement.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getCategoryColor(announcement.category)}`}>
                            {announcement.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 whitespace-pre-wrap">{announcement.content}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-3 border-t border-border">
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {announcement.targetAudience}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(announcement.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                      <span>By {announcement.author}</span>
                    </div>
                  </Card>
                ))
              ) : !error ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="text-gray-400" size={40} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No announcements yet</h3>
                  <p className="text-muted-foreground">Announcements from the school will appear here</p>
                </div>
              ) : null}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
