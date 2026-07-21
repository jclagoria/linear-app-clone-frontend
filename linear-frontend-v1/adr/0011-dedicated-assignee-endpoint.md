---
status: accepted
date: 2026-07-21
decision-makers: Developer
---

# Dedicated Assignee Transition Endpoint for Issue Assignment

## Context and Problem Statement

The frontend needs to assign and unassign users to issues. The backend provides a dedicated `PATCH /issues/{id}/assignee` endpoint that validates team-membership constraints — the assignee must be a member of the issue's team. Without this dedicated endpoint, the frontend would need to either send assignment changes through the generic `PATCH /issues/{id}` path (bypassing team-membership validation) or reimplement the validation client-side.

## Decision Drivers

- Team-membership enforcement — the backend validates that the assignee belongs to the issue's team; the frontend must not bypass this
- Error clarity — 422 BusinessRuleError responses carry specific messages (e.g., "Assignee is not a member of this team") that must reach the user
- Separation of concerns — assignment is semantically different from generic field updates; a dedicated action isolates optimistic-update/rollback logic, cache invalidation, and error handling
- Consistency — follows the same pattern established by the dedicated status endpoint (ADR-0010)

## Considered Options

- **Dedicated endpoint** (`PATCH /issues/{id}/assignee`) — new API function and store action call the assignment-specific path; separate error handling for 422
- **Generic endpoint** (`PATCH /issues/{id}`) — send assigneeId through the existing `updateIssue` path; team-membership validation must be done client-side
- **Optimistic update + rollback** — update UI immediately, fire-and-forget the assignment to the dedicated endpoint, revert on error

## Decision Outcome

Chosen option: "Dedicated endpoint (`PATCH /issues/{id}/assignee`)", because it aligns with the backend's team-membership validation contract, provides clear 422 error surfacing, and separates assignment mutation from generic field updates at the architectural level.

### Consequences

- Good, because the frontend enforces no team-membership rules — the backend is the single source of truth.
- Good, because 422 BusinessRuleError responses are handled in a dedicated code path with specific error toasts, not mixed with generic update errors.
- Good, because the `assignIssue` action isolates optimistic-update/rollback logic, making the store easier to reason about.
- Good, because the API layer remains clean — assignment and field updates do not share the same code path.
- Bad, because it adds a new API function (`assignIssue`) and store action alongside the existing `updateIssue`.
- Bad, because cache invalidation must happen on three paths (assignment, status change, generic update) and could be missed.

### Confirmation

- An `assignIssue(id, assigneeId)` function exists in `src/entities/issue/api/index.ts`.
- An `assignIssue` action exists in `useIssuesStore` that calls the dedicated function with optimistic update and rollback.
- The assignee `<select>` in `IssueForm` calls `assignIssue` for assignment changes instead of `updateIssue`.
- 422 responses from the dedicated endpoint surface `BusinessRuleError` messages as error toasts.

## Pros and Cons of the Options

### Dedicated endpoint

- Good, because the backend validates team-membership — no client-side assignment logic needed.
- Good, because 422 errors carry specific failure messages that the frontend surfaces directly.
- Good, because the assignee field on the generic endpoint remains available for backward compatibility.
- Bad, because the frontend must manage two distinct mutation paths: generic update and assignment.

### Generic endpoint

- Good, because it requires no new API function — the existing `updateIssue` handles all field changes.
- Bad, because the frontend must either bypass team-membership validation or reimplement it client-side.
- Bad, because 422 errors from the generic endpoint conflate field validation errors with assignment errors.
- Bad, because the frontend cannot distinguish between a failed assignment and a failed title update.

### Optimistic update + rollback

- Good, because the UI feels instant — assignee updates before the server confirms.
- Bad, because optimistic updates must be reverted on 422, creating a visual flash.
- Bad, because concurrent generic updates and assignment changes can produce race conditions.
- Bad, because error handling is more complex — reverting assignee requires knowing the previous value.

## More Information

This decision mirrors ADR-0010 (Dedicated Status Transition Endpoint) and establishes a pattern: domain-specific operations (status, assignment) use dedicated endpoints with their own store actions, while the generic `updateIssue` remains for simple field changes (title, description, priority, labels).
