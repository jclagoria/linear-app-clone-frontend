import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateComment } from '@/entities/issue/api'
import type { Comment } from '@/entities/issue/model/types'

const mockPatch = vi.hoisted(() => vi.fn())

vi.mock('@/shared/lib/api-client', () => ({
  apiClient: {
    patch: mockPatch,
  },
  isForbiddenError: vi.fn(),
  isBusinessRuleError: vi.fn(),
}))

describe('updateComment API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls apiClient.patch with correct endpoint and body', async () => {
    const updatedComment: Comment = {
      id: 'c1',
      issueId: 'i1',
      body: 'Updated body text',
      authorId: 'u1',
      authorName: 'John Doe',
      createdAt: '2024-01-01T12:00:00Z',
      updatedAt: '2024-01-01T13:00:00Z',
    }

    mockPatch.mockResolvedValue({ data: updatedComment })

    const result = await updateComment('i1', 'c1', 'Updated body text')

    expect(mockPatch).toHaveBeenCalledWith('/issues/i1/comments/c1', {
      body: { body: 'Updated body text' },
    })
    expect(result.data).toEqual(updatedComment)
    expect(result.data.body).toBe('Updated body text')
  })

  it('propagates 403 ForbiddenError from API', async () => {
    const { ForbiddenError } = await import('@/shared/lib/api-client/errors')
    mockPatch.mockRejectedValue(new ForbiddenError())

    await expect(updateComment('i1', 'c1', 'Updated body')).rejects.toThrow(ForbiddenError)
  })

  it('propagates network errors', async () => {
    mockPatch.mockRejectedValue(new Error('Network error'))

    await expect(updateComment('i1', 'c1', 'Updated body')).rejects.toThrow('Network error')
  })

  it('calls correct endpoint with special characters in body', async () => {
    mockPatch.mockResolvedValue({ data: { id: 'c1' } })

    await updateComment('i1', 'c1', 'Body with <special> characters & more!')

    expect(mockPatch).toHaveBeenCalledWith('/issues/i1/comments/c1', {
      body: { body: 'Body with <special> characters & more!' },
    })
  })

  it('includes updatedAt in response', async () => {
    const response = {
      data: {
        id: 'c1',
        issueId: 'i1',
        body: 'Updated',
        authorId: 'u1',
        authorName: 'John',
        createdAt: '2024-01-01T12:00:00Z',
        updatedAt: '2024-01-01T14:00:00Z',
      },
    }
    mockPatch.mockResolvedValue(response)

    const result = await updateComment('i1', 'c1', 'Updated')

    expect(result.data.updatedAt).toBe('2024-01-01T14:00:00Z')
    expect(new Date(result.data.updatedAt) > new Date(result.data.createdAt)).toBe(true)
  })
})
