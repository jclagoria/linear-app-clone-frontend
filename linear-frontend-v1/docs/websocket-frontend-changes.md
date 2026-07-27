# Frontend WebSocket Changes — Align with AsyncAPI Spec

## Overview

The backend WebSocket gateway (LAG-56) introduced auto-subscription, channel
validation, and event broadcasting. The frontend `ws-client.ts` currently uses
a different message format and authentication flow. This document lists every
change required to match the new AsyncAPI specification.

---

## 1. Message Format — Client → Server

### Current vs New

| Operation | Current | New (AsyncAPI) |
|-----------|---------|----------------|
| Authenticate | `{ type: 'auth', token }` | `{ type: 'authenticate', token }` |
| Subscribe | `{ type: 'subscribe', teamId }` | `{ type: 'subscribe', channel: 'team:<uuid>' }` |
| Unsubscribe | not implemented | `{ type: 'unsubscribe', channel: 'team:<uuid>' }` |
| Ping | `{ type: 'ping' }` | `{ type: 'ping' }` (unchanged) |

### File: `src/features/realtime/lib/ws-client.ts`

**Change 1 — Auth message type (line 74)**

```diff
- ws?.send(JSON.stringify({ type: 'auth', token: config.token }))
+ ws?.send(JSON.stringify({ type: 'authenticate', token: config.token }))
```

**Change 2 — Subscribe message format (lines 74-77)**

```diff
  ws?.send(JSON.stringify({ type: 'authenticate', token: config.token }))
- if (config.teamId) {
-   ws?.send(JSON.stringify({ type: 'subscribe', teamId: config.teamId }))
- }
```

Remove the manual team subscription from `onopen`. Auto-subscription is now
handled by the server after authentication. The client should NOT send subscribe
messages during the auth handshake.

**Change 3 — subscribeToTeam helper (lines 142-146)**

```diff
  const subscribeToTeam = (teamId: string) => {
    if (ws?.readyState === WebSocket.OPEN) {
-     ws.send(JSON.stringify({ type: 'subscribe', teamId }))
+     ws.send(JSON.stringify({ type: 'subscribe', channel: `team:${teamId}` }))
    }
  }
```

**Change 4 — Add subscribeToChannel and unsubscribeFromChannel**

```typescript
const subscribeToChannel = (channel: string) => {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'subscribe', channel }))
  }
}

const unsubscribeFromChannel = (channel: string) => {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'unsubscribe', channel }))
  }
}
```

Update the return object:

```diff
- return { connect, disconnect, reconnect, subscribeToTeam }
+ return { connect, disconnect, reconnect, subscribeToTeam, subscribeToChannel, unsubscribeFromChannel }
```

---

## 2. Authentication Flow — Connection ACK

### Current flow

1. Client connects
2. Server sends `connection_ack`
3. Client sends `auth` message
4. Client manually subscribes to team

### New flow (AsyncAPI)

1. Client connects
2. Client sends `authenticate` within 5 seconds
3. Server sends `authenticated` (with `userId`, `connectionId`)
4. Server auto-subscribes to user/team/issue channels, sends `subscribed` for each

### File: `src/features/realtime/lib/ws-client.ts`

**Change 5 — Replace `connection_ack` handler with `authenticated` (lines 66-83)**

```diff
  const defaultHandler = ws.onmessage
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
-     if (data.type === 'connection_ack') {
+     if (data.type === 'authenticated') {
        clearTimeout(ackTimeout)
        store.setConnected()
        heartbeat.start()
-       ws?.send(JSON.stringify({ type: 'auth', token: config.token }))
-       if (config.teamId) {
-         ws?.send(JSON.stringify({ type: 'subscribe', teamId: config.teamId }))
-       }
+       ws?.send(JSON.stringify({ type: 'authenticate', token: config.token }))
        ws.onmessage = defaultHandler
        return
      }
    } catch {}
    defaultHandler?.call(ws, event)
  }
```

**Important**: The `authenticated` message is sent BY the server AFTER the client
sends `authenticate`. So the flow is reversed from current code. The client must
send `authenticate` first, then wait for `authenticated` response.

Revised auth flow in `ws.onopen`:

