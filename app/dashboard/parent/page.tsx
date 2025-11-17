"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { BookOpen, TrendingUp, Calendar, Award, DollarSign, Bell, FileText } from "lucide-react"
import { Loader } from "@/components/ui/loader"
import EnhancedStatCard from "@/components/dashboard/enhanced-stat-card"
import DashboardGrid from "@/components/dashboard/dashboard-grid"
import QuickActions from "@/components/dashboard/quick-actions"
import ActivityTimeline, { generateSampleActivities } from "@/components/dashboard/activity-timeline"
import { StatCardsGridSkeleton } from "@/components/loading/stat-card-skeleton"

export default function ParentDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
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

      if (user.role !== "parent") {
        window.location.href = `/dashboard/${user.role}`
        return
      }

      setUserName(user.fullName || user.email.split("@")[0])
      setUserId(user.id || user.email)
      setIsAuthenticated(true)
      setLoading(false)
    } catch (error) {
      localStorage.removeItem("user")
      window.location.href = "/auth/login"
    }
  }, [])

  if (!isAuthenticated) {
    return <Loader size="lg" text="Loading Dashboard..." fullScreen />
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="parent" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Parent" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Child Info */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Student Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-2xl text-primary-foreground font-bold">AB</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Ama Boateng</p>
                    <p className="text-sm text-muted-foreground">Form 2A</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Overview */}
            {loading ? (
              <StatCardsGridSkeleton count={4} />
            ) : (
              <DashboardGrid columns={4} gap={6} className="mb-8">
                <EnhancedStatCard
                  title="Average Score"
                  value={84}
                  icon={<Award size={24} />}
                  gradient="blue"
                  suffix="%"
                  trend={{ value: 5, isPositive: true }}
                  onClick={() => router.push('/dashboard/parent/student-report')}
                />
                
                <EnhancedStatCard
                  title="Attendance"
                  value={96}
                  icon={<Calendar size={24} />}
                  gradient="green"
                  suffix="%"
                  trend={{ value: 2, isPositive: true }}
                />
                
                <EnhancedStatCard
                  title="Class Rank"
                  value="8/35"
                  icon={<TrendingUp size={24} />}
                  gradient="purple"
                />
                
                <EnhancedStatCard
                  title="Fee Status"
                  value="Paid"
                  icon={<DollarSign size={24} />}
                  gradient="orange"
                  onClick={() => router.push('/dashboard/parent/fee-status')}
                />
              </DashboardGrid>
            )}

            {/* Quick Actions */}
            <QuickActions
              title="Quick Actions"
              columns={3}
              className="mb-8"
              actions={[
                {
                  label: "Child's Progress",
                  icon: <TrendingUp size={20} />,
                  onClick: () => router.push('/dashboard/parent/student-report'),
                  color: 'primary'
                },
                {
                  label: "Fee Status",
                  icon: <DollarSign size={20} />,
                  onClick: () => router.push('/dashboard/parent/fee-status'),
                  color: 'success'
                },
                {
                  label: "Announcements",
                  icon: <Bell size={20} />,
                  onClick: () => router.push('/dashboard/parent/announcements'),
                  color: 'info'
                }
              ]}
            />

            {/* Activity Timeline */}
            <ActivityTimeline
              activities={timelineActivities}
              maxItems={5}
              loading={loading}
              showViewAll={true}
              onViewAll={() => router.push('/dashboard/parent/activities')}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
