---
status: accepted
date: 2026-07-21
decision-makers: Developer
---

# Dedicated Status Transition Endpoint for Issue Workflow

## Context and Problem Statement

The frontend currently sends status changes through the generic `PATCH /issues/{id}` endpoint, which accepts any issue field. The backend now provides a dedicated `PATCH /issues/{id}/status` endpoint that validates transitions against the default workflow map (Backlog → Todo → In Progress → Done, Canceled allowed from any active state). Without frontend integration, users can bypass workflow validation and move issues to invalid states, leading to inconsistent project tracking.

## Decision Drivers

- Workflow enforcement — status transitions must follow the backend's validated transition map
- Error clarity — 422 BusinessRuleError responses carry specific transition failure messages that must reach the user
- Side-effect correctness — `completedAt`/`canceledAt` timestamps are auto-set by the dedicated endpoint
- Separation of concerns — status mutation is semantically different from field-level updates; the dedicated endpoint enforces this at both API and UI layers

## Considered Options

- **Dedicated endpoint** (`PATCH /issues/{id}/status`) — new API function calls the status-specific path; separate error handling for 422
- **Generic endpoint** (`PATCH /issues/{id}`) — send status field through the existing `updateIssue` path; workflow validation must be done client-side
- **Optimistic update + sync** — update UI immediately, fire-and-forget the status change to the dedicated endpoint, revert on error

## Decision Outcome

Chosen option: "Dedicated endpoint (`PATCH /issues/{id}/status`)", because it aligns with the backend's workflow validation contract, provides clear 422 error surfacing, and separates status mutation from generic field updates at the architectural level.

### Consequences

- Good, because the frontend enforces no invalid transitions — the backend's transition map is the single source of truth.
- Good, because 422 BusinessRuleError responses are handled in a dedicated code path with specific error toasts, not mixed with generic update errors.
- Good, because `completedAt`/`canceledAt` timestamps are automatically set by the backend without frontend logic.
- Good, because the API layer remains clean — status changes and field updates do not share the same code path.
- Bad, because it adds a new API function (`changeIssueStatus`) alongside the existing `updateIssue`.
- Bad, because cache invalidation must happen on two paths (status change + generic update) and could be missed.

### Confirmation

- A `changeIssueStatus(id, statusId)` function exists in `src/entities/issue/api/index.ts`.
- A `changeStatus` action exists in `useIssuesStore` that calls the dedicated function.
- The status dropdown in `IssueDetail` calls `changeStatus` instead of `updateIssue` for status changes.
- 422 responses from the dedicated endpoint surface `BusinessRuleError` messages as error toasts.

## Pros and Cons of the Options

### Dedicated endpoint

- Good, because the backend validates workflow transitions — no client-side transition logic needed.
- Good, because 422 errors carry specific transition failure messages that the frontend surfaces directly.
- Good, because the `status` field on the generic endpoint remains available for backward compatibility.
- Bad, because the frontend must manage two distinct mutation paths: generic update and status change.

### Generic endpoint

- Good, because it requires no new API function — the existing `updateIssue` handles all field changes.
- Bad, because the frontend must either bypass workflow validation or reimplement the transition map client-side.
- Bad, because 422 errors from the generic endpoint conflate field validation errors with transition errors.
- Bad, because `completedAt`/`canceledAt` timestamps are not auto-set — the frontend must compute and send them.

### Optimistic update + sync

- Good, because the UI feels instant — status updates before the server confirms.
- Bad, because optimistic updates must be reverted on 422, creating a visual flash.
- Bad, because concurrent generic updates and status changes can produce race conditions.
- Bad, because error handling is more complex — reverting status requires knowing the previous value.

## More Information

The workflow transition map enforced by the backend:

- Backlog → Todo, Canceled
- Todo → In Progress, Canceled
- In Progress → Done, Canceled
- Done → (none — terminal)
- Canceled → (none — terminal)
