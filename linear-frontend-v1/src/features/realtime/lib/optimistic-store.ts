import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { OptimisticUpdate } from './event-schema'

interface OptimisticState {
  pending: OptimisticUpdate[]

  addPending: (update: OptimisticUpdate) => void
  removePending: (id: string) => void
  confirmPending: (id: string) => void
  revertPending: (id: string) => OptimisticUpdate | undefined
  clearStale: (maxAgeMs?: number) => OptimisticUpdate[]
  isPending: (target: string) => boolean
}

export const useOptimisticStore = create<OptimisticState>()(
  devtools(
    (set, get) => ({
      pending: [],

      addPending: (update) =>
        set((state) => ({
          pending: [...state.pending, update],
        })),

      removePending: (id) =>
        set((state) => ({
          pending: state.pending.filter((u) => u.id !== id),
        })),

      confirmPending: (id) =>
        set((state) => ({
          pending: state.pending.filter((u) => u.id !== id),
        })),

      revertPending: (id) => {
        const state = get()
        const update = state.pending.find((u) => u.id === id)
        if (!update) return undefined
        set((s) => ({
          pending: s.pending.filter((u) => u.id !== id),
        }))
        return update
      },

      clearStale: (maxAgeMs = 30000) => {
        const state = get()
        const now = Date.now()
        const stale = state.pending.filter((u) => now - u.timestamp > maxAgeMs)
        if (stale.length > 0) {
          set((s) => ({
            pending: s.pending.filter((u) => now - u.timestamp <= maxAgeMs),
          }))
        }
        return stale
      },

      isPending: (target) => {
        return get().pending.some((u) => u.target === target)
      },
    }),
    { name: 'optimistic-store' },
  ),
)
