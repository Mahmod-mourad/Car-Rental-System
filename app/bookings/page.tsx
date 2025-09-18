"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Car, Eye, X, ChevronLeft, ChevronRight } from "lucide-react"
import { bookingsService, type Booking, type BookingFilters } from "@/lib/bookings"

export default function MyBookingsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  })

  const [filters, setFilters] = useState<BookingFilters>({
    page: 1,
    limit: 10,
  })

  const loadBookings = async (newFilters: BookingFilters = filters) => {
    setLoading(true)
    setError("")

    try {
      const response = await bookingsService.getMyBookings(newFilters)
      setBookings(response.bookings)
      setPagination({
        page: response.page,
        totalPages: response.totalPages,
        total: response.total,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء جلب الحجوزات")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const handleFilterChange = (key: keyof BookingFilters, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 }
    setFilters(newFilters)
    loadBookings(newFilters)
  }

  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage }
    setFilters(newFilters)
    loadBookings(newFilters)
  }

  const cancelBooking = async (bookingId: string) => {
    if (!confirm("هل أنت متأكد من إلغاء هذا الحجز؟")) return

    try {
      await bookingsService.cancelBooking(bookingId)
      loadBookings() // Reload bookings
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل في إلغاء الحجز")
    }
  }

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

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { text: "في الانتظار", variant: "secondary" as const },
      paid: { text: "تم الدفع", variant: "default" as const },
      failed: { text: "فشل", variant: "destructive" as const },
      refunded: { text: "مسترد", variant: "outline" as const },
    }
    return statusConfig[status as keyof typeof statusConfig] || { text: status, variant: "secondary" as const }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">حجوزاتي</h1>
            <p className="text-muted-foreground">إدارة وعرض جميع حجوزاتك</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">حالة الحجز</label>
                  <Select
                    value={filters.status || "all"}
                    onValueChange={(value) => handleFilterChange("status", value === "all" ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الحالات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="pending">في الانتظار</SelectItem>
                      <SelectItem value="confirmed">مؤكد</SelectItem>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                      <SelectItem value="cancelled">ملغي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">حالة الدفع</label>
                  <Select
                    value={filters.paymentStatus || "all"}
                    onValueChange={(value) => handleFilterChange("paymentStatus", value === "all" ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="جميع حالات الدفع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع حالات الدفع</SelectItem>
                      <SelectItem value="pending">في الانتظار</SelectItem>
                      <SelectItem value="paid">تم الدفع</SelectItem>
                      <SelectItem value="failed">فشل</SelectItem>
                      <SelectItem value="refunded">مسترد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button variant="outline" onClick={() => loadBookings()} disabled={loading}>
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
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-32"></div>
                </div>
              ))}
            </div>
          )}

          {/* Bookings List */}
          {!loading && bookings.length > 0 && (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const statusBadge = getStatusBadge(booking.status)
                const paymentStatusBadge = getPaymentStatusBadge(booking.paymentStatus)

                return (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Car Info */}
                        <div className="lg:col-span-2">
                          {booking.car && (
                            <div className="flex gap-4">
                              <img
                                src={booking.car.images?.[0] || "/placeholder.svg?height=80&width=120&query=car"}
                                alt={booking.car.name}
                                className="w-20 h-14 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h3 className="font-semibold">{booking.car.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {booking.car.brand} {booking.car.model}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <Badge variant={statusBadge.variant}>{statusBadge.text}</Badge>
                                  <Badge variant={paymentStatusBadge.variant}>{paymentStatusBadge.text}</Badge>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Booking Details */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {new Date(booking.startDate).toLocaleDateString("ar-SA")} -{" "}
                              {new Date(booking.endDate).toLocaleDateString("ar-SA")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.pickupLocation}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {booking.totalDays} يوم - {booking.totalAmount} ريال
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/bookings/${booking.id}`}>
                              <Eye className="h-4 w-4 ml-2" />
                              عرض التفاصيل
                            </Link>
                          </Button>

                          {booking.status === "pending" && (
                            <Button variant="destructive" size="sm" onClick={() => cancelBooking(booking.id)}>
                              <X className="h-4 w-4 ml-2" />
                              إلغاء الحجز
                            </Button>
                          )}

                          {booking.paymentStatus === "pending" && (
                            <Button size="sm" asChild>
                              <Link href={`/bookings/${booking.id}/payment`}>إكمال الدفع</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && bookings.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="bg-muted rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <Car className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">لا توجد حجوزات</h3>
              <p className="text-muted-foreground mb-4">لم تقم بأي حجوزات بعد</p>
              <Button asChild>
                <Link href="/cars">تصفح السيارات</Link>
              </Button>
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronRight className="h-4 w-4" />
                السابق
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum: number
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i
                  } else {
                    pageNum = pagination.page - 2 + i
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === pagination.page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                التالي
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
