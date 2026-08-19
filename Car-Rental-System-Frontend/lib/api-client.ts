import { API_BASE_URL } from "./config"

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

const TOKEN_KEY = "accessToken"

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearStoredToken(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(TOKEN_KEY)
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  body?: unknown
  query?: Record<string, string | number | boolean | undefined | null>
  /** Send the stored bearer token. On by default; login and register turn it off. */
  auth?: boolean
  signal?: AbortSignal
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(`${API_BASE_URL}${path}`)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      // Skip empty filters rather than sending "undefined" as a string, which the
      // API's ParseIntPipe would reject.
      if (value === undefined || value === null || value === "") continue
      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
}

/**
 * One place for every call to the NestJS API: base URL, bearer token, and error
 * shape. The API answers errors as { message, error, statusCode }, where message
 * is a string or, for validation failures, an array of strings.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, auth = true, signal } = options

  const headers: Record<string, string> = {}
  if (body !== undefined) headers["Content-Type"] = "application/json"

  if (auth) {
    const token = getStoredToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  const payload = text ? JSON.parse(text) : null

  if (!response.ok) {
    const raw = (payload as { message?: string | string[] })?.message
    const message = Array.isArray(raw) ? raw.join(", ") : raw || `Request failed (${response.status})`

    // A 401 means the token is gone or expired. Dropping it here stops every later
    // call from retrying with a token the server has already rejected.
    if (response.status === 401) clearStoredToken()

    throw new ApiError(message, response.status, payload)
  }

  return payload as T
}
