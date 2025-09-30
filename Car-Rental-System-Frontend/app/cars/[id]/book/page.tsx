"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, FileText, Tag, CreditCard } from "lucide-react"
import { carsService, type Car } from "@/lib/cars"
import { bookingsService, type CreateBookingData } from "@/lib/bookings"
import { paymentsService, type PriceCalculation } from "@/lib/payments"

export default function BookCarPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const carId = params.id as string

  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [priceCalculation, setPriceCalculation] = useState<PriceCalculation | null>(null)

  const [formData, setFormData] = useState<CreateBookingData>({
    carId,
    startDate: "",
    endDate: "",
    pickupLocation: "",
    dropoffLocation: "",
    driverLicense: "",
    additionalNotes: "",
    discountCode: "",
  })

  const [discountLoading, setDiscountLoading] = useState(false)
  const [discountApplied, setDiscountApplied] = useState(false)

  useEffect(() => {
    const loadCar = async () => {
      if (!carId) return

      try {
        const carData = await carsService.getCarById(carId)
        setCar(carData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "فشل في جلب تفاصيل السيارة")
      } finally {
        setLoading(false)
      }
    }

    loadCar()
  }, [carId])

  useEffect(() => {
    if (formData.startDate && formData.endDate && car) {
      calculatePrice()
    }
  }, [formData.startDate, formData.endDate, car])

  const calculatePrice = async () => {
    if (!formData.startDate || !formData.endDate || !car) return

    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    if (totalDays <= 0) return

    const subtotal = totalDays * car.pricePerDay
    setPriceCalculation({
      subtotal,
      discountAmount: 0,
      totalAmount: subtotal,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const applyDiscount = async () => {
    if (!formData.discountCode.trim()) return

    setDiscountLoading(true)
    try {
      const validation = await paymentsService.validateDiscount(formData.discountCode)
      if (validation.valid && priceCalculation) {
        const discountAmount = (priceCalculation.subtotal * validation.discountPercentage) / 100
        setPriceCalculation({
          ...priceCalculation,
          discountAmount,
          totalAmount: priceCalculation.subtotal - discountAmount,
          discountPercentage: validation.discountPercentage,
        })
        setDiscountApplied(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "كود الخصم غير صحيح")
    } finally {
      setDiscountLoading(false)
    }
  }

  const removeDiscount = () => {
    if (priceCalculation) {
      setPriceCalculation({
        subtotal: priceCalculation.subtotal,
        discountAmount: 0,
        totalAmount: priceCalculation.subtotal,
      })
    }
    setFormData((prev) => ({ ...prev, discountCode: "" }))
    setDiscountApplied(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!car || !user) return

    setSubmitting(true)
    setError("")

    try {
      // Validate dates
      const startDate = new Date(formData.startDate)
      const endDate = new Date(formData.endDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (startDate < today) {
        throw new Error("تاريخ البداية لا يمكن أن يكون في الماضي")
      }

      if (endDate <= startDate) {
        throw new Error("تاريخ النهاية يجب أن يكون بعد تاريخ البداية")
      }

      // Create booking
      const booking = await bookingsService.createBooking(formData)

      // Redirect to payment page
      router.push(`/bookings/${booking.id}/payment`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء إنشاء الحجز")
    } finally {
      setSubmitting(false)
    }
  }

  const getTotalDays = () => {
    if (!formData.startDate || !formData.endDate) return 0
    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
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
                <div className="space-y-4">
                  <div className="bg-muted rounded h-8 w-3/4"></div>
                  <div className="bg-muted rounded h-64"></div>
                </div>
                <div className="bg-muted rounded-lg h-64"></div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    )
  }

  if (!car) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Alert variant="destructive">
              <AlertDescription>لم يتم العثور على السيارة</AlertDescription>
            </Alert>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    )
  }

  const totalDays = getTotalDays()

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">حجز السيارة</h1>
            <p className="text-muted-foreground">أكمل بياناتك لحجز السيارة</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل الحجز</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {/* Date Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">تاريخ البداية</Label>
                        <div className="relative">
                          <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="startDate"
                            name="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            className="pr-10"
                            min={new Date().toISOString().split("T")[0]}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endDate">تاريخ النهاية</Label>
                        <div className="relative">
                          <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="endDate"
                            name="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            className="pr-10"
                            min={formData.startDate || new Date().toISOString().split("T")[0]}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Location Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pickupLocation">مكان الاستلام</Label>
                        <div className="relative">
                          <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="pickupLocation"
                            name="pickupLocation"
                            placeholder="أدخل مكان الاستلام"
                            value={formData.pickupLocation}
                            onChange={handleInputChange}
                            className="pr-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dropoffLocation">مكان التسليم</Label>
                        <div className="relative">
                          <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="dropoffLocation"
                            name="dropoffLocation"
                            placeholder="أدخل مكان التسليم"
                            value={formData.dropoffLocation}
                            onChange={handleInputChange}
                            className="pr-10"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Driver License */}
                    <div className="space-y-2">
                      <Label htmlFor="driverLicense">رقم رخصة القيادة</Label>
                      <div className="relative">
                        <FileText className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="driverLicense"
                          name="driverLicense"
                          placeholder="أدخل رقم رخصة القيادة"
                          value={formData.driverLicense}
                          onChange={handleInputChange}
                          className="pr-10"
                          required
                        />
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="additionalNotes">ملاحظات إضافية (اختياري)</Label>
                      <Textarea
                        id="additionalNotes"
                        name="additionalNotes"
                        placeholder="أي ملاحظات أو طلبات خاصة"
                        value={formData.additionalNotes}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>

                    {/* Discount Code */}
                    <div className="space-y-2">
                      <Label htmlFor="discountCode">كود الخصم (اختياري)</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="discountCode"
                            name="discountCode"
                            placeholder="أدخل كود الخصم"
                            value={formData.discountCode}
                            onChange={handleInputChange}
                            className="pr-10"
                            disabled={discountApplied}
                          />
                        </div>
                        {!discountApplied ? (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={applyDiscount}
                            disabled={!formData.discountCode.trim() || discountLoading}
                          >
                            {discountLoading ? "جاري التحقق..." : "تطبيق"}
                          </Button>
                        ) : (
                          <Button type="button" variant="outline" onClick={removeDiscount}>
                            إزالة
                          </Button>
                        )}
                      </div>
                      {discountApplied && priceCalculation?.discountPercentage && (
                        <p className="text-sm text-blue-600">تم تطبيق خصم {priceCalculation.discountPercentage}%</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={submitting || !priceCalculation}>
                      {submitting ? "جاري إنشاء الحجز..." : "متابعة للدفع"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="space-y-6">
              {/* Car Details */}
              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل السيارة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <img
                      src={car.images?.[0] || "/placeholder.svg?height=100&width=150&query=car"}
                      alt={car.name}
                      className="w-24 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{car.name}</h3>
                      <p className="text-sm text-muted-foreground">{car.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{car.transmission === "automatic" ? "أوتوماتيك" : "يدوي"}</Badge>
                        <Badge variant="outline">{car.seats} مقاعد</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Summary */}
              {priceCalculation && totalDays > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      ملخص التكلفة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>السعر لليوم الواحد</span>
                      <span>{car.pricePerDay} ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span>عدد الأيام</span>
                      <span>{totalDays} يوم</span>
                    </div>
                    <div className="flex justify-between">
                      <span>المجموع الفرعي</span>
                      <span>{priceCalculation.subtotal} ريال</span>
                    </div>

                    {priceCalculation.discountAmount > 0 && (
                      <div className="flex justify-between text-blue-600">
                        <span>الخصم</span>
                        <span>-{priceCalculation.discountAmount} ريال</span>
                      </div>
                    )}

                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>المجموع الكلي</span>
                      <span className="text-primary">{priceCalculation.totalAmount} ريال</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Booking Info */}
              {formData.startDate && formData.endDate && (
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات الحجز</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">تاريخ البداية</span>
                      <span>{new Date(formData.startDate).toLocaleDateString("ar-SA")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">تاريخ النهاية</span>
                      <span>{new Date(formData.endDate).toLocaleDateString("ar-SA")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">مدة الإيجار</span>
                      <span>{totalDays} يوم</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
