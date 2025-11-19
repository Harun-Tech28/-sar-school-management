"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, Plus } from "lucide-react"
import Link from "next/link"

export default function TeacherLessonPlansPage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")

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
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">Lesson Plans</h1>
              <p className="text-muted-foreground mt-1">
                Manage your lesson plans and teaching resources
              </p>
            </div>

            {/* Empty State */}
            <Card className="p-12 bg-card border-border">
              <div className="text-center max-w-md mx-auto">
                <div className="flex justify-center mb-4">
                  <BookOpen className="text-muted-foreground" size={64} />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Lesson Plans Coming Soon
                </h2>
                <p className="text-muted-foreground mb-6">
                  The lesson planning feature is currently under development. You'll be able to create, manage, and share lesson plans here soon.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link href="/dashboard/teacher">
                    <Button variant="outline" className="gap-2">
                      <FileText size={18} />
                      Back to Dashboard
                    </Button>
                  </Link>
                  <Link href="/dashboard/teacher/classes">
                    <Button className="gap-2 bg-[#E31E24] hover:bg-[#C41E3A]">
                      <BookOpen size={18} />
                      View My Classes
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
