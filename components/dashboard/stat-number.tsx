"use client"

import { useState, useEffect } from "react"

interface StatNumberProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
  decimals?: number
}

export default function StatNumber({
  value,
  duration = 1000,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0
}: StatNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const startValue = 0
    const endValue = value

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      
      // Ease-out cubic function
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (endValue - startValue) * easeOut
      
      setDisplayValue(current)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    const animationFrame = requestAnimationFrame(animate)
    
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  const formatNumber = (num: number) => {
    if (decimals > 0) {
      return num.toFixed(decimals)
    }
    return Math.floor(num).toLocaleString()
  }

  return (
    <span className={className}>
      {prefix}{formatNumber(displayValue)}{suffix}
    </span>
  )
}
