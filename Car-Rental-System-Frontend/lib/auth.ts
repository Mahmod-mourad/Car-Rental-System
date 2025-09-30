// Authentication utilities and API calls
import { config } from "./config"

const API_BASE_URL = config.api.baseUrl

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: "user" | "admin" | "staff"
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

class AuthService {
  private getAuthHeaders() {
    const token = localStorage.getItem("accessToken")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Check if backend is available
    if (!config.api.isBackendAvailable()) {
      throw new Error("Backend server is not available")
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "فشل في تسجيل الدخول")
    }

    const data = await response.json()

    // Store token (backend returns access_token)
    const accessToken = data.access_token || data.accessToken
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken)
    }

    return data
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    // Check if backend is available
    if (!config.api.isBackendAvailable()) {
      throw new Error("Backend server is not available")
    }

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "فشل في إنشاء الحساب")
    }

    const data = await response.json()

    const accessToken = data.access_token || data.accessToken
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken)
    }

    return data
  }

  async logout(): Promise<void> {
    try {
      // Only attempt API call if backend is available
      if (config.api.isBackendAvailable()) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: this.getAuthHeaders(),
        })
      }
    } catch (error) {
      // Silently handle network errors - this is expected when backend is not running
      console.log("Logout API call failed (backend may not be running):", error)
    } finally {
      // Clear tokens regardless of API response
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
    }
  }

  async getProfile(): Promise<User> {
    // Check if backend is available
    if (!config.api.isBackendAvailable()) {
      throw new Error("Backend server is not available")
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error("فشل في جلب بيانات المستخدم")
    }

    return response.json()
  }

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem("refreshToken")
    if (!refreshToken) {
      throw new Error("لا يوجد refresh token")
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      throw new Error("فشل في تجديد التوكن")
    }

    const data = await response.json()
    localStorage.setItem("accessToken", data.accessToken)

    return data.accessToken
  }

  async forgotPassword(email: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "فشل في إرسال رابط إعادة التعيين")
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "فشل في إعادة تعيين كلمة المرور")
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("accessToken")
  }
}

export const authService = new AuthService()
