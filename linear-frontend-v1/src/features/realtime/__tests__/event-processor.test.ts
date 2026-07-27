import { describe, it, expect, beforeEach, vi } from 'vitest'
import { processEvent, routeEvent, registerEventHandler, clearDedupStore, clearEntityDedupStore } from '../model/event-processor'

describe('processEvent', () => {
  beforeEach(() => {
    clearDedupStore()
    clearEntityDedupStore()
  })

  it('returns null for non-object input', () => {
    expect(processEvent(null)).toBeNull()
    expect(processEvent('string')).toBeNull()
    expect(processEvent(123)).toBeNull()
  })

  it('returns null if eventId is missing', () => {
    expect(processEvent({ type: 'event', channel: 'team:t1', event: 'issue.created', data: {}, timestamp: '', userId: 'u1' })).toBeNull()
  })

  it('returns null if event type is invalid', () => {
    expect(processEvent({ eventId: 'e1', type: 'event', channel: 'team:t1', event: 'invalid.type', data: {}, timestamp: '', userId: 'u1' })).toBeNull()
  })

  it('returns a valid WSEvent for valid input', () => {
    const result = processEvent({
      eventId: 'e1',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: { issueId: 'i1', title: 'Test' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })
    expect(result).not.toBeNull()
    expect(result?.eventId).toBe('e1')
    expect(result?.type).toBe('event')
    expect(result?.event).toBe('issue.created')
  })

  it('deduplicates events by eventId', () => {
    const input = {
      eventId: 'e-dedup',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: { issueId: 'i1' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    }
    const first = processEvent(input)
    const second = processEvent(input)
    expect(first).not.toBeNull()
    expect(second).toBeNull()
  })

  it('allows the same eventId after clearing dedup store', () => {
    const input = {
      eventId: 'e-clear',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: { issueId: 'i1' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    }
    processEvent(input)
    clearDedupStore()
    clearEntityDedupStore()
    const result = processEvent(input)
    expect(result).not.toBeNull()
  })
})

describe('routeEvent', () => {
  it('calls the registered handler for matching event type', () => {
    const handler = vi.fn()
    registerEventHandler('issue.created', handler)

    routeEvent({
      eventId: 'e1',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: { issueId: 'i1' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })

    expect(handler).toHaveBeenCalledOnce()
  })
})

describe('entity-level deduplication (100ms window)', () => {
  beforeEach(() => {
    clearDedupStore()
    clearEntityDedupStore()
  })

  it('drops duplicate events for the same entity within 100ms', () => {
    const first = processEvent({
      eventId: 'e-dedup-1',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.updated',
      data: { issueId: 'i1', title: 'First' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })
    const second = processEvent({
      eventId: 'e-dedup-2',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.updated',
      data: { issueId: 'i1', title: 'Second' },
      timestamp: '2026-01-01T00:00:01Z',
      userId: 'u1',
    })

    expect(first).not.toBeNull()
    expect(second).toBeNull()
  })

  it('accepts same entity after 100ms window', async () => {
    const first = processEvent({
      eventId: 'e-window-1',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.updated',
      data: { issueId: 'i2', title: 'First' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })
    expect(first).not.toBeNull()

    await new Promise((r) => setTimeout(r, 110))

    const second = processEvent({
      eventId: 'e-window-2',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.updated',
      data: { issueId: 'i2', title: 'Second' },
      timestamp: '2026-01-01T00:00:01Z',
      userId: 'u1',
    })
    expect(second).not.toBeNull()
  })

  it('independent dedup for different entities', () => {
    const issueA = processEvent({
      eventId: 'e-entity-a',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.updated',
      data: { issueId: 'iA', title: 'A' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })
    const issueB = processEvent({
      eventId: 'e-entity-b',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.updated',
      data: { issueId: 'iB', title: 'B' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })

    expect(issueA).not.toBeNull()
    expect(issueB).not.toBeNull()
  })

  it('different event types on same entity are deduplicated', () => {
    const first = processEvent({
      eventId: 'e-type-1',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.updated',
      data: { issueId: 'i3', title: 'Update' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })
    const second = processEvent({
      eventId: 'e-type-2',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.statusChanged',
      data: { issueId: 'i3', statusId: 'done' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })

    expect(first).not.toBeNull()
    expect(second).toBeNull()
  })

  it('events without entity ID bypass entity dedup', () => {
    const first = processEvent({
      eventId: 'e-no-entity-1',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: {},
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })
    const second = processEvent({
      eventId: 'e-no-entity-2',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: {},
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })

    expect(first).not.toBeNull()
    expect(second).not.toBeNull()
  })

  it('clearEntityDedupStore resets dedup state', () => {
    processEvent({
      eventId: 'e-clear-1',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.updated',
      data: { issueId: 'i4' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })

    clearEntityDedupStore()

    const second = processEvent({
      eventId: 'e-clear-2',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.updated',
      data: { issueId: 'i4' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })

    expect(second).not.toBeNull()
  })

  it.each([
    'comment.created',
    'comment.updated',
    'project.updated',
    'cycle.updated',
    'notification.created',
  ])('deduplicates "%s" for same entity within 100ms', (type) => {
    const entityKey = type.split('.')[0]
    const idField = `${entityKey}Id`

    const first = processEvent({
      eventId: `e-dedup-${type}-1`,
      type: 'event',
      channel: 'team:t1',
      event: type,
      data: { [idField]: 'same-id' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })
    const second = processEvent({
      eventId: `e-dedup-${type}-2`,
      type: 'event',
      channel: 'team:t1',
      event: type,
      data: { [idField]: 'same-id' },
      timestamp: '2026-01-01T00:00:01Z',
      userId: 'u1',
    })

    expect(first).not.toBeNull()
    expect(second).toBeNull()
  })
})
