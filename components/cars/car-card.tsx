import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, Fuel, Settings, MapPin } from "lucide-react"
import type { Car } from "@/lib/cars"

interface CarCardProps {
  car: Car
}

export function CarCard({ car }: CarCardProps) {
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { text: "متاحة", variant: "default" as const },
      rented: { text: "مؤجرة", variant: "secondary" as const },
      maintenance: { text: "صيانة", variant: "destructive" as const },
    }
    return statusConfig[status as keyof typeof statusConfig] || { text: status, variant: "default" as const }
  }

  const statusBadge = getStatusBadge(car.status)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        <img
          src={car.images?.[0] || "/placeholder.svg?height=200&width=300&query=car"}
          alt={car.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <Badge variant={statusBadge.variant}>{statusBadge.text}</Badge>
        </div>
        {car.rating > 0 && (
          <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded flex items-center gap-1 text-sm">
            <Star className="h-3 w-3 fill-blue-400 text-blue-400" />
            <span>{car.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Car name and category */}
          <div>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {car.name}
            </h3>
            <p className="text-sm text-muted-foreground">{car.category}</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Settings className="h-3 w-3" />
              <span>{getTransmissionText(car.transmission)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{car.seats} مقاعد</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="h-3 w-3" />
              <span>{getFuelTypeText(car.fuelType)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{car.location}</span>
            </div>
          </div>

          {/* Price and action */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div>
              <span className="text-2xl font-bold text-primary">{car.pricePerDay}</span>
              <span className="text-muted-foreground text-sm"> ريال/يوم</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/cars/${car.id}`}>التفاصيل</Link>
              </Button>
              {car.status === "available" && (
                <Button size="sm" asChild>
                  <Link href={`/cars/${car.id}/book`}>احجز الآن</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
