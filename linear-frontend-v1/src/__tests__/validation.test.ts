import { describe, it, expect } from 'vitest'
import { isValidEmail, isValidPassword } from '@/shared/lib/utils'

describe('isValidEmail', () => {
  it('returns true for valid email addresses', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('test.user@domain.co')).toBe(true)
    expect(isValidEmail('name+tag@company.org')).toBe(true)
  })

  it('returns false for invalid email addresses', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('not-an-email')).toBe(false)
    expect(isValidEmail('@domain.com')).toBe(false)
    expect(isValidEmail('user@')).toBe(false)
    expect(isValidEmail('user@.com')).toBe(false)
  })

  it('rejects emails without @ symbol', () => {
    expect(isValidEmail('userexample.com')).toBe(false)
  })

  it('rejects empty strings', () => {
    expect(isValidEmail('')).toBe(false)
  })
})

describe('isValidPassword', () => {
  it('returns true for passwords with 8 or more characters', () => {
    expect(isValidPassword('12345678')).toBe(true)
    expect(isValidPassword('a'.repeat(8))).toBe(true)
    expect(isValidPassword('a'.repeat(20))).toBe(true)
  })

  it('returns false for passwords shorter than 8 characters', () => {
    expect(isValidPassword('')).toBe(false)
    expect(isValidPassword('1234567')).toBe(false)
    expect(isValidPassword('a'.repeat(7))).toBe(false)
  })

  it('returns false for empty password', () => {
    expect(isValidPassword('')).toBe(false)
  })
})
