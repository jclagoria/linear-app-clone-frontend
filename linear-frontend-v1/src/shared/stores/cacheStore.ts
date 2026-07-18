import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface CacheEntry<T = unknown> {
  data: T
  timestamp: number
  ttl: number
}

interface CacheState {
  entries: Map<string, CacheEntry>
  accessOrder: string[]
  maxSize: number

  get: <T>(key: string) => { data: T; stale: boolean } | null
  set: <T>(key: string, data: T, ttl?: number) => void
  invalidate: (key: string) => void
  invalidateByPrefix: (prefix: string) => void
  clear: () => void
}

const DEFAULT_TTLS: Record<string, number> = {
  issues: 30_000,
  projects: 60_000,
  cycles: 60_000,
  users: 120_000,
  labels: 120_000,
}

const DEFAULT_MAX_SIZE = 100

function getDefaultTTL(key: string): number {
  for (const [prefix, ttl] of Object.entries(DEFAULT_TTLS)) {
    if (key.startsWith(prefix)) return ttl
  }
  return 60_000
}

export const useCacheStore = create<CacheState>()(
  devtools(
    (set, get) => ({
      entries: new Map(),
      accessOrder: [],
      maxSize: DEFAULT_MAX_SIZE,

      get: <T>(key: string): { data: T; stale: boolean } | null => {
        const state = get()
        const entry = state.entries.get(key) as CacheEntry<T> | undefined
        if (!entry) return null

        const now = Date.now()
        const expired = now - entry.timestamp > entry.ttl

        const updatedOrder = state.accessOrder.filter((k) => k !== key)
        updatedOrder.push(key)

        set({ accessOrder: updatedOrder })

        if (expired) {
          return { data: entry.data, stale: true }
        }

        return { data: entry.data, stale: false }
      },

      set: <T>(key: string, data: T, ttl?: number) => {
        const state = get()
        const resolvedTtl = ttl ?? getDefaultTTL(key)
        const entry: CacheEntry<T> = {
          data,
          timestamp: Date.now(),
          ttl: resolvedTtl,
        }

        const newEntries = new Map(state.entries)
        newEntries.set(key, entry as CacheEntry)

        const newOrder = state.accessOrder.filter((k) => k !== key)
        newOrder.push(key)

        while (newOrder.length > state.maxSize) {
          const evicted = newOrder.shift()
          if (evicted) newEntries.delete(evicted)
        }

        set({ entries: newEntries, accessOrder: newOrder })
      },

      invalidate: (key: string) => {
        const state = get()
        const newEntries = new Map(state.entries)
        newEntries.delete(key)
        set({
          entries: newEntries,
          accessOrder: state.accessOrder.filter((k) => k !== key),
        })
      },

      invalidateByPrefix: (prefix: string) => {
        const state = get()
        const newEntries = new Map(state.entries)
        const newOrder = state.accessOrder.filter((k) => {
          if (k.startsWith(prefix)) {
            newEntries.delete(k)
            return false
          }
          return true
        })
        set({ entries: newEntries, accessOrder: newOrder })
      },

      clear: () => {
        set({ entries: new Map(), accessOrder: [] })
      },
    }),
    { name: 'cache-store' },
  ),
)
