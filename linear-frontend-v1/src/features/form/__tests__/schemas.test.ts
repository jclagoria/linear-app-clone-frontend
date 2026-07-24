import { describe, it, expect } from 'vitest'
import { createIssueSchema, projectSettingsSchema, profileSchema } from '../model'

describe('createIssueSchema', () => {
  it('should validate a valid issue', () => {
    const result = createIssueSchema.safeParse({
      title: 'Test Issue',
      description: 'Test description',
      projectId: 'project-1',
      priority: 'high',
    })
    expect(result.success).toBe(true)
  })

  it('should require title', () => {
    const result = createIssueSchema.safeParse({
      title: '',
      projectId: 'project-1',
      priority: 'high',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Title is required')
    }
  })

  it('should require minimum 3 characters for title', () => {
    const result = createIssueSchema.safeParse({
      title: 'ab',
      projectId: 'project-1',
      priority: 'high',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Title must be at least 3 characters')
    }
  })

  it('should enforce max 255 characters for title', () => {
    const result = createIssueSchema.safeParse({
      title: 'a'.repeat(256),
      projectId: 'project-1',
      priority: 'high',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Title must be 255 characters or less')
    }
  })

  it('should require project', () => {
    const result = createIssueSchema.safeParse({
      title: 'Test Issue',
      projectId: '',
      priority: 'high',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Project is required')
    }
  })

  it('should require priority', () => {
    const result = createIssueSchema.safeParse({
      title: 'Test Issue',
      projectId: 'project-1',
      priority: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Priority is required')
    }
  })

  it('should enforce max 5000 characters for description', () => {
    const result = createIssueSchema.safeParse({
      title: 'Test Issue',
      description: 'a'.repeat(5001),
      projectId: 'project-1',
      priority: 'high',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Description must be 5000 characters or less')
    }
  })
})

describe('projectSettingsSchema', () => {
  it('should validate valid project settings', () => {
    const result = projectSettingsSchema.safeParse({
      name: 'My Project',
      slug: 'my-project',
    })
    expect(result.success).toBe(true)
  })

  it('should require name', () => {
    const result = projectSettingsSchema.safeParse({
      name: '',
      slug: 'my-project',
    })
    expect(result.success).toBe(false)
  })

  it('should enforce slug pattern', () => {
    const result = projectSettingsSchema.safeParse({
      name: 'My Project',
      slug: 'My Project!',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Slug must contain only lowercase letters, numbers, and hyphens')
    }
  })
})

describe('profileSchema', () => {
  it('should validate valid profile', () => {
    const result = profileSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
    })
    expect(result.success).toBe(true)
  })

  it('should require valid email', () => {
    const result = profileSchema.safeParse({
      name: 'John Doe',
      email: 'invalid-email',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Please enter a valid email address')
    }
  })
})
