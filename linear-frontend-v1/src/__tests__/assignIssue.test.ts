import { describe, it, expect, vi, beforeEach } from 'vitest'
import { assignIssue } from '@/entities/issue/api'

vi.mock('@/shared/lib/api-client', () => ({
  apiClient: {
    patch: vi.fn(),
  },
}))

describe('assignIssue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls PATCH /issues/:id/assignee with assigneeId', async () => {
    const { apiClient } = await import('@/shared/lib/api-client')
    const mockResponse = { data: { id: '1', assigneeId: 'user-1', assigneeName: 'John Doe' } }
    vi.mocked(apiClient.patch).mockResolvedValue(mockResponse)

    const result = await assignIssue('1', 'user-1')

    expect(apiClient.patch).toHaveBeenCalledWith('/issues/1/assignee', {
      body: { assigneeId: 'user-1' },
    })
    expect(result).toEqual(mockResponse)
  })

  it('calls PATCH /issues/:id/assignee with null for unassign', async () => {
    const { apiClient } = await import('@/shared/lib/api-client')
    const mockResponse = { data: { id: '1', assigneeId: null, assigneeName: null } }
    vi.mocked(apiClient.patch).mockResolvedValue(mockResponse)

    const result = await assignIssue('1', null)

    expect(apiClient.patch).toHaveBeenCalledWith('/issues/1/assignee', {
      body: { assigneeId: null },
    })
    expect(result).toEqual(mockResponse)
  })

  it('propagates BusinessRuleError on 422 response', async () => {
    const { apiClient } = await import('@/shared/lib/api-client')
    const error = new Error('Assignee is not a member of this team')
    vi.mocked(apiClient.patch).mockRejectedValue(error)

    await expect(assignIssue('1', 'user-3')).rejects.toThrow('Assignee is not a member of this team')
  })

  it('propagates network errors', async () => {
    const { apiClient } = await import('@/shared/lib/api-client')
    vi.mocked(apiClient.patch).mockRejectedValue(new Error('Network error'))

    await expect(assignIssue('1', 'user-1')).rejects.toThrow('Network error')
  })
})
