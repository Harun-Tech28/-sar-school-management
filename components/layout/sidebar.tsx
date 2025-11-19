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
          label: "Pending Approvals",
          href: `/dashboard/${userRole}/pending-registrations`,
          icon: ClipboardCheck,
        },
        {
          label: "Announcements",
          href: `/dashboard/${userRole}/announcements`,
          icon: Bell,
        },
        {
          label: "People",
          icon: Users,
          subItems: [
            {
              label: "Students",
              href: `/dashboard/${userRole}/students`,
              icon: GraduationCap,
            },
            {
              label: "Teachers",
              href: `/dashboard/${userRole}/teachers`,
              icon: Users,
            },
            {
              label: "Parents",
              href: `/dashboard/${userRole}/parents`,
              icon: UserCircle2,
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
              label: "Homework",
              href: `/dashboard/${userRole}/homework`,
              icon: BookOpen,
            },
            {
              label: "Attendance",
              href: `/dashboard/${userRole}/attendance-analytics`,
              icon: ClipboardCheck,
            },
            {
              label: "Academic Calendar",
              href: `/dashboard/${userRole}/academic-calendar`,
              icon: CalendarDays,
            },
          ]
        },
        {
          label: "Exams & Grades",
          icon: FileCheck,
          subItems: [
            {
              label: "Exams",
              href: `/dashboard/${userRole}/exams`,
              icon: FileCheck,
            },
            {
              label: "Report Cards",
              href: `/dashboard/${userRole}/report-cards`,
              icon: FileText,
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
            {
              label: "Income",
              href: `/dashboard/${userRole}/finance/income`,
              icon: DollarSign,
            },
            {
              label: "Expenses",
              href: `/dashboard/${userRole}/finance/expenses`,
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
              label: "Academic Progress",
              href: `/dashboard/${userRole}/reports/academic-progress`,
              icon: BarChart3,
            },
            {
              label: "Financial Reports",
              href: `/dashboard/${userRole}/reports/financial`,
              icon: DollarSign,
            },
          ]
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
        {
          label: "My Classes",
          href: `/dashboard/${userRole}/classes`,
          icon: BookOpen,
        },
        {
          label: "My Students",
          href: `/dashboard/${userRole}/students`,
          icon: GraduationCap,
        },
        {
          label: "Teaching",
          icon: ClipboardCheck,
          subItems: [
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
              label: "Grades",
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
          label: "My Schedule",
          href: `/dashboard/${userRole}/timetable`,
          icon: Clock,
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
    } else if (userRole === "student") {
      return [
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
        {
          label: "My Learning",
          icon: BookOpen,
          subItems: [
            {
              label: "Homework",
              href: `/dashboard/${userRole}/homework`,
              icon: BookOpen,
            },
            {
              label: "Grades",
              href: `/dashboard/${userRole}/grades`,
              icon: BarChart3,
            },
            {
              label: "Attendance",
              href: `/dashboard/${userRole}/attendance`,
              icon: Calendar,
            },
            {
              label: "Timetable",
              href: `/dashboard/${userRole}/timetable`,
              icon: Clock,
            },
          ]
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
    } else {
      // Parent
      return [
        {
          label: "Dashboard",
          href: `/dashboard/${userRole}`,
          icon: LayoutDashboard,
        },
        {
          label: "My Children",
          href: `/dashboard/${userRole}/children`,
          icon: Users,
        },
        {
          label: "Announcements",
          href: `/dashboard/${userRole}/announcements`,
          icon: Bell,
        },
        {
          label: "Child's Progress",
          icon: BarChart3,
          subItems: [
            {
              label: "Performance",
              href: `/dashboard/${userRole}/performance`,
              icon: BarChart3,
            },
            {
              label: "Student Report",
              href: `/dashboard/${userRole}/student-report`,
              icon: FileText,
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
          ]
        },
        {
          label: "Fee Status",
          href: `/dashboard/${userRole}/fee-status`,
          icon: DollarSign,
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
        <div key={item.label} className="mb-1">
          <button
            onClick={() => toggleMenu(item.label)}
            className={`w-full flex items-center justify-between gap-3 px-5 py-4 rounded-xl transition-all duration-200 ${
              hasActiveSubItem
                ? "bg-white/15 text-white font-semibold shadow-md"
                : "text-white/90 hover:bg-white/20 hover:text-white hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon size={22} />
              <span className="font-semibold text-base">{item.label}</span>
            </div>
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>
          
          {isExpanded && (
            <div className="ml-4 mt-2 space-y-2 pb-2">
              {item.subItems?.map((subItem) => {
                const SubIcon = subItem.icon
                const isSubActive = pathname === subItem.href
                
                return (
                  <Link
                    key={subItem.href}
                    href={subItem.href!}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-200 ${
                      isSubActive
                        ? "bg-white/15 text-white font-medium shadow-sm"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <SubIcon size={20} />
                    <span className="text-base font-medium">{subItem.label}</span>
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
        className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200 mb-1 ${
          isActive && isOverview
            ? "bg-secondary text-foreground font-semibold shadow-lg transform scale-105"
            : isActive
            ? "bg-white/15 text-white font-semibold shadow-md"
            : "text-white/90 hover:bg-white/20 hover:text-white hover:shadow-md hover:translate-x-1"
        }`}
      >
        <Icon size={22} className="transition-transform duration-200 group-hover:scale-110" />
        <span className="font-semibold text-base">{item.label}</span>
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
      <aside className="w-64 bg-primary min-h-screen flex flex-col shadow-xl fixed lg:static top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out -translate-x-full lg:translate-x-0 data-[open=true]:translate-x-0"
        data-open={isMobileMenuOpen}
      >
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
          <h1 className="font-bold text-white text-3xl mb-2">SAR School</h1>
          <p className="text-white/90 text-base font-medium">{getRoleLabel()}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => {
            // Add separator after Dashboard and before last 2 items (Report Cases & Settings)
            const showSeparatorAfter = index === 0 || index === menuItems.length - 3
            
            return (
              <div key={item.label || index}>
                <div onClick={item.href ? closeMobileMenu : undefined}>
                  {renderMenuItem(item, index)}
                </div>
                {showSeparatorAfter && (
                  <div className="my-3 border-t border-white/10"></div>
                )}
              </div>
            )
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => {
              localStorage.removeItem("user")
              window.location.href = "/"
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/90 hover:bg-red-500/20 hover:text-white hover:shadow-md hover:translate-x-1 transition-all duration-200"
          >
            <LogOut size={22} />
            <span className="font-semibold text-base">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
