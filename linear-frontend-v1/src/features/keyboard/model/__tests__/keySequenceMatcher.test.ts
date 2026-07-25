import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  handleKeyInSequence,
  resetSequence,
  isInSequence,
  getCurrentSequence,
} from '../keySequenceMatcher'

describe('keySequenceMatcher', () => {
  beforeEach(() => {
    resetSequence()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('handles single key press', () => {
    const sequences = [{ keys: ['g', 'i'], action: 'go-to-inbox' }]

    const result = handleKeyInSequence('g', sequences)
    expect(result.matched).toBe(false)
    expect(result.action).toBeNull()
    expect(isInSequence()).toBe(true)
  })

  it('completes sequence on second key', () => {
    const sequences = [{ keys: ['g', 'i'], action: 'go-to-inbox' }]

    handleKeyInSequence('g', sequences)
    const result = handleKeyInSequence('i', sequences)

    expect(result.matched).toBe(true)
    expect(result.action).toBe('go-to-inbox')
    expect(isInSequence()).toBe(false)
  })

  it('cancels sequence on timeout', () => {
    const sequences = [{ keys: ['g', 'i'], action: 'go-to-inbox' }]

    handleKeyInSequence('g', sequences)
    expect(isInSequence()).toBe(true)

    vi.advanceTimersByTime(1000)

    expect(isInSequence()).toBe(false)
  })

  it('cancels sequence on non-matching key', () => {
    const sequences = [{ keys: ['g', 'i'], action: 'go-to-inbox' }]

    handleKeyInSequence('g', sequences)
    const result = handleKeyInSequence('x', sequences)

    expect(result.matched).toBe(false)
    expect(isInSequence()).toBe(false)
  })

  it('returns current sequence', () => {
    const sequences = [{ keys: ['g', 'i'], action: 'go-to-inbox' }]

    handleKeyInSequence('g', sequences)
    expect(getCurrentSequence()).toEqual(['g'])

    handleKeyInSequence('i', sequences)
    expect(getCurrentSequence()).toEqual([])
  })

  it('handles multiple sequences', () => {
    const sequences = [
      { keys: ['g', 'i'], action: 'go-to-inbox' },
      { keys: ['g', 'p'], action: 'go-to-projects' },
    ]

    handleKeyInSequence('g', sequences)
    const result = handleKeyInSequence('p', sequences)

    expect(result.matched).toBe(true)
    expect(result.action).toBe('go-to-projects')
  })

  it('resets sequence', () => {
    const sequences = [{ keys: ['g', 'i'], action: 'go-to-inbox' }]

    handleKeyInSequence('g', sequences)
    expect(isInSequence()).toBe(true)

    resetSequence()
    expect(isInSequence()).toBe(false)
    expect(getCurrentSequence()).toEqual([])
  })
})
