import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useOptimisticStore } from '../lib/optimistic-store'
import { createOptimisticUpdate, applyOptimistic, checkStaleUpdates, onRevertEvent } from '../lib/optimistic-manager'
import type { OptimisticUpdate } from '../lib/event-schema'

describe('optimistic update — add, confirm, revert', () => {
  beforeEach(() => {
    useOptimisticStore.setState({ pending: [] })
  })

  it('adds and confirms a pending update', () => {
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

    useOptimisticStore.getState().confirmPending('opt_1')
    expect(useOptimisticStore.getState().isPending('issues:i1')).toBe(false)
  })

  it('reverts a pending update and returns revert data', () => {
    const revertData = { action: 'update' as const, target: 'issues:i1', data: { statusId: 'todo' } }
    const update: OptimisticUpdate = {
      id: 'opt_1',
      action: 'update',
      target: 'issues:i1',
      data: { statusId: 'done' },
      revert: revertData,
      request: { method: 'PATCH', url: '/api/issues/i1' },
      timestamp: Date.now(),
    }

    useOptimisticStore.getState().addPending(update)
    const reverted = useOptimisticStore.getState().revertPending('opt_1')

    expect(reverted).toBeDefined()
    expect(reverted?.revert).toEqual(revertData)
    expect(useOptimisticStore.getState().isPending('issues:i1')).toBe(false)
  })

  it('returns undefined when reverting non-existent update', () => {
    const reverted = useOptimisticStore.getState().revertPending('nonexistent')
    expect(reverted).toBeUndefined()
  })

  it('tracks multiple pending updates', () => {
    const update1: OptimisticUpdate = {
      id: 'opt_1',
      action: 'update',
      target: 'issues:i1',
      data: { statusId: 'done' },
      revert: { action: 'update', target: 'issues:i1', data: { statusId: 'todo' } },
      request: { method: 'PATCH', url: '/api/issues/i1' },
      timestamp: Date.now(),
    }
    const update2: OptimisticUpdate = {
      id: 'opt_2',
      action: 'update',
      target: 'issues:i2',
      data: { statusId: 'in-progress' },
      revert: { action: 'update', target: 'issues:i2', data: { statusId: 'todo' } },
      request: { method: 'PATCH', url: '/api/issues/i2' },
      timestamp: Date.now(),
    }

    useOptimisticStore.getState().addPending(update1)
    useOptimisticStore.getState().addPending(update2)

    expect(useOptimisticStore.getState().pending).toHaveLength(2)
    expect(useOptimisticStore.getState().isPending('issues:i1')).toBe(true)
    expect(useOptimisticStore.getState().isPending('issues:i2')).toBe(true)

    useOptimisticStore.getState().confirmPending('opt_1')

    expect(useOptimisticStore.getState().pending).toHaveLength(1)
    expect(useOptimisticStore.getState().isPending('issues:i1')).toBe(false)
    expect(useOptimisticStore.getState().isPending('issues:i2')).toBe(true)
  })
})

