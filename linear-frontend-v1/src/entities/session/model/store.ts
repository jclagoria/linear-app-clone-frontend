import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { resetDomainStores } from '@/shared/stores/resetAllStores'
import type { User, LoginResponse, RefreshResponse } from './types'

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1'

function getTokenExpiry(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split('.')[1] ?? ''))
    return (payload.exp as number) * 1000
  } catch {
    return 0
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

export const initialAuthState = {
  user: null as User | null,
  accessToken: null as string | null,
  isAuthenticated: false,
  isLoading: false,
  error: null as string | null,
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      ...initialAuthState,

      clearError: () => set({ error: null }),

      login: async (email: string, password: string) => {
        const { isLoading } = get()
        if (isLoading) return

        set({ isLoading: true, error: null })

        try {
          const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            credentials: 'include',
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
          const { user, accessToken } = json.data

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
            credentials: 'include',
            headers: accessToken
              ? { Authorization: `Bearer ${accessToken}` }
              : {},
          })
        } catch {
          // Logout is best-effort server-side
        }

        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
        resetDomainStores()
      },

      hydrate: async () => {
        set({ isLoading: true })

        try {
          const response = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          })

          if (!response.ok) {
            set({ isLoading: false, isAuthenticated: false })
            return
          }

          const json = (await response.json()) as RefreshResponse
          const { accessToken } = json.data

          set({
            accessToken,
            isAuthenticated: true,
            isLoading: false,
          })

          // Fetch user data after successful token refresh.
          // This is best-effort — if it fails the user stays null
          // and will be fetched on first page navigation.
          try {
            const userResponse = await fetch(`${API_BASE}/auth/me`, {
              credentials: 'include',
              headers: { Authorization: `Bearer ${accessToken}` },
            })
            if (userResponse.ok) {
              const userJson = (await userResponse.json()) as { data: User }
              set({ user: userJson.data })
            }
          } catch {
            // Non-critical — user data can be fetched lazily
          }
        } catch {
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

        try {
          const response = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          })

          if (!response.ok) {
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
            })
            return null
          }

          const json = (await response.json()) as RefreshResponse
          const { accessToken: newToken } = json.data

          set({ accessToken: newToken })
          return newToken
        } catch {
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
