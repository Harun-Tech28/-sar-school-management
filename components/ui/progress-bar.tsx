import React from "react"

interface ProgressBarProps {
  value: number // 0-100
  max?: number
  showLabel?: boolean
  label?: string
  showPercentage?: boolean
  color?: "red" | "yellow" | "gradient" | "green" | "blue" | "purple" | "orange"
  variant?: "linear" | "circular"
  size?: "sm" | "md" | "lg"
  animated?: boolean
  striped?: boolean
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  label,
  showPercentage = true,
  color = "red",
  variant = "linear",
  size = "md",
  animated = true,
  striped = false,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const colorClasses = {
    red: "bg-[#E31E24]",
    yellow: "bg-[#FFD100]",
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    gradient: "bg-gradient-to-r from-[#E31E24] to-[#FFD100]",
  }

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  }

  if (variant === "circular") {
    const radius = size === "sm" ? 20 : size === "md" ? 30 : 40
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference
    const strokeWidth = size === "sm" ? 3 : size === "md" ? 4 : 6
    const svgSize = (radius + strokeWidth) * 2

    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <div className="relative">
          <svg width={svgSize} height={svgSize} className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              className="text-gray-200"
            />
            {/* Progress circle */}
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`${colorClasses[color].replace('bg-', 'text-')} ${animated ? 'transition-all duration-500 ease-out' : ''}`}
            />
          </svg>
          {showPercentage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`font-bold ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}`}>
                {Math.round(percentage)}%
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{label || "Progress"}</span>
          {showPercentage && (
            <span className="text-sm font-bold text-[#E31E24]">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <div
          className={`
            ${sizeClasses[size]} rounded-full ${colorClasses[color]} 
            ${animated ? "transition-all duration-500 ease-out" : ""}
            ${striped ? "bg-striped" : ""}
          `}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}
