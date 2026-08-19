import { apiRequest } from "./api-client"

/**
 * The API speaks snake_case and calls these "vehicles"; the UI speaks camelCase
 * and calls them "cars". The mapping lives in this file and nowhere else.
 */

export type CarCategory = "sedan" | "suv" | "truck" | "van" | "luxury"
export type Transmission = "manual" | "automatic"
export type FuelType = "gasoline" | "diesel" | "electric" | "hybrid"

export interface Car {
  id: string
  name: string
  brand: string
  model: string
  year: number
  category: CarCategory
  pricePerDay: number
  description: string | null
  color: string | null
  mileage: number | null
  doors: number | null
  airConditioning: boolean
  features: string[]
  images: string[]
  transmission: Transmission
  fuelType: FuelType
  seats: number
  isAvailable: boolean
  rating: number
  reviewsCount: number
  isFeatured: boolean
  location: string | null
  createdAt: string
  updatedAt: string
}

export interface CarFilters {
  make?: string
  model?: string
  /** One box searched across make and model. */
  search?: string
  transmission?: Transmission
  fuelType?: FuelType
  minSeats?: number
  sortBy?: "price" | "rating" | "year" | "name"
  sortOrder?: "asc" | "desc"
  category?: CarCategory
  minPrice?: number
  maxPrice?: number
  minYear?: number
  maxYear?: number
  minRating?: number
  available?: boolean
  isFeatured?: boolean
  /** Radius search. All three are needed for it to apply. */
  lat?: number
  lng?: number
  radiusKm?: number
  page?: number
  limit?: number
}

export interface CarsResponse {
  cars: Car[]
  total: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PriceRange {
  min: number
  max: number
}

export interface Category {
  id: CarCategory
  name: string
  carsCount: number
}

/** Shape the API returns for a vehicle. */
interface ApiVehicle {
  id: string
  make: string
  model: string
  year: number
  type: CarCategory
  transmission: Transmission
  fuel_type: FuelType
  seats: number
  price_per_day: string | number
  available: boolean
  description: string | null
  color: string | null
  mileage: number | null
  doors: number | null
  air_conditioning: boolean
  location_name: string | null
  average_rating: string | number
  review_count: number
  is_featured: boolean
  images: string[] | null
  features: string[] | null
  created_at: string
  updated_at: string
}

interface ApiListResponse<T> {
  data: T[]
  count: number
  page?: number
  limit?: number
}

// Postgres returns decimal columns as strings to avoid losing precision in
// JavaScript numbers. Every price and rating needs this on the way in.
function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0
  return typeof value === "number" ? value : Number.parseFloat(value)
}

export function mapVehicleToCar(vehicle: ApiVehicle): Car {
  return {
    id: vehicle.id,
    name: `${vehicle.make} ${vehicle.model}`,
    brand: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    category: vehicle.type,
    pricePerDay: toNumber(vehicle.price_per_day),
    description: vehicle.description,
    color: vehicle.color,
    mileage: vehicle.mileage,
    doors: vehicle.doors,
    airConditioning: vehicle.air_conditioning ?? true,
    features: vehicle.features ?? [],
    images: vehicle.images ?? [],
    transmission: vehicle.transmission,
    fuelType: vehicle.fuel_type,
    seats: vehicle.seats,
    isAvailable: vehicle.available,
    rating: toNumber(vehicle.average_rating),
    reviewsCount: vehicle.review_count ?? 0,
    isFeatured: vehicle.is_featured ?? false,
    location: vehicle.location_name,
    createdAt: vehicle.created_at,
    updatedAt: vehicle.updated_at,
  }
}

export interface CreateCarInput {
  brand: string
  model: string
  year: number
  category: CarCategory
  transmission: Transmission
  fuelType: FuelType
  seats: number
  pricePerDay: number
  description?: string
  color?: string
  mileage?: number
  doors?: number
  airConditioning?: boolean
  location?: string
  features?: string[]
  images?: string[]
  isAvailable?: boolean
}

function toApiVehiclePayload(input: Partial<CreateCarInput>) {
  // Only send keys the caller actually set. The API rejects unknown properties and
  // an explicit undefined would fail validation on a partial update.
  const payload: Record<string, unknown> = {}
  const set = (key: string, value: unknown) => {
    if (value !== undefined && value !== "") payload[key] = value
  }

  set("make", input.brand)
  set("model", input.model)
  set("year", input.year)
  set("type", input.category)
  set("transmission", input.transmission)
  set("fuel_type", input.fuelType)
  set("seats", input.seats)
  set("price_per_day", input.pricePerDay)
  set("description", input.description)
  set("color", input.color)
  set("mileage", input.mileage)
  set("doors", input.doors)
  if (input.airConditioning !== undefined) payload.air_conditioning = input.airConditioning
  set("location_name", input.location)
  set("features", input.features)
  set("images", input.images)
  if (input.isAvailable !== undefined) payload.available = input.isAvailable

  return payload
}

const CATEGORY_LABELS: Record<CarCategory, string> = {
  sedan: "سيدان",
  suv: "دفع رباعي",
  truck: "شاحنة",
  van: "فان",
  luxury: "فاخرة",
}

