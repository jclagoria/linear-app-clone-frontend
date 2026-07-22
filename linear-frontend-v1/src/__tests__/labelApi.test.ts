import { describe, it, expect, vi } from 'vitest'
import { apiClient } from '@/shared/lib/api-client'
import {
  fetchIssueLabels,
  attachLabel,
  detachLabel,
  fetchLabelDefinitions,
} from '@/entities/label/api'

vi.mock('@/shared/lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockLabel = { id: 'l1', name: 'Bug', color: '#ef4444', createdAt: '', updatedAt: '' }

describe('label API functions', () => {
  it('fetchIssueLabels calls GET /issues/{id}/labels', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [mockLabel] })
    const result = await fetchIssueLabels('issue-1')
    expect(apiClient.get).toHaveBeenCalledWith('/issues/issue-1/labels')
    expect(result.data).toEqual([mockLabel])
  })

  it('attachLabel calls POST /issues/{id}/labels with labelId in body', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: mockLabel })
    const result = await attachLabel('issue-1', 'l1')
    expect(apiClient.post).toHaveBeenCalledWith('/issues/issue-1/labels', {
      body: { labelId: 'l1' },
    })
    expect(result.data).toEqual(mockLabel)
  })

  it('detachLabel calls DELETE /issues/{id}/labels/{labelId}', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue(undefined)
    await detachLabel('issue-1', 'l1')
    expect(apiClient.delete).toHaveBeenCalledWith('/issues/issue-1/labels/l1')
  })

  it('fetchLabelDefinitions calls GET /labels', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [mockLabel] })
    const result = await fetchLabelDefinitions()
    expect(apiClient.get).toHaveBeenCalledWith('/labels')
    expect(result.data).toEqual([mockLabel])
  })
})
