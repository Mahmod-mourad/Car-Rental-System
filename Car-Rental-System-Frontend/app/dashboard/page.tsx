"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Car,
  Calendar,
  CreditCard,
  Bell,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  ArrowRight,
} from "lucide-react"
import { bookingsService, type Booking } from "@/lib/bookings"
import { paymentsService } from "@/lib/payments"
import { notificationsService, type Notification } from "@/lib/notifications"

interface DashboardStats {
  totalBookings: number
  activeBookings: number
  completedBookings: number
  totalSpent: number
  unreadNotifications: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
    unreadNotifications: 0,
  })
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      setError("")

      try {
        const [bookingsResponse, paymentsData, notificationsData] = await Promise.all([
          bookingsService.getMyBookings({ limit: 5 }),
          paymentsService.getMyPayments(),
          notificationsService.getNotifications(),
        ])

        // Calculate stats
        const totalBookings = bookingsResponse.total
        const activeBookings = bookingsResponse.bookings.filter(
          (b) => b.status === "confirmed" || b.status === "active",
        ).length
        const completedBookings = bookingsResponse.bookings.filter((b) => b.status === "completed").length
        const totalSpent = paymentsData.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)
        const unreadNotifications = notificationsData.filter((n) => !n.isRead).length

        setStats({
          totalBookings,
          activeBookings,
          completedBookings,
          totalSpent,
          unreadNotifications,
        })

        setRecentBookings(bookingsResponse.bookings.slice(0, 3))
        setRecentNotifications(notificationsData.slice(0, 5))
      } catch (err) {
        setError(err instanceof Error ? err.message : "حدث خطأ أثناء جلب البيانات")
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { text: "في الانتظار", variant: "secondary" as const },
      confirmed: { text: "مؤكد", variant: "default" as const },
      active: { text: "نشط", variant: "default" as const },
      completed: { text: "مكتمل", variant: "outline" as const },
      cancelled: { text: "ملغي", variant: "destructive" as const },
    }
    return statusConfig[status as keyof typeof statusConfig] || { text: status, variant: "secondary" as const }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-4 w-4" />
      case "payment":
        return <CreditCard className="h-4 w-4" />
      case "maintenance":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-8">
              <div className="bg-muted rounded-lg h-32"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-muted rounded-lg h-24"></div>
                ))}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">مرحباً، {user.name}</h1>
                <p className="text-muted-foreground">إليك نظرة عامة على نشاطك</p>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-muted rounded-lg h-24"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="animate-pulse bg-muted rounded-lg h-64"></div>
                <div className="animate-pulse bg-muted rounded-lg h-64"></div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          {!loading && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">إجمالي الحجوزات</p>
                        <p className="text-2xl font-bold">{stats.totalBookings}</p>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Car className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">الحجوزات النشطة</p>
                        <p className="text-2xl font-bold">{stats.activeBookings}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
<CheckCircle className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">إجمالي المصروفات</p>
                        <p className="text-2xl font-bold">{stats.totalSpent.toLocaleString()} ريال</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">الإشعارات الجديدة</p>
                        <p className="text-2xl font-bold">{stats.unreadNotifications}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
<Bell className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Bookings */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>آخر الحجوزات</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/bookings">
                        عرض الكل
                        <ArrowRight className="h-4 w-4 mr-2" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {recentBookings.length > 0 ? (
                      <div className="space-y-4">
                        {recentBookings.map((booking) => {
                          const statusBadge = getStatusBadge(booking.status)
                          return (
                            <div key={booking.id} className="flex items-center gap-4 p-3 border rounded-lg">
                              {booking.car && (
                                <img
                                  src={booking.car.images?.[0] || "/placeholder.svg?height=60&width=80&query=car"}
                                  alt={booking.car.name}
                                  className="w-16 h-12 object-cover rounded"
                                />
                              )}
                              <div className="flex-1">
                                <h4 className="font-medium">{booking.car?.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(booking.startDate).toLocaleDateString("ar-SA")}
                                </p>
                                <Badge variant={statusBadge.variant} className="mt-1">
                                  {statusBadge.text}
                                </Badge>
                              </div>
                              <div className="text-left">
                                <p className="font-semibold">{booking.totalAmount} ريال</p>
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/bookings/${booking.id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">لا توجد حجوزات حديثة</p>
                        <Button className="mt-4" asChild>
                          <Link href="/cars">تصفح السيارات</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Notifications */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>الإشعارات الحديثة</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/notifications">
                        عرض الكل
                        <ArrowRight className="h-4 w-4 mr-2" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {recentNotifications.length > 0 ? (
                      <div className="space-y-3">
                        {recentNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`flex items-start gap-3 p-3 rounded-lg border ${
                              !notification.isRead ? "bg-primary/5 border-primary/20" : ""
                            }`}
                          >
                            <div className="bg-muted p-2 rounded-full">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{notification.title}</h4>
                              <p className="text-sm text-muted-foreground">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(notification.createdAt).toLocaleDateString("ar-SA")}
                              </p>
                            </div>
                            {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">لا توجد إشعارات جديدة</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>إجراءات سريعة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="h-16" asChild>
                      <Link href="/cars">
                        <Car className="h-6 w-6 ml-2" />
                        تصفح السيارات
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-16 bg-transparent" asChild>
                      <Link href="/bookings">
                        <Calendar className="h-6 w-6 ml-2" />
                        إدارة الحجوزات
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-16 bg-transparent" asChild>
                      <Link href="/profile">
                        <Clock className="h-6 w-6 ml-2" />
                        الملف الشخصي
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
