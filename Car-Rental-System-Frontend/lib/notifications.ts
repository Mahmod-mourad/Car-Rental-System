import { apiRequest } from "./api-client"

export type NotificationType =
  | "booking_created"
  | "booking_confirmed"
  | "booking_cancelled"
  | "payment_received"
  | "payment_failed"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  read: boolean
  referenceId: string | null
  createdAt: string
}

export interface NotificationsResponse {
  notifications: Notification[]
  total: number
  unread: number
}

interface ApiNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  read: boolean
  reference_id: string | null
  created_at: string
}

function mapNotification(notification: ApiNotification): Notification {
  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    read: notification.read,
    referenceId: notification.reference_id,
    createdAt: notification.created_at,
  }
}

class NotificationsService {
  /** The API always answers for the signed-in user; there is no user id to pass. */
  async getNotifications(
    options: { unreadOnly?: boolean; page?: number; limit?: number } = {},
  ): Promise<NotificationsResponse> {
    const response = await apiRequest<{
      data: ApiNotification[]
      total: number
      unread: number
    }>("/notifications", {
      query: {
        unreadOnly: options.unreadOnly ? "true" : undefined,
        page: options.page,
        limit: options.limit,
      },
    })

    return {
      notifications: (response.data ?? []).map(mapNotification),
      total: response.total ?? 0,
      unread: response.unread ?? 0,
    }
  }

  async getUnreadCount(): Promise<number> {
    const { unread } = await this.getNotifications({ limit: 1 })
    return unread
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await apiRequest<ApiNotification>(`/notifications/${id}/read`, {
      method: "PATCH",
    })
    return mapNotification(notification)
  }

  async markAllAsRead(): Promise<number> {
    const { updated } = await apiRequest<{ updated: number }>("/notifications/read-all", {
      method: "POST",
    })
    return updated
  }

  async deleteNotification(id: string): Promise<void> {
    await apiRequest<void>(`/notifications/${id}`, { method: "DELETE" })
  }
}

export const notificationsService = new NotificationsService()
