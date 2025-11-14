"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut, 
  GraduationCap,
  CalendarDays,
  ClipboardCheck,
  DollarSign,
  FileText,
  BookOpen,
  FileCheck,
  UserCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronRight
} from "lucide-react"

interface MenuItem {
  label: string
  href?: string
  icon: any
  subItems?: MenuItem[]
}

interface SidebarProps {
  userRole: "admin" | "teacher" | "parent" | "student"
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }

  const getMenuItems = (): MenuItem[] => {
    const baseItems: MenuItem[] = [
      {
        label: "Dashboard",
        href: `/dashboard/${userRole}`,
        icon: LayoutDashboard,
      },
      {
        label: "Announcements",
        href: `/dashboard/${userRole}/announcements`,
        icon: Bell,
      },
    ]

    if (userRole === "admin") {
      return [
        ...baseItems,
        {
          label: "User Management",
          icon: Users,
          subItems: [
            {
              label: "All Users",
              href: `/dashboard/${userRole}/users`,
              icon: Users,
            },
            {
              label: "Students",
              href: `/dashboard/${userRole}/students`,
              icon: GraduationCap,
            },
            {
              label: "Parents",
              href: `/dashboard/${userRole}/parents`,
              icon: UserCircle2,
            },
            {
              label: "Teachers",
              href: `/dashboard/${userRole}/teachers`,
              icon: Users,
            },
          ]
        },
        {
          label: "Academic",
          icon: BookOpen,
          subItems: [
            {
              label: "Classes",
              href: `/dashboard/${userRole}/classes`,
              icon: BookOpen,
            },
            {
              label: "Calendar",
              href: `/dashboard/${userRole}/academic-calendar`,
              icon: CalendarDays,
            },
            {
              label: "Attendance",
              href: `/dashboard/${userRole}/attendance-analytics`,
              icon: ClipboardCheck,
            },
            {
              label: "Exams",
              href: `/dashboard/${userRole}/exams`,
              icon: FileCheck,
            },
          ]
        },
        {
          label: "Finance",
          icon: DollarSign,
          subItems: [
            {
              label: "Overview",
              href: `/dashboard/${userRole}/finance`,
              icon: DollarSign,
            },
            {
              label: "Fee Management",
              href: `/dashboard/${userRole}/fee-management`,
              icon: DollarSign,
            },
          ]
        },
        {
          label: "Reports",
          href: `/dashboard/${userRole}/reports`,
          icon: FileText,
        },
        {
          label: "Report Cases",
          href: `/dashboard/${userRole}/report-cases`,
          icon: AlertTriangle,
        },
        {
          label: "Settings",
          href: `/dashboard/${userRole}/settings`,
          icon: Settings,
        },
      ]
    } else if (userRole === "teacher") {
      return [
        ...baseItems,
        {
          label: "Attendance",
          href: `/dashboard/${userRole}/attendance`,
          icon: Calendar,
        },
        {
          label: "Grades",
          href: `/dashboard/${userRole}/grades`,
          icon: BarChart3,
        },
        {
          label: "Performance Analysis",
          href: `/dashboard/${userRole}/performance-analysis`,
          icon: BarChart3,
        },
        {
          label: "Homework",
          href: `/dashboard/${userRole}/homework`,
          icon: BookOpen,
        },
        {
          label: "Report Issue",
          href: `/dashboard/${userRole}/report-cases`,
          icon: AlertTriangle,
        },
      ]
    } else if (userRole === "student") {
      return [
        ...baseItems,
        {
          label: "My Grades",
          href: `/dashboard/${userRole}/grades`,
          icon: BarChart3,
        },
        {
          label: "Attendance",
          href: `/dashboard/${userRole}/attendance`,
          icon: Calendar,
        },
        {
          label: "Homework",
          href: `/dashboard/${userRole}/homework`,
          icon: BookOpen,
        },
        {
          label: "Timetable",
          href: `/dashboard/${userRole}/timetable`,
          icon: Calendar,
        },
        {
          label: "Report Issue",
          href: `/dashboard/${userRole}/report-cases`,
          icon: AlertTriangle,
        },
      ]
    } else {
      // Parent
      return [
        ...baseItems,
        {
          label: "Performance",
          href: `/dashboard/${userRole}/performance`,
          icon: BarChart3,
        },
        {
          label: "Attendance",
          href: `/dashboard/${userRole}/attendance`,
          icon: Calendar,
        },
        {
          label: "Student Report",
          href: `/dashboard/${userRole}/student-report`,
          icon: BarChart3,
        },
        {
          label: "Homework",
          href: `/dashboard/${userRole}/homework`,
          icon: BookOpen,
        },
        {
          label: "Report Issue",
          href: `/dashboard/${userRole}/report-cases`,
          icon: AlertTriangle,
        },
      ]
    }
  }

  const menuItems = getMenuItems()

  const getRoleLabel = () => {
    switch (userRole) {
      case "admin": return "Admin Portal"
      case "teacher": return "Teacher Portal"
      case "parent": return "Parent Portal"
      case "student": return "Student Portal"
    }
  }

  const renderMenuItem = (item: MenuItem, index: number) => {
    const Icon = item.icon
    const isExpanded = expandedMenus.includes(item.label)
    const hasSubItems = item.subItems && item.subItems.length > 0
    const isActive = pathname === item.href
    const isOverview = index === 0

    // Check if any sub-item is active
    const hasActiveSubItem = hasSubItems && item.subItems?.some(subItem => pathname === subItem.href)

    if (hasSubItems) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleMenu(item.label)}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              hasActiveSubItem
                ? "bg-white/10 text-white font-medium"
                : "text-white/90 hover:bg-white/20 hover:text-white hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon size={20} />
              <span>{item.label}</span>
            </div>
            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {item.subItems?.map((subItem) => {
                const SubIcon = subItem.icon
                const isSubActive = pathname === subItem.href
                
                return (
                  <Link
                    key={subItem.href}
                    href={subItem.href!}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isSubActive
                        ? "bg-white/10 text-white font-medium"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <SubIcon size={18} />
                    <span className="text-sm">{subItem.label}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.href}
        href={item.href!}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive && isOverview
            ? "bg-secondary text-foreground font-semibold shadow-lg transform scale-105"
            : isActive
            ? "bg-white/10 text-white font-medium"
            : "text-white/90 hover:bg-white/20 hover:text-white hover:shadow-md hover:translate-x-1"
        }`}
      >
        <Icon size={20} className="transition-transform duration-200 group-hover:scale-110" />
        <span>{item.label}</span>
      </Link>
    )
  }

  return (
    <aside className="w-64 bg-primary min-h-screen flex flex-col shadow-xl">
      {/* Logo & Title */}
      <div className="p-6">
        <h1 className="font-bold text-white text-2xl mb-1">SAR School</h1>
        <p className="text-white/80 text-sm">{getRoleLabel()}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => renderMenuItem(item, index))}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => {
            localStorage.removeItem("user")
            window.location.href = "/"
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/90 hover:bg-red-500/20 hover:text-white hover:shadow-md hover:translate-x-1 transition-all duration-200"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
