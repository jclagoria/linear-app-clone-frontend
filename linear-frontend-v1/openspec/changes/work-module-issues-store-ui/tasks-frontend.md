# Tasks — Work Module: Issues Store & UI (Frontend)

## Scaffold

- [ ] Create `src/entities/issue/model/store.ts` — Zustand IssuesStore with `issues[]`, `selectedIssueId`, `filters`, `isLoading`, `error`, `pagination`
- [ ] Create `src/entities/issue/model/types.ts` — `Issue`, `Comment`, `IssueFilters`, `PaginationCursor` interfaces
- [ ] Create `src/entities/issue/model/validation.ts` — Zod schemas for issue form (title required/max 255, description max 50000)
- [ ] Create `src/entities/issue/model/selectors/index.ts` — `selectIssuesByStatus`, `selectFilteredIssues`, `selectIssueById`
- [ ] Create `src/entities/issue/api/index.ts` — `fetchIssues`, `createIssue`, `updateIssue`, `deleteIssue` using ApiClient
- [ ] Set up `src/entities/issue/` directory structure: `model/`, `api/`, `ui/`

## Components

- [ ] Create `src/entities/issue/ui/IssueCard.tsx` — compact card with identifier, title, status badge, priority badge, assignee avatar; `role="button"`, click handler
- [ ] Create `src/entities/issue/ui/IssueList.tsx` — scrollable list with loading (skeleton), empty (no issues + CTA), populated, and error (with cached data fallback) states
- [ ] Create `src/entities/issue/ui/IssueFilters.tsx` — filter bar with Status, Assignee, Project selects and "Clear" button; reads/writes IssuesStore filters
- [ ] Create `src/entities/issue/ui/IssueDetail.tsx` — full issue metadata, description, labels as badges, comments list, comment form
- [ ] Create `src/entities/issue/ui/IssueForm.tsx` — create/edit form with title (required), description, status, priority, assignee, labels; react-hook-form + Zod; submitting/validation-error/api-error states
- [ ] Create `src/entities/issue/ui/IssueFormModal.tsx` — modal wrapper around IssueForm with focus trap, Esc close, backdrop click close
- [ ] Create `src/entities/issue/ui/ConfirmDeleteDialog.tsx` — danger confirmation modal with `role="alertdialog"`, submitting spinner, api-error state
- [ ] Create `src/entities/issue/ui/CommentCard.tsx` — comment display with author avatar, name, timestamp, body
- [ ] Create `src/entities/issue/ui/CommentList.tsx` — chronological comment list with populated and empty states
- [ ] Create `src/entities/issue/ui/SkeletonLoader.tsx` — reusable skeleton card placeholders for loading state
- [ ] Create `src/entities/issue/ui/EmptyState.tsx` — reusable empty state with icon, message, optional CTA button

## Pages

- [ ] Create `src/pages/IssuesPage.tsx` — page container composing IssueFilters + IssueList + "New Issue" button
- [ ] Create `src/pages/IssueDetailPage.tsx` — page container composing IssueDetail + Edit/Delete buttons + modals; loading/not-found/error states

## State & Data

- [ ] Implement `fetchIssues(filters)` in IssuesStore — dispatches API call, sets loading/error, updates `issues` and `pagination`
- [ ] Implement `createIssue(data)` in IssuesStore — API call, prepends to `issues` array
- [ ] Implement `updateIssue(id, partial)` in IssuesStore — API call, immutable update in `issues`
- [ ] Implement `deleteIssue(id)` in IssuesStore — API call, removes from `issues`, clears `selectedIssueId` if matched
- [ ] Implement filter setters in IssuesStore — `setStatusFilter`, `setAssigneeFilter`, `setProjectFilter`, `clearFilters`
- [ ] Implement pagination — cursor-based `loadMore` action

## Routing

- [ ] Add `/issues` route to `src/app/router.tsx` → IssuesPage
- [ ] Add `/issues/:id` route to `src/app/router.tsx` → IssueDetailPage
- [ ] Wire IssueCard click to navigate to `/issues/:id`
- [ ] Wire "New Issue" button to open IssueFormModal in create mode
- [ ] Wire "Edit" button on detail page to open IssueFormModal in edit mode
- [ ] Wire "Delete" button to open ConfirmDeleteDialog
- [ ] Wire modal submit/cancel transitions (create → issues list, edit → detail, delete confirm → issues list)

## Validation

### Unit tests

- [ ] Test IssuesStore: initial empty state, fetch sets issues, create prepends, update mutates immutably, delete removes
- [ ] Test IssuesStore: `selectedIssueId` cleared on delete of selected issue
- [ ] Test IssuesStore: filter setters update state correctly
- [ ] Test selectors: `selectIssuesByStatus` groups correctly, `selectFilteredIssues` applies all filters
- [ ] Test IssueCard: renders all fields, calls onClick
- [ ] Test IssueForm: shows validation error on empty title, submits with valid data
- [ ] Test IssueFilters: filter change updates store, clear resets filters
- [ ] Test API module: all functions call ApiClient with correct endpoints

### Integration tests

- [ ] Test IssuesPage: renders cards from store, shows loading/empty/error states
- [ ] Test IssueDetailPage: renders full issue, shows not-found for missing ID
- [ ] Test IssueFormModal: create and edit mode, submit flow, validation errors
- [ ] Test ConfirmDeleteDialog: confirm navigates away, cancel returns

### E2E tests

- [ ] Test full flow: navigate to issues → see list → apply filter → click card → view detail → edit → save → back to list
- [ ] Test create flow: click "New Issue" → fill form → submit → new issue appears in list

## Review

- [ ] Self-review: all components match design-frontend spec (props, states, events)
- [ ] Self-review: all states covered per component (loading, empty, populated, error, not-found)
- [ ] Self-review: keyboard navigation (Tab, Enter, Esc, J/K) on issue list and modals
- [ ] Self-review: ARIA labels on all icon-only controls, `role` attributes on interactive cards
- [ ] PR checklist: lint + typecheck pass, test suite green, no console warnings
