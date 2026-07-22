# Implement PATCH /issues/{id}/assignee Endpoint (Assign/Unassign)

## Problem Statement

Currently, assignee changes on issues are sent through the general-purpose `PATCH /issues/{id}` endpoint, which accepts arbitrary issue fields without validating relationships. This means an issue can be assigned to a user who is not a member of the issue's team, causing data integrity issues and a poor user experience. The backend spec introduces a dedicated `PATCH /issues/{id}/assignee` endpoint that validates team membership and provides clear error responses.

## Motivation

This change delivers:
- **Data integrity**: The backend enforces that assignees are team members, preventing orphan assignments.
- **Clear error handling**: A `422 BUSINESS_RULE_ERROR` response when attempting to assign to a non-team member, with a user-facing error message.
- **Separation of concerns**: A dedicated endpoint for assign/unassign operations means the general update endpoint no longer needs to carry assignee-team validation logic, and the frontend can handle assignee changes as a distinct action.
- **Consistency**: Aligns with the existing pattern of dedicated sub-resource endpoints (e.g., `PATCH /issues/{id}/status` for status changes).

## Scope

- **In scope**:
  - Add `assignIssue(id, assigneeId)` API function to `src/entities/issue/api/index.ts`
  - Add `assignIssue` action to `useIssuesStore` with optimistic update and rollback on failure
  - Wire up assignee change in `IssueDetailPage` with user feedback (toast on success/error)
  - Handle `null` `assigneeId` for unassign operations
  - Display `BUSINESS_RULE_ERROR` from 422 responses as a toast notification
- **Out of scope**:
  - Building a full assignee selector UI component (the page already has one via `IssueFormModal`)
  - Backend implementation (separate change)
  - Other issue fields or endpoints

## Impact

- **`src/entities/issue/api/index.ts`**: New `assignIssue` function added alongside existing `changeIssueStatus`.
- **`src/entities/issue/model/store.ts`**: New `assignIssue` action following the same optimistic-update pattern as `changeStatus`.
- **`src/pages/IssueDetailPage.tsx`**: Updated to call the new store action when assignee changes, with toast notifications for success and business-rule errors.
- **Consumers**: The store action and API function are the public contract — components and pages use the store action; no direct API calls are needed outside the entity layer.
