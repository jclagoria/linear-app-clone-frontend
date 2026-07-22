# Label Management Endpoints for Issues

## Problem Statement

Issues currently accept labels as `string[]` (label names) during create/update, but there are no dedicated API functions or store actions for managing labels independently. Users cannot add or remove labels from an issue without refetching the entire issue, and there is no UI to browse, attach, or detach labels on an issue detail page.

## Motivation

This change delivers independent label management for issues, matching the backend API contract. It enables:

- Attaching and detaching labels from an issue detail view without saving the entire issue form
- Listing all labels attached to an issue
- Real-time optimistic UI updates on label changes
- A foundation for future label picker/selector components

## Scope

- **In scope**:
  - Add `getIssueLabels(id)`, `attachLabel(id, labelId)`, `detachLabel(id, labelId)` to the issue API layer
  - Add corresponding store actions (`fetchLabels`, `attachLabel`, `detachLabel`) to `useIssuesStore`
  - Wire label management UI into `IssueDetailPage`
  - Label model type (UUID-based, not just name strings)

- **Out of scope**:
  - Global label CRUD (creation, editing, deletion of label definitions — these exist at `/api/v1/labels`)
  - Label color/description management
  - Bulk label operations
  - Label filtering in the issues list (already exists via `labelIds` on `FetchIssuesParams`)

## Impact

- **`src/entities/issue/api/index.ts`**: +3 new API functions
- **`src/entities/issue/model/types.ts`**: New `Label` interface export
- **`src/entities/issue/model/store.ts`**: +3 new store actions with optimistic update pattern
- **`src/pages/IssueDetailPage.tsx`**: Label list + attach/detach UI wired in
- **`src/entities/issue/ui/IssueDetail.tsx`**: Display attached labels with management affordances
- No breaking changes to existing API or store interfaces