```typescript
ws.onopen = () => {
  clearTimeout(connectTimeout)
  reconnectAttempts = 0
  store.setConnecting()
  setupEventRouter()
  config.onOpen?.()

  // Send authenticate immediately — server expects it within 5s
  ws?.send(JSON.stringify({ type: 'authenticate', token: config.token }))

  const ackTimeout = setTimeout(() => {
    if (store.connectionStatus === 'connecting') {
      ws?.close()
      store.setDisconnected()
      config.onClose?.()
    }
  }, 5000)

  const defaultHandler = ws.onmessage
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      if (data.type === 'authenticated') {
        clearTimeout(ackTimeout)
        store.setConnected()
        heartbeat.start()
        // Auto-subscription handled by server — no manual subscribe needed
        ws.onmessage = defaultHandler
        return
      }
      if (data.type === 'error') {
        clearTimeout(ackTimeout)
        store.setDisconnected()
        ws?.close()
        config.onClose?.()
        return
      }
    } catch {}
    defaultHandler?.call(ws, event)
  }
}
```

---

## 3. Event Message Format — Server → Client

### Current format

```json
{
  "eventId": "uuid",
  "type": "issue.updated",
  "payload": { "issueId": "...", "statusId": "..." },
  "timestamp": "2026-07-26T12:00:00.000Z",
  "teamId": "uuid"
}
```

### New format (AsyncAPI)

```json
{
  "type": "event",
  "channel": "team:uuid",
  "event": "issue.updated",
  "data": { "id": "...", "identifier": "ENG-1", "statusId": "..." },
  "timestamp": "2026-07-26T12:00:00.000Z",
  "userId": "uuid"
}
```

### File: `src/features/realtime/lib/event-schema.ts`

**Change 6 — Update WSEvent interface**

```diff
  export interface WSEvent {
-   eventId: string
-   type: WSEventType
-   payload: WSEventPayload
+   type: 'event'
+   channel: string
+   event: WSEventType
+   data: WSEventPayload
    timestamp: string
-   teamId: string
+   userId: string
  }
```

**Change 7 — Update event type enums**

Add new event types from AsyncAPI:

```diff
  export type IssueEventType =
    | 'issue.created'
    | 'issue.updated'
-   | 'issue.statusChanged'
    | 'issue.assigned'
+   | 'issue.deleted'

  export type CommentEventType =
    | 'comment.created'
-   | 'comment.updated'
+   | 'comment.updated'
+   | 'comment.deleted'

+ export type LabelEventType =
+   | 'label.created'
+   | 'label.updated'
+   | 'label.deleted'

+ export type WatcherEventType =
+   | 'watcher.added'
+   | 'watcher.removed'

  export type ProjectEventType =
    | 'project.created'
-   | 'project.updated'
+   | 'project.updated'

  export type CycleEventType =
    | 'cycle.created'
-   | 'cycle.updated'
-   | 'cycle.activated'
-   | 'cycle.completed'
+   | 'cycle.updated'

+ export type TeamEventType =
+   | 'team.member_added'
+   | 'team.member_removed'

+ export type UserEventType =
+   | 'user.online'
+   | 'user.offline'
+   | 'session.revoked'

  export type NotificationEventType = 'notification.created'

  export type WSEventType =
    | IssueEventType
    | CommentEventType
+   | LabelEventType
+   | WatcherEventType
    | ProjectEventType
    | CycleEventType
+   | TeamEventType
+   | UserEventType
    | NotificationEventType
```

**Change 8 — Update REGISTERED_EVENT_TYPES**

```diff
  export const REGISTERED_EVENT_TYPES: WSEventType[] = [
    'issue.created',
    'issue.updated',
-   'issue.statusChanged',
    'issue.assigned',
-   'issue.unassigned',
    'issue.deleted',
    'comment.created',
    'comment.updated',
+   'comment.deleted',
+   'label.created',
+   'label.updated',
+   'label.deleted',
+   'watcher.added',
+   'watcher.removed',
    'project.created',
    'project.updated',
    'cycle.created',
    'cycle.updated',
-   'cycle.activated',
-   'cycle.completed',
+   'team.member_added',
+   'team.member_removed',
+   'user.online',
+   'user.offline',
+   'session.revoked',
    'notification.created',
  ]
```

**Change 9 — Update validateWSEvent**

```diff
  export function validateWSEvent(data: unknown): data is WSEvent {
    if (typeof data !== 'object' || data === null) return false
    const obj = data as Record<string, unknown>
-   if (typeof obj.eventId !== 'string' || obj.eventId.length === 0) return false
-   if (typeof obj.type !== 'string' || !isValidEventType(obj.type)) return false
+   if (obj.type !== 'event') return false
+   if (typeof obj.channel !== 'string' || obj.channel.length === 0) return false
+   if (typeof obj.event !== 'string' || !isValidEventType(obj.event)) return false
    if (typeof obj.timestamp !== 'string' || obj.timestamp.length === 0) return false
-   if (typeof obj.teamId !== 'string' || obj.teamId.length === 0) return false
-   if (typeof obj.payload !== 'object' || obj.payload === null) return false
+   if (typeof obj.userId !== 'string' || obj.userId.length === 0) return false
+   if (typeof obj.data !== 'object' || obj.data === null) return false
    return true
  }
```

