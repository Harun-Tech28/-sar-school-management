"use client"

import { LucideIcon, Clock } from "lucide-react"
import { EnhancedCard } from "./enhanced-card"

interface Activity {
  id: string
  title: string
  description: string
  time: string
  icon: LucideIcon
  color: "blue" | "green" | "purple" | "orange" | "red" | "yellow"
  onClick?: () => void
}

interface ActivityFeedProps {
  activities: Activity[]
  title?: string
  emptyMessage?: string
}

const colorClasses = {
  blue: "text-blue-600 bg-blue-100",
  green: "text-green-600 bg-green-100",
  purple: "text-purple-600 bg-purple-100",
  orange: "text-orange-600 bg-orange-100",
  red: "text-red-600 bg-red-100",
  yellow: "text-yellow-600 bg-yellow-100",
}

export function ActivityFeed({
  activities,
  title = "Recent Activities",
  emptyMessage = "No recent activities",
}: ActivityFeedProps) {
  return (
    <EnhancedCard className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock size={20} className="text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div
                key={activity.id}
                className={`flex items-start gap-4 p-3 rounded-lg transition-colors duration-200 ${
                  activity.onClick ? "cursor-pointer hover:bg-gray-50" : ""
                }`}
                onClick={activity.onClick}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClasses[activity.color]}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                      <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{activity.time}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </EnhancedCard>
  )
}
