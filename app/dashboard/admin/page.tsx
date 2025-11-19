"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import { Users, BookOpen, Calendar, TrendingUp, UserPlus, Bell, BarChart3, DollarSign, Settings, GraduationCap, UserCheck, AlertTriangle, FileText, School } from "lucide-react"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { Loader } from "@/components/ui/loader"
import { ActivityFeed as NotificationActivityFeed } from "@/components/notifications/activity-feed"
import { ActivityFeed } from "@/components/ui/activity-feed"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { ProgressBar } from "@/components/ui/progress-bar"
import EnhancedStatCard from "@/components/dashboard/enhanced-stat-card"
import DashboardGrid from "@/components/dashboard/dashboard-grid"
import QuickActions from "@/components/dashboard/quick-actions"
import ActivityTimeline, { generateSampleActivities } from "@/components/dashboard/activity-timeline"
import { StatCardsGridSkeleton } from "@/components/loading/stat-card-skeleton"

export default function AdminDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [counts, setCounts] = useState({
    students: 0,
    teachers: 0,
    parents: 0,
    classes: 0
  })
  const [analytics, setAnalytics] = useState({
    financialNet: 0,
    performanceAverage: 0,
    recentReports: 0
  })
  const [pendingCount, setPendingCount] = useState(0)
  const [pendingUsers, setPendingUsers] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [timelineActivities] = useState(generateSampleActivities())
  const [loading, setLoading] = useState(true)

  // Function to fetch dashboard data
  const fetchDashboardData = () => {
    // Fetch real counts from database
    fetch("/api/dashboard/stats")
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setCounts({
            students: data.data.students,
            teachers: data.data.teachers,
            parents: data.data.parents,
            classes: data.data.classes
          })
        }
      })
      .catch(error => {
        console.error("Error fetching dashboard stats:", error)
        setCounts({ students: 0, teachers: 0, parents: 0, classes: 0 })
      })

    // Fetch analytics data
    fetch("/api/dashboard/analytics")
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setAnalytics({
            financialNet: data.data.financialNet || 0,
            performanceAverage: data.data.performanceAverage || 0,
            recentReports: data.data.recentReports || 0
          })
        }
      })
      .catch(error => {
        console.error("Error fetching analytics:", error)
        setAnalytics({ financialNet: 0, performanceAverage: 0, recentReports: 0 })
      })

    // Fetch pending registrations
    fetch("/api/admin/pending-users")
      .then(response => response.json())
      .then(data => {
        if (data.success || data.users) {
          const users = data.users || []
          setPendingCount(users.length)
          setPendingUsers(users.slice(0, 3)) // Get first 3 for preview
        }
      })
      .catch(error => {
        console.error("Error fetching pending users:", error)
        setPendingCount(0)
        setPendingUsers([])
      })
  }

  useEffect(() => {
    const userString = localStorage.getItem("user")

    if (!userString) {
      console.log("[v0] No user found, redirecting to login")
      window.location.href = "/auth/login"
      return
    }

    try {
      const user = JSON.parse(userString)

      // Verify user has required fields
      if (!user.email || !user.role) {
        console.log("[v0] Invalid user data, redirecting to login")
        localStorage.removeItem("user")
        window.location.href = "/auth/login"
        return
      }

      // Check if user is admin
      if (user.role !== "admin") {
        console.log("[v0] User is not admin, redirecting to their dashboard")
        window.location.href = `/dashboard/${user.role}`
        return
      }

      setUserName(user.fullName || user.email.split("@")[0])
      setUserId(user.id || user.email)
      setIsAuthenticated(true)
      setLoading(false)
      
      // Initial data fetch
      fetchDashboardData()

      // Auto-refresh every 30 seconds
      const refreshInterval = setInterval(() => {
        fetchDashboardData()
      }, 30000) // 30 seconds

      // Set sample activities
      setActivities([
        {
          id: '1',
          title: 'New Student Registered',
          description: 'John Doe has registered for Grade 10',
          time: '2 hours ago',
          icon: UserPlus,
          color: 'green' as const,
          onClick: () => router.push('/dashboard/admin/students')
        },
        {
          id: '2',
          title: 'Fee Payment Received',
          description: 'Payment of GH₵ 500 from Sarah Wilson',
          time: '4 hours ago',
          icon: DollarSign,
          color: 'blue' as const,
          onClick: () => router.push('/dashboard/admin/finance')
        },
        {
          id: '3',
          title: 'New Announcement Posted',
          description: 'Mid-term exam schedule published',
          time: '6 hours ago',
          icon: Bell,
          color: 'purple' as const,
          onClick: () => router.push('/dashboard/admin/announcements')
        },
        {
          id: '4',
          title: 'Teacher Report Submitted',
          description: 'Monthly performance report by Mr. Smith',
          time: '1 day ago',
          icon: FileText,
          color: 'orange' as const,
          onClick: () => router.push('/dashboard/admin/reports')
        },
      ])

      // Cleanup interval on unmount
      return () => clearInterval(refreshInterval)
    } catch (error) {
      console.log("[v0] Error parsing user data:", error)
      localStorage.removeItem("user")
      window.location.href = "/auth/login"
    }
  }, [router])

  // Show loading state while authenticating
  if (!isAuthenticated) {
    return <Loader size="lg" text="Loading Dashboard..." fullScreen />
  }

  const stats = [
    {
      label: "Total Students",
      value: counts.students.toString(),
      icon: Users,
      color: "bg-primary",
    },
    {
      label: "Total Teachers",
      value: counts.teachers.toString(),
      icon: BookOpen,
      color: "bg-secondary",
    },
    {
      label: "Active Classes",
      value: counts.classes.toString(),
      icon: Calendar,
      color: "bg-accent",
    },
    {
      label: "Average Score",
      value: analytics.performanceAverage > 0 ? `${analytics.performanceAverage.toFixed(1)}%` : "0%",
      icon: TrendingUp,
      color: "bg-chart-1",
    },
  ]

  // Calculate total for visual representation
  const total = counts.students + counts.teachers + counts.parents + counts.classes
  
  const statCards = [
    { 
      label: "TOTAL STUDENTS", 
      value: counts.students, 
      icon: "👨‍🎓", 
      bgColor: "bg-blue-500",
      progressColor: "bg-blue-500",
      percentage: total > 0 ? (counts.students / total) * 100 : 0,
      href: "/dashboard/admin/students" 
    },
    { 
      label: "TOTAL TEACHERS", 
      value: counts.teachers, 
      icon: "👨‍🏫", 
      bgColor: "bg-green-500",
      progressColor: "bg-green-500",
      percentage: total > 0 ? (counts.teachers / total) * 100 : 0,
      href: "/dashboard/admin/teachers" 
    },
    { 
      label: "TOTAL PARENTS", 
      value: counts.parents, 
      icon: "👨‍👩‍👧", 
      bgColor: "bg-purple-500",
      progressColor: "bg-purple-500",
      percentage: total > 0 ? (counts.parents / total) * 100 : 0,
      href: "/dashboard/admin/parents"
    },
    { 
      label: "TOTAL CLASSES", 
      value: counts.classes, 
      icon: "🏫", 
      bgColor: "bg-yellow-500",
      progressColor: "bg-yellow-500",
      percentage: total > 0 ? (counts.classes / total) * 100 : 0,
      href: "/dashboard/admin/classes" 
    },
  ]

  const quickActions = [
    { label: "Add Student", icon: "➕👨‍🎓", href: "/dashboard/admin/students" },
    { label: "Add Teacher", icon: "➕👨‍🏫", href: "/dashboard/admin/teachers" },
    { label: "Manage Classes", icon: "🏫", href: "/dashboard/admin/classes" },
    { label: "View Reports", icon: "📊", href: "/dashboard/admin/reports" },
  ]

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar userRole="admin" />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Simple Header */}
            <div className="bg-gradient-to-r from-[#E31E24] to-[#C41E3A] rounded-2xl p-6 mb-6 shadow-lg relative">
              <div className="absolute top-4 right-4">
                <NotificationBell userId={userId} userRole="admin" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Welcome back, Administrator
              </h1>
              <p className="text-white/90">Here's your school overview</p>
            </div>

            {/* Simple Stats Cards */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Link href="/dashboard/admin/students">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-white/90 font-medium">Students</p>
                      <div className="bg-white/20 p-2 rounded-lg">
                        <GraduationCap className="text-white" size={24} />
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-white">{counts.students}</p>
                    <p className="text-xs text-white/80 mt-2">Total enrolled</p>
                  </div>
                </Link>

                <Link href="/dashboard/admin/teachers">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-white/90 font-medium">Teachers</p>
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Users className="text-white" size={24} />
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-white">{counts.teachers}</p>
                    <p className="text-xs text-white/80 mt-2">Active staff</p>
                  </div>
                </Link>

                <Link href="/dashboard/admin/parents">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-white/90 font-medium">Parents</p>
                      <div className="bg-white/20 p-2 rounded-lg">
                        <UserCheck className="text-white" size={24} />
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-white">{counts.parents}</p>
                    <p className="text-xs text-white/80 mt-2">Registered</p>
                  </div>
                </Link>

                <Link href="/dashboard/admin/classes">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-white/90 font-medium">Classes</p>
                      <div className="bg-white/20 p-2 rounded-lg">
                        <BookOpen className="text-white" size={24} />
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-white">{counts.classes}</p>
                    <p className="text-xs text-white/80 mt-2">Active classes</p>
                  </div>
                </Link>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-md mb-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => router.push('/dashboard/admin/students/add')}
                  className="flex flex-col items-center justify-center p-5 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all transform hover:scale-105 border border-blue-200"
                >
                  <div className="bg-blue-500 p-3 rounded-full mb-2">
                    <UserPlus className="text-white" size={20} />
                  </div>
                  <span className="text-sm font-semibold text-blue-900">Add Student</span>
                </button>

                <button
                  onClick={() => router.push('/dashboard/admin/teachers/add')}
                  className="flex flex-col items-center justify-center p-5 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all transform hover:scale-105 border border-green-200"
                >
                  <div className="bg-green-500 p-3 rounded-full mb-2">
                    <GraduationCap className="text-white" size={20} />
                  </div>
                  <span className="text-sm font-semibold text-green-900">Add Teacher</span>
                </button>

                <button
                  onClick={() => router.push('/dashboard/admin/classes/add')}
                  className="flex flex-col items-center justify-center p-5 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all transform hover:scale-105 border border-purple-200"
                >
                  <div className="bg-purple-500 p-3 rounded-full mb-2">
                    <School className="text-white" size={20} />
                  </div>
                  <span className="text-sm font-semibold text-purple-900">Create Class</span>
                </button>

                <button
                  onClick={() => router.push('/dashboard/admin/announcements/create')}
                  className="flex flex-col items-center justify-center p-5 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-xl transition-all transform hover:scale-105 border border-orange-200"
                >
                  <div className="bg-orange-500 p-3 rounded-full mb-2">
                    <Bell className="text-white" size={20} />
                  </div>
                  <span className="text-sm font-semibold text-orange-900">Announcement</span>
                </button>
              </div>
            </div>

            {/* Pending Registrations Alert */}
            {pendingCount > 0 && (
              <Link href="/dashboard/admin/pending-registrations">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-5 shadow-md hover:shadow-lg transition-all mb-6 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="text-white" size={32} />
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {pendingCount} Pending Registration{pendingCount !== 1 ? 's' : ''}
                        </h3>
                        <p className="text-white/90 text-sm">Click to review and approve</p>
                      </div>
                    </div>
                    <div className="hidden md:block bg-white/20 px-4 py-2 rounded-lg">
                      <span className="text-white font-medium text-sm">Review →</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-5 shadow-md border border-cyan-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">👥</span>
                  <p className="text-sm text-cyan-700 font-medium">Student-Teacher Ratio</p>
                </div>
                <p className="text-3xl font-bold text-cyan-900">
                  {counts.teachers > 0 ? Math.round(counts.students / counts.teachers) : 0}:1
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-5 shadow-md border border-pink-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📚</span>
                  <p className="text-sm text-pink-700 font-medium">Avg Class Size</p>
                </div>
                <p className="text-3xl font-bold text-pink-900">
                  {counts.classes > 0 ? Math.round(counts.students / counts.classes) : 0}
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-5 shadow-md border border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🌐</span>
                  <p className="text-sm text-indigo-700 font-medium">Total Users</p>
                </div>
                <p className="text-3xl font-bold text-indigo-900">
                  {counts.students + counts.teachers + counts.parents}
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 shadow-md border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📈</span>
                  <p className="text-sm text-emerald-700 font-medium">Performance Avg</p>
                </div>
                <p className="text-3xl font-bold text-emerald-900">
                  {analytics.performanceAverage > 0 ? `${analytics.performanceAverage.toFixed(1)}%` : '0%'}
                </p>
              </div>
            </div>

            {/* Management Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Link href="/dashboard/admin/finance">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <DollarSign className="text-white" size={28} />
                    </div>
                    <h3 className="font-bold text-white text-lg">Finance</h3>
                  </div>
                  <p className="text-sm text-white/90">Manage income, expenses & budgets</p>
                  <div className="mt-3 text-xs text-white/80">→ View Details</div>
                </div>
              </Link>

              <Link href="/dashboard/admin/attendance">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <UserCheck className="text-white" size={28} />
                    </div>
                    <h3 className="font-bold text-white text-lg">Attendance</h3>
                  </div>
                  <p className="text-sm text-white/90">Track student & teacher attendance</p>
                  <div className="mt-3 text-xs text-white/80">→ View Details</div>
                </div>
              </Link>

              <Link href="/dashboard/admin/reports">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <BarChart3 className="text-white" size={28} />
                    </div>
                    <h3 className="font-bold text-white text-lg">Reports</h3>
                  </div>
                  <p className="text-sm text-white/90">View analytics & generate reports</p>
                  <div className="mt-3 text-xs text-white/80">→ View Details</div>
                </div>
              </Link>
            </div>

            {/* Recent Activity */}
            <NotificationActivityFeed userRole="admin" maxItems={10} showFilters={true} />
          </div>
        </main>
      </div>
    </div>
  )
}
