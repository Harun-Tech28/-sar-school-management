"use client"

import { LucideIcon } from "lucide-react"
import { EnhancedCard } from "./enhanced-card"

interface QuickActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  onClick: () => void
  color?: "blue" | "green" | "purple" | "orange" | "red" | "yellow"
}

const colorClasses = {
  blue: "text-blue-600 bg-blue-50 hover:bg-blue-100",
  green: "text-green-600 bg-green-50 hover:bg-green-100",
  purple: "text-purple-600 bg-purple-50 hover:bg-purple-100",
  orange: "text-orange-600 bg-orange-50 hover:bg-orange-100",
  red: "text-red-600 bg-red-50 hover:bg-red-100",
  yellow: "text-yellow-600 bg-yellow-50 hover:bg-yellow-100",
}

const iconColorClasses = {
  blue: "text-blue-600 bg-blue-100",
  green: "text-green-600 bg-green-100",
  purple: "text-purple-600 bg-purple-100",
  orange: "text-orange-600 bg-orange-100",
  red: "text-red-600 bg-red-100",
  yellow: "text-yellow-600 bg-yellow-100",
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  onClick,
  color = "blue",
}: QuickActionCardProps) {
  return (
    <EnhancedCard
      clickable
      onClick={onClick}
      className={`p-6 transition-all duration-200 ${colorClasses[color]}`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColorClasses[color]}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </EnhancedCard>
  )
}
