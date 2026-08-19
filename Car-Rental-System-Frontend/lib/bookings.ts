import { apiRequest } from "./api-client"
import { mapVehicleToCar, type Car } from "./cars"

export type BookingStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled"
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed"

export interface Booking {
  id: string
  userId: string
  carId: string
  car?: Car
  startDate: string
  endDate: string
  totalDays: number
  totalAmount: number
  status: BookingStatus
  paymentStatus: PaymentStatus
  notes: string | null
  pickupLocation: string | null
  returnLocation: string | null
  driverLicense: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateBookingRequest {
  carId: string
  startDate: string
  endDate: string
  notes?: string
  pickupLocation?: string
  returnLocation?: string
  driverLicense?: string
}

export interface BookingFilters {
  status?: BookingStatus
  paymentStatus?: PaymentStatus
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
}

interface ApiBooking {
  id: string
  user_id: string
  vehicle_id: string
  vehicle?: Parameters<typeof mapVehicleToCar>[0]
  start_date: string
  end_date: string
  total_price: string | number
  status: BookingStatus
  payment_status: PaymentStatus
  notes: string | null
  pickup_location: string | null
  return_location: string | null
  driver_license: string | null
  created_at: string
  updated_at: string
}

interface ApiListResponse<T> {
  data: T[]
  count: number
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

function rentalDays(start: string, end: string): number {
  const days = Math.round((new Date(end).getTime() - new Date(start).getTime()) / MS_PER_DAY)
  return Math.max(days, 1)
}

function mapBooking(booking: ApiBooking): Booking {
  return {
    id: booking.id,
    userId: booking.user_id,
    carId: booking.vehicle_id,
    car: booking.vehicle ? mapVehicleToCar(booking.vehicle) : undefined,
    startDate: booking.start_date,
    endDate: booking.end_date,
    totalDays: rentalDays(booking.start_date, booking.end_date),
    // The API prices the booking; the UI only displays what came back.
    totalAmount: Number(booking.total_price),
    status: booking.status,
    paymentStatus: booking.payment_status,
    notes: booking.notes,
    pickupLocation: booking.pickup_location,
    returnLocation: booking.return_location,
    driverLicense: booking.driver_license,
    createdAt: booking.created_at,
    updatedAt: booking.updated_at,
  }
}

class BookingsService {
  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    const booking = await apiRequest<ApiBooking>("/bookings", {
      method: "POST",
      body: {
        vehicle_id: data.carId,
        start_date: data.startDate,
        end_date: data.endDate,
        notes: data.notes || undefined,
        pickup_location: data.pickupLocation || undefined,
        return_location: data.returnLocation || undefined,
        driver_license: data.driverLicense || undefined,
      },
    })

    return mapBooking(booking)
  }

  async getMyBookings(filters: BookingFilters = {}): Promise<BookingsResponse> {
    const page = filters.page ?? 1
    const limit = filters.limit ?? 10

    const response = await apiRequest<ApiListResponse<ApiBooking>>("/bookings/my-bookings", {
      query: {
        status: filters.status,
        paymentStatus: filters.paymentStatus,
        startDate: filters.startDate,
        endDate: filters.endDate,
        page,
        limit,
      },
    })

    return {
      bookings: (response.data ?? []).map(mapBooking),
      total: response.count ?? 0,
      page,
      totalPages: Math.max(Math.ceil((response.count ?? 0) / limit), 1),
    }
  }

  async getBookingById(id: string): Promise<Booking> {
    const booking = await apiRequest<ApiBooking>(`/bookings/${id}`)
    return mapBooking(booking)
  }

  async cancelBooking(id: string): Promise<Booking> {
    const booking = await apiRequest<ApiBooking>(`/bookings/${id}/cancel`, { method: "DELETE" })
    return mapBooking(booking)
  }

  async getBookingsForCar(carId: string): Promise<Booking[]> {
    const response = await apiRequest<ApiListResponse<ApiBooking> | ApiBooking[]>(
      `/bookings/vehicle/${carId}`,
    )

    const rows = Array.isArray(response) ? response : (response.data ?? [])
    return rows.map(mapBooking)
  }
}

export type CreateBookingData = CreateBookingRequest

export const bookingsService = new BookingsService()
