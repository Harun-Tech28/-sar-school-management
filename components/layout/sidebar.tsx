"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Clock,
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
  ChevronRight,
  Menu,
  X
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const getMenuItems = (): MenuItem[] => {
    if (userRole === "admin") {
      return [
        {
          label: "Dashboard",
          href: `/dashboard/${userRole}`,
          icon: LayoutDashboard,
        },
        {
          label: "Announcements",
          icon: Bell,
          subItems: [
            {
              label: "View All",
              href: `/dashboard/${userRole}/announcements`,
              icon: Bell,
            },
            {
              label: "Create New",
              href: `/dashboard/${userRole}/announcements/create`,
              icon: Bell,
            },
          ]
        },
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
            {
              label: "Pending Registrations",
              href: `/dashboard/${userRole}/pending-registrations`,
              icon: ClipboardCheck,
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
              label: "Timetable",
              href: `/dashboard/${userRole}/timetable`,
              icon: Clock,
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
          icon: FileText,
          subItems: [
            {
              label: "All Reports",
              href: `/dashboard/${userRole}/reports`,
              icon: FileText,
            },
            {
              label: "Report Cases",
              href: `/dashboard/${userRole}/report-cases`,
              icon: AlertTriangle,
            },
          ]
        },
        {
          label: "Settings",
          icon: Settings,
          subItems: [
            {
              label: "General",
              href: `/dashboard/${userRole}/settings`,
              icon: Settings,
            },
          ]
        },
      ]
    } else if (userRole === "teacher") {
      return [
        {
          label: "Dashboard",
          href: `/dashboard/${userRole}`,
          icon: LayoutDashboard,
        },
        {
          label: "Announcements",
          icon: Bell,
          subItems: [
            {
              label: "View All",
              href: `/dashboard/${userRole}/announcements`,
              icon: Bell,
            },
          ]
        },
        {
          label: "My Classes",
          icon: BookOpen,
          subItems: [
            {
              label: "View Classes",
              href: `/dashboard/${userRole}/classes`,
              icon: BookOpen,
            },
          ]
        },
        {
          label: "My Students",
          icon: GraduationCap,
          subItems: [
            {
              label: "View Students",
              href: `/dashboard/${userRole}/students`,
              icon: GraduationCap,
            },
          ]
        },
        {
          label: "Attendance",
          icon: Calendar,
          subItems: [
            {
              label: "Mark Attendance",
              href: `/dashboard/${userRole}/attendance`,
              icon: Calendar,
            },
          ]
        },
        {
          label: "Grades",
          icon: BarChart3,
          subItems: [
            {
              label: "Manage Grades",
              href: `/dashboard/${userRole}/grades`,
              icon: BarChart3,
            },
            {
              label: "Performance Analysis",
              href: `/dashboard/${userRole}/performance-analysis`,
              icon: BarChart3,
            },
          ]
        },
        {
          label: "Homework",
          icon: BookOpen,
          subItems: [
            {
              label: "View Homework",
              href: `/dashboard/${userRole}/homework`,
              icon: BookOpen,
            },
          ]
        },
        {
          label: "Timetable",
          icon: Clock,
          subItems: [
            {
              label: "My Schedule",
              href: `/dashboard/${userRole}/timetable`,
              icon: Clock,
            },
          ]
        },
        {
          label: "Report Issue",
          icon: AlertTriangle,
          subItems: [
            {
              label: "View Cases",
              href: `/dashboard/${userRole}/report-cases`,
              icon: AlertTriangle,
            },
          ]
        },
      ]
    } else if (userRole === "student") {
      return [
        {
          label: "Dashboard",
          href: `/dashboard/${userRole}`,
          icon: LayoutDashboard,
        },
        {
          label: "Announcements",
          icon: Bell,
          subItems: [
            {
              label: "View All",
              href: `/dashboard/${userRole}/announcements`,
              icon: Bell,
            },
          ]
        },
        {
          label: "My Grades",
          icon: BarChart3,
          subItems: [
            {
              label: "View Grades",
              href: `/dashboard/${userRole}/grades`,
              icon: BarChart3,
            },
          ]
        },
        {
          label: "Attendance",
          icon: Calendar,
          subItems: [
            {
              label: "View Attendance",
              href: `/dashboard/${userRole}/attendance`,
              icon: Calendar,
            },
          ]
        },
        {
          label: "Homework",
          icon: BookOpen,
          subItems: [
            {
              label: "View Homework",
              href: `/dashboard/${userRole}/homework`,
              icon: BookOpen,
            },
          ]
        },
        {
          label: "Timetable",
          icon: Calendar,
          subItems: [
            {
              label: "View Timetable",
              href: `/dashboard/${userRole}/timetable`,
              icon: Calendar,
            },
          ]
        },
        {
          label: "Report Issue",
          icon: AlertTriangle,
          subItems: [
            {
              label: "View Cases",
              href: `/dashboard/${userRole}/report-cases`,
              icon: AlertTriangle,
            },
          ]
        },
      ]
    } else {
      // Parent
      return [
        {
          label: "Dashboard",
          href: `/dashboard/${userRole}`,
          icon: LayoutDashboard,
        },
        {
          label: "Announcements",
          icon: Bell,
          subItems: [
            {
              label: "View All",
              href: `/dashboard/${userRole}/announcements`,
              icon: Bell,
            },
          ]
        },
        {
          label: "Performance",
          icon: BarChart3,
          subItems: [
            {
              label: "View Performance",
              href: `/dashboard/${userRole}/performance`,
              icon: BarChart3,
            },
            {
              label: "Student Report",
              href: `/dashboard/${userRole}/student-report`,
              icon: BarChart3,
            },
          ]
        },
        {
          label: "Attendance",
          icon: Calendar,
          subItems: [
            {
              label: "View Attendance",
              href: `/dashboard/${userRole}/attendance`,
              icon: Calendar,
            },
          ]
        },
        {
          label: "Homework",
          icon: BookOpen,
          subItems: [
            {
              label: "View Homework",
              href: `/dashboard/${userRole}/homework`,
              icon: BookOpen,
            },
          ]
        },
        {
          label: "Report Issue",
          icon: AlertTriangle,
          subItems: [
            {
              label: "View Cases",
              href: `/dashboard/${userRole}/report-cases`,
              icon: AlertTriangle,
            },
          ]
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
                    onClick={closeMobileMenu}
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
        onClick={closeMobileMenu}
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
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg shadow-lg"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-primary min-h-screen flex flex-col shadow-xl
        fixed lg:static top-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <button
          onClick={closeMobileMenu}
          className="lg:hidden absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>

        {/* Logo & Title */}
        <div className="p-6">
          <h1 className="font-bold text-white text-2xl mb-1">SAR School</h1>
          <p className="text-white/80 text-sm">{getRoleLabel()}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => (
            <div key={item.label || index} onClick={item.href ? closeMobileMenu : undefined}>
              {renderMenuItem(item, index)}
            </div>
          ))}
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
    </>
  )
}
