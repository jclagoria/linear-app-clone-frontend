import type { WSEvent, WSEventType, WSEventPayload } from '../lib/event-schema'
import { isValidEventType } from '../lib/event-schema'

const eventHandlers = new Map<WSEventType, (event: WSEvent) => void>()

export function registerEventHandler(
  eventType: WSEventType,
  handler: (event: WSEvent) => void,
): () => void {
  eventHandlers.set(eventType, handler)
  return () => {
    eventHandlers.delete(eventType)
  }
}

export function processEvent(data: unknown): WSEvent | null {
  if (typeof data !== 'object' || data === null) return null

  const obj = data as Record<string, unknown>

  const event: WSEvent = {
    eventId: String(obj.eventId || ''),
    type: String(obj.type) as WSEventType,
    payload: (obj.payload || {}) as WSEventPayload,
    timestamp: String(obj.timestamp || new Date().toISOString()),
    teamId: String(obj.teamId || ''),
  }

  if (!event.eventId) return null
  if (!isValidEventType(event.type)) return null

  return event
}

export function routeEvent(event: WSEvent): void {
  const handler = eventHandlers.get(event.type)
  if (handler) {
    handler(event)
  }
}
