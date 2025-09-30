// Payments API service with static data fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Import static data
import { 
  staticPayments, 
  getPaymentsByUserId, 
  type StaticPayment 
} from "./static-data"

export interface Payment {
  id: string
  bookingId: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded"
  method: "credit_card" | "debit_card" | "cash" | "bank_transfer"
  transactionId?: string
  createdAt: string
}

export interface CreatePaymentRequest {
  bookingId: string
  amount: number
  method: string
}

export interface PaymentFilters {
  status?: string
  method?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface PaymentsResponse {
  payments: Payment[]
  total: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

class PaymentsService {
  private getAuthHeaders() {
    const token = localStorage.getItem("accessToken")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async getMyPayments(filters: PaymentFilters = {}): Promise<Payment[]> {
    try {
      // For demo purposes, assume current user ID is "user1"
      const userId = "user1"
      let userPayments = getPaymentsByUserId(userId)
      
      // Apply filters
      if (filters.status) {
        userPayments = userPayments.filter(payment => payment.status === filters.status)
      }
      
      if (filters.method) {
        userPayments = userPayments.filter(payment => payment.method === filters.method)
      }
      
      if (filters.startDate) {
        userPayments = userPayments.filter(payment => payment.createdAt >= filters.startDate!)
      }
      
      if (filters.endDate) {
        userPayments = userPayments.filter(payment => payment.createdAt <= filters.endDate!)
      }
      
      return userPayments as Payment[]
    } catch (error) {
      console.error("Error getting payments from static data:", error)
      throw new Error("فشل في جلب المدفوعات")
    }
  }

  async getPaymentById(id: string): Promise<Payment> {
    try {
      const payment = staticPayments.find(p => p.id === id)
      if (!payment) {
        throw new Error("الدفعة غير موجودة")
      }
      return payment as Payment
    } catch (error) {
      console.error("Error getting payment by ID from static data:", error)
      throw new Error("فشل في جلب تفاصيل الدفعة")
    }
  }

  async createPayment(data: CreatePaymentRequest): Promise<Payment> {
    try {
      // Simulate creating a new payment
      const newPayment: StaticPayment = {
        id: `payment_${Date.now()}`,
        bookingId: data.bookingId,
        amount: data.amount,
        currency: "SAR",
        status: "pending",
        method: data.method as any,
        createdAt: new Date().toISOString(),
      }
      
      // In a real app, this would be saved to the database
      console.log("Created payment:", newPayment)
      
      return newPayment as Payment
    } catch (error) {
      console.error("Error creating payment:", error)
      throw new Error("فشل في إنشاء الدفعة")
    }
  }

  async processPayment(paymentId: string): Promise<Payment> {
    try {
      const payment = staticPayments.find(p => p.id === paymentId)
      if (!payment) {
        throw new Error("الدفعة غير موجودة")
      }
      
      // Simulate processing the payment
      const processedPayment = {
        ...payment,
        status: "completed" as const,
        transactionId: `TXN${Date.now()}`,
      }
      
      console.log("Processed payment:", processedPayment)
      
      return processedPayment as Payment
    } catch (error) {
      console.error("Error processing payment:", error)
      throw new Error("فشل في معالجة الدفعة")
    }
  }

  async getAllPayments(filters: PaymentFilters = {}): Promise<PaymentsResponse> {
    try {
      let allPayments = [...staticPayments]
      
      // Apply filters
      if (filters.status) {
        allPayments = allPayments.filter(payment => payment.status === filters.status)
      }
      
      if (filters.method) {
        allPayments = allPayments.filter(payment => payment.method === filters.method)
      }
      
      if (filters.startDate) {
        allPayments = allPayments.filter(payment => payment.createdAt >= filters.startDate!)
      }
      
      if (filters.endDate) {
        allPayments = allPayments.filter(payment => payment.createdAt <= filters.endDate!)
      }
      
      // Apply pagination
      const page = filters.page || 1
      const limit = filters.limit || 10
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedPayments = allPayments.slice(startIndex, endIndex)
      
      return {
        payments: paginatedPayments as Payment[],
        total: allPayments.length,
        page,
        totalPages: Math.ceil(allPayments.length / limit),
        hasNext: endIndex < allPayments.length,
        hasPrev: page > 1,
      }
    } catch (error) {
      console.error("Error getting all payments from static data:", error)
      throw new Error("فشل في جلب جميع المدفوعات")
    }
  }
}

export const paymentsService = new PaymentsService()
