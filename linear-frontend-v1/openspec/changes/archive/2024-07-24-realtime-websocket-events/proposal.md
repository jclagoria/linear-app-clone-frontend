# Realtime Module — WebSocket & Events

## Problem Statement

The application currently relies on manual data fetching and page refreshes to display current state. Users cannot see updates made by other team members in real-time, leading to stale data, coordination friction, and a disjointed collaborative experience. Critical workflows like issue status changes, comment additions, and project updates require all participants to be on the same page — literally.

## Motivation

Real-time synchronization is foundational to a project management tool that teams rely on for daily coordination. Without it, the application feels static and unreliable compared to competitors like Linear. Implementing WebSocket-based real-time updates delivers:

- **Immediate visibility**: All team members see issue changes, comments, and project updates as they happen
- **Reduced coordination overhead**: No need to refresh pages or ask "did you see my update?"
- **Optimistic UX**: Users see their own actions reflected instantly, making the app feel responsive and alive
- **Notification delivery**: Real-time push of notifications without polling

## Scope

### In scope

- WebSocket connection lifecycle management (connect, disconnect, reconnect with exponential backoff)
- Authentication handshake within 5 seconds of connection
- Heartbeat mechanism to maintain connection health
- Event subscription and routing for 15 event types:
  - Issue events: `issue.created`, `issue.updated`, `issue.statusChanged`, `issue.assigned`, `issue.unassigned`, `issue.deleted`
  - Comment events: `comment.created`, `comment.updated`
  - Project events: `project.created`, `project.updated`
  - Cycle events: `cycle.created`, `cycle.updated`, `cycle.activated`, `cycle.completed`
  - Notification events: `notification.created`
- Event processing pipeline: validate, deduplicate, route to appropriate Zustand stores
- OptimisticUpdate interface implementation for low-risk user actions
- Cache bypass strategy for optimistic updates (update state directly, invalidate on API success)
- Failure revert with error toast on optimistic update failure
- Auto-subscription to team channels on connection
- WebSocket store for connection state, events, and notifications

### Out of scope

- Backend WebSocket server implementation (handled by separate team)
- Custom event types beyond the 15 specified
- WebSocket protocol customization
- Mobile push notification delivery
- Offline event queuing and sync
- WebRTC or peer-to-peer communication

## Impact

### Affected modules

- **Realtime Module** (primary): New module implementation per Section 7 of frontend spec
- **State Module**: WebSocket store additions, cache invalidation coordination
- **Auth Module**: Token provision for WebSocket authentication handshake
- **API Module**: Request deduplication awareness for optimistic update flows
- **Work Module**: Issue store receives real-time event updates
- **Layout Module**: Header notification count updates from WebSocket events

### Teams and consumers

- **Frontend team**: Primary implementors; must coordinate with backend on event payload contracts
- **Backend team**: WebSocket gateway team needs to confirm event type schema and authentication flow
- **QA team**: Real-time behaviors require new test scenarios (connection drops, reconnection, event ordering)

### Risk considerations

- Reconnection logic must handle network instability gracefully without spamming the server
- Optimistic updates introduce temporary state inconsistency that must revert cleanly on failure
- Event deduplication is critical to prevent double-processing from retry logic
