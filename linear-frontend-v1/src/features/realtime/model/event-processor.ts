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

// --- Entity-level deduplication (100ms window for same-entity events) ---

const ENTITY_DEDUP_MS = 100
const lastEntityEvent = new Map<string, number>()

function getEntityKey(event: WSEvent): string | null {
  const payload = event.data as Record<string, unknown>
  switch (event.event) {
    case 'issue.created':
    case 'issue.updated':
    case 'issue.statusChanged':
    case 'issue.assigned':
    case 'issue.unassigned':
    case 'issue.deleted':
      return payload.issueId ? `issue:${payload.issueId}` : null
    case 'comment.created':
    case 'comment.updated':
      return payload.commentId ? `comment:${payload.commentId}` : null
    case 'project.created':
    case 'project.updated':
      return payload.projectId ? `project:${payload.projectId}` : null
    case 'cycle.created':
    case 'cycle.updated':
    case 'cycle.activated':
    case 'cycle.completed':
      return payload.cycleId ? `cycle:${payload.cycleId}` : null
    case 'notification.created':
      return payload.notificationId ? `notification:${payload.notificationId}` : null
    default:
      return null
  }
}

function isDuplicateEntityEvent(event: WSEvent): boolean {
  const key = getEntityKey(event)
  if (!key) return false

  const now = Date.now()
  const lastSeen = lastEntityEvent.get(key)

  if (lastSeen !== undefined && now - lastSeen < ENTITY_DEDUP_MS) {
    return true
  }

  lastEntityEvent.set(key, now)
  return false
}

function cleanupEntityDedupStore(): void {
  const now = Date.now()
  for (const [key, timestamp] of lastEntityEvent) {
    if (now - timestamp > ENTITY_DEDUP_MS * 10) {
      lastEntityEvent.delete(key)
    }
  }
}

export function clearEntityDedupStore(): void {
  lastEntityEvent.clear()
}

// --- Event handlers ---

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
    type: 'event',
    channel: String(obj.channel || ''),
    event: String(obj.event || '') as WSEventType,
    data: (obj.data || {}) as WSEventPayload,
    timestamp: String(obj.timestamp || new Date().toISOString()),
    userId: String(obj.userId || ''),
  }

  if (!event.eventId) return null
  if (!isValidEventType(event.event)) return null

  if (seenEvents.has(event.eventId)) return null
  seenEvents.set(event.eventId, Date.now())
  cleanupSeenEvents()

  if (isDuplicateEntityEvent(event)) return null
  cleanupEntityDedupStore()

  return event
}

export function routeEvent(event: WSEvent): void {
  const handler = eventHandlers.get(event.event)
  if (handler) {
    handler(event)
  }
}

// Clear all registered event handlers (used by tests to isolate state)
export function clearEventHandlers(): void {
  eventHandlers.clear()
}
