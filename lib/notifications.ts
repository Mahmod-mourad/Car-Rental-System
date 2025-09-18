// Notifications API service with static data fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Import static data
import { 
  staticNotifications, 
  getNotificationsByUserId, 
  type StaticNotification 
} from "./static-data"

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "booking" | "payment" | "maintenance" | "general"
  isRead: boolean
  createdAt: string
}

export interface CreateNotificationRequest {
  userId: string
  title: string
  message: string
  type: string
}

export interface NotificationFilters {
  type?: string
  isRead?: boolean
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface NotificationsResponse {
  notifications: Notification[]
  total: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

class NotificationsService {
  private getAuthHeaders() {
    const token = localStorage.getItem("accessToken")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async getNotifications(filters: NotificationFilters = {}): Promise<Notification[]> {
    try {
      // For demo purposes, assume current user ID is "user1"
      const userId = "user1"
      let userNotifications = getNotificationsByUserId(userId)
      
      // Apply filters
      if (filters.type) {
        userNotifications = userNotifications.filter(notification => notification.type === filters.type)
      }
      
      if (filters.isRead !== undefined) {
        userNotifications = userNotifications.filter(notification => notification.isRead === filters.isRead)
      }
      
      if (filters.startDate) {
        userNotifications = userNotifications.filter(notification => notification.createdAt >= filters.startDate!)
      }
      
      if (filters.endDate) {
        userNotifications = userNotifications.filter(notification => notification.createdAt <= filters.endDate!)
      }
      
      // Sort by creation date (newest first)
      userNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      return userNotifications as Notification[]
    } catch (error) {
      console.error("Error getting notifications from static data:", error)
      throw new Error("فشل في جلب الإشعارات")
    }
  }

  async getNotificationById(id: string): Promise<Notification> {
    try {
      const notification = staticNotifications.find(n => n.id === id)
      if (!notification) {
        throw new Error("الإشعار غير موجود")
      }
      return notification as Notification
    } catch (error) {
      console.error("Error getting notification by ID from static data:", error)
      throw new Error("فشل في جلب تفاصيل الإشعار")
    }
  }

  async markAsRead(id: string): Promise<Notification> {
    try {
      const notification = staticNotifications.find(n => n.id === id)
      if (!notification) {
        throw new Error("الإشعار غير موجود")
      }
      
      // Simulate marking notification as read
      const updatedNotification = {
        ...notification,
        isRead: true,
      }
      
      console.log("Marked notification as read:", updatedNotification)
      
      return updatedNotification as Notification
    } catch (error) {
      console.error("Error marking notification as read:", error)
      throw new Error("فشل في تحديث حالة الإشعار")
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      // For demo purposes, assume current user ID is "user1"
      const userId = "user1"
      const userNotifications = getNotificationsByUserId(userId)
      
      // Simulate marking all notifications as read
      userNotifications.forEach(notification => {
        notification.isRead = true
      })
      
      console.log("Marked all notifications as read for user:", userId)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      throw new Error("فشل في تحديث حالة جميع الإشعارات")
    }
  }

  async createNotification(data: CreateNotificationRequest): Promise<Notification> {
    try {
      // Simulate creating a new notification
      const newNotification: StaticNotification = {
        id: `notification_${Date.now()}`,
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type as any,
        isRead: false,
        createdAt: new Date().toISOString(),
      }
      
      // In a real app, this would be saved to the database
      console.log("Created notification:", newNotification)
      
      return newNotification as Notification
    } catch (error) {
      console.error("Error creating notification:", error)
      throw new Error("فشل في إنشاء الإشعار")
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      const notification = staticNotifications.find(n => n.id === id)
      if (!notification) {
        throw new Error("الإشعار غير موجود")
      }
      
      // Simulate deleting the notification
      console.log("Deleted notification:", id)
      
      // In a real app, this would remove the notification from the database
    } catch (error) {
      console.error("Error deleting notification:", error)
      throw new Error("فشل في حذف الإشعار")
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      // For demo purposes, assume current user ID is "user1"
      const userId = "user1"
      const userNotifications = getNotificationsByUserId(userId)
      
      return userNotifications.filter(notification => !notification.isRead).length
    } catch (error) {
      console.error("Error getting unread count from static data:", error)
      return 0
    }
  }

  async getAllNotifications(filters: NotificationFilters = {}): Promise<NotificationsResponse> {
    try {
      let allNotifications = [...staticNotifications]
      
      // Apply filters
      if (filters.type) {
        allNotifications = allNotifications.filter(notification => notification.type === filters.type)
      }
      
      if (filters.isRead !== undefined) {
        allNotifications = allNotifications.filter(notification => notification.isRead === filters.isRead)
      }
      
      if (filters.startDate) {
        allNotifications = allNotifications.filter(notification => notification.createdAt >= filters.startDate!)
      }
      
      if (filters.endDate) {
        allNotifications = allNotifications.filter(notification => notification.createdAt <= filters.endDate!)
      }
      
      // Sort by creation date (newest first)
      allNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      // Apply pagination
      const page = filters.page || 1
      const limit = filters.limit || 10
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedNotifications = allNotifications.slice(startIndex, endIndex)
      
      return {
        notifications: paginatedNotifications as Notification[],
        total: allNotifications.length,
        page,
        totalPages: Math.ceil(allNotifications.length / limit),
        hasNext: endIndex < allNotifications.length,
        hasPrev: page > 1,
      }
    } catch (error) {
      console.error("Error getting all notifications from static data:", error)
      throw new Error("فشل في جلب جميع الإشعارات")
    }
  }
}

export const notificationsService = new NotificationsService()
