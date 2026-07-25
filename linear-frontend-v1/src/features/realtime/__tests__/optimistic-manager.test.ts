import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createOptimisticUpdate, applyOptimistic } from '../lib/optimistic-manager'
import { useOptimisticStore } from '../lib/optimistic-store'

describe('createOptimisticUpdate', () => {
  it('creates an update with id and timestamp', () => {
    const update = createOptimisticUpdate({
      action: 'update',
      target: 'issues:i1',
      data: { statusId: 'done' },
      revert: { action: 'update', target: 'issues:i1', data: { statusId: 'todo' } },
      request: { method: 'PATCH', url: '/api/issues/i1', body: { statusId: 'done' } },
    })

    expect(update.id).toMatch(/^opt_/)
    expect(update.timestamp).toBeTypeOf('number')
    expect(update.action).toBe('update')
    expect(update.target).toBe('issues:i1')
  })
})

describe('applyOptimistic', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Reset the store
    useOptimisticStore.setState({ pending: [] })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('adds update to pending store', () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }))

    const update = createOptimisticUpdate({
      action: 'update',
      target: 'issues:i1',
      data: { statusId: 'done' },
      revert: { action: 'update', target: 'issues:i1', data: { statusId: 'todo' } },
      request: { method: 'PATCH', url: '/api/issues/i1', body: { statusId: 'done' } },
    })

    applyOptimistic({ update })

    expect(useOptimisticStore.getState().pending).toHaveLength(1)
    expect(useOptimisticStore.getState().pending[0].id).toBe(update.id)
  })
})
