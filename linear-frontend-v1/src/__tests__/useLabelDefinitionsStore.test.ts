import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useLabelDefinitionsStore } from '@/entities/label/model/store'
import { useCacheStore } from '@/shared/stores/cacheStore'

vi.mock('@/entities/label/api', () => ({
  fetchLabelDefinitions: vi.fn(),
}))

const mockLabels = [
  { id: 'l1', name: 'Bug', color: '#ef4444', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'l2', name: 'Feature', color: '#22c55e', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
]

describe('useLabelDefinitionsStore', () => {
  beforeEach(() => {
    useLabelDefinitionsStore.setState({
      labels: [],
      isLoading: false,
      error: null,
    })
    useCacheStore.getState().clear()
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('starts with empty labels, no loading, and no error', () => {
      const state = useLabelDefinitionsStore.getState()
      expect(state.labels).toEqual([])
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('fetchLabelDefinitions', () => {
    it('sets loading state then populates labels on success', async () => {
      const { fetchLabelDefinitions } = await import('@/entities/label/api')
      let resolvePromise!: (value: { data: typeof mockLabels }) => void
      vi.mocked(fetchLabelDefinitions).mockReturnValue(
        new Promise((resolve) => { resolvePromise = resolve }),
      )

      const promise = useLabelDefinitionsStore.getState().fetchLabelDefinitions()

      expect(useLabelDefinitionsStore.getState().isLoading).toBe(true)
      expect(useLabelDefinitionsStore.getState().error).toBeNull()

      resolvePromise({ data: mockLabels })
      await promise

      const state = useLabelDefinitionsStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.labels).toEqual(mockLabels)
      expect(state.error).toBeNull()
    })

    it('stores fetched labels in cache', async () => {
      const { fetchLabelDefinitions } = await import('@/entities/label/api')
      vi.mocked(fetchLabelDefinitions).mockResolvedValue({ data: mockLabels })

      await useLabelDefinitionsStore.getState().fetchLabelDefinitions()

      const cached = useCacheStore.getState().get('label:definitions')
      expect(cached).not.toBeNull()
      expect(cached!.data).toEqual(mockLabels)
      expect(cached!.stale).toBe(false)
    })

    it('uses cached data when cache is fresh (skips API call)', async () => {
      useCacheStore.getState().set('label:definitions', mockLabels)
      useLabelDefinitionsStore.setState({ labels: mockLabels })

      const { fetchLabelDefinitions } = await import('@/entities/label/api')
      vi.mocked(fetchLabelDefinitions).mockClear()

      await useLabelDefinitionsStore.getState().fetchLabelDefinitions()

      expect(fetchLabelDefinitions).not.toHaveBeenCalled()
      const state = useLabelDefinitionsStore.getState()
      expect(state.labels).toEqual(mockLabels)
      expect(state.isLoading).toBe(false)
    })

    it('sets error message on failure and clears loading', async () => {
      const { fetchLabelDefinitions } = await import('@/entities/label/api')
      vi.mocked(fetchLabelDefinitions).mockRejectedValue(new Error('Network error'))

      await useLabelDefinitionsStore.getState().fetchLabelDefinitions()

      const state = useLabelDefinitionsStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBe('Network error')
      expect(state.labels).toEqual([])
    })

    it('uses fallback error message when error has no message', async () => {
      const { fetchLabelDefinitions } = await import('@/entities/label/api')
      vi.mocked(fetchLabelDefinitions).mockRejectedValue(null)

      await useLabelDefinitionsStore.getState().fetchLabelDefinitions()

      const state = useLabelDefinitionsStore.getState()
      expect(state.error).toBe('Failed to load labels')
    })
  })
})
