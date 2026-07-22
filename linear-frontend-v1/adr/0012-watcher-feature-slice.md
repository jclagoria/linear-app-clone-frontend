---
status: accepted
date: 2026-07-22
decision-makers: Developer
---

# ADR-0012: Watcher Feature Slice — New FSD Entity and Feature for Issue Watchers

## Context and Problem Statement

The issue detail page needs to display watchers and provide a watch/unwatch toggle. Watcher data has its own API endpoints (`GET/POST /issues/{id}/watchers`, `DELETE /issues/{id}/watchers/{userId}`), its own loading/error lifecycle, and an optimistic update pattern for the toggle action. The existing `entities/issue/` slice handles issue metadata, status transitions, assignment, and comments — watcher logic is functionally independent and would add significant complexity to an already-dense slice.

## Decision Drivers

- FSD layer rules — `entities/issue/` should own the issue aggregate, not peripheral entities with independent lifecycles
- Separation of concerns — watcher fetching and mutation have distinct loading/error states from issue loading
- Optimistic update isolation — reverting a failed watch toggle must not interfere with issue store state
- Testability — the watcher feature should be testable without loading the entire issue store
- Consistency — follows the pattern established by existing FSD slices (session entity, issue entity, auth feature)

## Considered Options

- **New entity + feature slice** (`entities/watcher/` + `features/watchers/`) — Watcher data type and API in entity; watch/unwatch business logic and UI in feature
- **Extend entities/issue/** — Add watcher type, API calls, store actions, and UI components to the existing issue slice
- **Inline in pages/IssueDetailPage** — Manage watcher state locally with useState (similar to current comments pattern)

## Decision Outcome

Chosen option: "New entity + feature slice (`entities/watcher/` + `features/watchers/`)", because it follows FSD boundaries, keeps watcher logic independently testable, and prevents the issue entity from accumulating concerns that belong to separate domain concepts.

### Consequences

- Good, because `entities/watcher/` owns the `Watcher` type and API calls — a single source of truth for the watcher data contract.
- Good, because `features/watchers/` owns the watch/unwatch action, optimistic update store, and UI (WatcherSection, WatchButton) — the feature can be enabled/disabled independently.
- Good, because the watcher Zustand store is scoped to watcher state only — easier to test and reset than extending the issue store.
- Good, because the pattern scales to future FSD entities (e.g., notifications, projects) without overloading existing slices.
- Bad, because it adds two new FSD directories (entity + feature) for a relatively small domain — may feel like over-engineering for simple CRUD.
- Bad, because `WatcherSection` must coordinate between two stores (issue store for issueId context, watcher store for data).

### Confirmation

- `src/entities/watcher/` exists with `model/types.ts` (Watcher interface), `api/index.ts` (fetch/add/remove), and optionally `ui/WatcherItem.tsx`.
- `src/features/watchers/` exists with `model/store.ts` (useWatchersStore with optimistic update), `ui/WatcherSection.tsx`, `ui/WatcherList.tsx`, `ui/WatchButton.tsx`.
- `src/pages/IssueDetailPage.tsx` renders `<WatcherSection issueId={id} />` instead of inline watcher state.
- The watcher store does not import or depend on the issue store.

## Pros and Cons of the Options

### New entity + feature slice

- Good, because FSD layer rules are respected — `entities/watcher/` is independent, `features/watchers/` can import it.
- Good, because the feature can be lazy-loaded with its route chunk.
- Good, because the store can be reset without affecting issue state.
- Neutral, because it introduces a store-per-feature pattern that increases total store count.
- Bad, because cross-store coordination requires the page component to bridge issueId from one store context to the feature.

### Extend entities/issue/

- Good, because watcher data is naturally related to issues — a user watches an issue, the watcher list belongs on the issue page.
- Good, because no new slice directories or store creation is needed.
- Bad, because the issue store grows with watcher-specific loading states, error handling, and cache invalidation — making it harder to reason about.
- Bad, because the issue type conceptually includes watcher relation, but adding watcher API functions to `entities/issue/api/` mixes concerns.
- Bad, because resetting issue state (e.g., on project switch) would also discard watcher state unnecessarily.

### Inline in pages/IssueDetailPage

- Good, because it requires no architectural changes — watchers become local state like comments.
- Bad, because optimistic update logic with rollback becomes complex to manage in a useEffect/useState pattern (retry, 409 conflict, revert).
- Bad, because the watcher toggle pattern would be duplicated if watchers appear elsewhere (e.g., notification preferences).
- Bad, because the page component grows larger and harder to test in isolation.

## More Information

This decision extends the FSD pattern established in ADR-0004 (Feature-Sliced Design) and the store isolation pattern from ADR-0007 (Store Isolation). The dedicated watcher endpoints mirror the pattern from ADR-0010 (Dedicated Status Endpoint) and ADR-0011 (Dedicated Assignee Endpoint), where domain-specific operations get their own API path and frontend logic.
