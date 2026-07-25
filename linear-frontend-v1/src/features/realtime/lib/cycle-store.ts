import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Cycle } from './entity-types'
import { useCacheStore } from '@/shared/stores/cacheStore'

interface CyclesState {
  cycles: Cycle[]
  isLoading: boolean
  error: string | null

  setCycles: (cycles: Cycle[]) => void
  addCycle: (cycle: Cycle) => void
  updateCycle: (id: string, changes: Partial<Cycle>) => void
  removeCycle: (id: string) => void
  applyEvent: (event: { type: string; payload: Record<string, unknown> }) => void
}

export const useCyclesStore = create<CyclesState>()(
  devtools(
    (set) => ({
      cycles: [],
      isLoading: false,
      error: null,

      setCycles: (cycles) => set({ cycles }),

      addCycle: (cycle) => {
        useCacheStore.getState().invalidateByPrefix('cycles')
        set((state) => ({
          cycles: [cycle, ...state.cycles],
        }))
      },

      updateCycle: (id, changes) => {
        useCacheStore.getState().invalidateByPrefix('cycles')
        set((state) => ({
          cycles: state.cycles.map((c) =>
            c.id === id ? { ...c, ...changes } : c,
          ),
        }))
      },

      removeCycle: (id) => {
        useCacheStore.getState().invalidateByPrefix('cycles')
        set((state) => ({
          cycles: state.cycles.filter((c) => c.id !== id),
        }))
      },

      applyEvent: (event) => {
        const { type, payload } = event
        const cycleId = payload.cycleId as string
        if (!cycleId) return

        switch (type) {
          case 'cycle.created':
            set((state) => ({
              cycles: [payload as unknown as Cycle, ...state.cycles],
            }))
            break
          case 'cycle.updated':
          case 'cycle.activated':
          case 'cycle.completed':
            set((state) => ({
              cycles: state.cycles.map((c) =>
                c.id === cycleId ? { ...c, ...payload } : c,
              ),
            }))
            break
        }
      },
    }),
    { name: 'cycles-store' },
  ),
)
