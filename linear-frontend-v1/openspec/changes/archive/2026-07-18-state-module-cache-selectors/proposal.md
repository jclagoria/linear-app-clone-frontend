# State Module — Cache & Selectors

## Problem Statement

The application currently lacks a centralized client-side state management layer. Without defined stores, caching rules, and selectors, components must manage data ad-hoc — leading to duplicate API calls, inconsistent UI state across views, and no clear pattern for derived data like filtered issue lists or project progress. This gap blocks building data-heavy screens (issue list, project board, cycle view) that rely on shared, predictable state.

## Motivation

A well-defined state module is the foundation for all data-display components. It delivers:

- **Performance**: Cache-first strategy reduces redundant network requests
- **Consistency**: Single source of truth for every entity type — components always render the same data
- **Developer velocity**: Selectors encapsulate derived-state logic; new views reuse them instead of reimplementing filters or aggregations
- **Resilience**: Cache invalidation rules prevent stale data from surfacing after mutations

Without this module, every screen that displays issues, projects, cycles, or notifications will need its own data-fetching and caching logic, creating maintenance burden and a brittle UX.

## Scope

- **In scope**:
  - Store interface definition for all entities (Issues, Auth, UI, WebSocket, Projects, Cycles)
  - Cache layer with TTL, invalidation rules, and background refresh
  - Selectors for derived state (filtered lists, computed values, combined slices)
  - Component-Store-Selector mapping as documented in the tech-agnostic spec
  - State persistence rules (local storage for preferences, secure storage for tokens)

- **Out of scope**:
  - API client / data fetching layer (handled by API Module)
  - Real-time event handling (handled by Realtime Module)
  - UI component implementation (handled by UI Module)
  - Form state management
  - Routing state
  - Server-side state concerns

## Impact

- **Core architecture change**: All data-display components will depend on the State Module instead of owning their own data
- **API Module interface**: Must expose endpoints that the cache layer can call (GET for cache-first reads, mutations for write-through invalidation)
- **Auth Module interface**: Must provide token lifecycle events so the cache can be cleared on logout
- **Testing surface**: Unit tests needed for each store, selector, and cache rule
- **No breaking changes to deployed code**: This module is additive — existing placeholder components continue to work until wired up
