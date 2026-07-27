import { describe, it, expect } from 'vitest'
import { isValidEventType, validateWSEvent, REGISTERED_EVENT_TYPES } from '../lib/event-schema'

describe('isValidEventType', () => {
  it('returns true for all 15 registered event types', () => {
    for (const type of REGISTERED_EVENT_TYPES) {
      expect(isValidEventType(type)).toBe(true)
    }
  })

  it('returns false for unregistered types', () => {
    expect(isValidEventType('issue.moved')).toBe(false)
    expect(isValidEventType('random.event')).toBe(false)
    expect(isValidEventType('')).toBe(false)
  })
})

describe('validateWSEvent', () => {
  it('returns true for valid events', () => {
    expect(validateWSEvent({
      eventId: 'e1',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: { issueId: 'i1' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })).toBe(true)
  })

  it('returns false for null/undefined', () => {
    expect(validateWSEvent(null)).toBe(false)
    expect(validateWSEvent(undefined)).toBe(false)
  })

  it('returns false if eventId is empty', () => {
    expect(validateWSEvent({
      eventId: '',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: {},
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })).toBe(false)
  })

  it('returns false if type is not "event"', () => {
    expect(validateWSEvent({
      eventId: 'e1',
      type: 'invalid',
      channel: 'team:t1',
      event: 'issue.created',
      data: {},
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })).toBe(false)
  })

  it('returns false if event type is invalid', () => {
    expect(validateWSEvent({
      eventId: 'e1',
      type: 'event',
      channel: 'team:t1',
      event: 'invalid.type',
      data: {},
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })).toBe(false)
  })
})
