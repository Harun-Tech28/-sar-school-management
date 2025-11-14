"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { BookOpen, Calendar, CheckCircle, FileText, TrendingUp, Award } from "lucide-react"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { ActivityFeed } from "@/components/notifications/activity-feed"
import { NotificationBell } from "@/components/notifications/notification-bell"

export default function StudentDashboard() {
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
    
    // Notifications will be loaded from database when implemented
  }, [])

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="student" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Student" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {userName}! 👋</h1>
              <p className="text-muted-foreground">Here's your academic overview</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 hover-lift">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Overall Grade</p>
                    <p className="text-3xl font-bold text-foreground">
                      <AnimatedNumber value={0} duration={1500} />%
                    </p>
                  </div>
                  <Award className="h-10 w-10 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">No grades yet</p>
              </Card>

              <Card className="p-6 hover-lift">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                    <p className="text-3xl font-bold text-foreground">
                      <AnimatedNumber value={0} duration={1500} />%
                    </p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-success" />
                </div>
                <p className="text-xs text-muted-foreground">No records yet</p>
              </Card>

              <Card className="p-6 hover-lift">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Assignments</p>
                    <p className="text-3xl font-bold text-foreground">0/0</p>
                  </div>
                  <FileText className="h-10 w-10 text-secondary" />
                </div>
                <p className="text-xs text-muted-foreground">No assignments yet</p>
              </Card>

              <Card className="p-6 hover-lift">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Class Rank</p>
                    <p className="text-3xl font-bold text-foreground">-</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-chart-3" />
                </div>
                <p className="text-xs text-muted-foreground">Not calculated yet</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Grades */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen size={20} />
                  Recent Grades
                </h3>
                <div className="text-center py-8">
                  <BookOpen className="mx-auto mb-3 text-muted-foreground" size={40} />
                  <p className="text-muted-foreground">No grades available yet</p>
                </div>
              </Card>

              {/* Upcoming Assignments */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Calendar size={20} />
                  Upcoming Assignments
                </h3>
                <div className="text-center py-8">
                  <FileText className="mx-auto mb-3 text-muted-foreground" size={40} />
                  <p className="text-muted-foreground">No assignments yet</p>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/dashboard/student/grades">
                  <Card className="p-4 hover-lift cursor-pointer text-center">
                    <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">View Grades</p>
                  </Card>
                </Link>
                <Link href="/dashboard/student/homework">
                  <Card className="p-4 hover-lift cursor-pointer text-center">
                    <FileText className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">Assignments</p>
                  </Card>
                </Link>
                <Link href="/dashboard/student/timetable">
                  <Card className="p-4 hover-lift cursor-pointer text-center">
                    <Calendar className="h-8 w-8 text-success mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">Timetable</p>
                  </Card>
                </Link>
                <Link href="/dashboard/student/attendance">
                  <Card className="p-4 hover-lift cursor-pointer text-center">
                    <CheckCircle className="h-8 w-8 text-chart-3 mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">Attendance</p>
                  </Card>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <ActivityFeed userRole="student" maxItems={10} />
          </div>
        </main>
      </div>
    </div>
  )
}
