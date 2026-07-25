# ADR Review Manifest — Realtime WebSocket Events

- Status: completed
- Review date: 2026-07-24

## Review Summary

ADR review completed for the realtime WebSocket events feature. Three architecturally significant decisions were identified and recorded as new durable ADRs. Five additional operational decisions were captured as part of the design-frontend artifact without requiring standalone ADRs.

## In-Force ADRs Reviewed

- None — `<repo>/adr/` has no in-force ADRs. This is the first ADR batch for the project.

## New Durable ADRs Created

### ADR-001: Use Native WebSocket API for Real-Time Transport

- **Status**: Accepted
- **Decision**: Use the browser-native `WebSocket` API instead of socket.io or similar abstraction.
- **Rationale**: The backend owns the WebSocket server and protocol. No need for socket.io's automatic fallback, room management, or protocol overhead. Custom reconnection and heartbeat logic matches the spec requirements (1s–30s exponential backoff, 30s ping interval).
- **Alternatives considered**: socket.io (adds protocol layer, auto-fallback not needed), Server-Sent Events (unidirectional, doesn't support client→server), WebSocket polyfill libraries (unnecessary with modern browsers).
- **Consequences**: Must implement custom reconnection, heartbeat, and auth handshake. No automatic HTTP long-polling fallback if WebSocket fails at network level.

### ADR-002: Use Zustand for All State Management

- **Status**: Accepted
- **Decision**: Extend existing Zustand stores for realtime state; add `useWebSocketStore` and `useOptimisticStore` as new slices.
- **Rationale**: Project already uses Zustand 5.x with a slice pattern. Adding new stores follows existing conventions. No new dependencies introduced. Zustand's subscription model pairs well with WebSocket event-driven updates.
- **Alternatives considered**: TanStack Query (adds dependency, overkill for WS-driven updates), Redux Toolkit (heavier, existing codebase uses Zustand), React Context only (no fine-grained subscriptions).
- **Consequences**: Custom optimistic update tracking code required (no built-in revert). Event routing must be manually wired to stores. DevTools integration requires Zustand middleware.

### ADR-003: Custom Optimistic Update Manager with 30s Staleness

- **Status**: Accepted
- **Decision**: Build a custom optimistic update orchestrator using a dedicated Zustand slice, with automatic revert after 30 seconds of no server confirmation.
- **Rationale**: Linear-like UX demands instant UI feedback on user actions. The 30s staleness threshold prevents indefinite "pending" state. Custom implementation gives full control over revert logic, toast notifications, and retry behavior.
- **Alternatives considered**: TanStack Query optimistic updates (adds dependency, less control over staleness), no optimistic updates (degraded UX for status/assignee changes), pessimistic-only with loading spinners (doesn't match Linear's snappy feel).
- **Consequences**: Must track timestamps for each pending update. Auto-revert goroutine (interval check) needed. Success path must invalidate cache explicitly. Failure path must apply revert data and show toast.

## Operational Decisions (Not Standalone ADRs)

These decisions are significant but fall within standard implementation patterns. Documented in `design-frontend.md`:

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Event routing | Prefix matching (`issue.*`) | Simple; maps 15 event types to 4 domain stores |
| Deduplication | Set-based with 5min TTL | Prevents retry-induced duplicates; low memory footprint |
| Heartbeat | Custom ping/pong frames | 30s interval, 10s timeout per spec |
| Reconnection | Exponential backoff (1s–30s, 10 max) | Prevents server spam; per spec requirement |
| Auth handshake | JWT in first message | Simple; no custom protocol headers required |

## More Information

- Design document: `design-frontend.md`
- Tech stack: `docs/stack-frontend.md`
- Architecture: `docs/architecture-frontend.md`
- These ADRs should be migrated to `<repo>/adr/` if adopted as project-wide standards.
