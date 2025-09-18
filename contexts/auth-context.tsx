"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import { type User, authService } from "@/lib/auth"
import { staticUsers } from "@/lib/static-data"
import { config } from "@/lib/config"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  demoLogin: (role: "user" | "admin") => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    // Check if user is logged in on app start
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Only try to get profile if backend is available
          if (config.api.isBackendAvailable()) {
            const userData = await authService.getProfile()
            setUser(userData)
          } else {
            // If no backend, clear tokens to avoid confusion
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
          }
        }
      } catch (error) {
        console.log("Auth initialization warning (backend may not be running):", error)
        // Clear invalid tokens
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password })
      setUser(response.user)
    } catch (error) {
      // If backend is not available, try demo login as fallback
      if (!config.api.isBackendAvailable()) {
        console.log("Backend not available, attempting demo login fallback")
        // Try to find a matching demo user
        const demoUser = staticUsers.find(u => u.email === email)
        if (demoUser) {
          await demoLogin(demoUser.role)
          return
        }
      }
      throw error
    }
  }

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const response = await authService.register({ name, email, password, phone })
      setUser(response.user)
    } catch (error) {
      // If backend is not available, create a demo user
      if (!config.api.isBackendAvailable()) {
        console.log("Backend not available, creating demo user")
        // Create a mock user for demo purposes
        const mockUser: User = {
          id: `demo_${Date.now()}`,
          name,
          email,
          phone: phone || "",
          role: "user",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        
        // Set mock tokens
        localStorage.setItem("accessToken", `demo_token_${mockUser.id}`)
        localStorage.setItem("refreshToken", `demo_refresh_${mockUser.id}`)
        
        setUser(mockUser)
        return
      }
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      // Log the error but don't throw it since logout should always succeed locally
      console.log("Logout completed with warning:", error)
    } finally {
      // Always clear user state
      setUser(null)
    }
  }

  const demoLogin = async (role: "user" | "admin") => {
    try {
      // Find user by role in static data
      const demoUser = staticUsers.find(u => u.role === role)
      if (!demoUser) {
        throw new Error("Demo user not found")
      }

      // Create a mock user object
      const mockUser: User = {
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        phone: demoUser.phone,
        role: demoUser.role,
        createdAt: demoUser.createdAt,
        updatedAt: demoUser.createdAt,
      }

      // Set mock tokens for demo
      localStorage.setItem("accessToken", `demo_token_${role}`)
      localStorage.setItem("refreshToken", `demo_refresh_${role}`)

      setUser(mockUser)
    } catch (error) {
      console.error("Demo login error:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
