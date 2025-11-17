"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface GradientCardProps {
  children: ReactNode
  gradient?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'yellow' | 'gray'
  className?: string
  onClick?: () => void
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

const gradientClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  orange: 'from-orange-500 to-orange-600', 
  purple: 'from-purple-500 to-purple-600',
  red: 'from-[#E31E24] to-[#c91a1f]',
  yellow: 'from-[#FFD100] to-[#e6bc00]',
  gray: 'from-gray-500 to-gray-600'
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
}

export default function GradientCard({
  children,
  gradient = 'blue',
  className = '',
  onClick,
  hover = true,
  padding = 'md'
}: GradientCardProps) {
  const isClickable = !!onClick

  return (
    <motion.div
      whileHover={hover && isClickable ? { y: -2, scale: 1.01 } : {}}
      whileTap={isClickable ? { scale: 0.98 } : {}}
      className={`
        relative overflow-hidden rounded-xl text-white shadow-lg
        bg-gradient-to-br ${gradientClasses[gradient]}
        ${paddingClasses[padding]}
        ${isClickable ? 'cursor-pointer hover:shadow-xl' : ''}
        transition-all duration-200
        ${className}
      `}
      onClick={onClick}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-white/10 opacity-20">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Hover Glow Effect */}
      {isClickable && hover && (
        <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-xl" />
      )}
    </motion.div>
  )
}
