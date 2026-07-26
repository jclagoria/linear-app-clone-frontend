---
status: accepted
date: 2026-07-25
decision-makers: Developer
---

# ADR-0014: Optimistic Updates with Rollback

## Context and Problem Statement

Real-time SSE events trigger state mutations in the frontend (e.g., an issue's status changes when the server broadcasts `issue.statusChanged`). Without optimistic handling, users see a delay between their action and the UI update — or worse, the UI updates for other users' actions before the originating user sees their own change reflected. The state update pattern must feel instant while handling conflicts gracefully.

## Decision Drivers

- Perceived latency — users expect immediate feedback on their own actions
- Multi-user conflicts — two users may edit the same issue simultaneously
- Consistency — the UI must reflect the server's truth, not diverge from it
- Existing pattern — Zustand stores already support `set` and `get` for snapshot/restore

## Considered Options

### Option 1: Optimistic with Rollback

| Criterion | Assessment |
|-----------|------------|
| User experience | Instant — UI updates before server confirms |
| Conflict handling | Rollback to previous state on server rejection |
| Complexity | Moderate — store actions must snapshot, apply, and conditionally revert |
| Data loss risk | Low — rollback restores the previous state atomically |
| Existing pattern | Consistent with Zustand's `set`/`get` API |

### Option 2: Pessimistic (wait for server)

| Criterion | Assessment |
|-----------|------------|
| User experience | Delayed — UI waits for server response before updating |
| Conflict handling | Server response is the source of truth; no rollback needed |
| Complexity | Low — just apply server response |
| Data loss risk | None — only confirmed state is shown |
| Existing pattern | Simple but feels sluggish for real-time updates |

### Option 3: Optimistic without Rollback

| Criterion | Assessment |
|-----------|------------|
| User experience | Instant — UI updates before server confirms |
| Conflict handling | No rollback; optimistic state persists even on server rejection |
| Complexity | Lowest — just apply immediately |
| Data loss risk | High — UI may diverge from server truth indefinitely |
| Existing pattern | Not recommended for multi-user systems |

## Decision Outcome

### Chosen: Optimistic with Rollback

Optimistic updates with rollback are chosen because they provide instant feedback while maintaining eventual consistency. The pattern is: (1) save previous state, (2) apply new state, (3) on server confirmation, confirm; on rejection, restore previous state and show revert toast. This is the standard pattern for collaborative real-time applications.

### Consequences

- Good, because users see their changes immediately — no perceived latency.
- Good, because rollback on conflict preserves server truth; the UI never permanently diverges.
- Good, because the pattern composes naturally with Zustand's `set`/`get` API.
- Bad, because store actions become more complex — each mutation requires snapshot, apply, and conditional revert logic.
- Bad, because rapid concurrent edits may cause visible flicker (mitigated by 100ms deduplication window).
- Follow-up: Consider `immer` integration if store action complexity becomes a maintenance burden.

### Confirmation

- `src/shared/stores/` — Zustand stores with `set`/`get` for snapshot/restore
- `src/features/realtime/lib/optimistic-store.ts` — manages pending updates and rollback state
- `src/features/realtime/ui/RevertToast.tsx` — notifies user when optimistic update is reverted

## Pros and Cons of the Options

### Optimistic with Rollback

- Good, because instant feedback aligns with real-time expectations.
- Good, because rollback ensures server truth is never permanently overridden.
- Good, because the pattern is well-understood and documented in Zustand patterns.
- Bad, because every mutation needs a rollback path; not all mutations are easily reversible.

### Pessimistic (wait for server)

- Good, because simplest to implement — no rollback logic needed.
- Good, because no flicker from optimistic-then-revert cycles.
- Bad, because perceived latency makes the app feel unresponsive.
- Bad, because real-time updates from other users still arrive via SSE, creating an inconsistent feel (some updates instant, some delayed).

### Optimistic without Rollback

- Good, because simplest optimistic pattern — just apply and move on.
- Bad, because UI can diverge from server state indefinitely after a rejected mutation.
- Bad, because other users see the divergent state until a refresh or correction event.

## More Information

This ADR establishes the state update pattern for all real-time mutations. Individual store actions implement this pattern using `set`/`get` in Zustand. The `optimistic-store.ts` module centralizes the snapshot/rollback logic so individual stores don't duplicate it.
