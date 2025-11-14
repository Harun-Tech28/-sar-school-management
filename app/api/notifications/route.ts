import { NextRequest, NextResponse } from 'next/server'

// Mock notification data for testing
const mockNotifications = [
  {
    id: '1',
    title: 'New Student Registration',
    message: 'A new student has registered and is pending approval',
    type: 'info' as const,
    read: false,
    createdAt: new Date().toISOString(),
    userId: 'admin'
  },
  {
    id: '2', 
    title: 'Budget Alert',
    message: 'Mathematics department budget is 85% utilized',
    type: 'warning' as const,
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    userId: 'admin'
  },
  {
    id: '3',
    title: 'Fee Payment Received',
    message: 'Payment of GHS 500 received from John Doe',
    type: 'success' as const,
    read: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    userId: 'admin'
  }
]

// GET /api/notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    
    let notifications = mockNotifications
    
    if (unreadOnly) {
      notifications = notifications.filter(n => !n.read)
    }
    
    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount: notifications.filter(n => !n.read).length
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// POST /api/notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, message, type = 'info', userId } = body
    
    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: 'Title and message are required' },
        { status: 400 }
      )
    }
    
    const newNotification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      userId: userId || 'admin'
    }
    
    mockNotifications.unshift(newNotification)
    
    return NextResponse.json({
      success: true,
      data: newNotification
    })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}
