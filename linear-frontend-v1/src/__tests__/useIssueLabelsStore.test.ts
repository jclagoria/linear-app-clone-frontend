import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useIssueLabelsStore } from '@/entities/label/model/store'
import { useCacheStore } from '@/shared/stores/cacheStore'

vi.mock('@/shared/lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockLabels = [
  { id: 'l1', name: 'Bug', color: '#ef4444', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'l2', name: 'Feature', color: '#22c55e', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
]

describe('useIssueLabelsStore', () => {
  beforeEach(() => {
    useIssueLabelsStore.setState({
      labelsByIssue: {},
      isLoading: false,
      error: null,
    })
    useCacheStore.getState().clear()
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('starts with empty labelsByIssue, no loading, and no error', () => {
      const state = useIssueLabelsStore.getState()
      expect(state.labelsByIssue).toEqual({})
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('fetchLabels', () => {
    it('sets loading state then populates labelsByIssue on success', async () => {
      const { apiClient } = await import('@/shared/lib/api-client')
      let resolvePromise!: (value: { data: typeof mockLabels }) => void
      vi.mocked(apiClient.get).mockReturnValue(
        new Promise((resolve) => { resolvePromise = resolve }),
      )

      const promise = useIssueLabelsStore.getState().fetchLabels('issue-1')

      expect(useIssueLabelsStore.getState().isLoading).toBe(true)

      resolvePromise({ data: mockLabels })
      await promise

      const state = useIssueLabelsStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.labelsByIssue['issue-1']).toEqual(mockLabels)
      expect(state.error).toBeNull()
      expect(apiClient.get).toHaveBeenCalledWith('/issues/issue-1/labels')
    })

    it('stores fetched labels in cache', async () => {
      const { apiClient } = await import('@/shared/lib/api-client')
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockLabels })

      await useIssueLabelsStore.getState().fetchLabels('issue-1')

      const cached = useCacheStore.getState().get('labels:issue:issue-1')
      expect(cached).not.toBeNull()
      expect(cached!.data).toEqual(mockLabels)
    })

    it('merges labels for different issues', async () => {
      const { apiClient } = await import('@/shared/lib/api-client')
      const labelA = [mockLabels[0]]
      const labelB = [mockLabels[1]]
      vi.mocked(apiClient.get)
        .mockResolvedValueOnce({ data: labelA })
        .mockResolvedValueOnce({ data: labelB })

      await useIssueLabelsStore.getState().fetchLabels('issue-1')
      await useIssueLabelsStore.getState().fetchLabels('issue-2')

      const state = useIssueLabelsStore.getState()
      expect(state.labelsByIssue['issue-1']).toEqual(labelA)
      expect(state.labelsByIssue['issue-2']).toEqual(labelB)
    })

    it('uses cached data when fresh (skips API call)', async () => {
      useCacheStore.getState().set('labels:issue:issue-1', mockLabels)
      useIssueLabelsStore.setState({
        labelsByIssue: { 'issue-1': mockLabels },
      })

      const { apiClient } = await import('@/shared/lib/api-client')
      vi.mocked(apiClient.get).mockClear()

      await useIssueLabelsStore.getState().fetchLabels('issue-1')

      expect(apiClient.get).not.toHaveBeenCalled()
    })

    it('sets error message on failure', async () => {
      const { apiClient } = await import('@/shared/lib/api-client')
      vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'))

      await useIssueLabelsStore.getState().fetchLabels('issue-1')

      const state = useIssueLabelsStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBe('Network error')
    })

    it('uses fallback error when error has no message', async () => {
      const { apiClient } = await import('@/shared/lib/api-client')
      vi.mocked(apiClient.get).mockRejectedValue(null)

      await useIssueLabelsStore.getState().fetchLabels('issue-1')

      const state = useIssueLabelsStore.getState()
      expect(state.error).toBe('Failed to load labels')
    })
  })

  describe('attachLabel', () => {
    it('optimistically adds label to issue', async () => {
      const { apiClient } = await import('@/shared/lib/api-client')
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockLabels[0] })

      const promise = useIssueLabelsStore.getState().attachLabel('issue-1', 'l1', mockLabels[0])

      expect(useIssueLabelsStore.getState().labelsByIssue['issue-1']).toEqual([mockLabels[0]])

      await promise
    })

    it('invalidates cache after successful attach', async () => {
      const { apiClient } = await import('@/shared/lib/api-client')
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockLabels[0] })
      useCacheStore.getState().set('labels:issue:issue-1', mockLabels)
      useCacheStore.getState().set('issues:list', [])
      useIssueLabelsStore.setState({ labelsByIssue: { 'issue-1': [mockLabels[1]] } })

      await useIssueLabelsStore.getState().attachLabel('issue-1', 'l1', mockLabels[0])

      expect(useCacheStore.getState().get('labels:issue:issue-1')).toBeNull()
      expect(useCacheStore.getState().get('issues:list')).toBeNull()
      expect(apiClient.post).toHaveBeenCalledWith('/issues/issue-1/labels', { body: { labelId: 'l1' } })
    })

    it('rolls back label on API failure', async () => {
      const { apiClient } = await import('@/shared/lib/api-client')
      vi.mocked(apiClient.post).mockRejectedValue(new Error('API error'))

      useIssueLabelsStore.setState({
        labelsByIssue: { 'issue-1': [mockLabels[1]] },
      })

      await expect(
        useIssueLabelsStore.getState().attachLabel('issue-1', 'l1', mockLabels[0]),
      ).rejects.toThrow('API error')

      const state = useIssueLabelsStore.getState()
      expect(state.labelsByIssue['issue-1']).toEqual([mockLabels[1]])
    })

    it('rolls back when issue had no labels before', async () => {
      const { apiClient } = await import('@/shared/lib/api-client')
      vi.mocked(apiClient.post).mockRejectedValue(new Error('API error'))

      await expect(
        useIssueLabelsStore.getState().attachLabel('issue-1', 'l1', mockLabels[0]),
      ).rejects.toThrow('API error')

      const state = useIssueLabelsStore.getState()
      expect(state.labelsByIssue['issue-1']).toEqual([])
    })
  })

  describe('detachLabel', () => {
    it('optimistically removes label from issue', async () => {
      const { apiClient } = await import('@/shared/lib/api-client')
      vi.mocked(apiClient.delete).mockResolvedValue(undefined)

      useIssueLabelsStore.setState({
        labelsByIssue: { 'issue-1': mockLabels },
      })

      const promise = useIssueLabelsStore.getState().detachLabel('issue-1', 'l1')

      expect(useIssueLabelsStore.getState().labelsByIssue['issue-1']).toEqual([mockLabels[1]])

      await promise
    })

    it('invalidates cache after successful detach', async () => {
      const { apiClient } = await import('@/shared/lib/api-client')
      vi.mocked(apiClient.delete).mockResolvedValue(undefined)
      useCacheStore.getState().set('labels:issue:issue-1', mockLabels)
      useCacheStore.getState().set('issues:list', [])
      useIssueLabelsStore.setState({ labelsByIssue: { 'issue-1': mockLabels } })

      await useIssueLabelsStore.getState().detachLabel('issue-1', 'l1')

      expect(useCacheStore.getState().get('labels:issue:issue-1')).toBeNull()
      expect(useCacheStore.getState().get('issues:list')).toBeNull()
      expect(apiClient.delete).toHaveBeenCalledWith('/issues/issue-1/labels/l1')
    })

    it('rolls back label removal on API failure', async () => {
      const { apiClient } = await import('@/shared/lib/api-client')
      vi.mocked(apiClient.delete).mockRejectedValue(new Error('API error'))

      useIssueLabelsStore.setState({
        labelsByIssue: { 'issue-1': mockLabels },
      })

      await expect(
        useIssueLabelsStore.getState().detachLabel('issue-1', 'l1'),
      ).rejects.toThrow('API error')

      const state = useIssueLabelsStore.getState()
      expect(state.labelsByIssue['issue-1']).toEqual(mockLabels)
    })

    it('handles detach from issue with no labels gracefully', async () => {
      const { apiClient } = await import('@/shared/lib/api-client')
      vi.mocked(apiClient.delete).mockResolvedValue(undefined)

      await useIssueLabelsStore.getState().detachLabel('issue-1', 'l1')

      const state = useIssueLabelsStore.getState()
      expect(state.labelsByIssue['issue-1']).toEqual([])
    })
  })
})
