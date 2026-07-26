# ADR Review Manifest

- Status: completed
- Review date: 2026-07-25

## Review Summary

ADR review completed for this change. Two durable architectural decisions were introduced: SSE as the real-time transport protocol and optimistic updates with rollback as the state synchronization pattern.

## In-Force ADRs Reviewed

- ADR-0004: Feature-Sliced Design — architecture layer rules respected; SSE client lives in `features/realtime/lib/`, not `shared/`
- ADR-0006: Stack Selection — Zustand stores used for real-time state; no new state management library introduced
- ADR-0007: Store Isolation — each entity type gets its own store slice; no cross-store coupling
- ADR-0009: UI Component Architecture — ConnectionStatusIndicator, NotificationBadge follow shared component patterns

## New Durable ADRs Created

- **ADR-0013: SSE for Real-Time Transport** — SSE chosen over WebSocket for one-way server→client event delivery; matches existing `ws-client.ts` implementation
- **ADR-0014: Optimistic Updates with Rollback** — Store actions save previous state before SSE mutation; rollback on conflict prevents UI flicker
