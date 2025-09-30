// Bookings API service with static data fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Import static data
import { 
  staticBookings, 
  getBookingsByUserId, 
  type StaticBooking 
} from "./static-data"
import { getBookingsFromStorage } from "./local-storage"

export interface Booking {
  id: string
  userId: string
  carId: string
  car?: {
    id: string
    name: string
    brand: string
    model: string
    images: string[]
    pricePerDay: number
  }
  startDate: string
  endDate: string
  totalDays: number
  totalAmount: number
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  pickupLocation: string
  returnLocation: string
  createdAt: string
  updatedAt: string
}

export interface CreateBookingRequest {
  carId: string
  startDate: string
  endDate: string
  pickupLocation: string
  returnLocation: string
}

export interface UpdateBookingRequest {
  status?: string
  paymentStatus?: string
}

export interface BookingFilters {
  status?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface BookingsResponse {
  bookings: Booking[]
  total: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

class BookingsService {
  private getAuthHeaders() {
    const token = localStorage.getItem("accessToken")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async getMyBookings(filters: BookingFilters = {}): Promise<BookingsResponse> {
    try {
      // For demo purposes, assume current user ID is "user1"
      const userId = "user1"
      let userBookings = getBookingsByUserId(userId)
      
      // Apply filters
      if (filters.status) {
        userBookings = userBookings.filter(booking => booking.status === filters.status)
      }
      
      if (filters.startDate) {
        userBookings = userBookings.filter(booking => booking.startDate >= filters.startDate!)
      }
      
      if (filters.endDate) {
        userBookings = userBookings.filter(booking => booking.endDate <= filters.endDate!)
      }
      
      // Apply pagination
      const page = filters.page || 1
      const limit = filters.limit || 10
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedBookings = userBookings.slice(startIndex, endIndex)
      
      return {
        bookings: paginatedBookings as Booking[],
        total: userBookings.length,
        page,
        totalPages: Math.ceil(userBookings.length / limit),
        hasNext: endIndex < userBookings.length,
        hasPrev: page > 1,
      }
    } catch (error) {
      console.error("Error getting bookings from static data:", error)
      throw new Error("فشل في جلب الحجوزات")
    }
  }

  async getBookingById(id: string): Promise<Booking> {
    try {
      const booking = staticBookings.find(b => b.id === id)
      if (!booking) {
        throw new Error("الحجز غير موجود")
      }
      return booking as Booking
    } catch (error) {
      console.error("Error getting booking by ID from static data:", error)
      throw new Error("فشل في جلب تفاصيل الحجز")
    }
  }

  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    try {
      // Simulate creating a new booking
      const newBooking: StaticBooking = {
        id: `booking_${Date.now()}`,
        userId: "user1", // Assume current user
        carId: data.carId,
        startDate: data.startDate,
        endDate: data.endDate,
        totalDays: Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)),
        totalAmount: 0, // Will be calculated based on car price
        status: "pending",
        paymentStatus: "pending",
        pickupLocation: data.pickupLocation,
        returnLocation: data.returnLocation,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      // In a real app, this would be saved to the database
      console.log("Created booking:", newBooking)
      
      return newBooking as Booking
    } catch (error) {
      console.error("Error creating booking:", error)
      throw new Error("فشل في إنشاء الحجز")
    }
  }

  async updateBooking(id: string, data: UpdateBookingRequest): Promise<Booking> {
    try {
      const booking = staticBookings.find(b => b.id === id)
      if (!booking) {
        throw new Error("الحجز غير موجود")
      }
      
      // Simulate updating the booking
      const updatedBooking = {
        ...booking,
        ...data,
        updatedAt: new Date().toISOString(),
      }
      
      console.log("Updated booking:", updatedBooking)
      
      return updatedBooking as Booking
    } catch (error) {
      console.error("Error updating booking:", error)
      throw new Error("فشل في تحديث الحجز")
    }
  }

  async cancelBooking(id: string): Promise<void> {
    try {
      const booking = staticBookings.find(b => b.id === id)
      if (!booking) {
        throw new Error("الحجز غير موجود")
      }
      
      // Simulate cancelling the booking
      console.log("Cancelled booking:", id)
      
      // In a real app, this would update the booking status in the database
    } catch (error) {
      console.error("Error cancelling booking:", error)
      throw new Error("فشل في إلغاء الحجز")
    }
  }

  async getAllBookings(filters: BookingFilters = {}): Promise<BookingsResponse> {
    try {
      let allBookings = [...staticBookings]
      
      // Apply filters
      if (filters.status) {
        allBookings = allBookings.filter(booking => booking.status === filters.status)
      }
      
      if (filters.startDate) {
        allBookings = allBookings.filter(booking => booking.startDate >= filters.startDate!)
      }
      
      if (filters.endDate) {
        allBookings = allBookings.filter(booking => booking.endDate <= filters.endDate!)
      }
      
      // Apply pagination
      const page = filters.page || 1
      const limit = filters.limit || 10
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedBookings = allBookings.slice(startIndex, endIndex)
      
      return {
        bookings: paginatedBookings as Booking[],
        total: allBookings.length,
        page,
        totalPages: Math.ceil(allBookings.length / limit),
        hasNext: endIndex < allBookings.length,
        hasPrev: page > 1,
      }
    } catch (error) {
      console.error("Error getting all bookings from static data:", error)
      throw new Error("فشل في جلب جميع الحجوزات")
    }
  }
}

export const bookingsService = new BookingsService()
