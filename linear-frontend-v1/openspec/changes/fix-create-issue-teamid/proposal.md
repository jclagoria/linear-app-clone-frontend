# Fix: Create Issue Missing Required teamId Field

## Problem Statement

The API contract requires `teamId` to create an issue — it validates the user is a team member before allowing issue creation. The frontend's `CreateIssueData` type, `createIssue()` API function, and `handleCreateIssue` callback all omit `teamId`, causing all issue creation requests to fail with a 400/422 validation error.

The current codebase has team data (hardcoded in sidebar components) but no shared mechanism to pass the selected team ID to the issue creation flow.

## Motivation

Issue creation is a core workflow for the Linear clone. Without it, users cannot file bugs, add tasks, or track work. This is a critical bug blocking all issue creation functionality.

Fixing this enables:
- Valid issue creation with proper team scoping
- Correct API contract compliance
- A reusable pattern for team-context propagation across other features (projects, cycles)

## Scope

- **In scope**:
  - Add `teamId` to `CreateIssueData` type
  - Add `teamId` to `createIssue()` API call
  - Pass `teamId` from the IssuesPage (from a team context/store)
  - Update MSW mock handler to validate `teamId` presence
  - Create or reuse a team store/context for the currently selected team

- **Out of scope**:
  - Team management UI (create/edit teams)
  - Multi-team issue creation in a single flow
  - Backend API changes
  - Other entity creation flows (projects, cycles)

## Impact

- **`src/entities/issue/model/types.ts`** — `CreateIssueData` gets a new required field
- **`src/entities/issue/api/index.ts`** — `createIssue()` passes `teamId` in the POST body
- **`src/pages/IssuesPage.tsx`** — `handleCreateIssue` reads team ID from context and passes it
- **Team state** — A shared team-selection store or context provider is needed so pages can access the current team ID
- **`src/mocks/handlers.ts`** — POST `/issues` handler should validate and use `teamId`
