"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Shield } from "lucide-react"
import { bookingsService, type Booking } from "@/lib/bookings"
import { paymentsService } from "@/lib/payments"

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const bookingId = params.id as string

  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedMethod, setSelectedMethod] = useState<"stripe" | "paypal">("stripe")

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

  const handlePayment = async () => {
    if (!booking) return

    setPaymentLoading(true)
    setError("")

    try {
      if (selectedMethod === "stripe") {
        const { clientSecret } = await paymentsService.createStripePayment({
          bookingId: booking.id,
          amount: booking.totalAmount,
          method: "stripe",
        })

        // In a real app, you would integrate with Stripe Elements here
        // For now, we'll simulate a successful payment
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Confirm booking after successful payment
        await bookingsService.confirmBooking(booking.id)

        router.push(`/bookings/${booking.id}/confirmation`)
      } else if (selectedMethod === "paypal") {
        const { approvalUrl } = await paymentsService.createPayPalPayment({
          bookingId: booking.id,
          amount: booking.totalAmount,
          method: "paypal",
        })

        // Redirect to PayPal
        window.location.href = approvalUrl
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء الدفع")
    } finally {
      setPaymentLoading(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-8">
              <div className="bg-muted rounded-lg h-32"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-muted rounded-lg h-64"></div>
                <div className="bg-muted rounded-lg h-64"></div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    )
  }

  if (!booking) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Alert variant="destructive">
              <AlertDescription>لم يتم العثور على الحجز</AlertDescription>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">إتمام الدفع</h1>
            <p className="text-muted-foreground">اختر طريقة الدفع المناسبة لك</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Methods */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    طرق الدفع
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Stripe Payment */}
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedMethod === "stripe" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => setSelectedMethod("stripe")}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          selectedMethod === "stripe" ? "border-primary bg-primary" : "border-muted-foreground"
                        }`}
                      >
                        {selectedMethod === "stripe" && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">بطاقة ائتمان/خصم</h3>
                        <p className="text-sm text-muted-foreground">ادفع بأمان باستخدام بطاقتك الائتمانية</p>
                      </div>
                      <div className="flex gap-1">
                        <img src="/visa-logo.png" alt="Visa" className="h-6" />
                        <img src="/mastercard-logo.png" alt="Mastercard" className="h-6" />
                      </div>
                    </div>
                  </div>

                  {/* PayPal Payment */}
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedMethod === "paypal" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => setSelectedMethod("paypal")}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          selectedMethod === "paypal" ? "border-primary bg-primary" : "border-muted-foreground"
                        }`}
                      >
                        {selectedMethod === "paypal" && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">PayPal</h3>
                        <p className="text-sm text-muted-foreground">ادفع باستخدام حساب PayPal الخاص بك</p>
                      </div>
                      <img src="/paypal-logo.png" alt="PayPal" className="h-6" />
                    </div>
                  </div>

                  <Button onClick={handlePayment} className="w-full" size="lg" disabled={paymentLoading}>
                    {paymentLoading ? "جاري المعالجة..." : `ادفع ${booking.totalAmount} ريال`}
                  </Button>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                    <Shield className="h-4 w-4" />
                    <span>دفعاتك محمية بتشفير SSL</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="space-y-6">
              {/* Car Details */}
              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل الحجز</CardTitle>
                </CardHeader>
                <CardContent>
                  {booking.car && (
                    <div className="flex gap-4 mb-4">
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
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">تاريخ البداية</span>
                      <span>{new Date(booking.startDate).toLocaleDateString("ar-SA")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">تاريخ النهاية</span>
                      <span>{new Date(booking.endDate).toLocaleDateString("ar-SA")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">مدة الإيجار</span>
                      <span>{booking.totalDays} يوم</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">مكان الاستلام</span>
                      <span>{booking.pickupLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">مكان التسليم</span>
                      <span>{booking.dropoffLocation}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Breakdown */}
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

              {/* Status */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Badge variant={booking.status === "pending" ? "secondary" : "default"}>
                      {booking.status === "pending" ? "في انتظار الدفع" : booking.status}
                    </Badge>
                    <Badge variant={booking.paymentStatus === "pending" ? "secondary" : "default"}>
                      {booking.paymentStatus === "pending" ? "لم يتم الدفع" : booking.paymentStatus}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