---

## 4. Event Processing — Adapt to New Shape

### File: `src/features/realtime/model/event-processor.ts`

**Change 10 — Update processEvent to handle new format**

```diff
  export function processEvent(data: unknown): WSEvent | null {
    if (typeof data !== 'object' || data === null) return null

    const obj = data as Record<string, unknown>

+   // Only process 'event' type messages
+   if (obj.type !== 'event') return null
+
-   const event: WSEvent = {
-     eventId: String(obj.eventId || ''),
-     type: String(obj.type) as WSEventType,
-     payload: (obj.payload || {}) as WSEventPayload,
-     timestamp: String(obj.timestamp || new Date().toISOString()),
-     teamId: String(obj.teamId || ''),
-   }
+   const event: WSEvent = {
+     type: 'event',
+     channel: String(obj.channel || ''),
+     event: String(obj.event) as WSEventType,
+     data: (obj.data || {}) as WSEventPayload,
+     timestamp: String(obj.timestamp || new Date().toISOString()),
+     userId: String(obj.userId || ''),
+   }

-   if (!event.eventId) return null
-   if (!isValidEventType(event.type)) return null
+   if (!isValidEventType(event.event)) return null

-   if (seenEvents.has(event.eventId)) return null
-   seenEvents.set(event.eventId, Date.now())
+   // Dedup using channel + event + timestamp as key
+   const dedupKey = `${event.channel}:${event.event}:${event.timestamp}`
+   if (seenEvents.has(dedupKey)) return null
+   seenEvents.set(dedupKey, Date.now())
    cleanupSeenEvents()

    if (isDuplicateEntityEvent(event)) return null
    cleanupEntityDedupStore()

    return event
  }
```

**Change 11 — Update getEntityKey to use `data` instead of `payload`**

```diff
  function getEntityKey(event: WSEvent): string | null {
-   const payload = event.payload as Record<string, unknown>
+   const data = event.data as Record<string, unknown>
    switch (event.type) {
-     case 'issue.created':
-     case 'issue.updated':
-     case 'issue.statusChanged':
-     case 'issue.assigned':
-     case 'issue.unassigned':
-     case 'issue.deleted':
-       return payload.issueId ? `issue:${payload.issueId}` : null
-     case 'comment.created':
-     case 'comment.updated':
-       return payload.commentId ? `comment:${payload.commentId}` : null
-     case 'project.created':
-     case 'project.updated':
-       return payload.projectId ? `project:${payload.projectId}` : null
-     case 'cycle.created':
-     case 'cycle.updated':
-     case 'cycle.activated':
-     case 'cycle.completed':
-       return payload.cycleId ? `cycle:${payload.cycleId}` : null
-     case 'notification.created':
-       return payload.notificationId ? `notification:${payload.notificationId}` : null
+     // Use event.event (the event type) instead of event.type (always 'event')
+     // Access data instead of payload
    }
  }
```

Update the switch to use `event.event` for type checking and `data` for payload access:

```typescript
function getEntityKey(event: WSEvent): string | null {
  const data = event.data as Record<string, unknown>
  switch (event.event) {
    case 'issue.created':
    case 'issue.updated':
    case 'issue.assigned':
    case 'issue.deleted':
      return data.id ? `issue:${data.id}` : null
    case 'comment.created':
    case 'comment.updated':
    case 'comment.deleted':
      return data.id ? `comment:${data.id}` : null
    case 'label.created':
    case 'label.updated':
    case 'label.deleted':
      return data.id ? `label:${data.id}` : null
    case 'watcher.added':
    case 'watcher.removed':
      return data.issueId ? `watcher:${data.issueId}` : null
    case 'project.created':
    case 'project.updated':
      return data.id ? `project:${data.id}` : null
    case 'cycle.created':
    case 'cycle.updated':
      return data.id ? `cycle:${data.id}` : null
    case 'team.member_added':
    case 'team.member_removed':
      return data.teamId ? `team:${data.teamId}` : null
    case 'notification.created':
      return data.id ? `notification:${data.id}` : null
    default:
      return null
  }
}
```

