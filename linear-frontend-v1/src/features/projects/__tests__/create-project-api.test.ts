import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiClient } from '@/shared/lib/api-client'
import { createProject } from '@/shared/api/projects'

vi.mock('@/shared/lib/api-client', () => ({
  apiClient: { post: vi.fn() },
}))

const mockProject = {
  id: 'new-p1',
  name: 'Test Project',
  description: 'A test project',
  icon: '',
  status: 'planned',
  teamId: 't1',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
}

describe('createProject', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sends POST to /projects with the correct payload', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(mockProject)

    const payload = {
      teamId: 't1',
      name: 'Test Project',
      description: 'A test project',
    }

    const result = await createProject(payload)

    expect(apiClient.post).toHaveBeenCalledWith('/projects', {
      body: payload,
    })
    expect(result).toEqual(mockProject)
  })

  it('includes optional date fields when provided', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(mockProject)

    const payload = {
      teamId: 't1',
      name: 'Test Project',
      startDate: '2024-06-01',
      targetDate: '2024-12-31',
    }

    await createProject(payload)

    expect(apiClient.post).toHaveBeenCalledWith('/projects', {
      body: payload,
    })
  })

  it('propagates API errors', async () => {
    const error = new Error('Validation failed')
    vi.mocked(apiClient.post).mockRejectedValue(error)

    await expect(
      createProject({ teamId: 't1', name: 'Test' }),
    ).rejects.toThrow('Validation failed')
  })
})
