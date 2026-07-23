import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchIssues } from '@/entities/issue/api'

vi.mock('@/shared/lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}))

describe('fetchIssues query param construction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sends statusId param', async () => {
    const { apiClient } = await import('@/shared/lib/api-client')
    vi.mocked(apiClient.get).mockResolvedValue({ data: [], meta: { cursor: null, hasMore: false } })

    await fetchIssues({ statusId: 'status-uuid' })

    expect(apiClient.get).toHaveBeenCalledWith('/issues', {
      params: { statusId: 'status-uuid' },
    })
  })

  it('does not send status param', async () => {
    const { apiClient } = await import('@/shared/lib/api-client')
    vi.mocked(apiClient.get).mockResolvedValue({ data: [], meta: { cursor: null, hasMore: false } })

    await fetchIssues({ statusId: 'status-uuid' })

    const callParams = vi.mocked(apiClient.get).mock.calls[0][1]?.params ?? {}
    expect(callParams).not.toHaveProperty('status')
  })

  it('sends labelIds as comma-separated string', async () => {
    const { apiClient } = await import('@/shared/lib/api-client')
    vi.mocked(apiClient.get).mockResolvedValue({ data: [], meta: { cursor: null, hasMore: false } })

    await fetchIssues({ labelIds: ['label-1', 'label-2'] })

    expect(apiClient.get).toHaveBeenCalledWith('/issues', {
      params: { labelIds: 'label-1,label-2' },
    })
  })

  it('omits labelIds when empty array', async () => {
    const { apiClient } = await import('@/shared/lib/api-client')
    vi.mocked(apiClient.get).mockResolvedValue({ data: [], meta: { cursor: null, hasMore: false } })

    await fetchIssues({ labelIds: [] })

    const callParams = vi.mocked(apiClient.get).mock.calls[0][1]?.params ?? {}
    expect(callParams).not.toHaveProperty('labelIds')
  })

  it('omits empty statusId', async () => {
    const { apiClient } = await import('@/shared/lib/api-client')
    vi.mocked(apiClient.get).mockResolvedValue({ data: [], meta: { cursor: null, hasMore: false } })

    await fetchIssues({ statusId: null })

    const callParams = vi.mocked(apiClient.get).mock.calls[0][1]?.params ?? {}
    expect(callParams).not.toHaveProperty('statusId')
  })

  it('does not send search param', async () => {
    const { apiClient } = await import('@/shared/lib/api-client')
    vi.mocked(apiClient.get).mockResolvedValue({ data: [], meta: { cursor: null, hasMore: false } })

    await fetchIssues({ statusId: 's1' })

    const callParams = vi.mocked(apiClient.get).mock.calls[0][1]?.params ?? {}
    expect(callParams).not.toHaveProperty('search')
  })

  it('does not send priority param', async () => {
    const { apiClient } = await import('@/shared/lib/api-client')
    vi.mocked(apiClient.get).mockResolvedValue({ data: [], meta: { cursor: null, hasMore: false } })

    await fetchIssues({ statusId: 's1' })

    const callParams = vi.mocked(apiClient.get).mock.calls[0][1]?.params ?? {}
    expect(callParams).not.toHaveProperty('priority')
  })
})
