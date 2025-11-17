"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { BookOpen, Calendar, CheckCircle, FileText, TrendingUp, Award, Bell } from "lucide-react"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { ActivityFeed } from "@/components/notifications/activity-feed"
import EnhancedStatCard from "@/components/dashboard/enhanced-stat-card"
import DashboardGrid from "@/components/dashboard/dashboard-grid"
import QuickActions from "@/components/dashboard/quick-actions"
import ActivityTimeline, { generateSampleActivities } from "@/components/dashboard/activity-timeline"
import { StatCardsGridSkeleton } from "@/components/loading/stat-card-skeleton"

export default function StudentDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [timelineActivities] = useState(generateSampleActivities())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
    setLoading(false)
    
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
            {loading ? (
              <StatCardsGridSkeleton count={4} />
            ) : (
              <DashboardGrid columns={4} gap={6} className="mb-8">
                <EnhancedStatCard
                  title="Overall Grade"
                  value={0}
                  icon={<Award size={24} />}
                  gradient="blue"
                  suffix="%"
                  onClick={() => router.push('/dashboard/student/grades')}
                />
                
                <EnhancedStatCard
                  title="Attendance"
                  value={0}
                  icon={<CheckCircle size={24} />}
                  gradient="green"
                  suffix="%"
                  onClick={() => router.push('/dashboard/student/attendance')}
                />
                
                <EnhancedStatCard
                  title="Assignments"
                  value="0/0"
                  icon={<FileText size={24} />}
                  gradient="purple"
                  onClick={() => router.push('/dashboard/student/homework')}
                />
                
                <EnhancedStatCard
                  title="Class Rank"
                  value="-"
                  icon={<TrendingUp size={24} />}
                  gradient="orange"
                />
              </DashboardGrid>
            )}

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
            <QuickActions
              title="Quick Actions"
              columns={4}
              className="mt-8"
              actions={[
                {
                  label: "View Homework",
                  icon: <BookOpen size={20} />,
                  onClick: () => router.push('/dashboard/student/homework'),
                  color: 'primary'
                },
                {
                  label: "Check Grades",
                  icon: <Award size={20} />,
                  onClick: () => router.push('/dashboard/student/grades'),
                  color: 'success'
                },
                {
                  label: "View Timetable",
                  icon: <Calendar size={20} />,
                  onClick: () => router.push('/dashboard/student/timetable'),
                  color: 'info'
                },
                {
                  label: "Announcements",
                  icon: <Bell size={20} />,
                  onClick: () => router.push('/dashboard/student/announcements'),
                  color: 'warning'
                }
              ]}
            />

            {/* Activity Timeline */}
            <div className="mt-8 mb-8">
              <ActivityTimeline
                activities={timelineActivities}
                maxItems={5}
                loading={loading}
                showViewAll={true}
                onViewAll={() => router.push('/dashboard/student/activities')}
              />
            </div>

            {/* Recent Activity */}
            <ActivityFeed userRole="student" maxItems={10} />
          </div>
        </main>
      </div>
    </div>
  )
}
