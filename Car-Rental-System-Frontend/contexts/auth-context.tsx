"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"

import { type User, authService } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user

  // Restore the session on load. getProfile returns null for a missing or rejected
  // token, so a stale token signs the user out instead of leaving the UI in a
  // half-logged-in state.
  useEffect(() => {
    authService
      .getProfile()
      .then(setUser)
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password })
    setUser(response.user)
  }

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const response = await authService.register({ name, email, password, phone })
    setUser(response.user)
  }

  // The API issues stateless JWTs, so signing out is just dropping the token.
  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated }}>
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
