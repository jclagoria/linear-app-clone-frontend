import { describe, it, expect } from 'vitest'
import {
  isValidEventType,
  validateWSEvent,
  REGISTERED_EVENT_TYPES,
} from '../lib/event-schema'

const ALL_EVENT_TYPES = [
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
] as const

const VALID_PAYLOADS: Record<string, object> = {
  'issue.created': { issueId: 'i1', title: 'Test Issue' },
  'issue.updated': { issueId: 'i1', title: 'Updated' },
  'issue.statusChanged': { issueId: 'i1', statusId: 'done' },
  'issue.assigned': { issueId: 'i1', assigneeId: 'u1', assigneeName: 'Alice' },
  'issue.unassigned': { issueId: 'i1', assigneeId: null },
  'issue.deleted': { issueId: 'i1' },
  'comment.created': { commentId: 'c1', issueId: 'i1', body: 'Hello' },
  'comment.updated': { commentId: 'c1', issueId: 'i1', body: 'Updated' },
  'project.created': { projectId: 'p1', name: 'New Project' },
  'project.updated': { projectId: 'p1', name: 'Renamed' },
  'cycle.created': { cycleId: 'cy1', name: 'Cycle 1' },
  'cycle.updated': { cycleId: 'cy1', name: 'Updated Cycle' },
  'cycle.activated': { cycleId: 'cy1', status: 'active' },
  'cycle.completed': { cycleId: 'cy1', status: 'completed' },
  'notification.created': {
    notificationId: 'n1',
    type: 'issue_assigned',
    title: 'Assigned',
    message: 'You were assigned',
  },
}

describe('event schema — all 15 event types', () => {
  it('registers exactly 15 event types', () => {
    expect(REGISTERED_EVENT_TYPES).toHaveLength(15)
  })

  it.each(ALL_EVENT_TYPES)('recognizes "%s" as valid', (type) => {
    expect(isValidEventType(type)).toBe(true)
  })

  it('rejects unregistered event types', () => {
    expect(isValidEventType('issue.moved')).toBe(false)
    expect(isValidEventType('comment.deleted')).toBe(false)
    expect(isValidEventType('sprint.created')).toBe(false)
    expect(isValidEventType('')).toBe(false)
    expect(isValidEventType('issue.CREATED')).toBe(false)
  })
})

describe('validateWSEvent — payload validation per event type', () => {
  it.each(ALL_EVENT_TYPES)('accepts valid "%s" event', (type) => {
    const valid = validateWSEvent({
      eventId: `evt-${type}`,
      type,
      payload: VALID_PAYLOADS[type],
      timestamp: '2026-01-01T00:00:00Z',
      teamId: 't1',
    })
    expect(valid).toBe(true)
  })

  it('rejects event with missing eventId', () => {
    expect(validateWSEvent({
      eventId: '',
      type: 'issue.created',
      payload: { issueId: 'i1' },
      timestamp: '2026-01-01T00:00:00Z',
      teamId: 't1',
    })).toBe(false)
  })

  it('rejects event with invalid type', () => {
    expect(validateWSEvent({
      eventId: 'e1',
      type: 'invalid.type',
      payload: {},
      timestamp: '2026-01-01T00:00:00Z',
      teamId: 't1',
    })).toBe(false)
  })

  it('rejects null/undefined input', () => {
    expect(validateWSEvent(null)).toBe(false)
    expect(validateWSEvent(undefined)).toBe(false)
  })

  it('rejects non-object input', () => {
    expect(validateWSEvent('string')).toBe(false)
    expect(validateWSEvent(123)).toBe(false)
    expect(validateWSEvent(true)).toBe(false)
  })

  it('rejects event with null payload', () => {
    expect(validateWSEvent({
      eventId: 'e1',
      type: 'issue.created',
      payload: null,
      timestamp: '2026-01-01T00:00:00Z',
      teamId: 't1',
    })).toBe(false)
  })

  it('rejects event with missing timestamp', () => {
    expect(validateWSEvent({
      eventId: 'e1',
      type: 'issue.created',
      payload: { issueId: 'i1' },
      timestamp: '',
      teamId: 't1',
    })).toBe(false)
  })

  it('rejects event with missing teamId', () => {
    expect(validateWSEvent({
      eventId: 'e1',
      type: 'issue.created',
      payload: { issueId: 'i1' },
      timestamp: '2026-01-01T00:00:00Z',
      teamId: '',
    })).toBe(false)
  })
})
