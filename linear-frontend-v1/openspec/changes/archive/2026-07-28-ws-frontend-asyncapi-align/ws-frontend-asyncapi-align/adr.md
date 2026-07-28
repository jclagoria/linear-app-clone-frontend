# ADR Review Manifest

- Status: completed
- Review date: 2026-07-27

## Review Summary

ADR review completed for the `ws-frontend-asyncapi-align` change. This change migrates the real-time transport from SSE to WebSocket, aligning the frontend with the AsyncAPI 3.0 spec. One existing in-force ADR (0013) is superseded by this change.

## In-Force ADRs Reviewed

- **ADR-0013: SSE for Real-Time Transport** — superseded. This change replaces SSE with WebSocket bidirectional messaging. The existing SSE client infrastructure (`features/realtime/lib/ws-client.ts`) is retired in favor of the new WebSocket client (`src/lib/ws/`).
- **ADR-0014: Optimistic Updates with Rollback** — retained. The optimistic update pattern with rollback remains applicable; the transport layer changes but the state update strategy does not.

## New Durable ADRs Created

### ADR-0015: WebSocket Isolated Module Architecture

**Status**: accepted  
**Date**: 2026-07-27  
**Decision-makers**: Developer

#### Context

The WebSocket client must handle connection lifecycle, message serialization, reconnection, and event dispatching without coupling to React. The existing SSE implementation was tightly coupled to the `features/realtime` slice, making it difficult to test in isolation.

#### Decision

Isolate the WebSocket client in `src/lib/ws/` as a pure TypeScript module with no React dependencies. React integration happens via a thin context provider (`WebSocketProvider`) that wraps the isolated client.

#### Consequences

- Good: WebSocket client is testable without rendering React components.
- Good: Clear separation of concerns — connection logic vs. UI integration.
- Good: Reusable across non-React contexts (e.g., service workers, Node.js tests).
- Bad: Requires manual wiring between the isolated client and React context.
- Bad: Event handlers must be registered imperatively, not declaratively.

---

### ADR-0016: Zod Schema Validation at WebSocket Boundary

**Status**: accepted  
**Date**: 2026-07-27  
**Decision-makers**: Developer

#### Context

WebSocket messages from the server may be malformed, outdated, or unexpected. Without validation, the frontend could crash or enter an inconsistent state when receiving unexpected payloads.

#### Decision

Validate all incoming WebSocket messages against Zod schemas at the network boundary (before dispatching to handlers). Messages that fail validation are logged and discarded with a user-facing error toast.

#### Consequences

- Good: Runtime type safety catches malformed messages before they reach stores.
- Good: Zod schemas serve as living documentation of the message contract.
- Good: Error messages are descriptive and actionable for debugging.
- Bad: Schema maintenance overhead when the server adds new message types.
- Bad: Slight performance overhead from validation on every message.

---

### ADR-0017: Exponential Backoff Reconnection Strategy

**Status**: accepted  
**Date**: 2026-07-27  
**Decision-makers**: Developer

#### Context

WebSocket connections can drop due to network issues, server restarts, or idle timeouts. Without a reconnection strategy, users would need to manually refresh the page to restore real-time functionality.

#### Decision

Implement exponential backoff with jitter: 1s → 2s → 4s → 8s → 16s (max 5 retries). After max retries, enter a "disconnected" state and show the ConnectionErrorModal with a manual reconnect button.

#### Consequences

- Good: Prevents server flood during widespread outages.
- Good: Automatic recovery for transient network issues.
- Good: Jitter prevents thundering herd on server restart.
- Bad: User may see "Reconnecting" state for up to 31 seconds during recovery.
- Bad: No automatic retry after max retries — requires manual intervention.

---

### ADR-0018: Zustand Store Direct Mutation from WebSocket Handlers

**Status**: accepted  
**Date**: 2026-07-27  
**Decision-makers**: Developer

#### Context

WebSocket events arrive asynchronously and must update the frontend state immediately. Using React Context or setState would require component re-renders on every event, causing performance issues with high-frequency updates.

#### Decision

WebSocket event handlers directly mutate Zustand stores using the `set` API. Components subscribe to specific store slices via Zustand selectors, ensuring granular re-renders only when relevant data changes.

#### Consequences

- Good: No React re-render overhead for WebSocket event processing.
- Good: Zustand selectors ensure components only re-render when their specific data changes.
- Good: Consistent with existing store patterns (auth, issues, notifications).
- Bad: Direct mutations bypass React's batched updates, requiring manual debouncing for rapid events.
- Bad: No automatic optimistic rollback — must be implemented manually per store action.

---

### ADR-0019: Centralized Error Handling with UI Dispatch

**Status**: accepted  
**Date**: 2026-07-27  
**Decision-makers**: Developer

#### Context

WebSocket errors vary in severity: some are transient (rate limiting), some are recoverable (invalid channel), and some are critical (auth failure, session revoked). A single error handler must route errors to the appropriate UI component.

#### Decision

Implement a centralized error handler in `src/lib/ws/handlers.ts` that classifies errors by severity and dispatches them to the appropriate UI layer: critical errors show a modal, transient errors show a toast, and recoverable errors trigger automatic retry.

#### Consequences

- Good: Consistent error UX across all WebSocket scenarios.
- Good: Single source of truth for error classification and routing.
- Good: Easy to extend with new error types without modifying UI components.
- Bad: Handler complexity increases with the number of error codes.
- Bad: Error classification must be maintained as the server adds new error types.

---

### ADR-0020: WebSocket Message Type Discrimination

**Status**: accepted  
**Date**: 2026-07-27  
**Decision-makers**: Developer

#### Context

WebSocket messages from the server have different structures and purposes: authentication responses, subscription confirmations, domain events, and errors. Without type discrimination, handlers must manually inspect message shapes.

#### Decision

Use a discriminated union type with a `type` field as the discriminator. The WebSocket client routes messages to type-specific handlers based on the `type` field before Zod validation.

#### Consequences

- Good: TypeScript exhaustive checking ensures all message types are handled.
- Good: Clear routing logic — each message type has a dedicated handler.
- Good: Easy to add new message types without modifying existing handlers.
- Bad: Requires updating the discriminated union type when the server adds new message types.
- Bad: Slight overhead from type discrimination on every message.

---

## Files Affected by This Change

| File | Change Description |
|------|-------------------|
| `adr/0013-sse-for-real-time-transport.md` | Superseded — SSE replaced by WebSocket |
| `adr/0015-ws-isolated-module.md` | New — WebSocket module architecture |
| `adr/0016-ws-zod-validation.md` | New — Zod schema validation |
| `adr/0017-ws-exponential-backoff.md` | New — Reconnection strategy |
| `adr/0018-ws-zustand-direct-mutation.md` | New — Store mutation pattern |
| `adr/0019-ws-centralized-error-handling.md` | New — Error routing |
| `adr/0020-ws-message-type-discrimination.md` | New — Message routing |
