import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { processEvent, clearDedupStore, clearEntityDedupStore } from '../model/event-processor'

function makeInput(eventId: string, event = 'issue.created', issueId = 'i1') {
  return {
    eventId,
    type: 'event',
    channel: 'team:t1',
    event,
    data: { issueId },
    timestamp: '2026-01-01T00:00:00Z',
    userId: 'u1',
  }
}

describe('entity-level deduplication (100ms window)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    clearDedupStore()
    clearEntityDedupStore()
  })

  afterEach(() => {
    vi.useRealTimers()
    clearDedupStore()
    clearEntityDedupStore()
  })

  it('drops duplicate event for same entity within 100ms', () => {
    const event1 = processEvent(makeInput('e1', 'issue.created', 'i1'))
    expect(event1).not.toBeNull()

    vi.advanceTimersByTime(50)

    const event2 = processEvent(makeInput('e2', 'issue.updated', 'i1'))
    expect(event2).toBeNull()
  })

  it('allows same entity after 100ms window', () => {
    const event1 = processEvent(makeInput('e1', 'issue.created', 'i1'))
    expect(event1).not.toBeNull()

    vi.advanceTimersByTime(150)

    const event2 = processEvent(makeInput('e2', 'issue.updated', 'i1'))
    expect(event2).not.toBeNull()
  })

  it('allows different entities within 100ms', () => {
    const event1 = processEvent(makeInput('e1', 'issue.created', 'i1'))
    expect(event1).not.toBeNull()

    vi.advanceTimersByTime(50)

    const event2 = processEvent(makeInput('e2', 'issue.created', 'i2'))
    expect(event2).not.toBeNull()
  })

  it('deduplicates events with same eventId (event-level dedup)', () => {
    const input = makeInput('e-dedup', 'issue.created', 'i1')
    const event1 = processEvent(input)
    expect(event1).not.toBeNull()

    const event2 = processEvent(input)
    expect(event2).toBeNull()
  })

  it('clearEntityDedupStore resets entity dedup state', () => {
    processEvent(makeInput('e1', 'issue.created', 'i1'))

    vi.advanceTimersByTime(50)

    clearEntityDedupStore()

    const event2 = processEvent(makeInput('e2', 'issue.updated', 'i1'))
    expect(event2).not.toBeNull()
  })
})

describe('event-level deduplication (eventId-based)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    clearDedupStore()
    clearEntityDedupStore()
  })

  afterEach(() => {
    vi.useRealTimers()
    clearDedupStore()
    clearEntityDedupStore()
  })

  it('drops events with duplicate eventId', () => {
    const event1 = processEvent(makeInput('same-id', 'issue.created', 'i1'))
    expect(event1).not.toBeNull()

    const event2 = processEvent(makeInput('same-id', 'issue.updated', 'i1'))
    expect(event2).toBeNull()
  })

  it('allows re-processing after clearDedupStore', () => {
    processEvent(makeInput('e1', 'issue.created', 'i1'))

    clearDedupStore()
    clearEntityDedupStore()

    const event2 = processEvent(makeInput('e1', 'issue.created', 'i1'))
    expect(event2).not.toBeNull()
  })
})
