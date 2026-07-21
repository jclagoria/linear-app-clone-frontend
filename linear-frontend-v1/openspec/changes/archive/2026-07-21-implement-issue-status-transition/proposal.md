# Implement Issue Status Transitions

## Problem Statement

Currently, issue status changes are made through a general `PATCH /issues/{id}` endpoint that allows updating any issue field. This bypasses workflow validation — a user can transition an issue from Todo directly to Done, or from Backlog to In Progress, without going through the correct workflow stages. The backend now provides a dedicated `PATCH /issues/{id}/status` endpoint that validates status transitions against the default workflow, but the frontend has no integration with it.

## Motivation

Status transitions are a core workflow primitive in any project management tool. Without workflow validation, issues can be moved to invalid states, leading to inconsistent project tracking and inaccurate reporting. This change delivers:

- Correct workflow enforcement — status changes follow the defined transition map (Backlog → Todo → In Progress → Done, with Canceled allowed from any active state)
- `completedAt`/`canceledAt` timestamps automatically set by the backend when moving to terminal states
- Clearer error feedback when a transition is invalid (422 BUSINESS_RULE_ERROR)
- Separation of concerns — status changes call a dedicated endpoint rather than a general-purpose update

## Scope

- **In scope**:
  - Add `changeIssueStatus(id, statusId)` API function in `src/entities/issue/api/index.ts`
  - Add `changeStatus` action to `useIssuesStore`
  - Wire up the status dropdown in `IssueDetailPage` to use the new endpoint
  - Handle 422 BUSINESS_RULE_ERROR responses with user-facing toast messages

- **Out of scope**:
  - Workflow configuration UI (custom workflows, transition map editing)
  - Bulk status changes
  - Batch operations
  - Status change history/audit log
  - Visual status transition diagram in the UI

## Impact

The change is scoped entirely to the frontend application:

- **API layer**: New `changeIssueStatus` function alongside existing `updateIssue`, `createIssue`, `deleteIssue`
- **Store**: New `changeStatus` action on `useIssuesStore` that calls the dedicated API function and updates local state
- **UI**: Status dropdown in `IssueDetailPage` switches from the generic `updateIssue` path to the dedicated status transition endpoint
- **Error handling**: Toast notifications for workflow validation errors (422)
- **No breaking changes**: The existing `status` field on `PATCH /issues/{id}` remains available for backward compatibility
