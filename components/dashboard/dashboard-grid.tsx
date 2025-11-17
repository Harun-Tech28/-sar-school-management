"use client"

import { motion, Variants } from "framer-motion"
import { ReactNode } from "react"

interface DashboardGridProps {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 4 | 6 | 8
  className?: string
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

export default function DashboardGrid({
  children,
  columns = 4,
  gap = 6,
  className = ''
}: DashboardGridProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  const gapClasses = {
    4: 'gap-4',
    6: 'gap-6', 
    8: 'gap-8'
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`
        grid ${gridClasses[columns]} ${gapClasses[gap]}
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}

export function DashboardGridItem({ children, className = '' }: {
  children: ReactNode
  className?: string
}) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      variants={itemVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}
