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
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-400 rounded-3xl p-8 mb-8 shadow-xl relative">
              <div className="absolute top-6 right-6">
                <NotificationBell userId={userId} userRole="admin" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, <span className="text-yellow-200">Administrator</span>
              </h1>
              <p className="text-white/90 text-lg">Here's what's happening in your school today ✨</p>
            </div>

            {/* Enhanced Stats Cards */}
            {loading ? (
              <StatCardsGridSkeleton count={4} />
            ) : (
              <DashboardGrid columns={4} gap={6} className="mb-8">
                <EnhancedStatCard
                  title="Total Students"
                  value={counts.students}
                  icon={<GraduationCap size={24} />}
                  gradient="blue"
                  trend={{ value: 12, isPositive: true }}
                  onClick={() => router.push('/dashboard/admin/students')}
                />
                
                <EnhancedStatCard
                  title="Total Teachers"
                  value={counts.teachers}
                  icon={<Users size={24} />}
                  gradient="green"
                  trend={{ value: 5, isPositive: true }}
                  onClick={() => router.push('/dashboard/admin/teachers')}
                />
                
                <EnhancedStatCard
                  title="Total Parents"
                  value={counts.parents}
                  icon={<UserCheck size={24} />}
                  gradient="purple"
                  trend={{ value: 8, isPositive: true }}
                  onClick={() => router.push('/dashboard/admin/parents')}
                />
                
                <EnhancedStatCard
                  title="Pending Registrations"
                  value={pendingCount}
                  icon={<AlertTriangle size={24} />}
                  gradient="orange"
                  onClick={() => router.push('/dashboard/admin/pending-registrations')}
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
                  label: "Add Student",
                  icon: <UserPlus size={20} />,
                  onClick: () => router.push('/dashboard/admin/students/add'),
                  color: 'primary'
                },
                {
                  label: "Add Teacher",
                  icon: <GraduationCap size={20} />,
                  onClick: () => router.push('/dashboard/admin/teachers/add'),
                  color: 'success'
                },
                {
                  label: "Create Class",
                  icon: <School size={20} />,
                  onClick: () => router.push('/dashboard/admin/classes/add'),
                  color: 'info'
                },
                {
                  label: "View Reports",
                  icon: <BarChart3 size={20} />,
                  onClick: () => router.push('/dashboard/admin/reports'),
                  color: 'secondary'
                }
              ]}
            />

            {/* Pending Registrations Alert */}
            {pendingCount > 0 && (
              <Link href="/dashboard/admin/pending-registrations">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all mb-8 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl group-hover:scale-110 transition-transform">
                        <span className="text-4xl">⏳</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {pendingCount} Pending Registration{pendingCount !== 1 ? 's' : ''}
                        </h3>
                        <p className="text-white/90">
                          {pendingCount === 1 ? 'A new user is' : 'New users are'} waiting for your approval
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl group-hover:bg-white/30 transition-all">
                      <span className="text-white font-semibold">Review Now</span>
                      <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Preview of pending users */}
                  {pendingUsers.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="flex items-center gap-3 flex-wrap">
                        {pendingUsers.map((user, index) => (
                          <div key={user.id} className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                            <span className="text-white/90 text-sm font-medium">{user.fullName}</span>
                            <span className="text-white/70 text-xs">({user.role})</span>
                          </div>
                        ))}
                        {pendingCount > 3 && (
                          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                            <span className="text-white/90 text-sm font-medium">+{pendingCount - 3} more</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            )}

            {/* Overview Chart */}
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">School Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* User Distribution Chart */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">User Distribution</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                          Students
                        </span>
                        <span className="text-sm font-bold text-gray-800">{counts.students}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(counts.students / (counts.students + counts.teachers + counts.parents + 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                          Teachers
                        </span>
                        <span className="text-sm font-bold text-gray-800">{counts.teachers}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(counts.teachers / (counts.students + counts.teachers + counts.parents + 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                          Parents
                        </span>
                        <span className="text-sm font-bold text-gray-800">{counts.parents}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(counts.parents / (counts.students + counts.teachers + counts.parents + 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                      <p className="text-xs text-blue-600 font-semibold mb-1">Student-Teacher Ratio</p>
                      <p className="text-3xl font-bold text-blue-700">
                        {counts.teachers > 0 ? Math.round(counts.students / counts.teachers) : 0}:1
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                      <p className="text-xs text-green-600 font-semibold mb-1">Avg Class Size</p>
                      <p className="text-3xl font-bold text-green-700">
                        {counts.classes > 0 ? Math.round(counts.students / counts.classes) : 0}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                      <p className="text-xs text-purple-600 font-semibold mb-1">Total Users</p>
                      <p className="text-3xl font-bold text-purple-700">
                        {counts.students + counts.teachers + counts.parents}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
                      <p className="text-xs text-yellow-600 font-semibold mb-1">Active Classes</p>
                      <p className="text-3xl font-bold text-yellow-700">{counts.classes}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Grid with Overview and Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Overview Stats - 2 columns */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EnhancedCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Active Classes</h3>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <AnimatedNumber value={counts.classes} className="text-3xl font-bold text-gray-900" />
                    <p className="text-sm text-gray-600 mt-2">Currently running</p>
                    <ProgressBar value={75} className="mt-3" color="blue" />
                  </EnhancedCard>

                  <EnhancedCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Student-Teacher Ratio</h3>
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {counts.teachers > 0 ? Math.round(counts.students / counts.teachers) : 0}:1
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Students per teacher</p>
                    <ProgressBar value={60} className="mt-3" color="green" />
                  </EnhancedCard>

                  <EnhancedCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Financial Net</h3>
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-yellow-600" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      GH₵ <AnimatedNumber value={analytics.financialNet} />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">This month</p>
                    <ProgressBar value={85} className="mt-3" color="yellow" />
                  </EnhancedCard>

                  <EnhancedCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Performance Average</h3>
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-purple-600">
                      {analytics.performanceAverage > 0 ? `${analytics.performanceAverage.toFixed(1)}%` : '0%'}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">School-wide average</p>
                    <ProgressBar value={analytics.performanceAverage} className="mt-3" color="purple" />
                  </EnhancedCard>
                </div>
              </div>

              {/* Activity Feed - 1 column */}
              <div>
                <ActivityFeed
                  activities={activities}
                  title="Recent Activities"
                  emptyMessage="No recent activities to show"
                />
              </div>
            </div>

            {/* Analytics & Reports */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics & Reports</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/dashboard/admin/financial-reports">
                  <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover-lift border border-gray-100 cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-green-100 p-4 rounded-xl group-hover:scale-110 transition-transform">
                        <span className="text-4xl">💰</span>
                      </div>
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        Financial
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Financial Reports</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Track income, expenses, and financial health
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600 font-semibold">
                        ₵{analytics.financialNet.toLocaleString()} Net
                      </span>
                      <span className="text-gray-500">This month</span>
                    </div>
                  </div>
                </Link>

                <Link href="/dashboard/admin/performance-analysis">
                  <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover-lift border border-gray-100 cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-blue-100 p-4 rounded-xl group-hover:scale-110 transition-transform">
                        <span className="text-4xl">📊</span>
                      </div>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        Academic
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Performance Analysis</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Student rankings, grades, and trends
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-600 font-semibold">
                        {analytics.performanceAverage > 0 ? `${analytics.performanceAverage.toFixed(1)}% Average` : 'No data'}
                      </span>
                      <span className="text-gray-500">School-wide</span>
                    </div>
                  </div>
                </Link>

                <Link href="/dashboard/admin/reports">
                  <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover-lift border border-gray-100 cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-purple-100 p-4 rounded-xl group-hover:scale-110 transition-transform">
                        <span className="text-4xl">📄</span>
                      </div>
                      <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                        Reports
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">All Reports</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Generate and download comprehensive reports
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-600 font-semibold">
                        {analytics.recentReports} Recent
                      </span>
                      <span className="text-gray-500">Available</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="mb-8">
              <ActivityTimeline
                activities={timelineActivities}
                maxItems={5}
                loading={loading}
                showViewAll={true}
                onViewAll={() => router.push('/dashboard/admin/activities')}
              />
            </div>

            {/* System Activity Log */}
            <NotificationActivityFeed userRole="admin" maxItems={10} />
          </div>
        </main>
      </div>
    </div>
  )
}
