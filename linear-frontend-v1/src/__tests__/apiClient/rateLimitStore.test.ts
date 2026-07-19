import { describe, it, expect, beforeEach } from 'vitest'
import { useRateLimitStore } from '@/shared/stores/rate-limit'

describe('RateLimitStore', () => {
  beforeEach(() => {
    useRateLimitStore.setState({ endpoints: new Map() })
  })

  it('updates endpoint state', () => {
    const store = useRateLimitStore.getState()

    store.updateEndpoint('/api/v1/issues', {
      limit: 100,
      remaining: 85,
      resetAt: Date.now() + 60_000,
    })

    const state = useRateLimitStore.getState()
    const entry = state.endpoints.get('/api/v1/issues')
    expect(entry).toBeDefined()
    expect(entry?.limit).toBe(100)
    expect(entry?.remaining).toBe(85)
  })

  it('isRateLimited returns false when no data exists', () => {
    expect(useRateLimitStore.getState().isRateLimited('/unknown')).toBe(false)
  })

  it('isRateLimited returns false when remaining > 0', () => {
    useRateLimitStore.getState().updateEndpoint('/api/v1/issues', {
      limit: 100,
      remaining: 10,
      resetAt: Date.now() + 60_000,
    })

    expect(useRateLimitStore.getState().isRateLimited('/api/v1/issues')).toBe(false)
  })

  it('isRateLimited returns true when remaining is 0 and within window', () => {
    useRateLimitStore.getState().updateEndpoint('/api/v1/issues', {
      limit: 100,
      remaining: 0,
      resetAt: Date.now() + 60_000,
    })

    expect(useRateLimitStore.getState().isRateLimited('/api/v1/issues')).toBe(true)
  })

  it('isRateLimited returns false when reset time has passed', () => {
    useRateLimitStore.getState().updateEndpoint('/api/v1/issues', {
      limit: 100,
      remaining: 0,
      resetAt: Date.now() - 1000, // Already passed
    })

    expect(useRateLimitStore.getState().isRateLimited('/api/v1/issues')).toBe(false)
  })

  it('getRetryAfter returns null when no retryAfter set', () => {
    useRateLimitStore.getState().updateEndpoint('/api/v1/issues', {
      limit: 100,
      remaining: 50,
      resetAt: Date.now() + 60_000,
    })

    expect(useRateLimitStore.getState().getRetryAfter('/api/v1/issues')).toBeNull()
  })

  it('getRetryAfter returns retryAfter value', () => {
    useRateLimitStore.getState().updateEndpoint('/api/v1/issues', {
      limit: 100,
      remaining: 0,
      resetAt: Date.now() + 30_000,
      retryAfter: 30,
    })

    expect(useRateLimitStore.getState().getRetryAfter('/api/v1/issues')).toBe(30)
  })

  it('getRetryAfter returns null for unknown endpoint', () => {
    expect(useRateLimitStore.getState().getRetryAfter('/unknown')).toBeNull()
  })

  it('clear removes all endpoints', () => {
    useRateLimitStore.getState().updateEndpoint('/api/v1/issues', {
      limit: 100,
      remaining: 50,
      resetAt: Date.now() + 60_000,
    })

    useRateLimitStore.getState().clear()

    expect(useRateLimitStore.getState().endpoints.size).toBe(0)
  })

  it('handles multiple endpoints independently', () => {
    const store = useRateLimitStore.getState()

    store.updateEndpoint('/api/v1/issues', {
      limit: 100,
      remaining: 0,
      resetAt: Date.now() + 60_000,
    })

    store.updateEndpoint('/api/v1/projects', {
      limit: 200,
      remaining: 150,
      resetAt: Date.now() + 60_000,
    })

    expect(store.isRateLimited('/api/v1/issues')).toBe(true)
    expect(store.isRateLimited('/api/v1/projects')).toBe(false)
  })
})
