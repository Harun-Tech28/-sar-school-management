"use client"

import { motion, Variants } from "framer-motion"
import { ReactNode } from "react"

interface QuickAction {
  label: string
  icon: ReactNode
  onClick: () => void
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'danger'
  disabled?: boolean
}

interface QuickActionsProps {
  actions: QuickAction[]
  title?: string
  columns?: 2 | 3 | 4
  className?: string
}

const colorClasses = {
  primary: 'bg-gradient-to-br from-[#E31E24] to-[#c91a1f] hover:from-[#c91a1f] hover:to-[#b01621] text-white',
  secondary: 'bg-gradient-to-br from-[#FFD100] to-[#e6bc00] hover:from-[#e6bc00] hover:to-[#cca700] text-gray-900',
  success: 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white',
  warning: 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white',
  info: 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white',
  danger: 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3
    }
  }
}

export default function QuickActions({
  actions,
  title = "Quick Actions",
  columns = 4,
  className = ''
}: QuickActionsProps) {
  const gridClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  }

  if (actions.length === 0) {
    return null
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {title && (
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
        </div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`grid ${gridClasses[columns]} gap-4`}
      >
        {actions.map((action, index) => (
          <QuickActionButton
            key={`${action.label}-${index}`}
            action={action}
          />
        ))}
      </motion.div>
    </div>
  )
}

function QuickActionButton({ action }: { action: QuickAction }) {
  const { label, icon, onClick, color = 'primary', disabled = false } = action

  return (
    <motion.button
      variants={itemVariants}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={label}
      aria-disabled={disabled}
      className={`
        relative overflow-hidden rounded-xl p-6 shadow-md transition-all duration-200
        ${disabled 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : `${colorClasses[color]} hover:shadow-lg cursor-pointer`
        }
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      `}
    >
      {!disabled && (
        <div className="absolute inset-0 bg-white/10 opacity-20">
          <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/20 rounded-full"></div>
          <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-white/10 rounded-full"></div>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center
          ${disabled ? 'bg-gray-200' : 'bg-white/20 backdrop-blur-sm'}
        `}>
          <div className={disabled ? 'opacity-50' : ''}>
            {icon}
          </div>
        </div>

        <span className={`
          font-medium text-center leading-tight
          ${disabled ? 'text-gray-400' : ''}
        `}>
          {label}
        </span>
      </div>

      {!disabled && (
        <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-xl" />
      )}
    </motion.button>
  )
}
