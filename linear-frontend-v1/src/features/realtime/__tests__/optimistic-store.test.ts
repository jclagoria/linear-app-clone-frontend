import { describe, it, expect, beforeEach } from 'vitest'
import { useOptimisticStore } from '../lib/optimistic-store'
import type { OptimisticUpdate } from '../lib/event-schema'

describe('useOptimisticStore', () => {
  beforeEach(() => {
    useOptimisticStore.setState({ pending: [] })
  })

  it('adds pending updates', () => {
    const update: OptimisticUpdate = {
      id: 'opt_1',
      action: 'update',
      target: 'issues:i1',
      data: { statusId: 'done' },
      revert: { action: 'update', target: 'issues:i1', data: { statusId: 'todo' } },
      request: { method: 'PATCH', url: '/api/issues/i1' },
      timestamp: Date.now(),
    }

    useOptimisticStore.getState().addPending(update)
    expect(useOptimisticStore.getState().pending).toHaveLength(1)
  })

  it('removes pending updates', () => {
    const update: OptimisticUpdate = {
      id: 'opt_1',
      action: 'update',
      target: 'issues:i1',
      data: { statusId: 'done' },
      revert: { action: 'update', target: 'issues:i1', data: { statusId: 'todo' } },
      request: { method: 'PATCH', url: '/api/issues/i1' },
      timestamp: Date.now(),
    }

    useOptimisticStore.getState().addPending(update)
    useOptimisticStore.getState().removePending('opt_1')
    expect(useOptimisticStore.getState().pending).toHaveLength(0)
  })

  it('clears stale updates', () => {
    const oldUpdate: OptimisticUpdate = {
      id: 'opt_old',
      action: 'update',
      target: 'issues:i1',
      data: { statusId: 'done' },
      revert: { action: 'update', target: 'issues:i1', data: { statusId: 'todo' } },
      request: { method: 'PATCH', url: '/api/issues/i1' },
      timestamp: Date.now() - 60000,
    }

    const newUpdate: OptimisticUpdate = {
      id: 'opt_new',
      action: 'update',
      target: 'issues:i2',
      data: { statusId: 'done' },
      revert: { action: 'update', target: 'issues:i2', data: { statusId: 'todo' } },
      request: { method: 'PATCH', url: '/api/issues/i2' },
      timestamp: Date.now(),
    }

    useOptimisticStore.setState({ pending: [oldUpdate, newUpdate] })
    const stale = useOptimisticStore.getState().clearStale(30000)

    expect(stale).toHaveLength(1)
    expect(stale[0].id).toBe('opt_old')
    expect(useOptimisticStore.getState().pending).toHaveLength(1)
    expect(useOptimisticStore.getState().pending[0].id).toBe('opt_new')
  })

  it('isPending returns true for matching target', () => {
    const update: OptimisticUpdate = {
      id: 'opt_1',
      action: 'update',
      target: 'issues:i1',
      data: { statusId: 'done' },
      revert: { action: 'update', target: 'issues:i1', data: { statusId: 'todo' } },
      request: { method: 'PATCH', url: '/api/issues/i1' },
      timestamp: Date.now(),
    }

    useOptimisticStore.getState().addPending(update)
    expect(useOptimisticStore.getState().isPending('issues:i1')).toBe(true)
    expect(useOptimisticStore.getState().isPending('issues:i2')).toBe(false)
  })
})
