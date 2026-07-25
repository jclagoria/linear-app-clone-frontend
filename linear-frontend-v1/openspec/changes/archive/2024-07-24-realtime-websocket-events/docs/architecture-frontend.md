# Architecture — Realtime Module (Frontend)

## Overview

The realtime module extends the existing React/Vite frontend with WebSocket-based event delivery, optimistic state updates, and automatic reconnection. It integrates as a thin layer over the current Zustand store architecture, adding a WebSocket connection manager and an optimistic update orchestrator.

## Technical Direction

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Architecture style | Feature-Sliced Design (FSD) | Existing project convention |
| Real-time transport | Native WebSocket API | No protocol overhead; backend owns the server |
| State management | Zustand slices | Existing store pattern; natural extension |
| Optimistic updates | Custom Zustand slice with revert | Per spec: immediate UI, cache bypass, revert on failure |
| Event routing | Event type prefix matching | 15 event types map to 4 domain stores |

## Project Structure

```
src/
  app/
    providers/
      WebSocketProvider.tsx      # Top-level WS lifecycle provider
      OptimisticProvider.tsx     # Optimistic update context
  features/
    realtime/
      model/
        websocket-store.ts      # Connection status, events, notifications
        optimistic-store.ts     # Pending updates, revert data
        event-processor.ts      # Validate, deduplicate, route events
        event-router.ts         # Map event types to store handlers
        reconnection.ts         # Exponential backoff logic
        heartbeat.ts            # Ping/pong health checks
      ui/
        ConnectionStatusIndicator.tsx
        ReconnectionToast.tsx
        ConnectionErrorModal.tsx
        RevertToast.tsx
      lib/
        ws-client.ts            # WebSocket wrapper with reconnect
        event-schema.ts         # Event type definitions + validation
        optimistic-manager.ts   # Create, track, resolve optimistic ops
  pages/
    issues/
      IssueListPage.tsx          # Consumes real-time issue events
      IssueDetailPage.tsx        # Consumes real-time comment/status events
    projects/
      ProjectListPage.tsx        # Consumes real-time project events
    cycles/
      CycleListPage.tsx          # Consumes real-time cycle events
  shared/
    ui/                          # Design-system components
    lib/                         # Shared utilities
```

## Component Design

### WebSocketProvider

```
Wraps app root. On mount:
  1. Reads auth token from auth store
  2. Initiates WebSocket connection
  3. Sets up heartbeat interval (30s)
  4. Registers event listener → EventProcessor
  5. Handles cleanup on unmount (graceful close)
```

### EventProcessor (singleton)

```
Pipeline: receive → validate → deduplicate → route → store update
  - validate: check eventType is one of 15 registered types
  - deduplicate: Set<eventId> with 5-minute TTL
  - route: prefix match (issue.* → IssuesStore, etc.)
```

### OptimisticUpdateManager

```
Flow:
  1. User action creates OptimisticUpdate object
  2. Apply data to target store immediately (bypass cache)
  3. Track in OptimisticStore with timestamp
  4. Send API request in background
  5. On success: remove from pending, invalidate cache
  6. On failure: apply revert data, show RevertToast
  7. Auto-revert if pending > 30 seconds
```

## Data Flow

```
User Action
  |
  v
OptimisticUpdateManager
  |-- Apply to Zustand store (immediate)
  |-- Track in OptimisticStore
  |-- Send API request (background)
  |     |-- Success → Confirm, invalidate cache
  |     |-- Failure → Revert store, show toast
  |
WebSocket Event (from other users)
  |
  v
EventProcessor
  |-- Validate schema
  |-- Deduplicate by eventId
  |-- Route to domain store
  |-- Store updates → UI re-renders
```

## Security

| Concern | Implementation |
|---------|---------------|
| Auth handshake | JWT token sent in WebSocket `protocols` field or first message |
| Token refresh | Reconnect with fresh token; old connection closed |
| Origin validation | WebSocket server validates Origin header |
| No sensitive data in WS | Event payloads contain only entity IDs and changed fields |

## Current Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| WebSocket API | Native `WebSocket` | No socket.io overhead; custom reconnect per spec |
| State integration | Zustand slices | Existing pattern; no new dependencies |
| Optimistic tracking | Dedicated Zustand slice | Centralized pending state; 30s staleness check |
| Event validation | JSON schema per event type | Strict typing; reject invalid payloads |
| Deduplication | Set-based with TTL | Simple; handles retry-induced duplicates |
| Reconnection | Exponential backoff (1s–30s, 10 max) | Per spec requirement |
| Heartbeat | 30s ping, 10s pong timeout | Per spec requirement |
