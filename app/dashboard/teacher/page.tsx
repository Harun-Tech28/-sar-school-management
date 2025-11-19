"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import { Users, Clock, CheckCircle, AlertCircle, BookOpen, ClipboardCheck, FileText, Bell } from "lucide-react"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { Loader } from "@/components/ui/loader"
import { ActivityFeed } from "@/components/notifications/activity-feed"
import { NotificationBell } from "@/components/notifications/notification-bell"
import EnhancedStatCard from "@/components/dashboard/enhanced-stat-card"
import DashboardGrid from "@/components/dashboard/dashboard-grid"
import QuickActions from "@/components/dashboard/quick-actions"
import ActivityTimeline, { generateSampleActivities } from "@/components/dashboard/activity-timeline"
import { StatCardsGridSkeleton } from "@/components/loading/stat-card-skeleton"

export default function TeacherDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [totalStudents, setTotalStudents] = useState(0)
  const [totalClasses, setTotalClasses] = useState(0)
  const [timelineActivities] = useState(generateSampleActivities())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userString = localStorage.getItem("user")

    if (!userString) {
      window.location.href = "/auth/login"
      return
    }

    try {
      const user = JSON.parse(userString)

      if (!user.email || !user.role) {
        localStorage.removeItem("user")
        window.location.href = "/auth/login"
        return
      }

      if (user.role !== "teacher") {
        window.location.href = `/dashboard/${user.role}`
        return
      }

      setUserName(user.fullName || user.email.split("@")[0])
      setUserId(user.id || user.email)
      setIsAuthenticated(true)
      setLoading(false)
      
      // Fetch real counts from database
      fetch("/api/dashboard/stats")
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setTotalStudents(data.data.students)
            setTotalClasses(data.data.classes)
          }
        })
        .catch(error => {
          console.error("Error fetching stats:", error)
          setTotalStudents(0)
          setTotalClasses(0)
        })
    } catch (error) {
      localStorage.removeItem("user")
      window.location.href = "/auth/login"
    }
  }, [])

  if (!isAuthenticated) {
    return <Loader size="lg" text="Loading Dashboard..." fullScreen />
  }

  const classesInfo: any[] = []  // Will be populated with real data

  const statCards = [
    { 
      label: "STUDENTS TODAY", 
      value: totalStudents.toString(), 
      icon: "👨‍🎓", 
      bgColor: "bg-blue-500",
      progressColor: "bg-blue-500",
      percentage: Math.min((totalStudents / 50) * 100, 100),
      trend: "0",
      trendUp: false
    },
    { 
      label: "CLASSES TODAY", 
      value: totalClasses.toString(), 
      icon: "📚", 
      bgColor: "bg-green-500",
      progressColor: "bg-green-500",
      percentage: Math.min((totalClasses / 5) * 100, 100),
      trend: "0",
      trendUp: false
    },
    { 
      label: "ATTENDANCE RATE", 
      value: "0%", 
      icon: "✅", 
      bgColor: "bg-purple-500",
      progressColor: "bg-purple-500",
      percentage: 0,
      trend: "0%",
      trendUp: false
    },
    { 
      label: "PENDING TASKS", 
      value: "0", 
      icon: "⏰", 
      bgColor: "bg-orange-500",
      progressColor: "bg-orange-500",
      percentage: 0,
      trend: "0",
      trendUp: false
    },
  ]

  const quickActions = [
    { label: "Mark Attendance", icon: "✅📝", href: "/dashboard/teacher/attendance" },
    { label: "Enter Grades", icon: "📊✏️", href: "/dashboard/teacher/grades" },
    { label: "Create Homework", icon: "📝➕", href: "/dashboard/teacher/homework" },
    { label: "View Classes", icon: "👥📚", href: "/dashboard/teacher/attendance" },
  ]

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar userRole="teacher" />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-3xl p-8 mb-8 shadow-xl relative">
              <div className="absolute top-6 right-6">
                <NotificationBell userId={userId} userRole="teacher" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, <span className="text-yellow-200">{userName}</span>
              </h1>
              <p className="text-white/90 text-lg">Ready to inspire young minds today? 📚</p>
            </div>

            {/* Stats Grid with Visual Indicators */}
            {loading ? (
              <StatCardsGridSkeleton count={4} />
            ) : (
              <DashboardGrid columns={4} gap={6} className="mb-8">
                <EnhancedStatCard
                  title="My Students"
                  value={totalStudents}
                  icon={<Users size={24} />}
                  gradient="blue"
                  trend={{ value: 5, isPositive: true }}
                  onClick={() => router.push('/dashboard/teacher/attendance')}
                />
                
                <EnhancedStatCard
                  title="My Classes"
                  value={totalClasses}
                  icon={<BookOpen size={24} />}
                  gradient="green"
                  trend={{ value: 2, isPositive: true }}
                  onClick={() => router.push('/dashboard/teacher/attendance')}
                />
                
                <EnhancedStatCard
                  title="Attendance Rate"
                  value="0"
                  icon={<CheckCircle size={24} />}
                  gradient="purple"
                  suffix="%"
                  onClick={() => router.push('/dashboard/teacher/attendance')}
                />
                
                <EnhancedStatCard
                  title="Pending Tasks"
                  value={0}
                  icon={<Clock size={24} />}
                  gradient="orange"
                  onClick={() => router.push('/dashboard/teacher/homework')}
                />
              </DashboardGrid>
            )}

            {/* Quick Actions */}
            <QuickActions
              title="Quick Actions"
              columns={4}
              className="mb-8"
              actions={[
                {
                  label: "Take Attendance",
                  icon: <ClipboardCheck size={20} />,
                  onClick: () => router.push('/dashboard/teacher/attendance'),
                  color: 'primary'
                },
                {
                  label: "Grade Students",
                  icon: <FileText size={20} />,
                  onClick: () => router.push('/dashboard/teacher/grades'),
                  color: 'success'
                },
                {
                  label: "Create Homework",
                  icon: <BookOpen size={20} />,
                  onClick: () => router.push('/dashboard/teacher/homework'),
                  color: 'info'
                },
                {
                  label: "Announcements",
                  icon: <Bell size={20} />,
                  onClick: () => router.push('/dashboard/teacher/announcements'),
                  color: 'warning'
                }
              ]}
            />

            {/* Analytics & Reports */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/dashboard/teacher/performance-analysis">
                  <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover-lift border border-gray-100 cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-blue-100 p-4 rounded-xl group-hover:scale-110 transition-transform">
                        <span className="text-4xl">📊</span>
                      </div>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        Performance
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Class Performance</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      View student grades, rankings, and trends
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-600 font-semibold">0% Average</span>
                      <span className="text-gray-500">My classes</span>
                    </div>
                  </div>
                </Link>

                <Link href="/dashboard/teacher/grades">
                  <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover-lift border border-gray-100 cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-green-100 p-4 rounded-xl group-hover:scale-110 transition-transform">
                        <span className="text-4xl">📝</span>
                      </div>
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        Grades
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Grade Management</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Enter and manage student grades
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600 font-semibold">0 Pending</span>
                      <span className="text-gray-500">To grade</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Today's Classes */}
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Today's Classes</h2>
              {classesInfo.length > 0 ? (
                <div className="space-y-4">
                  {classesInfo.map((classInfo, index) => (
                    <Link key={index} href="/dashboard/teacher/attendance">
                      <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 cursor-pointer">
                        <div>
                          <p className="font-bold text-gray-800 text-lg">{classInfo.name}</p>
                          <p className="text-sm text-gray-600">{classInfo.students} students</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">{classInfo.nextClass}</p>
                          <p className="text-xs text-gray-500">Next class</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-gray-600 text-lg mb-2">No classes scheduled yet</p>
                  <p className="text-gray-500 text-sm">Classes will appear here once they are created</p>
                </div>
              )}
            </div>

            {/* Activity Timeline */}
            <div className="mb-8">
              <ActivityTimeline
                activities={timelineActivities}
                maxItems={5}
                loading={loading}
                showViewAll={true}
                onViewAll={() => router.push('/dashboard/teacher/activities')}
              />
            </div>

            {/* Recent Activity */}
            <ActivityFeed userRole="teacher" maxItems={10} showFilters={true} />
          </div>
        </main>
      </div>
    </div>
  )
}
