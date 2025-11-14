"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { Bell, Calendar, User, Loader2 } from "lucide-react"

interface Announcement {
  id: string
  title: string
  content: string
  priority: string
  targetAudience: string
  createdAt: string
  author: {
    fullName: string
  }
}

export default function StudentAnnouncementsPage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/announcements")
      const data = await response.json()
      
      if (data.success) {
        // Filter announcements for students
        const studentAnnouncements = data.data.filter(
          (announcement: Announcement) =>
            announcement.targetAudience === "all" ||
            announcement.targetAudience === "students"
        )
        setAnnouncements(studentAnnouncements)
      }
    } catch (error) {
      console.error("Error fetching announcements:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="student" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Student" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Bell size={32} />
                Announcements
              </h1>
              <p className="text-muted-foreground mt-1">Stay updated with school announcements and news</p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            )}

            {/* Announcements List */}
            {!isLoading && announcements.length === 0 && (
              <Card className="p-12 text-center">
                <Bell className="mx-auto mb-4 text-muted-foreground" size={48} />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Announcements</h3>
                <p className="text-muted-foreground">There are no announcements at this time. Check back later!</p>
              </Card>
            )}

            {!isLoading && announcements.length > 0 && (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <Card key={announcement.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-foreground mb-2">
                          {announcement.title}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>{announcement.author.fullName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(
                          announcement.priority
                        )}`}
                      >
                        {announcement.priority}
                      </span>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-foreground whitespace-pre-wrap">{announcement.content}</p>
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
