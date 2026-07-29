import { describe, it, expect } from 'vitest'
import { createProjectSchema } from '../model/validation'

describe('createProjectSchema', () => {
  it('accepts valid project data', () => {
    const result = createProjectSchema.safeParse({
      teamId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'My Project',
      description: 'Optional desc',
      startDate: '2024-06-01',
      targetDate: '2024-12-31',
    })
    expect(result.success).toBe(true)
  })

  it('accepts minimal required fields only', () => {
    const result = createProjectSchema.safeParse({
      teamId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'My Project',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = createProjectSchema.safeParse({
      teamId: '550e8400-e29b-41d4-a716-446655440000',
      name: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name is required')
    }
  })

  it('rejects name exceeding 255 characters', () => {
    const result = createProjectSchema.safeParse({
      teamId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'x'.repeat(256),
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Name must be 255 characters or less',
      )
    }
  })

  it('rejects invalid UUID for teamId', () => {
    const result = createProjectSchema.safeParse({
      teamId: 'not-a-uuid',
      name: 'My Project',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid start date format', () => {
    const result = createProjectSchema.safeParse({
      teamId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'My Project',
      startDate: '06-01-2024',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Invalid start date format',
      )
    }
  })

  it('rejects invalid target date format', () => {
    const result = createProjectSchema.safeParse({
      teamId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'My Project',
      targetDate: 'not-a-date',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Invalid target date format',
      )
    }
  })

  it('rejects description exceeding 1000 characters', () => {
    const result = createProjectSchema.safeParse({
      teamId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'My Project',
      description: 'x'.repeat(1001),
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Description must be 1000 characters or less',
      )
    }
  })
})
