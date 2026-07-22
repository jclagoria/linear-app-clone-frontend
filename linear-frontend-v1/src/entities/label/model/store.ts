import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useCacheStore } from '@/shared/stores/cacheStore'
import {
  fetchIssueLabels as fetchIssueLabelsApi,
  attachLabel as attachLabelApi,
  detachLabel as detachLabelApi,
  fetchLabelDefinitions as fetchLabelDefinitionsApi,
} from '@/entities/label/api'
import type { Label } from './types'

interface LabelDefinitionsState {
  labels: Label[]
  isLoading: boolean
  error: string | null

  fetchLabelDefinitions: () => Promise<void>
}

export const useLabelDefinitionsStore = create<LabelDefinitionsState>()(
  devtools(
    (set, _get) => ({
      labels: [],
      isLoading: false,
      error: null,

      fetchLabelDefinitions: async () => {
        const cacheKey = 'label:definitions'
        const cached = useCacheStore.getState().get<Label[]>(cacheKey)

        if (cached && !cached.stale) {
          set({ labels: cached.data, isLoading: false, error: null })
          return
        }

        set({ isLoading: true, error: null })

        try {
          const result = await fetchLabelDefinitionsApi()
          useCacheStore.getState().set(cacheKey, result.data)
          set({ labels: result.data, isLoading: false })
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Failed to load labels',
            isLoading: false,
          })
        }
      },
    }),
    { name: 'label-definitions-store' },
  ),
)

interface IssueLabelsState {
  labelsByIssue: Record<string, Label[]>
  isLoading: boolean
  error: string | null

  fetchLabels: (issueId: string) => Promise<void>
  attachLabel: (issueId: string, labelId: string, label: Label) => Promise<void>
  detachLabel: (issueId: string, labelId: string) => Promise<void>
}

export const useIssueLabelsStore = create<IssueLabelsState>()(
  devtools(
    (set, get) => ({
      labelsByIssue: {},
      isLoading: false,
      error: null,

      fetchLabels: async (issueId: string) => {
        const cacheKey = `labels:issue:${issueId}`
        const cached = useCacheStore.getState().get<Label[]>(cacheKey)

        if (cached && !cached.stale) {
          set((state) => ({
            labelsByIssue: { ...state.labelsByIssue, [issueId]: cached.data },
            isLoading: false,
            error: null,
          }))
          return
        }

        set({ isLoading: true, error: null })

        try {
          const result = await fetchIssueLabelsApi(issueId)
          useCacheStore.getState().set(cacheKey, result.data)
          set((state) => ({
            labelsByIssue: { ...state.labelsByIssue, [issueId]: result.data },
            isLoading: false,
          }))
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Failed to load labels',
            isLoading: false,
          })
        }
      },

      attachLabel: async (issueId: string, labelId: string, label: Label) => {
        const previousLabels = get().labelsByIssue[issueId] ?? []

        set((state) => ({
          labelsByIssue: {
            ...state.labelsByIssue,
            [issueId]: [...(state.labelsByIssue[issueId] ?? []), label],
          },
        }))

        useCacheStore.getState().invalidateByPrefix(`labels:issue:${issueId}`)
        useCacheStore.getState().invalidateByPrefix('issues:list')

        try {
          await attachLabelApi(issueId, labelId)
        } catch (err) {
          set((state) => ({
            labelsByIssue: {
              ...state.labelsByIssue,
              [issueId]: previousLabels,
            },
          }))
          throw err
        }
      },

      detachLabel: async (issueId: string, labelId: string) => {
        const previousLabels = get().labelsByIssue[issueId] ?? []

        set((state) => ({
          labelsByIssue: {
            ...state.labelsByIssue,
            [issueId]: (state.labelsByIssue[issueId] ?? []).filter(
              (l) => l.id !== labelId,
            ),
          },
        }))

        useCacheStore.getState().invalidateByPrefix(`labels:issue:${issueId}`)
        useCacheStore.getState().invalidateByPrefix('issues:list')

        try {
          await detachLabelApi(issueId, labelId)
        } catch (err) {
          set((state) => ({
            labelsByIssue: {
              ...state.labelsByIssue,
              [issueId]: previousLabels,
            },
          }))
          throw err
        }
      },
    }),
    { name: 'issue-labels-store' },
  ),
)
