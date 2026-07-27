import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { registerEventHandler, routeEvent, clearEventHandlers, clearDedupStore, clearEntityDedupStore } from '../model/event-processor'
import type { WSEvent } from '../lib/event-schema'

function makeEvent(event: WSEvent['event'], data: Record<string, unknown> = {}): WSEvent {
  return {
    eventId: `evt-${event}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: 'event',
    channel: 'team:t1',
    event,
    data,
    timestamp: new Date().toISOString(),
    userId: 'u1',
  }
}

describe('event-processor — clearEventHandlers', () => {
  beforeEach(() => {
    clearDedupStore()
    clearEntityDedupStore()
    clearEventHandlers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    clearDedupStore()
    clearEntityDedupStore()
    clearEventHandlers()
  })

  it('clearEventHandlers removes registered handlers', () => {
    const handler = vi.fn()
    registerEventHandler('label.created', handler)

    const event = makeEvent('label.created', { labelId: 'l1' })

    // First routing: handler should be called
    routeEvent(event)
    expect(handler).toHaveBeenCalledOnce()

    // Prepare for second routing: clear mock count, remove handlers
    handler.mockClear()
    clearEventHandlers()

    // Second routing: handler should NOT be called
    routeEvent(event)
    expect(handler).not.toHaveBeenCalled()
  })
})
