"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface EnhancedCardProps {
  children: ReactNode
  className?: string
  gradient?: "blue" | "green" | "purple" | "orange" | "red" | "yellow"
  hover?: boolean
  clickable?: boolean
  onClick?: () => void
}

const gradientClasses = {
  blue: "bg-gradient-to-br from-blue-500 to-blue-600",
  green: "bg-gradient-to-br from-green-500 to-green-600",
  purple: "bg-gradient-to-br from-purple-500 to-purple-600",
  orange: "bg-gradient-to-br from-orange-500 to-orange-600",
  red: "bg-gradient-to-br from-red-500 to-red-600",
  yellow: "bg-gradient-to-br from-yellow-500 to-yellow-600",
}

export function EnhancedCard({
  children,
  className,
  gradient,
  hover = true,
  clickable = false,
  onClick,
}: EnhancedCardProps) {
  const baseClasses = "rounded-xl shadow-lg transition-all duration-300 ease-in-out"
  const hoverClasses = hover ? "hover:shadow-xl hover:-translate-y-1" : ""
  const clickableClasses = clickable ? "cursor-pointer" : ""
  const gradientClass = gradient ? gradientClasses[gradient] : "bg-white"

  return (
    <div
      className={cn(
        baseClasses,
        hoverClasses,
        clickableClasses,
        gradientClass,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
