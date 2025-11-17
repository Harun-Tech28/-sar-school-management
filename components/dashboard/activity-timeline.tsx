"use client"

import { motion, Variants } from "framer-motion"
import { ReactNode } from "react"
import { Clock, User, BookOpen, GraduationCap, Bell, Calendar, CheckCircle } from "lucide-react"

export interface Activity {
  id: string
  type: 'announcement' | 'grade' | 'attendance' | 'homework' | 'event' | 'user' | 'system'
  title: string
  description: string
  timestamp: Date
  icon?: ReactNode
  onClick?: () => void
  user?: {
    name: string
    avatar?: string
  }
}

interface ActivityTimelineProps {
  activities: Activity[]
  maxItems?: number
  loading?: boolean
  className?: string
  showViewAll?: boolean
  onViewAll?: () => void
}

const activityIcons = {
  announcement: <Bell size={16} />,
  grade: <GraduationCap size={16} />,
  attendance: <CheckCircle size={16} />,
  homework: <BookOpen size={16} />,
  event: <Calendar size={16} />,
  user: <User size={16} />,
  system: <Clock size={16} />
}

const activityColors = {
  announcement: 'bg-blue-500',
  grade: 'bg-green-500',
  attendance: 'bg-orange-500',
  homework: 'bg-purple-500',
  event: 'bg-pink-500',
  user: 'bg-indigo-500',
  system: 'bg-gray-500'
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Just now'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}d ago`
  }
  
  return date.toLocaleDateString()
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

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3
    }
  }
}

export default function ActivityTimeline({
  activities,
  maxItems = 10,
  loading = false,
  className = '',
  showViewAll = true,
  onViewAll
}: ActivityTimelineProps) {
  const displayedActivities = activities.slice(0, maxItems)
  const hasMore = activities.length > maxItems

  if (loading) {
    return <ActivityTimelineSkeleton />
  }

  if (activities.length === 0) {
    return (
      <div className={`bg-white rounded-xl p-8 shadow-md border border-gray-100 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h3>
          <p className="text-gray-500 text-sm">
            When you start using the system, your recent activities will appear here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-100 ${className}`}>
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          {showViewAll && hasMore && onViewAll && (
            <button
              onClick={onViewAll}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View All
            </button>
          )}
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-6 space-y-4"
      >
        {displayedActivities.map((activity, index) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            isLast={index === displayedActivities.length - 1}
          />
        ))}
      </motion.div>

      {hasMore && showViewAll && onViewAll && (
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <button
            onClick={onViewAll}
            className="w-full text-center text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            View {activities.length - maxItems} more activities
          </button>
        </div>
      )}
    </div>
  )
}

function ActivityItem({ activity, isLast }: { activity: Activity; isLast: boolean }) {
  const { type, title, description, timestamp, icon, onClick, user } = activity
  const isClickable = !!onClick

  return (
    <motion.div
      variants={itemVariants}
      className={`
        relative flex gap-4 pb-4
        ${isClickable ? 'cursor-pointer group' : ''}
        ${!isLast ? 'border-l-2 border-gray-100 ml-4' : ''}
      `}
      onClick={onClick}
    >
      {!isLast && (
        <div className="absolute left-4 top-12 w-0.5 h-full bg-gray-100"></div>
      )}

      <div className={`
        relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0
        ${activityColors[type]}
        ${isClickable ? 'group-hover:scale-110' : ''}
        transition-transform duration-200
      `}>
        {icon || activityIcons[type]}
      </div>

      <div className="flex-1 min-w-0">
        <div className={`
          ${isClickable ? 'group-hover:bg-gray-50' : ''}
          rounded-lg p-3 -m-3 transition-colors duration-200
        `}>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`
              font-medium text-gray-900 text-sm leading-tight
              ${isClickable ? 'group-hover:text-blue-600' : ''}
              transition-colors duration-200
            `}>
              {title}
            </h4>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {formatRelativeTime(timestamp)}
            </span>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-2">
            {description}
          </p>

          {user && (
            <div className="flex items-center gap-2">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-4 h-4 rounded-full"
                />
              ) : (
                <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                  <User size={10} className="text-gray-600" />
                </div>
              )}
              <span className="text-xs text-gray-500">{user.name}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function ActivityTimelineSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="w-32 h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex gap-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <div className="w-40 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-3/4 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function generateSampleActivities(): Activity[] {
  const now = new Date()
  return [
    {
      id: '1',
      type: 'announcement',
      title: 'New School Policy Update',
      description: 'Important changes to the attendance policy have been announced.',
      timestamp: new Date(now.getTime() - 30 * 60 * 1000),
      user: { name: 'Admin Team' }
    },
    {
      id: '2', 
      type: 'grade',
      title: 'Mathematics Test Results',
      description: 'Your test results for Chapter 5 have been published.',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      user: { name: 'Mr. Johnson' }
    },
    {
      id: '3',
      type: 'homework',
      title: 'Science Assignment Due',
      description: 'Complete the lab report on photosynthesis by tomorrow.',
      timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      user: { name: 'Ms. Davis' }
    },
    {
      id: '4',
      type: 'attendance',
      title: 'Attendance Marked',
      description: 'Your attendance for today has been recorded.',
      timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      user: { name: 'System' }
    },
    {
      id: '5',
      type: 'event',
      title: 'Parent-Teacher Meeting',
      description: 'Scheduled for next Friday at 2:00 PM.',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      user: { name: 'School Office' }
    }
  ]
}
