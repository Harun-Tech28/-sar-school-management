"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { Clock, Users } from "lucide-react"

interface Announcement {
  id: string
  title: string
  content: string
  target: string
  createdDate: string
  createdBy: string
}

export default function TeacherAnnouncementsPage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [announcements] = useState<Announcement[]>([])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
  }, [])

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="teacher" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Teacher" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">School Announcements</h1>
              <p className="text-muted-foreground mt-1">Latest updates from the school administration</p>
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
              {announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <Card key={announcement.id} className="p-6 bg-card border-border hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{announcement.title}</h3>
                    <p className="text-muted-foreground mb-4">{announcement.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {announcement.target.charAt(0).toUpperCase() + announcement.target.slice(1)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(announcement.createdDate).toLocaleDateString()}
                      </span>
                      <span>By {announcement.createdBy}</span>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📢</div>
                  <p className="text-gray-600 text-lg mb-2">No announcements yet</p>
                  <p className="text-gray-500 text-sm">Announcements from the school will appear here</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
