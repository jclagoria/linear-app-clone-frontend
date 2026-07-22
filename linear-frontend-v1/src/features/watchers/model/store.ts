import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useToastStore } from '@/shared/stores/toastStore'
import {
  fetchWatchers as fetchWatchersApi,
  addWatcher as addWatcherApi,
  removeWatcher as removeWatcherApi,
} from '@/entities/watcher/api'
import type { Watcher } from '@/entities/watcher/model/types'

interface WatchersState {
  watchersByIssue: Record<string, Watcher[]>
  isLoading: boolean
  error: string | null

  fetchWatchers: (issueId: string) => Promise<void>
  addWatcher: (issueId: string, userId: string) => Promise<void>
  removeWatcher: (issueId: string, userId: string) => Promise<void>
}

export const initialWatchersState = {
  watchersByIssue: {} as Record<string, Watcher[]>,
  isLoading: false,
  error: null as string | null,
}

export const useWatchersStore = create<WatchersState>()(
  devtools(
    (set, get) => ({
      ...initialWatchersState,

      fetchWatchers: async (issueId: string) => {
        const cached = get().watchersByIssue[issueId]
        if (cached && !get().error) return

        set({ isLoading: true, error: null })

        try {
          const result = await fetchWatchersApi(issueId)
          set((state) => ({
            watchersByIssue: {
              ...state.watchersByIssue,
              [issueId]: result.data,
            },
            isLoading: false,
          }))
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Failed to load watchers',
            isLoading: false,
          })
        }
      },

      addWatcher: async (issueId: string, userId: string) => {
        const previous = get().watchersByIssue[issueId] ?? []

        const optimisticWatcher: Watcher = {
          id: `optimistic-${Date.now()}`,
          userId,
          issueId,
          name: '',
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          watchersByIssue: {
            ...state.watchersByIssue,
            [issueId]: [...previous, optimisticWatcher],
          },
          error: null,
        }))

        try {
          const result = await addWatcherApi(issueId)
          set((state) => ({
            watchersByIssue: {
              ...state.watchersByIssue,
              [issueId]: state.watchersByIssue[issueId].map((w) =>
                w.id === optimisticWatcher.id ? result.data : w,
              ),
            },
          }))
          useToastStore.getState().addToast({
            title: 'You are now watching this issue',
            variant: 'success',
            duration: 3000,
          })
        } catch (err) {
          set((state) => ({
            watchersByIssue: {
              ...state.watchersByIssue,
              [issueId]: previous,
            },
          }))

          const message =
            err instanceof Error ? err.message : 'Failed to watch issue'
          useToastStore.getState().addToast({
            title: message,
            variant: 'error',
            duration: 5000,
          })
        }
      },

      removeWatcher: async (issueId: string, userId: string) => {
        const previous = get().watchersByIssue[issueId] ?? []

        set((state) => ({
          watchersByIssue: {
            ...state.watchersByIssue,
            [issueId]: state.watchersByIssue[issueId].filter(
              (w) => w.userId !== userId,
            ),
          },
          error: null,
        }))

        try {
          await removeWatcherApi(issueId, userId)
          useToastStore.getState().addToast({
            title: 'You are no longer watching this issue',
            variant: 'success',
            duration: 3000,
          })
        } catch (err) {
          set((state) => ({
            watchersByIssue: {
              ...state.watchersByIssue,
              [issueId]: previous,
            },
          }))

          const message =
            err instanceof Error ? err.message : 'Failed to unwatch issue'
          useToastStore.getState().addToast({
            title: message,
            variant: 'error',
            duration: 5000,
          })
        }
      },
    }),
    { name: 'watchers-store' },
  ),
)
