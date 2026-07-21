import { describe, it, expect, vi, beforeEach } from 'vitest'
import { changeIssueStatus } from '@/entities/issue/api'

vi.mock('@/shared/lib/api-client', () => ({
  apiClient: {
    patch: vi.fn(),
  },
}))

describe('changeIssueStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls PATCH /issues/:id/status with statusId', async () => {
    const { apiClient } = await import('@/shared/lib/api-client')
    const mockResponse = { data: { id: '1', status: 'In Progress' } }
    vi.mocked(apiClient.patch).mockResolvedValue(mockResponse)

    const result = await changeIssueStatus('1', 'status-2')

    expect(apiClient.patch).toHaveBeenCalledWith('/issues/1/status', {
      body: { statusId: 'status-2' },
    })
    expect(result).toEqual(mockResponse)
  })
})
