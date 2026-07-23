import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useCacheStore } from '@/shared/stores/cacheStore'
import { fetchIssues, changeIssueStatus, assignIssue as assignIssueApi, fetchComments as fetchCommentsApi, deleteComment as deleteCommentApi } from '@/entities/issue/api'
import type { Issue, IssueFilters, Comment } from './types'

interface IssuesState {
  issues: Issue[]
  selectedIssueId: string | null
  filters: IssueFilters
  cursor: string | null
  hasMore: boolean
  isLoading: boolean
  error: string | null
  commentsByIssue: Record<string, Comment[]>
  commentsLoading: boolean
  commentsError: string | null

  loadIssues: () => Promise<void>
  loadNextPage: () => Promise<void>
  selectIssue: (id: string) => void
  deselectIssue: () => void
  setFilters: (filters: Partial<IssueFilters>) => void
  clearFilters: () => void
  addIssue: (issue: Issue) => void
  updateIssue: (id: string, changes: Partial<Issue>) => void
  removeIssue: (id: string) => void
  changeStatus: (id: string, statusId: string) => Promise<Issue>
  assignIssue: (id: string, assigneeId: string | null) => Promise<Issue>
  fetchComments: (issueId: string) => Promise<void>
  updateCommentInStore: (issueId: string, commentId: string, body: string) => void
  setCommentsForIssue: (issueId: string, comments: Comment[]) => void
  deleteCommentFromStore: (issueId: string, commentId: string) => Promise<void>
}

const initialFilters: IssueFilters = {
  statusId: null,
  assigneeId: null,
  projectId: null,
  cycleId: null,
  labelIds: [],
}


export const initialIssuesState = {
  issues: [] as Issue[],
  selectedIssueId: null as string | null,
  filters: { ...initialFilters } as IssueFilters,
  cursor: null as string | null,
  hasMore: true,
  isLoading: false,
  error: null as string | null,
  commentsByIssue: {} as Record<string, Comment[]>,
  commentsLoading: false,
  commentsError: null as string | null,
}

export const useIssuesStore = create<IssuesState>()(
  devtools(
    (set, get) => ({
      ...initialIssuesState,

      loadIssues: async () => {
        set({ isLoading: true, error: null })

        try {
          const { filters } = get()
          const params = new URLSearchParams()
          if (filters.statusId) params.set('statusId', filters.statusId)
          if (filters.assigneeId) params.set('assigneeId', filters.assigneeId)
          if (filters.projectId) params.set('projectId', filters.projectId)
          if (filters.labelIds.length > 0) params.set('labelIds', filters.labelIds.join(','))

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

          const { data, meta } = await fetchIssues({
            statusId: filters.statusId,
            assigneeId: filters.assigneeId,
            projectId: filters.projectId,
            labelIds: filters.labelIds,
          })

          useCacheStore.getState().set(cacheKey, { data, meta })

          set({
            issues: data,
            cursor: meta.cursor,
            hasMore: meta.hasMore,
            isLoading: false,
          })
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Failed to load issues',
            isLoading: false,
          })
        }
      },

      loadNextPage: async () => {
        const { hasMore, isLoading, cursor, filters } = get()
        if (!hasMore || isLoading || !cursor) return

        set({ isLoading: true })

        try {
          const { data, meta } = await fetchIssues({
            cursor,
            statusId: filters.statusId,
            assigneeId: filters.assigneeId,
            projectId: filters.projectId,
            labelIds: filters.labelIds,
          })

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

      changeStatus: async (id: string, statusId: string) => {
        const previousIssues = get().issues
        const previousIssue = previousIssues.find((i) => i.id === id)

        useCacheStore.getState().invalidateByPrefix('issues:list')

        try {
          const result = await changeIssueStatus(id, statusId)
          set((state) => ({
            issues: state.issues.map((issue) =>
              issue.id === id ? { ...issue, ...result.data } : issue,
            ),
          }))
          return result.data
        } catch (err) {
          if (previousIssue) {
            set((state) => ({
              issues: state.issues.map((issue) =>
                issue.id === id ? previousIssue : issue,
              ),
            }))
          }
          throw err
        }
      },

      assignIssue: async (id: string, assigneeId: string | null) => {
        const previousIssues = get().issues
        const previousIssue = previousIssues.find((i) => i.id === id)

        set((state) => ({
          issues: state.issues.map((issue) =>
            issue.id === id
              ? {
                  ...issue,
                  assigneeId,
                  assigneeName:
                    assigneeId === null
                      ? null
                      : state.issues.find((i) => i.id === id)?.assigneeName,
}

              : issue,
          ),
        }))

        useCacheStore.getState().invalidateByPrefix('issues:list')

        try {
          const result = await assignIssueApi(id, assigneeId)
          set((state) => ({
            issues: state.issues.map((issue) =>
              issue.id === id ? { ...issue, ...result.data } : issue,
            ),
          }))
          return result.data
        } catch (err) {
          if (previousIssue) {
            set((state) => ({
              issues: state.issues.map((issue) =>
                issue.id === id ? previousIssue : issue,
              ),
            }))
          }
          throw err
        }
      },

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

      fetchComments: async (issueId: string) => {
        set({ commentsLoading: true, commentsError: null })
        try {
          const result = await fetchCommentsApi(issueId)
          set((state) => ({
            commentsByIssue: { ...state.commentsByIssue, [issueId]: result.data },
            commentsLoading: false,
          }))
        } catch (err) {
          set({
            commentsError: err instanceof Error ? err.message : 'Failed to load comments',
            commentsLoading: false,
          })
        }
      },

      updateCommentInStore: (issueId: string, commentId: string, body: string) => {
        set((state) => ({
          commentsByIssue: {
            ...state.commentsByIssue,
            [issueId]: (state.commentsByIssue[issueId] ?? []).map((c) =>
              c.id === commentId
                ? { ...c, body, updatedAt: new Date().toISOString() }
                : c,
            ),
          },
        }))
      },

      setCommentsForIssue: (issueId: string, comments: Comment[]) => {
        set((state) => ({
          commentsByIssue: { ...state.commentsByIssue, [issueId]: comments },
        }))
      },

      deleteCommentFromStore: async (issueId: string, commentId: string) => {
        const previousComments = get().commentsByIssue[issueId] ?? []

        set((state) => ({
          commentsByIssue: {
            ...state.commentsByIssue,
            [issueId]: (state.commentsByIssue[issueId] ?? []).filter(
              (c) => c.id !== commentId,
            ),
          },
        }))

        try {
          await deleteCommentApi(issueId, commentId)
        } catch (err) {
          set((state) => ({
            commentsByIssue: {
              ...state.commentsByIssue,
              [issueId]: previousComments,
            },
          }))
          throw err
        }
      },
    }),
    { name: 'issues-store' },
  ),
)
