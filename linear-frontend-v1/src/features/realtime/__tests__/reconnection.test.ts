import { describe, it, expect } from 'vitest'
import { calculateBackoff, shouldReconnect } from '../model/reconnection'

describe('calculateBackoff', () => {
  it('returns initial delay for attempt 0', () => {
    expect(calculateBackoff(0)).toBe(1000)
  })

  it('doubles delay on each attempt', () => {
    expect(calculateBackoff(1)).toBe(2000)
    expect(calculateBackoff(2)).toBe(4000)
    expect(calculateBackoff(3)).toBe(8000)
  })

  it('caps at maxDelayMs', () => {
    expect(calculateBackoff(10)).toBe(30000)
    expect(calculateBackoff(20)).toBe(30000)
  })

  it('respects custom config', () => {
    const config = { initialDelayMs: 500, maxDelayMs: 5000, maxAttempts: 5, multiplier: 3 }
    expect(calculateBackoff(0, config)).toBe(500)
    expect(calculateBackoff(1, config)).toBe(1500)
    expect(calculateBackoff(2, config)).toBe(4500)
    expect(calculateBackoff(3, config)).toBe(5000)
  })
})

describe('shouldReconnect', () => {
  it('returns true when under max attempts', () => {
    expect(shouldReconnect(0)).toBe(true)
    expect(shouldReconnect(5)).toBe(true)
    expect(shouldReconnect(9)).toBe(true)
  })

  it('returns false at max attempts', () => {
    expect(shouldReconnect(10)).toBe(false)
    expect(shouldReconnect(11)).toBe(false)
  })
})