**Change 12 — Update routeEvent to use `event.event`**

```diff
  export function routeEvent(event: WSEvent): void {
-   const handler = eventHandlers.get(event.type)
+   const handler = eventHandlers.get(event.event)
    if (handler) {
      handler(event)
    }
  }
```

---

## 5. Event Router — Adapt to New Event Shape

### File: `src/features/realtime/model/event-router.ts`

**Change 13 — Update setupEventRouter event types**

```diff
  export function setupEventRouter(): void {
    const types: WSEventType[] = [
      'issue.created', 'issue.updated',
-     'issue.statusChanged',
-     'issue.assigned', 'issue.unassigned', 'issue.deleted',
-     'comment.created', 'comment.updated',
+     'issue.assigned', 'issue.deleted',
+     'comment.created', 'comment.updated', 'comment.deleted',
+     'label.created', 'label.updated', 'label.deleted',
+     'watcher.added', 'watcher.removed',
      'project.created', 'project.updated',
-     'cycle.created', 'cycle.updated', 'cycle.activated', 'cycle.completed',
+     'cycle.created', 'cycle.updated',
+     'team.member_added', 'team.member_removed',
+     'user.online', 'user.offline', 'session.revoked',
      'notification.created',
    ]
```

**Change 14 — Update handleIssueEvent to use `event.event` and `data`**

```diff
  function handleIssueEvent(event: WSEvent): void {
    if (!isAutoUpdateEnabled()) return
    const store = useIssuesStore.getState()
-   const { type, payload } = event
-   const issueId = (payload as Record<string, unknown>).issueId as string
+   const { event: eventType, data } = event
+   const issueData = data as Record<string, unknown>
+   const issueId = (issueData.id as string) || (issueData.issueId as string)

-   switch (type) {
+   switch (eventType) {
      case 'issue.created':
-       store.addIssue(payload as Parameters<typeof store.addIssue>[0])
+       store.addIssue(data as Parameters<typeof store.addIssue>[0])
        break
      case 'issue.updated':
-     case 'issue.statusChanged':
      case 'issue.assigned':
-     case 'issue.unassigned':
        if (issueId) {
-         store.updateIssue(issueId, payload as Parameters<typeof store.updateIssue>[1])
+         store.updateIssue(issueId, data as Parameters<typeof store.updateIssue>[1])
        }
        break
      case 'issue.deleted':
        if (issueId) {
          store.removeIssue(issueId)
        }
        break
    }
  }
```

**Change 15 — Update handleCommentEvent**

```diff
  function handleCommentEvent(event: WSEvent): void {
    if (!isAutoUpdateEnabled()) return
    const store = useIssuesStore.getState()
-   const payload = event.payload as Record<string, unknown>
-   const issueId = payload.issueId as string
-   const commentId = payload.commentId as string
+   const data = event.data as Record<string, unknown>
+   const issueId = data.issueId as string
+   const commentId = data.id as string

    if (!issueId) return

    if (event.type === 'comment.created') {
      const existing = store.commentsByIssue[issueId] || []
      store.setCommentsForIssue(issueId, [
        ...existing,
        {
          id: commentId,
          issueId,
-         body: (payload.body as string) || '',
-         authorId: (payload.authorId as string) || '',
-         authorName: (payload.authorName as string) || '',
+         body: (data.body as string) || '',
+         authorId: (data.userId as string) || '',
+         authorName: (data.userName as string) || '',
          createdAt: event.timestamp,
          updatedAt: event.timestamp,
        },
      ])
-   } else if (event.type === 'comment.updated') {
-     const body = payload.body as string
+   } else if (event.event === 'comment.updated') {
+     const body = data.body as string
      if (body && commentId) {
        store.updateCommentInStore(issueId, commentId, body)
      }
+   } else if (event.event === 'comment.deleted') {
+     if (commentId) {
+       store.removeCommentFromStore(issueId, commentId)
+     }
    }
  }
```

**Change 16 — Update handleNotificationEvent**

```diff
  function handleNotificationEvent(event: WSEvent): void {
    if (!isAutoUpdateEnabled()) return
-   const payload = event.payload as Record<string, unknown>
+   const data = event.data as Record<string, unknown>
    useNotificationsStore.getState().addNotification({
-     id: (payload.notificationId as string) || event.eventId,
-     type: (payload.type as string) || 'info',
-     title: (payload.title as string) || 'New notification',
-     message: (payload.message as string) || '',
+     id: (data.id as string) || event.channel,
+     type: (data.type as string) || 'info',
+     title: (data.title as string) || 'New notification',
+     message: (data.message as string) || '',
      read: false,
      createdAt: event.timestamp,
-     issueId: payload.issueId as string | undefined,
+     issueId: data.issueId as string | undefined,
    })
  }
```

