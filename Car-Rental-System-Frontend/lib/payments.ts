import { apiRequest } from "./api-client"

export type PaymentMethod = "credit_card" | "debit_card" | "paypal" | "bank_transfer" | "other"
export type PaymentStatus =
  | "pending"
  | "completed"
  | "failed"
  | "refunded"
  | "partially_refunded"

export interface Payment {
  id: string
  bookingId: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  transactionId: string | null
  createdAt: string
}

interface ApiPayment {
  id: string
  booking_id: string
  amount: string | number
  payment_method: PaymentMethod
  status: PaymentStatus
  transaction_id: string | null
  created_at: string
}

interface ApiListResponse<T> {
  data: T[]
  count: number
}

function mapPayment(payment: ApiPayment): Payment {
  return {
    id: payment.id,
    bookingId: payment.booking_id,
    amount: Number(payment.amount),
    method: payment.payment_method,
    status: payment.status,
    transactionId: payment.transaction_id,
    createdAt: payment.created_at,
  }
}

class PaymentsService {
  /**
   * Opens a payment against a booking. The amount is not passed — the API charges
   * whatever is still owed, so the browser cannot decide what a rental costs.
   *
   * The payment comes back pending. Nothing here can mark it complete; settling a
   * payment is an administrative action on the API.
   */
  async createPayment(bookingId: string, method: PaymentMethod): Promise<Payment> {
    const payment = await apiRequest<ApiPayment>("/payments", {
      method: "POST",
      body: { booking_id: bookingId, payment_method: method },
    })

    return mapPayment(payment)
  }

  async getMyPayments(): Promise<Payment[]> {
    const response = await apiRequest<ApiListResponse<ApiPayment>>("/payments/my-payments")
    return (response.data ?? []).map(mapPayment)
  }

  async getPaymentsForBooking(bookingId: string): Promise<Payment[]> {
    const response = await apiRequest<ApiListResponse<ApiPayment> | ApiPayment[]>(
      `/payments/booking/${bookingId}`,
    )

    const rows = Array.isArray(response) ? response : (response.data ?? [])
    return rows.map(mapPayment)
  }

  async getTotalPaid(bookingId: string): Promise<number> {
    const result = await apiRequest<{ total: string | number }>(
      `/payments/booking/${bookingId}/total-paid`,
    )

    return Number(result.total ?? 0)
  }
}

export const paymentsService = new PaymentsService()
