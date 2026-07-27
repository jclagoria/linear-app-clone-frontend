import { describe, it, expect } from 'vitest'
import { isValidEventType, validateWSEvent, REGISTERED_EVENT_TYPES } from '../lib/event-schema'

describe('isValidEventType', () => {
  it('returns true for all 18 registered event types', () => {
    expect(REGISTERED_EVENT_TYPES).toHaveLength(18)
    for (const type of REGISTERED_EVENT_TYPES) {
      expect(isValidEventType(type)).toBe(true)
    }
  })

  it('returns false for unregistered types', () => {
    expect(isValidEventType('issue.moved')).toBe(false)
    expect(isValidEventType('random.event')).toBe(false)
    expect(isValidEventType('')).toBe(false)
    expect(isValidEventType('label.deleted')).toBe(false)
    expect(isValidEventType('user.offline')).toBe(false)
    expect(isValidEventType('session.created')).toBe(false)
  })

  it('validates label.created event type', () => {
    expect(isValidEventType('label.created')).toBe(true)
  })

  it('validates user.online event type', () => {
    expect(isValidEventType('user.online')).toBe(true)
  })

  it('validates session.revoked event type', () => {
    expect(isValidEventType('session.revoked')).toBe(true)
  })
})

describe('validateWSEvent', () => {
  it('returns true for valid issue events', () => {
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

  it('returns true for valid label.created event', () => {
    expect(validateWSEvent({
      eventId: 'e2',
      type: 'event',
      channel: 'team:t1',
      event: 'label.created',
      data: { labelId: 'l1', name: 'Bug', color: '#ff0000' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })).toBe(true)
  })

  it('returns true for valid user.online event', () => {
    expect(validateWSEvent({
      eventId: 'e3',
      type: 'event',
      channel: 'user:u1',
      event: 'user.online',
      data: { userId: 'u1', name: 'John Doe', email: 'john@example.com' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })).toBe(true)
  })

  it('returns true for valid session.revoked event', () => {
    expect(validateWSEvent({
      eventId: 'e4',
      type: 'event',
      channel: 'user:u1',
      event: 'session.revoked',
      data: { sessionId: 's1', reason: 'Token expired' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })).toBe(true)
  })

  it('returns true for valid comment events', () => {
    expect(validateWSEvent({
      eventId: 'e5',
      type: 'event',
      channel: 'team:t1',
      event: 'comment.created',
      data: { commentId: 'c1', issueId: 'i1', body: 'Test comment' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })).toBe(true)
  })

  it('returns true for valid project events', () => {
    expect(validateWSEvent({
      eventId: 'e6',
      type: 'event',
      channel: 'team:t1',
      event: 'project.created',
      data: { projectId: 'p1', name: 'New Project' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })).toBe(true)
  })

  it('returns true for valid cycle events', () => {
    expect(validateWSEvent({
      eventId: 'e7',
      type: 'event',
      channel: 'team:t1',
      event: 'cycle.created',
      data: { cycleId: 'cy1', name: 'Sprint 1' },
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })).toBe(true)
  })

  it('returns true for valid notification events', () => {
    expect(validateWSEvent({
      eventId: 'e8',
      type: 'event',
      channel: 'user:u1',
      event: 'notification.created',
      data: { notificationId: 'n1', type: 'mention', title: 'You were mentioned', message: 'Test' },
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

  it('returns false if channel is empty', () => {
    expect(validateWSEvent({
      eventId: 'e1',
      type: 'event',
      channel: '',
      event: 'issue.created',
      data: {},
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })).toBe(false)
  })

  it('returns false if timestamp is empty', () => {
    expect(validateWSEvent({
      eventId: 'e1',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: {},
      timestamp: '',
      userId: 'u1',
    })).toBe(false)
  })

  it('returns false if userId is empty', () => {
    expect(validateWSEvent({
      eventId: 'e1',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: {},
      timestamp: '2026-01-01T00:00:00Z',
      userId: '',
    })).toBe(false)
  })

  it('returns false if data is missing', () => {
    expect(validateWSEvent({
      eventId: 'e1',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })).toBe(false)
  })

  it('returns false if data is null', () => {
    expect(validateWSEvent({
      eventId: 'e1',
      type: 'event',
      channel: 'team:t1',
      event: 'issue.created',
      data: null,
      timestamp: '2026-01-01T00:00:00Z',
      userId: 'u1',
    })).toBe(false)
  })

  it('rejects all invalid event types', () => {
    const invalidTypes = [
      'issue.moved',
      'label.deleted',
      'user.offline',
      'session.created',
      'comment.deleted',
      'project.deleted',
      'cycle.deleted',
      'notification.read',
    ]
    for (const invalidType of invalidTypes) {
      expect(validateWSEvent({
        eventId: 'e1',
        type: 'event',
        channel: 'team:t1',
        event: invalidType,
        data: {},
        timestamp: '2026-01-01T00:00:00Z',
        userId: 'u1',
      })).toBe(false)
    }
  })
})
