"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Edit2, Clock, Loader2, Search } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Announcement {
  id: string
  title: string
  content: string
  category: string
  priority: string
  targetAudience: string
  date: string
  author: string
  authorId: string
  createdAt: string
  updatedAt: string
}

export default function AnnouncementsPage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
    
    // Fetch announcements from API
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/announcements")
      const data = await response.json()
      
      if (data.success) {
        setAnnouncements(data.data || [])
      } else {
        toast.error("Failed to load announcements")
      }
    } catch (error) {
      console.error("Error fetching announcements:", error)
      toast.error("Failed to load announcements")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) {
      return
    }

    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
      })
      
      const data = await response.json()
      
      if (data.success) {
        setAnnouncements(announcements.filter((a) => a.id !== id))
        toast.success("Announcement deleted successfully")
      } else {
        toast.error(data.error || "Failed to delete announcement")
      }
    } catch (error) {
      console.error("Error deleting announcement:", error)
      toast.error("Failed to delete announcement")
    }
  }

  const getTargetBadge = (target: string) => {
    const colors: Record<string, string> = {
      All: "bg-primary text-primary-foreground",
      Teachers: "bg-secondary text-secondary-foreground",
      Parents: "bg-accent text-accent-foreground",
      Students: "bg-chart-2 text-foreground",
      Staff: "bg-muted text-foreground",
    }
    return colors[target] || "bg-muted text-foreground"
  }

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      Urgent: "bg-red-500 text-white",
      High: "bg-orange-500 text-white",
      Normal: "bg-blue-500 text-white",
      Low: "bg-gray-500 text-white",
    }
    return colors[priority] || "bg-gray-500 text-white"
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="admin" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Admin" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
                <p className="text-muted-foreground mt-1">Manage school announcements and communications</p>
              </div>
              <Link href="/dashboard/admin/announcements/create">
                <Button className="gap-2">
                  <Plus size={18} />
                  Create Announcement
                </Button>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="bg-card rounded-lg border border-border p-4 mb-6">
              <div className="flex items-center gap-2">
                <Search size={20} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search announcements by title, content, or audience..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 border-0 bg-transparent focus:outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            )}

            {/* Announcements List */}
            {!isLoading && (
              <div className="space-y-4">
                {announcements.filter((announcement) => {
                  const searchLower = searchTerm.toLowerCase().trim()
                  if (!searchLower) return true
                  
                  return (
                    (announcement.title || '').toLowerCase().includes(searchLower) ||
                    (announcement.content || '').toLowerCase().includes(searchLower) ||
                    (announcement.targetAudience || '').toLowerCase().includes(searchLower)
                  )
                }).map((announcement) => (
                  <Card key={announcement.id} className="p-6 bg-card border-border hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-foreground">{announcement.title}</h3>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${getPriorityBadge(
                              announcement.priority,
                            )}`}
                          >
                            {announcement.priority}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-4">{announcement.content}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getTargetBadge(
                              announcement.targetAudience,
                            )}`}
                          >
                            {announcement.targetAudience}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted text-foreground">
                            {announcement.category}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock size={14} />
                            {new Date(announcement.date).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-muted-foreground">By {announcement.author}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/admin/announcements/${announcement.id}`}>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Edit2 size={16} />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(announcement.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && announcements.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No announcements yet</p>
                <Link href="/dashboard/admin/announcements/create">
                  <Button>
                    <Plus size={18} className="mr-2" />
                    Create Your First Announcement
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
