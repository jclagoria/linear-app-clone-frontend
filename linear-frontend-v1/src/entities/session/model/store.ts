import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { User, LoginResponse, RefreshResponse } from './types'

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1'
const REFRESH_TOKEN_KEY = 'linear_refresh_token'

function getTokenExpiry(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split('.')[1] ?? ''))
    return (payload.exp as number) * 1000
  } catch {
    return 0
  }
}

function getStoredRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  } catch {
    return null
  }
}

function setStoredRefreshToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token)
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY)
    }
  } catch {
    // localStorage unavailable (private browsing, etc.)
  }
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hydrate: () => Promise<void>
  refreshAccessToken: () => Promise<string | null>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      login: async (email: string, password: string) => {
        const { isLoading } = get()
        if (isLoading) return

        set({ isLoading: true, error: null })

        try {
          const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            const body = await response.json().catch(() => ({}))
            if (response.status === 401) {
              throw new Error('Invalid email or password')
            }
            throw new Error(
              (body as { message?: string }).message ??
                'Invalid email or password',
            )
          }

          const json = (await response.json()) as LoginResponse
          const { user, accessToken, refreshToken } = json.data

          setStoredRefreshToken(refreshToken)

          set({
            user,
            accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : 'Connection error. Please try again.'
          if (message === 'Failed to fetch') {
            set({
              error: 'Connection error. Please try again.',
              isLoading: false,
            })
          } else {
            set({ error: message, isLoading: false })
          }
        }
      },

      logout: async () => {
        const { accessToken } = get()

        try {
          await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            headers: accessToken
              ? { Authorization: `Bearer ${accessToken}` }
              : {},
          })
        } catch {
          // Logout is best-effort server-side
        }

        setStoredRefreshToken(null)
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      },

      hydrate: async () => {
        const refreshToken = getStoredRefreshToken()
        if (!refreshToken) {
          set({ isLoading: false, isAuthenticated: false })
          return
        }

        set({ isLoading: true })

        try {
          const response = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          })

          if (!response.ok) {
            setStoredRefreshToken(null)
            set({ isLoading: false, isAuthenticated: false })
            return
          }

          const json = (await response.json()) as RefreshResponse
          const { accessToken, refreshToken: newRefreshToken } = json.data

          setStoredRefreshToken(newRefreshToken)

          set({
            accessToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch {
          setStoredRefreshToken(null)
          set({ isLoading: false, isAuthenticated: false })
        }
      },

      refreshAccessToken: async () => {
        const { accessToken } = get()

        if (accessToken) {
          const expiry = getTokenExpiry(accessToken)
          if (expiry - Date.now() > 60_000) {
            return accessToken
          }
        }

        const refreshToken = getStoredRefreshToken()
        if (!refreshToken) {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          })
          return null
        }

        try {
          const response = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          })

          if (!response.ok) {
            setStoredRefreshToken(null)
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
            })
            return null
          }

          const json = (await response.json()) as RefreshResponse
          const { accessToken: newToken, refreshToken: newRefreshToken } =
            json.data

          setStoredRefreshToken(newRefreshToken)
          set({ accessToken: newToken })
          return newToken
        } catch {
          setStoredRefreshToken(null)
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          })
          return null
        }
      },
    }),
    { name: 'auth-store' },
  ),
)
