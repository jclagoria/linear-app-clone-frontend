import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { registerEventHandler, routeEvent, clearDedupStore, clearEntityDedupStore } from '../model/event-processor'
import type { WSEvent, WSEventType } from '../lib/event-schema'

const ALL_EVENT_TYPES: WSEventType[] = [
  'issue.created',
  'issue.updated',
  'issue.statusChanged',
  'issue.assigned',
  'issue.unassigned',
  'issue.deleted',
  'comment.created',
  'comment.updated',
  'project.created',
  'project.updated',
  'cycle.created',
  'cycle.updated',
  'cycle.activated',
  'cycle.completed',
  'notification.created',
]

function makeEvent(type: WSEventType, overrides: Partial<WSEvent> = {}): WSEvent {
  return {
    eventId: `evt-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    payload: {} as WSEvent['payload'],
    timestamp: '2026-01-01T00:00:00Z',
    teamId: 't1',
    ...overrides,
  }
}

describe('event router — dispatch to correct handler', () => {
  beforeEach(() => {
    clearDedupStore()
    clearEntityDedupStore()
  })

  afterEach(() => {
    clearDedupStore()
    clearEntityDedupStore()
  })

  it.each(ALL_EVENT_TYPES)('dispatches "%s" to its registered handler', (type) => {
    const handler = vi.fn()
    const unregister = registerEventHandler(type, handler)

    const event = makeEvent(type)
    routeEvent(event)

    expect(handler).toHaveBeenCalledOnce()
    expect(handler).toHaveBeenCalledWith(event)

    unregister()
  })

  it('does not call handler for unregistered event type', () => {
    const handler = vi.fn()
    registerEventHandler('issue.created', handler)

    const event = makeEvent('project.created' as WSEventType)
    routeEvent(event)

    expect(handler).not.toHaveBeenCalled()
  })

  it('unregister stops dispatching', () => {
    const handler = vi.fn()
    const unregister = registerEventHandler('issue.created', handler)

    routeEvent(makeEvent('issue.created'))
    expect(handler).toHaveBeenCalledTimes(1)

    unregister()
    routeEvent(makeEvent('issue.created'))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('each event type has its own handler', () => {
    const handlers: Record<string, ReturnType<typeof vi.fn>> = {}

    for (const type of ALL_EVENT_TYPES) {
      handlers[type] = vi.fn()
      registerEventHandler(type, handlers[type])
    }

    for (const type of ALL_EVENT_TYPES) {
      routeEvent(makeEvent(type))
    }

    for (const type of ALL_EVENT_TYPES) {
      expect(handlers[type]).toHaveBeenCalledOnce()
    }
  })
})
