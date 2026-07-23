import { describe, it, expect, vi, beforeEach } from 'vitest'
import { deleteComment } from '@/entities/issue/api'

const mockDelete = vi.hoisted(() => vi.fn())

vi.mock('@/shared/lib/api-client', () => ({
  apiClient: {
    delete: mockDelete,
  },
  isForbiddenError: vi.fn(),
  isBusinessRuleError: vi.fn(),
}))

describe('deleteComment API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls apiClient.delete with correct endpoint', async () => {
    mockDelete.mockResolvedValue(undefined)

    await deleteComment('i1', 'c1')

    expect(mockDelete).toHaveBeenCalledWith('/issues/i1/comments/c1')
  })

  it('returns undefined on success (204)', async () => {
    mockDelete.mockResolvedValue(undefined)

    const result = await deleteComment('i1', 'c1')

    expect(result).toBeUndefined()
  })

  it('propagates 403 ForbiddenError from API', async () => {
    const { ForbiddenError } = await import('@/shared/lib/api-client/errors')
    mockDelete.mockRejectedValue(new ForbiddenError())

    await expect(deleteComment('i1', 'c1')).rejects.toThrow(ForbiddenError)
  })

  it('propagates network errors', async () => {
    mockDelete.mockRejectedValue(new Error('Network error'))

    await expect(deleteComment('i1', 'c1')).rejects.toThrow('Network error')
  })
})