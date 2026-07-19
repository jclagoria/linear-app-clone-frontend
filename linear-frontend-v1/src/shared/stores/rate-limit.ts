import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface EndpointRateLimit {
  limit: number
  remaining: number
  resetAt: number
  retryAfter?: number
}

interface RateLimitState {
  endpoints: Map<string, EndpointRateLimit>

  updateEndpoint: (endpoint: string, data: EndpointRateLimit) => void
  isRateLimited: (endpoint: string) => boolean
  getRetryAfter: (endpoint: string) => number | null
  clear: () => void
}

export const useRateLimitStore = create<RateLimitState>()(
  devtools(
    (set, get) => ({
      endpoints: new Map(),

      updateEndpoint: (endpoint: string, data: EndpointRateLimit) => {
        set((state) => {
          const next = new Map(state.endpoints)
          next.set(endpoint, data)
          return { endpoints: next }
        })
      },

      isRateLimited: (endpoint: string) => {
        const entry = get().endpoints.get(endpoint)
        if (!entry) return false
        if (entry.remaining > 0) return false
        if (Date.now() > entry.resetAt) return false
        return true
      },

      getRetryAfter: (endpoint: string) => {
        const entry = get().endpoints.get(endpoint)
        if (!entry?.retryAfter) return null
        return entry.retryAfter
      },

      clear: () => {
        set({ endpoints: new Map() })
      },
    }),
    { name: 'rate-limit-store' },
  ),
)
