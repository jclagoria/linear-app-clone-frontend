---
status: accepted
date: 2026-07-25
decision-makers: Developer
---

# ADR-0013: SSE for Real-Time Transport

## Context and Problem Statement

The real-time issue updates feature requires a transport protocol for delivering server-initiated events (issue created, status changed, assigned, etc.) to connected clients. The transport must support one-way server→client delivery with automatic reconnection and low overhead.

## Decision Drivers

- Existing implementation — `features/realtime/lib/ws-client.ts` already provides SSE-based client infrastructure
- Directionality — events flow server→client only; no bidirectional messaging needed
- Simplicity — SSE is a browser-native API with built-in reconnection and event filtering
- Team familiarity — the current codebase uses SSE; no migration cost

## Considered Options

### Option 1: Server-Sent Events (SSE)

| Criterion | Assessment |
|-----------|------------|
| Direction | Server→client (one-way) — sufficient for this change |
| Reconnection | Built-in `EventSource` auto-reconnect with `Last-Event-ID` |
| Protocol | HTTP/1.1+ with `text/event-stream` content type |
| Browser support | All modern browsers; IE 9+ with polyfill |
| Existing code | Already implemented in `ws-client.ts` |
| Overhead | Low — text-based framing, HTTP/2 multiplexing |

### Option 2: WebSocket

| Criterion | Assessment |
|-----------|------------|
| Direction | Bidirectional — overkill for this change |
| Reconnection | Manual implementation required |
| Protocol | Upgrade from HTTP to `ws://` or `wss://` |
| Browser support | All modern browsers |
| Existing code | Not currently used |
| Overhead | Lower framing overhead, but bidirectional capability unused |

### Option 3: Polling (REST)

| Criterion | Assessment |
|-----------|------------|
| Direction | Client-initiated requests — no real-time push |
| Reconnection | N/A — client controls timing |
| Protocol | Standard HTTP |
| Browser support | Universal |
| Existing code | Used for CRUD, not suitable for live updates |
| Overhead | High — repeated HTTP requests with full headers |

## Decision Outcome

### Chosen: Server-Sent Events (SSE)

SSE is chosen because it is the simplest protocol that satisfies the one-way server→client requirement. The existing `ws-client.ts` implementation provides reconnection, event filtering, and heartbeat support. WebSocket would add bidirectional capability that is not needed, and polling would introduce latency and bandwidth waste.

### Consequences

- Good, because no new infrastructure or client code is required — `ws-client.ts` already works.
- Good, because SSE's built-in `Last-Event-ID` header enables automatic event replay after reconnection.
- Good, because HTTP/2 multiplexing eliminates the traditional SSE limitation of 6 concurrent connections per domain.
- Bad, because SSE cannot carry client→server messages on the same connection; client actions (e.g., creating an issue) use separate REST calls.
- Bad, because if bidirectional real-time is needed in the future (e.g., collaborative editing), a WebSocket migration would be required.

### Confirmation

- `src/features/realtime/lib/ws-client.ts` implements SSE client with `EventSource` API
- `src/features/realtime/model/event-router.ts` processes incoming SSE events
- `src/features/realtime/model/reconnection.ts` handles reconnection logic
- `src/features/realtime/model/heartbeat.ts` monitors connection health

## Pros and Cons of the Options

### SSE

- Good, because browser-native — no library dependency.
- Good, because built-in reconnection and `Last-Event-ID` support.
- Good, because text-based — easy to debug with browser DevTools.
- Bad, because limited to server→client direction; client actions require separate REST calls.

### WebSocket

- Good, because bidirectional — allows server and client to initiate messages.
- Good, because binary framing is more efficient for high-frequency data.
- Bad, because bidirectional capability is unused in this feature; added complexity for no benefit.
- Bad, because requires manual reconnection and heartbeat implementation.

### Polling

- Good, because simplest to implement — no streaming infrastructure.
- Good, because stateless — each request is independent.
- Bad, because latency is bounded by poll interval; not truly real-time.
- Bad, because repeated HTTP requests with full headers waste bandwidth.

## More Information

The SSE transport is a tactical reuse of existing infrastructure. The `ws-client.ts` module was built during initial project setup and has been validated in the existing codebase. This ADR formalizes the implicit decision to keep using SSE rather than migrating to WebSocket for this feature.
