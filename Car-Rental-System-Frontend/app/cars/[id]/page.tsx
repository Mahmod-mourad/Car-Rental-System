"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CarCard } from "@/components/cars/car-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  Users,
  Fuel,
  Settings,
  MapPin,
  Calendar,
  Gauge,
  Shield,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { carsService, type Car } from "@/lib/cars"

export default function CarDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const carId = params.id as string

  const [car, setCar] = useState<Car | null>(null)
  const [similarCars, setSimilarCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const loadCarDetails = async () => {
      if (!carId) return

      setLoading(true)
      setError("")

      try {
        const [carData, similarCarsData] = await Promise.all([
          carsService.getCarById(carId),
          carsService.getSimilarCars(carId),
        ])

        setCar(carData)
        setSimilarCars(similarCarsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "حدث خطأ أثناء جلب تفاصيل السيارة")
      } finally {
        setLoading(false)
      }
    }

    loadCarDetails()
  }, [carId])

  const getTransmissionText = (transmission: string) => {
    return transmission === "automatic" ? "أوتوماتيك" : "يدوي"
  }

  const getFuelTypeText = (fuelType: string) => {
    const fuelTypes = {
      petrol: "بنزين",
      diesel: "ديزل",
      electric: "كهربائي",
      hybrid: "هجين",
    }
    return fuelTypes[fuelType as keyof typeof fuelTypes] || fuelType
  }

  const nextImage = () => {
    if (car?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length)
    }
  }

  const prevImage = () => {
    if (car?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="bg-muted rounded-lg h-96"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-muted rounded h-8 w-3/4"></div>
                <div className="bg-muted rounded h-4 w-1/2"></div>
                <div className="bg-muted rounded h-32"></div>
              </div>
              <div className="bg-muted rounded-lg h-64"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !car) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error || "لم يتم العثور على السيارة"}</AlertDescription>
          </Alert>
          <div className="mt-6">
            <Button onClick={() => router.back()}>
              <ArrowRight className="h-4 w-4 ml-2" />
              العودة
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }


  // The API tracks availability as a boolean; there is no "maintenance" state.
  const availabilityBadge = car.isAvailable
    ? { text: "متاحة للحجز", variant: "default" as const }
    : { text: "غير متاحة", variant: "secondary" as const }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            الرئيسية
          </Link>
          <span>/</span>
          <Link href="/cars" className="hover:text-primary">
            السيارات
          </Link>
          <span>/</span>
          <span className="text-foreground">{car.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={car.images?.[currentImageIndex] || "/placeholder.svg?height=400&width=600&query=car"}
                  alt={car.name}
                  className="w-full h-96 object-cover"
                />

                {/* Image Navigation */}
                {car.images && car.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      onClick={prevImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      onClick={nextImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {car.images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? "bg-white" : "bg-white/50"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <Badge variant={availabilityBadge.variant}>{availabilityBadge.text}</Badge>
                </div>

                {/* Rating */}
                {car.rating > 0 && (
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded flex items-center gap-1">
                    <Star className="h-4 w-4 fill-blue-400 text-blue-400" />
                    <span>{car.rating.toFixed(1)}</span>
                    <span className="text-sm">({car.reviewsCount})</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Car Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{car.name}</CardTitle>
                    <p className="text-muted-foreground mt-1">{car.category}</p>
                  </div>
                  <div className="text-left">
                    <div className="text-3xl font-bold text-primary">{car.pricePerDay} ريال</div>
                    <div className="text-sm text-muted-foreground">لليوم الواحد</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Specifications */}
                <div>
                  <h3 className="font-semibold mb-4">المواصفات</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{getTransmissionText(car.transmission)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{car.seats} مقاعد</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{getFuelTypeText(car.fuelType)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{car.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{car.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{car.mileage?.toLocaleString() ?? "-"} كم</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{car.doors} أبواب</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{car.airConditioning ? "مكيف" : "بدون مكيف"}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-3">الوصف</h3>
                  <p className="text-muted-foreground leading-relaxed">{car.description}</p>
                </div>

                {/* Features */}
                {car.features && car.features.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">المميزات</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {car.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card>
              <CardHeader>
                <CardTitle>احجز هذه السيارة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{car.pricePerDay} ريال</div>
                  <div className="text-sm text-muted-foreground">لليوم الواحد</div>
                </div>

                {car.isAvailable ? (
                  <Button className="w-full" size="lg" asChild>
                    <Link href={`/cars/${car.id}/book`}>احجز الآن</Link>
                  </Button>
                ) : (
                  <Button className="w-full" size="lg" disabled>
                    غير متاحة حالياً
                  </Button>
                )}

                <div className="text-center">
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/contact">اتصل بنا للاستفسار</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>تحتاج مساعدة؟</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  فريق خدمة العملاء متاح لمساعدتك في اختيار السيارة المناسبة
                </div>
                <div className="space-y-2">
                  <div className="text-sm">📞 +966 50 123 4567</div>
                  <div className="text-sm">✉️ info@carrental.sa</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Cars */}
        {similarCars.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">سيارات مشابهة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {similarCars.slice(0, 4).map((similarCar) => (
                <CarCard key={similarCar.id} car={similarCar} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
