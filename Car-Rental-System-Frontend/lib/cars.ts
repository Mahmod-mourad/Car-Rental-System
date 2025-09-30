// Cars API service with static data fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Import static data
import { staticCars, filterCars, getCarById, type StaticCar } from "./static-data"
import { getCarsFromStorage } from "./local-storage"

export interface Car {
  id: string
  name: string
  brand: string
  model: string
  year: number
  category: string
  categoryId: string
  pricePerDay: number
  description: string
  features: string[]
  images: string[]
  transmission: "manual" | "automatic"
  fuelType: "petrol" | "diesel" | "electric" | "hybrid"
  seats: number
  doors: number
  airConditioning: boolean
  status: "available" | "rented" | "maintenance"
  rating: number
  reviewsCount: number
  location: string
  mileage: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  carsCount: number
}

export interface CarFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  transmission?: string
  fuelType?: string
  seats?: number
  location?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: "price" | "rating" | "year" | "name"
  sortOrder?: "asc" | "desc"
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

class CarsService {
  private getAuthHeaders() {
    const token = localStorage.getItem("accessToken")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async getCars(filters: CarFilters = {}): Promise<CarsResponse> {
    // Use localStorage data or fallback to static data
    try {
      const cars = getCarsFromStorage().length > 0 ? getCarsFromStorage() : staticCars
      let filteredCars = filterCars(cars, filters)
      
      // Apply sorting
      if (filters.sortBy) {
        filteredCars.sort((a, b) => {
          let aValue: any = a[filters.sortBy as keyof StaticCar]
          let bValue: any = b[filters.sortBy as keyof StaticCar]
          
          if (filters.sortBy === "price") {
            aValue = a.pricePerDay
            bValue = b.pricePerDay
          }
          
          if (filters.sortOrder === "desc") {
            return bValue > aValue ? 1 : -1
          }
          return aValue > bValue ? 1 : -1
        })
      }
      
      // Apply pagination
      const page = filters.page || 1
      const limit = filters.limit || 10
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedCars = filteredCars.slice(startIndex, endIndex)
      
      return {
        cars: paginatedCars as Car[],
        total: filteredCars.length,
        page,
        totalPages: Math.ceil(filteredCars.length / limit),
        hasNext: endIndex < filteredCars.length,
        hasPrev: page > 1,
      }
    } catch (error) {
      console.error("Error getting cars from static data:", error)
      throw new Error("فشل في جلب السيارات")
    }
  }

  async getCarById(id: string): Promise<Car> {
    try {
      // Try to get from localStorage first, then fallback to static data
      const cars = getCarsFromStorage()
      let car = cars.find(c => c.id === id)
      
      if (!car) {
        car = getCarById(id)
      }
      
      if (!car) {
        throw new Error("السيارة غير موجودة")
      }
      return car as Car
    } catch (error) {
      console.error("Error getting car by ID:", error)
      throw new Error("فشل في جلب تفاصيل السيارة")
    }
  }

  async getFeaturedCars(): Promise<Car[]> {
    try {
      // Return cars with high ratings as featured
      const featuredCars = staticCars
        .filter(car => car.rating >= 4.5)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6)
      
      return featuredCars as Car[]
    } catch (error) {
      console.error("Error getting featured cars from static data:", error)
      throw new Error("فشل في جلب السيارات المميزة")
    }
  }

  async getLatestCars(): Promise<Car[]> {
    try {
      // Return the most recently added cars
      const latestCars = [...staticCars]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6)
      
      return latestCars as Car[]
    } catch (error) {
      console.error("Error getting latest cars from static data:", error)
      throw new Error("فشل في جلب أحدث السيارات")
    }
  }

  async getSimilarCars(carId: string): Promise<Car[]> {
    try {
      const targetCar = getCarById(carId)
      if (!targetCar) {
        return []
      }
      
      // Find cars with similar category and price range
      const similarCars = staticCars
        .filter(car => 
          car.id !== carId && 
          car.category === targetCar.category &&
          Math.abs(car.pricePerDay - targetCar.pricePerDay) <= 50
        )
        .slice(0, 4)
      
      return similarCars as Car[]
    } catch (error) {
      console.error("Error getting similar cars from static data:", error)
      throw new Error("فشل في جلب السيارات المشابهة")
    }
  }

  async getPopularBrands(): Promise<string[]> {
    try {
      // Get unique brands and count their cars
      const brandCounts = staticCars.reduce((acc, car) => {
        acc[car.brand] = (acc[car.brand] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      // Return brands sorted by car count
      return Object.entries(brandCounts)
        .sort(([,a], [,b]) => b - a)
        .map(([brand]) => brand)
        .slice(0, 10)
    } catch (error) {
      console.error("Error getting popular brands from static data:", error)
      throw new Error("فشل في جلب الماركات الشائعة")
    }
  }

  async getPriceRange(): Promise<PriceRange> {
    try {
      const prices = staticCars.map(car => car.pricePerDay)
      return {
        min: Math.min(...prices),
        max: Math.max(...prices),
      }
    } catch (error) {
      console.error("Error getting price range from static data:", error)
      throw new Error("فشل في جلب نطاق الأسعار")
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      // Get unique categories and count their cars
      const categoryCounts = staticCars.reduce((acc, car) => {
        acc[car.category] = (acc[car.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      return Object.entries(categoryCounts).map(([name, carsCount]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        description: `سيارات ${name}`,
        icon: "car",
        carsCount,
      }))
    } catch (error) {
      console.error("Error getting categories from static data:", error)
      throw new Error("فشل في جلب الفئات")
    }
  }

  async getPopularCategories(): Promise<Category[]> {
    try {
      const categories = await this.getCategories()
      return categories
        .sort((a, b) => b.carsCount - a.carsCount)
        .slice(0, 6)
    } catch (error) {
      console.error("Error getting popular categories from static data:", error)
      throw new Error("فشل في جلب الفئات الشائعة")
    }
  }
}

export const carsService = new CarsService()
