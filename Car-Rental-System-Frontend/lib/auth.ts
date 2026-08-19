import { apiRequest, clearStoredToken, getStoredToken, setStoredToken } from "./api-client"

export type UserRole = "admin" | "user" | "owner" | "customer" | "agent"

export interface User {
  id: string
  email: string
  role: UserRole
  firstName: string | null
  lastName: string | null
  phone: string | null
  createdAt?: string
}

interface ApiUser {
  id: string
  email: string
  role: UserRole
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
  created_at?: string
}

function mapUser(user: ApiUser): User {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.first_name ?? null,
    lastName: user.last_name ?? null,
    phone: user.phone ?? null,
    createdAt: user.created_at,
  }
}

/** Full name if the profile has one, otherwise the email. */
export function displayName(user: User): string {
  const full = [user.firstName, user.lastName].filter(Boolean).join(" ").trim()
  return full || user.email
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
  access_token: string
  user: User
}

export interface UpdateProfileData {
  firstName?: string
  lastName?: string
  phone?: string
}

/** Splits the single "name" field the form collects into what the API stores. */
function splitName(name: string): { first_name?: string; last_name?: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return {}
  return {
    first_name: parts[0],
    last_name: parts.length > 1 ? parts.slice(1).join(" ") : undefined,
  }
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiRequest<{ access_token: string; user: ApiUser }>("/auth/login", {
      method: "POST",
      auth: false,
      body: { email: credentials.email, password: credentials.password },
    })

    setStoredToken(response.access_token)
    return { access_token: response.access_token, user: mapUser(response.user) }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiRequest<{ access_token: string; user: ApiUser }>("/auth/register", {
      method: "POST",
      auth: false,
      body: {
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        ...splitName(data.name),
      },
    })

    setStoredToken(response.access_token)
    return { access_token: response.access_token, user: mapUser(response.user) }
  }

  /**
   * Signing out is a client-side act. The API issues stateless JWTs and keeps no
   * session to invalidate, so there is nothing to call — dropping the token is the
   * whole operation. The previous code posted to /auth/logout, which does not exist.
   */
  logout(): void {
    clearStoredToken()
  }

  async getProfile(): Promise<User | null> {
    if (!getStoredToken()) return null

    try {
      return mapUser(await apiRequest<ApiUser>("/auth/profile"))
    } catch {
      // apiRequest clears the token on a 401, so a stale token signs the user out
      // rather than leaving the UI stuck in a half-logged-in state.
      return null
    }
  }

  async updateProfile(changes: UpdateProfileData): Promise<User> {
    const updated = await apiRequest<ApiUser>("/auth/profile", {
      method: "PATCH",
      body: {
        first_name: changes.firstName,
        last_name: changes.lastName,
        phone: changes.phone,
      },
    })

    return mapUser(updated)
  }

  isAuthenticated(): boolean {
    return getStoredToken() !== null
  }

  getToken(): string | null {
    return getStoredToken()
  }
}

export const authService = new AuthService()
