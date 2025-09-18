"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Calendar, MapPin, Phone, Mail, Download, ArrowRight } from "lucide-react"
import { bookingsService, type Booking } from "@/lib/bookings"

export default function BookingConfirmationPage() {
  const params = useParams()
  const { user } = useAuth()
  const bookingId = params.id as string

  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) return

      try {
        const bookingData = await bookingsService.getBookingById(bookingId)
        setBooking(bookingData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "فشل في جلب تفاصيل الحجز")
      } finally {
        setLoading(false)
      }
    }

    loadBooking()
  }, [bookingId])

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-8">
              <div className="bg-muted rounded-lg h-32"></div>
              <div className="bg-muted rounded-lg h-64"></div>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !booking) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Alert variant="destructive">
              <AlertDescription>{error || "لم يتم العثور على الحجز"}</AlertDescription>
            </Alert>
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
          <div className="max-w-4xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
<CheckCircle className="h-10 w-10 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-blue-600 mb-2">تم تأكيد حجزك بنجاح!</h1>
              <p className="text-muted-foreground">رقم الحجز: #{booking.id.slice(-8).toUpperCase()}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Booking Details */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>تفاصيل الحجز</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {booking.car && (
                      <div className="flex gap-4 mb-6">
                        <img
                          src={booking.car.images?.[0] || "/placeholder.svg?height=100&width=150&query=car"}
                          alt={booking.car.name}
                          className="w-24 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{booking.car.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {booking.car.brand} {booking.car.model}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{booking.status === "confirmed" ? "مؤكد" : booking.status}</Badge>
                            <Badge variant="outline">
                              {booking.paymentStatus === "paid" ? "تم الدفع" : booking.paymentStatus}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">فترة الإيجار</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.startDate).toLocaleDateString("ar-SA")} -{" "}
                            {new Date(booking.endDate).toLocaleDateString("ar-SA")}
                          </p>
                          <p className="text-sm text-muted-foreground">{booking.totalDays} يوم</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">مواقع الاستلام والتسليم</p>
                          <p className="text-sm text-muted-foreground">الاستلام: {booking.pickupLocation}</p>
                          <p className="text-sm text-muted-foreground">التسليم: {booking.dropoffLocation}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>تفاصيل التكلفة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>المجموع الفرعي</span>
                      <span>{booking.subtotal} ريال</span>
                    </div>

                    {booking.discountAmount > 0 && (
                      <div className="flex justify-between text-blue-600">
                        <span>الخصم</span>
                        <span>-{booking.discountAmount} ريال</span>
                      </div>
                    )}

                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>المجموع الكلي</span>
                      <span className="text-primary">{booking.totalAmount} ريال</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Next Steps */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>الخطوات التالية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-3">
                      <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold">
                        1
                      </div>
                      <div>
                        <p className="font-medium">تحضير الوثائق</p>
                        <p className="text-sm text-muted-foreground">
                          تأكد من إحضار رخصة القيادة وبطاقة الهوية عند الاستلام
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold">
                        2
                      </div>
                      <div>
                        <p className="font-medium">الوصول في الموعد</p>
                        <p className="text-sm text-muted-foreground">احرص على الوصول في الوقت المحدد لاستلام السيارة</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold">
                        3
                      </div>
                      <div>
                        <p className="font-medium">فحص السيارة</p>
                        <p className="text-sm text-muted-foreground">قم بفحص السيارة مع الموظف قبل الاستلام</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>معلومات الاتصال</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">خدمة العملاء</p>
                        <p className="text-sm text-muted-foreground">+966 50 123 4567</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">البريد الإلكتروني</p>
                        <p className="text-sm text-muted-foreground">info@carrental.sa</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-4">
                      نحن متاحون على مدار الساعة لمساعدتك في أي استفسار
                    </p>
                  </CardContent>
                </Card>

                <div className="flex flex-col gap-3">
                  <Button className="w-full" asChild>
                    <Link href="/bookings">عرض جميع حجوزاتي</Link>
                  </Button>

                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="h-4 w-4 ml-2" />
                    تحميل تأكيد الحجز
                  </Button>

                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/">
                      <ArrowRight className="h-4 w-4 ml-2" />
                      العودة للرئيسية
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
