"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Calendar, CreditCard, AlertCircle, Check, Trash2, CheckCheck } from "lucide-react"
import { notificationsService, type Notification } from "@/lib/notifications"

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")
  const [typeFilter, setTypeFilter] = useState<"all" | "booking" | "payment" | "maintenance" | "general">("all")

  const loadNotifications = async () => {
    setLoading(true)
    setError("")

    try {
      const data = await notificationsService.getNotifications()
      setNotifications(data)
      applyFilters(data, filter, typeFilter)
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء جلب الإشعارات")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const applyFilters = (data: Notification[], readFilter: string, typeFilterValue: string) => {
    let filtered = data

    // Apply read/unread filter
    if (readFilter === "read") {
      filtered = filtered.filter((n) => n.isRead)
    } else if (readFilter === "unread") {
      filtered = filtered.filter((n) => !n.isRead)
    }

    // Apply type filter
    if (typeFilterValue !== "all") {
      filtered = filtered.filter((n) => n.type === typeFilterValue)
    }

    setFilteredNotifications(filtered)
  }

  const handleFilterChange = (newFilter: "all" | "unread" | "read") => {
    setFilter(newFilter)
    applyFilters(notifications, newFilter, typeFilter)
  }

  const handleTypeFilterChange = (newTypeFilter: "all" | "booking" | "payment" | "maintenance" | "general") => {
    setTypeFilter(newTypeFilter)
    applyFilters(notifications, filter, newTypeFilter)
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId)
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))
      applyFilters(
        notifications.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
        filter,
        typeFilter,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل في تحديث الإشعار")
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      applyFilters(
        notifications.map((n) => ({ ...n, isRead: true })),
        filter,
        typeFilter,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل في تحديث الإشعارات")
    }
  }

  const deleteNotification = async (notificationId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الإشعار؟")) return

    try {
      await notificationsService.deleteNotification(notificationId)
      const updatedNotifications = notifications.filter((n) => n.id !== notificationId)
      setNotifications(updatedNotifications)
      applyFilters(updatedNotifications, filter, typeFilter)
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل في حذف الإشعار")
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-5 w-5 text-blue-600" />
      case "payment":
        return <CreditCard className="h-5 w-5 text-blue-600" />
      case "maintenance":
        return <AlertCircle className="h-5 w-5 text-blue-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getTypeText = (type: string) => {
    const types = {
      booking: "حجز",
      payment: "دفع",
      maintenance: "صيانة",
      general: "عام",
    }
    return types[type as keyof typeof types] || type
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">الإشعارات</h1>
                <p className="text-muted-foreground">
                  {unreadCount > 0 ? `لديك ${unreadCount} إشعار غير مقروء` : "جميع الإشعارات مقروءة"}
                </p>
              </div>
              {unreadCount > 0 && (
                <Button onClick={markAllAsRead}>
                  <CheckCheck className="h-4 w-4 ml-2" />
                  تحديد الكل كمقروء
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">حالة القراءة</label>
                  <Select value={filter} onValueChange={handleFilterChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الإشعارات</SelectItem>
                      <SelectItem value="unread">غير مقروءة</SelectItem>
                      <SelectItem value="read">مقروءة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">نوع الإشعار</label>
                  <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأنواع</SelectItem>
                      <SelectItem value="booking">حجوزات</SelectItem>
                      <SelectItem value="payment">مدفوعات</SelectItem>
                      <SelectItem value="maintenance">صيانة</SelectItem>
                      <SelectItem value="general">عام</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button variant="outline" onClick={loadNotifications} disabled={loading}>
                    {loading ? "جاري التحديث..." : "تحديث"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-20"></div>
                </div>
              ))}
            </div>
          )}

          {/* Notifications List */}
          {!loading && filteredNotifications.length > 0 && (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all ${!notification.isRead ? "border-primary/50 bg-primary/5" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-muted p-2 rounded-full">{getNotificationIcon(notification.type)}</div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{notification.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{getTypeText(notification.type)}</Badge>
                              {!notification.isRead && <Badge variant="default">جديد</Badge>}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                title="تحديد كمقروء"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              title="حذف الإشعار"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-2">{notification.message}</p>

                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString("ar-SA")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredNotifications.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="bg-muted rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <Bell className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">لا توجد إشعارات</h3>
              <p className="text-muted-foreground">
                {filter === "unread"
                  ? "جميع الإشعارات مقروءة"
                  : typeFilter !== "all"
                    ? `لا توجد إشعارات من نوع ${getTypeText(typeFilter)}`
                    : "لا توجد إشعارات حالياً"}
              </p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
