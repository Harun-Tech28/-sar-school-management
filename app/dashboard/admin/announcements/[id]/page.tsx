"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface AnnouncementData {
  id: string
  title: string
  content: string
  category: string
  priority: string
  targetAudience: string
  date: string
  author: string
}

export default function EditAnnouncementPage() {
  const router = useRouter()
  const params = useParams()
  const announcementId = params.id as string

  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [formData, setFormData] = useState<AnnouncementData>({
    id: "",
    title: "",
    content: "",
    category: "General",
    priority: "Normal",
    targetAudience: "All",
    date: "",
    author: "",
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)

    // Fetch announcement data from API
    fetchAnnouncement()
  }, [announcementId])

  const fetchAnnouncement = async () => {
    try {
      setIsFetching(true)
      const response = await fetch(`/api/announcements/${announcementId}`)
      const data = await response.json()

      if (data.success) {
        setFormData(data.data)
      } else {
        toast.error("Announcement not found")
        router.push("/dashboard/admin/announcements")
      }
    } catch (error) {
      console.error("Error fetching announcement:", error)
      toast.error("Failed to load announcement")
      router.push("/dashboard/admin/announcements")
    } finally {
      setIsFetching(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/announcements/${announcementId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Announcement updated successfully!")
        router.push("/dashboard/admin/announcements")
      } else {
        toast.error(data.error || "Failed to update announcement")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error updating announcement:", error)
      toast.error("Failed to update announcement")
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex bg-background min-h-screen">
        <Sidebar userRole="admin" />
        <div className="flex-1 flex flex-col">
          <Header userName={userName} userRole="Admin" userId={userId} />
          <main className="flex-1 p-6 overflow-auto flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
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
          <div className="max-w-2xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <Link
                href="/dashboard/admin/announcements"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
              >
                <ArrowLeft size={18} />
                Back to Announcements
              </Link>
              <h1 className="text-3xl font-bold text-foreground">Edit Announcement</h1>
              <p className="text-muted-foreground mt-1">Update announcement details</p>
            </div>

            {/* Form Card */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Announcement Title</label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter announcement title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Content</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Enter announcement content"
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                    >
                      <option value="General">General</option>
                      <option value="Academic">Academic</option>
                      <option value="Event">Event</option>
                      <option value="Administrative">Administrative</option>
                      <option value="Sports">Sports</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                    >
                      <option value="Low">Low</option>
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Target Audience</label>
                  <select
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                  >
                    <option value="All">All (Students, Teachers, Parents)</option>
                    <option value="Teachers">Teachers Only</option>
                    <option value="Parents">Parents Only</option>
                    <option value="Students">Students Only</option>
                    <option value="Staff">Staff Only</option>
                  </select>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Link href="/dashboard/admin/announcements">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
