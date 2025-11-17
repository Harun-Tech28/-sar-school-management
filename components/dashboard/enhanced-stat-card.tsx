"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"
import { ReactNode } from "react"

interface EnhancedStatCardProps {
  title: string
  value: number | string
  icon: ReactNode
  gradient: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'yellow'
  trend?: {
    value: number
    isPositive: boolean
  }
  onClick?: () => void
  loading?: boolean
  prefix?: string
  suffix?: string
}

const gradientClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600', 
  orange: 'from-orange-500 to-orange-600',
  purple: 'from-purple-500 to-purple-600',
  red: 'from-[#E31E24] to-[#c91a1f]',
  yellow: 'from-[#FFD100] to-[#e6bc00]'
}

export default function EnhancedStatCard({
  title,
  value,
  icon,
  gradient,
  trend,
  onClick,
  loading = false,
  prefix = '',
  suffix = ''
}: EnhancedStatCardProps) {
  const isClickable = !!onClick

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="w-24 h-8 bg-gray-200 rounded mb-2"></div>
          <div className="w-32 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={isClickable ? { y: -4, scale: 1.02 } : {}}
      className={`
        relative overflow-hidden rounded-xl p-6 text-white shadow-md transition-all duration-200
        bg-gradient-to-br ${gradientClasses[gradient]}
        ${isClickable ? 'cursor-pointer hover:shadow-xl' : ''}
      `}
      onClick={onClick}
      role={isClickable ? "button" : "article"}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      } : undefined}
      aria-label={`${title}: ${prefix}${value}${suffix}${trend ? `, ${trend.isPositive ? 'up' : 'down'} ${trend.value}%` : ''}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-white/10 opacity-20">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium ${
              trend.isPositive ? 'text-green-100' : 'text-red-100'
            }`}>
              {trend.isPositive ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          <div className="text-3xl font-bold">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </div>
        </div>

        {/* Title */}
        <div className="text-white/90 font-medium">
          {title}
        </div>
      </div>

      {/* Hover Glow Effect */}
      {isClickable && (
        <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-xl" />
      )}
    </motion.div>
  )
}