class CarsService {
  async getCars(filters: CarFilters = {}): Promise<CarsResponse> {
    const page = filters.page ?? 1
    const limit = filters.limit ?? 12

    const response = await apiRequest<ApiListResponse<ApiVehicle>>("/vehicles", {
      auth: false,
      query: {
        make: filters.make,
        model: filters.model,
        type: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minYear: filters.minYear,
        maxYear: filters.maxYear,
        minRating: filters.minRating,
        available: filters.available,
        isFeatured: filters.isFeatured,
        search: filters.search,
        transmission: filters.transmission,
        fuelType: filters.fuelType,
        minSeats: filters.minSeats,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        lat: filters.lat,
        lng: filters.lng,
        radiusKm: filters.lat && filters.lng ? filters.radiusKm : undefined,
        page,
        limit,
      },
    })

    const total = response.count ?? 0
    const totalPages = Math.max(Math.ceil(total / limit), 1)

    return {
      cars: (response.data ?? []).map(mapVehicleToCar),
      total,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }
  }

  async getCarById(id: string): Promise<Car> {
    const vehicle = await apiRequest<ApiVehicle>(`/vehicles/${id}`, { auth: false })
    return mapVehicleToCar(vehicle)
  }

  async getFeaturedCars(limit = 6): Promise<Car[]> {
    const vehicles = await apiRequest<ApiVehicle[]>("/vehicles/featured", {
      auth: false,
      query: { limit },
    })
    return vehicles.map(mapVehicleToCar)
  }

  async getLatestCars(limit = 6): Promise<Car[]> {
    const vehicles = await apiRequest<ApiVehicle[]>("/vehicles/latest", {
      auth: false,
      query: { limit },
    })
    return vehicles.map(mapVehicleToCar)
  }

  async getSimilarCars(carId: string, limit = 4): Promise<Car[]> {
    const vehicles = await apiRequest<ApiVehicle[]>(`/vehicles/similar/${carId}`, {
      auth: false,
      query: { limit },
    })
    return vehicles.map(mapVehicleToCar)
  }

  async getPopularBrands(limit = 5): Promise<string[]> {
    const brands = await apiRequest<{ make: string }[] | string[]>("/vehicles/brands/popular", {
      auth: false,
      query: { limit },
    })

    return brands.map((brand) => (typeof brand === "string" ? brand : brand.make))
  }

  async getPriceRange(): Promise<PriceRange> {
    const range = await apiRequest<{ min: string | number; max: string | number }>(
      "/vehicles/price-range",
      { auth: false },
    )

    return { min: toNumber(range.min), max: toNumber(range.max) }
  }

  /**
   * The API has no categories resource — the categories are the values of the
   * vehicle type enum. Counts come from one filtered query per type.
   */
  async getCategories(): Promise<Category[]> {
    const types = Object.keys(CATEGORY_LABELS) as CarCategory[]

    const counts = await Promise.all(
      types.map(async (type) => {
        const response = await apiRequest<ApiListResponse<ApiVehicle>>("/vehicles", {
          auth: false,
          query: { type, limit: 1 },
        })
        return { id: type, name: CATEGORY_LABELS[type], carsCount: response.count ?? 0 }
      }),
    )

    return counts
  }

  async getPopularCategories(): Promise<Category[]> {
    const categories = await this.getCategories()
    return [...categories].sort((a, b) => b.carsCount - a.carsCount).slice(0, 4)
  }

  async createCar(input: CreateCarInput): Promise<Car> {
    const vehicle = await apiRequest<ApiVehicle>("/vehicles", {
      method: "POST",
      body: toApiVehiclePayload(input),
    })
    return mapVehicleToCar(vehicle)
  }

  async updateCar(id: string, input: Partial<CreateCarInput>): Promise<Car> {
    const vehicle = await apiRequest<ApiVehicle>(`/vehicles/${id}`, {
      method: "PATCH",
      body: toApiVehiclePayload(input),
    })
    return mapVehicleToCar(vehicle)
  }

  async deleteCar(id: string): Promise<void> {
    await apiRequest<void>(`/vehicles/${id}`, { method: "DELETE" })
  }
}

export const carsService = new CarsService()
export { CATEGORY_LABELS }

/**
 * Option lists for the admin forms. The value is what the API stores; the label is
 * what the form shows. Previously the forms sent their Arabic labels straight to
 * the API, which only accepts these enum values.
 */
export const CATEGORY_OPTIONS: { value: CarCategory; label: string }[] = [
  { value: "sedan", label: "سيدان" },
  { value: "suv", label: "دفع رباعي" },
  { value: "luxury", label: "فاخرة" },
  { value: "van", label: "فان" },
  { value: "truck", label: "شاحنة" },
]

export const TRANSMISSION_OPTIONS: { value: Transmission; label: string }[] = [
  { value: "automatic", label: "أوتوماتيك" },
  { value: "manual", label: "يدوي" },
]

export const FUEL_OPTIONS: { value: FuelType; label: string }[] = [
  { value: "gasoline", label: "بنزين" },
  { value: "diesel", label: "ديزل" },
  { value: "electric", label: "كهربائي" },
  { value: "hybrid", label: "هجين" },
]
