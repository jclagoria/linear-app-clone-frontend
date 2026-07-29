import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiClient } from '@/shared/lib/api-client'

vi.mock('@/shared/lib/api-client', () => ({
  apiClient: { get: vi.fn() },
}))

describe('listProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sends teamId as required param', async () => {
    const { listProjects } = await import('@/shared/api/projects')
    vi.mocked(apiClient.get).mockResolvedValue({ data: [], pagination: { nextCursor: null, hasMore: false } })

    await listProjects({ teamId: 'team-1' })

    expect(apiClient.get).toHaveBeenCalledWith('/projects', {
      params: { teamId: 'team-1' },
    })
  })

  it('includes status filter when provided', async () => {
    const { listProjects } = await import('@/shared/api/projects')
    vi.mocked(apiClient.get).mockResolvedValue({ data: [], pagination: { nextCursor: null, hasMore: false } })

    await listProjects({ teamId: 'team-1', status: 'in_progress' })

    expect(apiClient.get).toHaveBeenCalledWith('/projects', {
      params: { teamId: 'team-1', status: 'in_progress' },
    })
  })

  it('includes cursor for pagination when provided', async () => {
    const { listProjects } = await import('@/shared/api/projects')
    vi.mocked(apiClient.get).mockResolvedValue({ data: [], pagination: { nextCursor: null, hasMore: false } })

    await listProjects({ teamId: 'team-1', cursor: 'cursor-abc' })

    expect(apiClient.get).toHaveBeenCalledWith('/projects', {
      params: { teamId: 'team-1', cursor: 'cursor-abc' },
    })
  })

  it('includes limit when provided', async () => {
    const { listProjects } = await import('@/shared/api/projects')
    vi.mocked(apiClient.get).mockResolvedValue({ data: [], pagination: { nextCursor: null, hasMore: false } })

    await listProjects({ teamId: 'team-1', limit: 50 })

    expect(apiClient.get).toHaveBeenCalledWith('/projects', {
      params: { teamId: 'team-1', limit: '50' },
    })
  })

  it('excludes optional params when not provided', async () => {
    const { listProjects } = await import('@/shared/api/projects')
    vi.mocked(apiClient.get).mockResolvedValue({ data: [], pagination: { nextCursor: null, hasMore: false } })

    await listProjects({ teamId: 'team-1' })

    const params = vi.mocked(apiClient.get).mock.calls[0][1]?.params
    expect(params).not.toHaveProperty('status')
    expect(params).not.toHaveProperty('cursor')
    expect(params).not.toHaveProperty('limit')
  })
})
