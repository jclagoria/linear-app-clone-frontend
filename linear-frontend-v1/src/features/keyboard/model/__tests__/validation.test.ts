import { describe, it, expect } from 'vitest'
import { shortcutKeySchema, isConflict } from '../validation'

describe('shortcutKeySchema', () => {
  it('validates single key', () => {
    const result = shortcutKeySchema.safeParse('c')
    expect(result.success).toBe(true)
  })

  it('validates modifier + key', () => {
    const result = shortcutKeySchema.safeParse('Ctrl+b')
    expect(result.success).toBe(true)
  })

  it('rejects empty string', () => {
    const result = shortcutKeySchema.safeParse('')
    expect(result.success).toBe(false)
  })

  it('rejects browser shortcuts', () => {
    const result = shortcutKeySchema.safeParse('Ctrl+s')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('This key combination is reserved by the browser')
    }
  })

  it('rejects multiple non-modifier keys', () => {
    const result = shortcutKeySchema.safeParse('x+y')
    expect(result.success).toBe(false)
  })
})

describe('isConflict', () => {
  it('detects conflict', () => {
    const existing = { 'shortcut-1': 'c' }
    expect(isConflict('c', existing)).toBe(true)
  })

  it('detects no conflict', () => {
    const existing = { 'shortcut-1': 'c' }
    expect(isConflict('x', existing)).toBe(false)
  })

  it('excludes specific shortcut', () => {
    const existing = { 'shortcut-1': 'c' }
    expect(isConflict('c', existing, 'shortcut-1')).toBe(false)
  })

  it('case insensitive', () => {
    const existing = { 'shortcut-1': 'C' }
    expect(isConflict('c', existing)).toBe(true)
  })
})
