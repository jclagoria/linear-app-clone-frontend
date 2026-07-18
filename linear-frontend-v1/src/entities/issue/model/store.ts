import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useCacheStore } from '@/shared/stores/cacheStore'

export interface Issue {
  id: string
  title: string
  description: string
  status: string
  priority: number
  assigneeId: string | null
  projectId: string | null
  cycleId: string | null
  labels: string[]
  createdAt: string
  updatedAt: string
}

export interface IssueFilters {
  status: string | null
  assigneeId: string | null
  priority: number | null
  projectId: string | null
  search: string | null
}

interface IssuesState {
  issues: Issue[]
  selectedIssueId: string | null
  filters: IssueFilters
  cursor: string | null
  hasMore: boolean
  isLoading: boolean
  error: string | null

  loadIssues: () => Promise<void>
  loadNextPage: () => Promise<void>
  selectIssue: (id: string) => void
  deselectIssue: () => void
  setFilters: (filters: Partial<IssueFilters>) => void
  clearFilters: () => void
  addIssue: (issue: Issue) => void
  updateIssue: (id: string, changes: Partial<Issue>) => void
  removeIssue: (id: string) => void
}

const initialFilters: IssueFilters = {
  status: null,
  assigneeId: null,
  priority: null,
  projectId: null,
  search: null,
}

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1'

export const useIssuesStore = create<IssuesState>()(
  devtools(
    (set, get) => ({
      issues: [],
      selectedIssueId: null,
      filters: { ...initialFilters },
      cursor: null,
      hasMore: true,
      isLoading: false,
      error: null,

      loadIssues: async () => {
        set({ isLoading: true, error: null })

        try {
          const params = new URLSearchParams()
          const { filters } = get()
          if (filters.status) params.set('status', filters.status)
          if (filters.assigneeId) params.set('assigneeId', filters.assigneeId)
          if (filters.priority !== null) params.set('priority', String(filters.priority))

          const cacheKey = `issues:list?${params.toString()}`
          const cached = useCacheStore.getState().get<{ data: Issue[]; meta: { cursor: string | null; hasMore: boolean } }>(cacheKey)

          if (cached && !cached.stale) {
            set({
              issues: cached.data.data,
              cursor: cached.data.meta.cursor,
              hasMore: cached.data.meta.hasMore,
              isLoading: false,
            })
            return
          }

          const response = await fetch(`${API_BASE}/issues?${params.toString()}`, {
            headers: { 'Content-Type': 'application/json' },
          })

          if (!response.ok) {
            throw new Error('Failed to load issues')
          }

          const json = await response.json()
          const { data, meta } = json as {
            data: Issue[]
            meta: { cursor: string | null; hasMore: boolean }
          }

          useCacheStore.getState().set(cacheKey, { data, meta })

          set({
            issues: data,
            cursor: meta.cursor,
            hasMore: meta.hasMore,
            isLoading: false,
          })

          if (cached?.stale) {
            const freshResponse = await fetch(`${API_BASE}/issues?${params.toString()}`, {
              headers: { 'Content-Type': 'application/json' },
            })
            if (freshResponse.ok) {
              const freshJson = await freshResponse.json()
              const freshData = freshJson as { data: Issue[]; meta: { cursor: string | null; hasMore: boolean } }
              useCacheStore.getState().set(cacheKey, freshData)
              set({
                issues: freshData.data,
                cursor: freshData.meta.cursor,
                hasMore: freshData.meta.hasMore,
              })
            }
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Failed to load issues',
            isLoading: false,
          })
        }
      },

      loadNextPage: async () => {
        const { hasMore, isLoading, cursor } = get()
        if (!hasMore || isLoading || !cursor) return

        set({ isLoading: true })

        try {
          const params = new URLSearchParams({ cursor })
          const { filters } = get()
          if (filters.status) params.set('status', filters.status)
          if (filters.assigneeId) params.set('assigneeId', filters.assigneeId)
          if (filters.priority !== null) params.set('priority', String(filters.priority))

          const response = await fetch(`${API_BASE}/issues?${params.toString()}`, {
            headers: { 'Content-Type': 'application/json' },
          })

          if (!response.ok) {
            throw new Error('Failed to load more issues')
          }

          const json = await response.json()
          const { data, meta } = json as {
            data: Issue[]
            meta: { cursor: string | null; hasMore: boolean }
          }

          set((state) => ({
            issues: [...state.issues, ...data],
            cursor: meta.cursor,
            hasMore: meta.hasMore,
            isLoading: false,
          }))
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Failed to load more issues',
            isLoading: false,
          })
        }
      },

      selectIssue: (id: string) => set({ selectedIssueId: id }),

      deselectIssue: () => set({ selectedIssueId: null }),

      setFilters: (filters: Partial<IssueFilters>) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      clearFilters: () => set({ filters: { ...initialFilters } }),

      addIssue: (issue: Issue) => {
        useCacheStore.getState().invalidateByPrefix('issues:list')
        set((state) => ({
          issues: [issue, ...state.issues],
        }))
      },

      updateIssue: (id: string, changes: Partial<Issue>) => {
        useCacheStore.getState().invalidateByPrefix('issues:list')
        set((state) => ({
          issues: state.issues.map((issue) =>
            issue.id === id ? { ...issue, ...changes } : issue,
          ),
        }))
      },

      removeIssue: (id: string) => {
        useCacheStore.getState().invalidateByPrefix('issues:list')
        set((state) => ({
          issues: state.issues.filter((issue) => issue.id !== id),
          selectedIssueId:
            state.selectedIssueId === id ? null : state.selectedIssueId,
        }))
      },
    }),
    { name: 'issues-store' },
  ),
)
