import { apiRequest } from "./api-client"
import { mapVehicleToCar, type Car } from "./cars"
import type { Booking, BookingStatus } from "./bookings"
import type { Payment } from "./payments"

/**
 * Reads the admin dashboard needs. Every one of these endpoints is guarded by the
 * admin role on the API — the UI hiding a button is not what keeps them safe.
 */

export interface AdminUser {
  id: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
  lastLogin: string | null
  firstName: string | null
  lastName: string | null
}

export interface AdminStats {
  totalUsers: number
  totalCars: number
  totalBookings: number
  totalRevenue: number
  activeBookings: number
  pendingBookings: number
  availableCars: number
  rentedCars: number
}

interface ApiListResponse<T> {
  data: T[]
  count: number
}

/** The API's user shape, with the profile joined in. */
interface ApiUser {
  id: string
  email: string
  role: string
  is_active?: boolean
  created_at: string
  last_login?: string | null
  profile?: { first_name?: string | null; last_name?: string | null } | null
}

interface ApiBookingRow {
  id: string
  user_id: string
  vehicle_id: string
  vehicle?: Parameters<typeof mapVehicleToCar>[0]
  start_date: string
  end_date: string
  total_price: string | number
  status: Booking["status"]
  payment_status: Booking["paymentStatus"]
  notes?: string | null
  pickup_location?: string | null
  return_location?: string | null
  driver_license?: string | null
  created_at: string
  updated_at: string
}

interface ApiPaymentRow {
  id: string
  booking_id: string
  amount: string | number
  payment_method: Payment["method"]
  status: Payment["status"]
  transaction_id?: string | null
  created_at: string
}

function unwrap<T>(response: ApiListResponse<T> | T[]): T[] {
  return Array.isArray(response) ? response : (response.data ?? [])
}

class AdminService {
  async getUsers(): Promise<AdminUser[]> {
    const response = await apiRequest<ApiListResponse<ApiUser> | ApiUser[]>("/users")

    return unwrap(response).map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.is_active ?? true,
      createdAt: user.created_at,
      lastLogin: user.last_login ?? null,
      firstName: user.profile?.first_name ?? null,
      lastName: user.profile?.last_name ?? null,
    }))
  }

  async getAllBookings(): Promise<Booking[]> {
    const response = await apiRequest<ApiListResponse<ApiBookingRow> | ApiBookingRow[]>("/bookings", {
      query: { limit: 100 },
    })

    return unwrap(response).map((booking) => ({
      id: booking.id,
      userId: booking.user_id,
      carId: booking.vehicle_id,
      car: booking.vehicle ? mapVehicleToCar(booking.vehicle) : undefined,
      startDate: booking.start_date,
      endDate: booking.end_date,
      totalDays: Math.max(
        Math.round(
          (new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) /
            (24 * 60 * 60 * 1000),
        ),
        1,
      ),
      totalAmount: Number(booking.total_price),
      status: booking.status,
      paymentStatus: booking.payment_status,
      notes: booking.notes ?? null,
      pickupLocation: booking.pickup_location ?? null,
      returnLocation: booking.return_location ?? null,
      driverLicense: booking.driver_license ?? null,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at,
    }))
  }

  async getAllPayments(): Promise<Payment[]> {
    const response = await apiRequest<ApiListResponse<ApiPaymentRow> | ApiPaymentRow[]>("/payments", {
      query: { limit: 100 },
    })

    return unwrap(response).map((payment) => ({
      id: payment.id,
      bookingId: payment.booking_id,
      amount: Number(payment.amount),
      method: payment.payment_method,
      status: payment.status,
      transactionId: payment.transaction_id ?? null,
      createdAt: payment.created_at,
    }))
  }

  async getAllCars(): Promise<Car[]> {
    const response = await apiRequest<ApiListResponse<Parameters<typeof mapVehicleToCar>[0]>>("/vehicles", {
      auth: false,
      query: { limit: 100 },
    })

    return unwrap(response).map(mapVehicleToCar)
  }

  async setBookingStatus(bookingId: string, status: BookingStatus): Promise<void> {
    await apiRequest(`/bookings/${bookingId}/status/${status}`, { method: "PATCH" })
  }

  /**
   * Pulls everything the dashboard shows in one go and derives the tiles from it.
   * Revenue counts completed payments only — pending ones are money not yet taken.
   */
  async getDashboard(): Promise<{
    users: AdminUser[]
    bookings: Booking[]
    payments: Payment[]
    cars: Car[]
    stats: AdminStats
  }> {
    const [users, bookings, payments, cars] = await Promise.all([
      this.getUsers(),
      this.getAllBookings(),
      this.getAllPayments(),
      this.getAllCars(),
    ])

    const stats: AdminStats = {
      totalUsers: users.length,
      totalCars: cars.length,
      totalBookings: bookings.length,
      totalRevenue: payments
        .filter((payment) => payment.status === "completed")
        .reduce((sum, payment) => sum + payment.amount, 0),
      activeBookings: bookings.filter((b) => b.status === "confirmed" || b.status === "active")
        .length,
      pendingBookings: bookings.filter((b) => b.status === "pending").length,
      availableCars: cars.filter((car) => car.isAvailable).length,
      rentedCars: cars.filter((car) => !car.isAvailable).length,
    }

    return { users, bookings, payments, cars, stats }
  }
}

export const adminService = new AdminService()