describe('optimistic update — applyOptimistic', () => {
  beforeEach(() => {
    vi.useFakeTimers()
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

  it('confirms pending update on successful fetch', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }))
    const onConfirm = vi.fn()

    const update = createOptimisticUpdate({
      action: 'update',
      target: 'issues:i1',
      data: { statusId: 'done' },
      revert: { action: 'update', target: 'issues:i1', data: { statusId: 'todo' } },
      request: { method: 'PATCH', url: '/api/issues/i1', body: { statusId: 'done' } },
    })

    applyOptimistic({ update, onConfirm })
    await vi.waitFor(() => {
      expect(useOptimisticStore.getState().pending).toHaveLength(0)
    })
    expect(onConfirm).toHaveBeenCalledWith(update.id)
  })

  it('reverts pending update on failed fetch', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('error', { status: 500 }))
    const onRevert = vi.fn()

    const update = createOptimisticUpdate({
      action: 'update',
      target: 'issues:i1',
      data: { statusId: 'done' },
      revert: { action: 'update', target: 'issues:i1', data: { statusId: 'todo' } },
      request: { method: 'PATCH', url: '/api/issues/i1', body: { statusId: 'done' } },
    })

    applyOptimistic({ update, onRevert })
    await vi.waitFor(() => {
      expect(onRevert).toHaveBeenCalled()
    })
    expect(useOptimisticStore.getState().pending).toHaveLength(0)
  })

  it('reverts pending update on network error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network failure'))
    const onRevert = vi.fn()

    const update = createOptimisticUpdate({
      action: 'add',
      target: 'comments:i1',
      data: { body: 'New comment' },
      revert: { action: 'remove', target: 'comments:i1', data: null },
      request: { method: 'POST', url: '/api/comments', body: { body: 'New comment' } },
    })

    applyOptimistic({ update, onRevert })
    await vi.waitFor(() => {
      expect(onRevert).toHaveBeenCalled()
    })
    const [revertedId, error] = onRevert.mock.calls[0]
    expect(revertedId).toBe(update.id)
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Network failure')
  })

  it('does not add duplicate when target is already pending', () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }))

    const update1 = createOptimisticUpdate({
      action: 'update',
      target: 'issues:i1',
      data: { statusId: 'done' },
      revert: { action: 'update', target: 'issues:i1', data: { statusId: 'todo' } },
      request: { method: 'PATCH', url: '/api/issues/i1', body: { statusId: 'done' } },
    })
    const update2 = createOptimisticUpdate({
      action: 'update',
      target: 'issues:i1',
      data: { statusId: 'in-progress' },
      revert: { action: 'update', target: 'issues:i1', data: { statusId: 'todo' } },
      request: { method: 'PATCH', url: '/api/issues/i1', body: { statusId: 'in-progress' } },
    })

    applyOptimistic({ update: update1 })
    applyOptimistic({ update: update2 })

    expect(useOptimisticStore.getState().pending).toHaveLength(1)
    expect(useOptimisticStore.getState().pending[0].id).toBe(update1.id)
  })
})

describe('checkStaleUpdates', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useOptimisticStore.setState({ pending: [] })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('reverts stale updates older than maxAge', () => {
    const staleUpdate: OptimisticUpdate = {
      id: 'opt_stale',
      action: 'update',
      target: 'issues:i1',
      data: { statusId: 'done' },
      revert: { action: 'update', target: 'issues:i1', data: { statusId: 'todo' } },
      request: { method: 'PATCH', url: '/api/issues/i1' },
      timestamp: Date.now() - 60000,
    }

    const freshUpdate: OptimisticUpdate = {
      id: 'opt_fresh',
      action: 'update',
      target: 'issues:i2',
      data: { statusId: 'done' },
      revert: { action: 'update', target: 'issues:i2', data: { statusId: 'todo' } },
      request: { method: 'PATCH', url: '/api/issues/i2' },
      timestamp: Date.now(),
    }

    useOptimisticStore.setState({ pending: [staleUpdate, freshUpdate] })
    checkStaleUpdates(30000)

    expect(useOptimisticStore.getState().pending).toHaveLength(1)
    expect(useOptimisticStore.getState().pending[0].id).toBe('opt_fresh')
  })

  it('fires onRevertEvent for each stale update', () => {
    const listener = vi.fn()
    const unsubscribe = onRevertEvent(listener)

    const staleUpdate: OptimisticUpdate = {
      id: 'opt_stale',
      action: 'update',
      target: 'issues:i1',
      data: { statusId: 'done' },
      revert: { action: 'update', target: 'issues:i1', data: { statusId: 'todo' } },
      request: { method: 'PATCH', url: '/api/issues/i1' },
      timestamp: Date.now() - 60000,
    }

    useOptimisticStore.setState({ pending: [staleUpdate] })
    checkStaleUpdates(30000)

    expect(listener).toHaveBeenCalledWith(staleUpdate)
    unsubscribe()
  })
})
