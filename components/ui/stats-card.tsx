"use client"

import { LucideIcon } from "lucide-react"
import { EnhancedCard } from "./enhanced-card"
import { AnimatedNumber } from "./animated-number"

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  gradient: "blue" | "green" | "purple" | "orange" | "red" | "yellow"
  trend?: {
    value: number
    isPositive: boolean
  }
  subtitle?: string
  onClick?: () => void
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  gradient,
  trend,
  subtitle,
  onClick,
}: StatsCardProps) {
  return (
    <EnhancedCard
      gradient={gradient}
      clickable={!!onClick}
      onClick={onClick}
      className="p-6 text-white"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            {typeof value === 'number' ? (
              <AnimatedNumber
                value={value}
                className="text-3xl font-bold text-white"
              />
            ) : (
              <span className="text-3xl font-bold text-white">{value}</span>
            )}
            {trend && (
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? "text-green-200" : "text-red-200"
                }`}
              >
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-white/70 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </EnhancedCard>
  )
}
