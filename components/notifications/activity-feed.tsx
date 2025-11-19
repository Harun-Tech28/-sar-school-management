"use client"

import { useEffect, useState } from "react"
import { Activity as ActivityIcon, Filter, RefreshCw } from "lucide-react"
import { Activity } from "@/lib/types/notification"
import { getRelativeTime } from "@/lib/notifications/activity-service"
import Link from "next/link"

interface ActivityFeedProps {
  userRole: string
  maxItems?: number
  showHeader?: boolean
  showFilters?: boolean
}

interface ActivityWithCategory extends Activity {
  category?: string
  actionUrl?: string
}

export function ActivityFeed({ 
  userRole, 
  maxItems = 10, 
  showHeader = true,
  showFilters = false 
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [categories, setCategories] = useState<string[]>(["All"])

  const loadActivities = async () => {
    try {
      const response = await fetch(`/api/activities?role=${userRole}&limit=${maxItems}`)
      const data = await response.json()
      
      if (data.success) {
        setActivities(data.data || [])
        if (data.categories) {
          setCategories(data.categories)
        }
      } else {
        setActivities([])
      }
    } catch (error) {
      console.error("Error loading activities:", error)
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActivities()

    // Refresh every 60 seconds
    const interval = setInterval(loadActivities, 60000)

    return () => clearInterval(interval)
  }, [userRole, maxItems])

  const getColorClass = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-600"
      case "green":
        return "bg-green-100 text-green-600"
      case "purple":
        return "bg-purple-100 text-purple-600"
      case "yellow":
        return "bg-yellow-100 text-yellow-600"
      case "orange":
        return "bg-orange-100 text-orange-600"
      case "red":
        return "bg-red-100 text-red-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "Academic":
        return "bg-blue-100 text-blue-700"
      case "Finance":
        return "bg-yellow-100 text-yellow-700"
      case "Attendance":
        return "bg-green-100 text-green-700"
      case "Communication":
        return "bg-orange-100 text-orange-700"
      case "Enrollment":
        return "bg-purple-100 text-purple-700"
      case "Staff":
        return "bg-indigo-100 text-indigo-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const filteredActivities = selectedCategory === "All" 
    ? activities 
    : activities.filter(a => a.category === selectedCategory)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#E31E24] to-[#FFD100] rounded-xl flex items-center justify-center shadow-lg">
              <ActivityIcon size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
              <p className="text-xs text-gray-600">Latest updates and events</p>
            </div>
          </div>
          <button
            onClick={() => {
              setLoading(true)
              loadActivities()
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh activities"
          >
            <RefreshCw size={16} className={`text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      )}

      {showFilters && categories.length > 1 && (
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          <Filter size={14} className="text-gray-500 flex-shrink-0" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-[#E31E24] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ActivityIcon size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">No recent activity</p>
          <p className="text-sm text-gray-500 mt-1">
            {selectedCategory !== "All" 
              ? `No ${selectedCategory.toLowerCase()} activities yet` 
              : "Activity will appear here"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredActivities.map((activity) => {
            const ActivityWrapper = activity.actionUrl ? Link : 'div'
            const wrapperProps = activity.actionUrl 
              ? { href: activity.actionUrl, className: "block hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors" }
              : { className: "block" }

            return (
              <ActivityWrapper key={activity.id} {...wrapperProps}>
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getColorClass(activity.color)}`}>
                    <span className="text-lg">{activity.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-relaxed">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <p className="text-xs text-gray-500">
                        {getRelativeTime(activity.timestamp)}
                      </p>
                      {activity.category && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryBadgeColor(activity.category)}`}>
                            {activity.category}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </ActivityWrapper>
            )
          })}
        </div>
      )}
    </div>
  )
}
