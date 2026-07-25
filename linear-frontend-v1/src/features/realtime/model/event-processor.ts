import type { WSEvent, WSEventType, WSEventPayload } from '../lib/event-schema'
import { isValidEventType } from '../lib/event-schema'

const EVENT_TTL_MS = 5 * 60 * 1000
const seenEvents = new Map<string, number>()

function cleanupSeenEvents(): void {
  const now = Date.now()
  for (const [id, timestamp] of seenEvents) {
    if (now - timestamp > EVENT_TTL_MS) {
      seenEvents.delete(id)
    }
  }
}

export function clearDedupStore(): void {
  seenEvents.clear()
}

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

  if (seenEvents.has(event.eventId)) return null
  seenEvents.set(event.eventId, Date.now())
  cleanupSeenEvents()

  return event
}

export function routeEvent(event: WSEvent): void {
  const handler = eventHandlers.get(event.type)
  if (handler) {
    handler(event)
  }
}