**Change 17 — Add handlers for new event types**

```typescript
function handleLabelEvent(event: WSEvent): void {
  if (!isAutoUpdateEnabled()) return
  // Handle label events — update issue labels in store
  const data = event.data as Record<string, unknown>
  // Implementation depends on how labels are stored
}

function handleWatcherEvent(event: WSEvent): void {
  if (!isAutoUpdateEnabled()) return
  // Handle watcher add/remove events
  const data = event.data as Record<string, unknown>
  // Implementation depends on how watchers are stored
}

function handleTeamEvent(event: WSEvent): void {
  if (!isAutoUpdateEnabled()) return
  // Handle team member changes
  const data = event.data as Record<string, unknown>
  // May trigger team store refresh
}

function handleUserEvent(event: WSEvent): void {
  if (!isAutoUpdateEnabled()) return
  // Handle user online/offline status
  const data = event.data as Record<string, unknown>
  // Could update presence indicators
}
```

Update ROUTES:

```diff
  const ROUTES: { prefix: string; handler: (event: WSEvent) => void }[] = [
    { prefix: 'issue.', handler: handleIssueEvent },
    { prefix: 'comment.', handler: handleCommentEvent },
+   { prefix: 'label.', handler: handleLabelEvent },
+   { prefix: 'watcher.', handler: handleWatcherEvent },
    { prefix: 'project.', handler: handleProjectEvent },
    { prefix: 'cycle.', handler: handleCycleEvent },
+   { prefix: 'team.', handler: handleTeamEvent },
+   { prefix: 'user.', handler: handleUserEvent },
+   { prefix: 'session.', handler: handleUserEvent },
    { prefix: 'notification.', handler: handleNotificationEvent },
  ]
```

---

## 6. Error Handling

### File: `src/features/realtime/lib/ws-client.ts`

**Change 18 — Handle error messages from server**

Add error message handling in the `onmessage` handler:

```typescript
ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data)

    // Handle server error responses
    if (data.type === 'error') {
      console.error('[WS] Server error:', data.code, data.message)
      // Handle specific error codes
      switch (data.code) {
        case 'auth_failed':
        case 'invalid_token':
          store.setDisconnected()
          ws?.close()
          break
        case 'forbidden':
          console.warn('[WS] Channel access denied')
          break
        case 'rate_limited':
          console.warn('[WS] Rate limited — slow down')
          break
        case 'invalid_channel':
          console.warn('[WS] Invalid channel format')
          break
      }
      return
    }

    // Handle subscribed/unsubscribed confirmations
    if (data.type === 'subscribed') {
      console.log('[WS] Subscribed to:', data.channel)
      return
    }
    if (data.type === 'unsubscribed') {
      console.log('[WS] Unsubscribed from:', data.channel)
      return
    }

    // Handle pong
    if (data.type === 'pong') {
      return
    }

    const processed = processEvent(data)
    if (processed) {
      routeEvent(processed)
    }
  } catch {
    // Ignore non-JSON messages
  }
}
```

---

## 7. WebSocketProvider — Remove Manual Team Subscription

### File: `src/app/providers/WebSocketProvider.tsx`

**Change 19 — Remove team subscription effect**

The server now auto-subscribes to team channels on authentication. Remove the
manual subscription effect:

```diff
- useEffect(() => {
-   if (connectionStatus === 'connected' && currentTeamId && clientRef.current) {
-     clientRef.current.subscribeToTeam(currentTeamId)
-   }
- }, [currentTeamId, connectionStatus])
```

**Change 20 — Remove teamId from createWSClient config**

```diff
  const client = createWSClient({
    url: WS_URL,
    token: accessToken,
-   teamId,
  })
```

**Change 21 — Expose new channel methods in context**

```diff
  interface WebSocketContextValue {
    isConnected: boolean
    connectionStatus: 'connecting' | 'connected' | 'reconnecting' | 'disconnected'
    reconnect: () => void
    disconnect: () => void
+   subscribe: (channel: string) => void
+   unsubscribe: (channel: string) => void
  }
```

Update the value:

```diff
  const value: WebSocketContextValue = {
    isConnected: connectionStatus === 'connected',
    connectionStatus,
    reconnect,
    disconnect,
+   subscribe: (channel: string) => clientRef.current?.subscribeToChannel(channel),
+   unsubscribe: (channel: string) => clientRef.current?.unsubscribeFromChannel(channel),
  }
```

