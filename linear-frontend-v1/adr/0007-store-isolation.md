---
status: accepted
date: 2026-07-17
decision-makers: Developer
---

# ADR-0007: Store Isolation — Separate Zustand Stores per Domain

## Context and Problem Statement

The application manages multiple distinct state domains: authentication, issues (with filters and pagination), UI preferences (sidebar, theme, modals), WebSocket connection status and notifications, and a client-side cache layer. These domains have different lifecycle, persistence, and invalidation requirements.

Options included a single monolithic store vs. domain-specific stores. The decision affects testability, resettability, bundle splitting, and cross-store selector complexity.

## Decision Drivers

- Domain isolation — clearing auth on logout must not reset UI preferences
- Testability — each store should be testable independently without mock factories
- Bundle splitting — feature stores can be lazy-loaded with their feature chunk
- Developer ergonomics — cross-store selectors (e.g., issues + cache) must still be possible

## Considered Options

- **Separate Zustand stores per domain** — each domain gets its own `create()` call
- **Single Zustand store with slices** — one `create()` with nested slice objects and combined reducer
- **Feature-scoped stores** (FSD-aligned) — stores co-located inside feature directories

## Decision Outcome

Chosen option: "Separate Zustand stores per domain" (for cross-cutting domains) + "Feature-scoped stores" (for feature-specific state).

A small set of cross-cutting stores (auth, ui, websocket, cache) live at `src/stores/` as shared singletons. Feature-specific state (e.g., issues filters, selected issue) lives inside `src/features/issues/stores/`. This mirrors the FSD pattern established in ADR-0004.

### Consequences

- Good, because each store can be reset independently on logout (auth store clears tokens; UI store preserves theme preference).
- Good, because each store can be tested with its own `create()` call — no shared state leaks between tests.
- Good, because the cache store can be evicted and invalidated without affecting domain stores.
- Bad, because cross-store selectors (e.g., filtering cached issues by UI store filter state) must subscribe to multiple stores and compose.

### Confirmation

- Domain stores use separate `create()` calls in separate modules.
- The `StoreProvider` initializes all stores on app boot.
- A `resetAllStores` utility iterates over known stores and calls `.setState(initialState)` on logout.
- Cross-store selectors explicitly list their dependencies.

## Pros and Cons of the Options

### Separate Zustand stores per domain

- Good, because each store is independently tree-shakeable.
- Good, because stores have individual middleware config (e.g., `persist` on UI store, not on cache store).
- Good, because reset logic is per-domain — auth reset does not disturb UI preferences.
- Bad, because cross-store selectors must manually subscribe to multiple stores and track dependency changes.

### Single Zustand store with slices

- Good, because cross-store selectors read from a single object — simpler dependency tracking.
- Good, because a single `setState` can reset the entire app state atomically.
- Bad, because resetting one slice without affecting others requires slice-aware reset logic.
- Bad, because the store module becomes a single large file or requires a slice-combination pattern (similar to Redux).
- Bad, because lazy-loading feature stores is not possible — all slices are in one module.

## More Information

This decision aligns with Zustand's recommended pattern for medium-complexity apps: multiple stores over one. The tech research digest lists Zustand as appropriate for both single and multiple store patterns, with multiple stores preferred when domains have independent lifecycles.
