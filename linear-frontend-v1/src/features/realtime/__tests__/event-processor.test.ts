import { describe, it, expect } from 'vitest'
import { processEvent, routeEvent, registerEventHandler } from '../model/event-processor'

describe('processEvent', () => {
  it('returns null for non-object input', () => {
    expect(processEvent(null)).toBeNull()
    expect(processEvent('string')).toBeNull()
    expect(processEvent(123)).toBeNull()
  })

  it('returns null if eventId is missing', () => {
    expect(processEvent({ type: 'issue.created', payload: {}, timestamp: '', teamId: 't1' })).toBeNull()
  })

  it('returns null if type is invalid', () => {
    expect(processEvent({ eventId: 'e1', type: 'invalid.type', payload: {}, timestamp: '', teamId: 't1' })).toBeNull()
  })

  it('returns a valid WSEvent for valid input', () => {
    const result = processEvent({
      eventId: 'e1',
      type: 'issue.created',
      payload: { issueId: 'i1', title: 'Test' },
      timestamp: '2026-01-01T00:00:00Z',
      teamId: 't1',
    })
    expect(result).not.toBeNull()
    expect(result?.eventId).toBe('e1')
    expect(result?.type).toBe('issue.created')
  })
})

describe('routeEvent', () => {
  it('calls the registered handler for matching event type', () => {
    const handler = vi.fn()
    registerEventHandler('issue.created', handler)

    routeEvent({
      eventId: 'e1',
      type: 'issue.created',
      payload: { issueId: 'i1' },
      timestamp: '2026-01-01T00:00:00Z',
      teamId: 't1',
    })

    expect(handler).toHaveBeenCalledOnce()
  })
})