---

## 8. Heartbeat — No Changes Needed

The heartbeat module sends `{ type: 'ping' }` which matches the AsyncAPI spec.
The server responds with `{ type: 'pong' }`. No changes required.

Current heartbeat handling in `ws-client.ts` already sends ping via `ws.send`.
The pong response is handled in the `onmessage` handler (Change 18 above).

---

## 9. Channel Subscription Strategy

After authentication, the server auto-subscribes to:
- `user:<userId>` — personal notifications
- `team:<teamId>` — for each team the user belongs to
- `issue:<issueId>` — for each issue the user is assigned to or watches

The client should:
1. **Not** send manual subscribe messages during auth handshake
2. **Listen** for `subscribed` messages to confirm auto-subscriptions
3. **Manually subscribe** only when navigating to a specific issue not in auto-sub
4. **Unsubscribe** when navigating away from specific views (optional optimization)

### File: `src/features/realtime/lib/ws-client.ts`

**Change 22 — Add issue channel subscription for detail views**

```typescript
const subscribeToIssue = (issueId: string) => {
  subscribeToChannel(`issue:${issueId}`)
}

const unsubscribeFromIssue = (issueId: string) => {
  unsubscribeFromChannel(`issue:${issueId}`)
}
```

---

## 10. TypeScript Types — New Channel Type

### File: `src/features/realtime/lib/event-schema.ts`

**Change 23 — Add channel type**

```typescript
export type ChannelType = 'team' | 'issue' | 'user'

export interface Channel {
  type: ChannelType
  id: string
}

export function parseChannel(channel: string): Channel | null {
  const match = channel.match(/^(team|issue|user):(.+)$/)
  if (!match) return null
  return { type: match[1] as ChannelType, id: match[2] }
}

export function formatChannel(channel: Channel): string {
  return `${channel.type}:${channel.id}`
}
```

---

## Summary of All Changes

| # | File | Change |
|---|------|--------|
| 1 | `ws-client.ts` | Auth message type: `auth` → `authenticate` |
| 2 | `ws-client.ts` | Remove manual team subscribe from onopen |
| 3 | `ws-client.ts` | subscribeToTeam uses channel format |
| 4 | `ws-client.ts` | Add subscribeToChannel/unsubscribeFromChannel |
| 5 | `ws-client.ts` | Handle `authenticated` instead of `connection_ack` |
| 6 | `event-schema.ts` | Update WSEvent interface to new shape |
| 7 | `event-schema.ts` | Add new event types (label, watcher, team, user) |
| 8 | `event-schema.ts` | Update REGISTERED_EVENT_TYPES |
| 9 | `event-schema.ts` | Update validateWSEvent |
| 10 | `event-processor.ts` | Handle `type: 'event'` wrapper, use `event` and `data` |
| 11 | `event-processor.ts` | Update getEntityKey for new data shape |
| 12 | `event-processor.ts` | Use `event.event` for handler lookup |
| 13 | `event-router.ts` | Update registered event types |
| 14 | `event-router.ts` | Update handleIssueEvent for new shape |
| 15 | `event-router.ts` | Update handleCommentEvent for new shape |
| 16 | `event-router.ts` | Update handleNotificationEvent for new shape |
| 17 | `event-router.ts` | Add label/watcher/team/user handlers |
| 18 | `ws-client.ts` | Handle error/subscribed/unsubscribed/pong messages |
| 19 | `WebSocketProvider.tsx` | Remove manual team subscription effect |
| 20 | `WebSocketProvider.tsx` | Remove teamId from client config |
| 21 | `WebSocketProvider.tsx` | Expose subscribe/unsubscribe in context |
| 22 | `ws-client.ts` | Add issue channel subscription helpers |
| 23 | `event-schema.ts` | Add Channel type and parse/format helpers |

---

## Breaking Changes to Test

1. Auth handshake — verify `authenticate` → `authenticated` flow works
2. Auto-subscription — verify `subscribed` messages arrive for user/team/issue channels
3. Event shape — verify `event` and `data` fields are parsed correctly
4. New event types — verify label, watcher, team, user events route correctly
5. Error handling — verify `error` messages are handled gracefully
6. Channel subscription — verify manual subscribe/unsubscribe works for issue views
7. Reconnection — verify reconnection sends `authenticate` again
8. Deduplication — verify new dedup key format works
