"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"
import { 
  BarChart3, 
  FileText, 
  Users, 
  GraduationCap, 
  DollarSign,
  TrendingUp
} from "lucide-react"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default function ReportsPage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")

  const reports = [
    {
      title: "Attendance Analysis",
      description: "View detailed attendance statistics and trends",
      icon: BarChart3,
      href: "/dashboard/admin/attendance-analytics",
      color: "bg-blue-500"
    },
    {
      title: "Exam Results",
      description: "Analyze student performance and exam statistics",
      icon: FileText,
      href: "/dashboard/admin/reports/exam-results",
      color: "bg-green-500"
    },
    {
      title: "Teacher Performance",
      description: "Review teacher effectiveness and class management",
      icon: Users,
      href: "/dashboard/admin/reports/teacher-performance",
      color: "bg-purple-500"
    },
    {
      title: "Class Analysis",
      description: "Compare class performance and attendance",
      icon: GraduationCap,
      href: "/dashboard/admin/reports/class-analysis",
      color: "bg-orange-500"
    },
    {
      title: "Financial Report",
      description: "Track fee payments and financial overview",
      icon: DollarSign,
      href: "/dashboard/admin/reports/financial",
      color: "bg-emerald-500"
    },
    {
      title: "Academic Progress",
      description: "Monitor overall academic performance trends",
      icon: TrendingUp,
      href: "/dashboard/admin/reports/academic-progress",
      color: "bg-pink-500"
    }
  ]

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="admin" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Admin" userId={userId} />
        <main className="flex-1 p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive reports and insights for school management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => {
          const Icon = report.icon
          return (
            <Link key={report.href} href={report.href}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[#E31E24]">
                <div className="flex items-start gap-4">
                  <div className={`${report.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {report.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">📊 Report Features</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Export reports to PDF and Excel</li>
          <li>• Filter by date range, class, or student</li>
          <li>• Visual charts and graphs</li>
          <li>• Real-time data updates</li>
        </ul>
      </div>
        </main>
      </div>
    </div>
  )
}
