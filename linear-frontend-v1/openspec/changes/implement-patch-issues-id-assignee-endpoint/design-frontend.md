# Issue Assign/Unassign — Frontend Design

## Architecture Decisions

### 1. Dedicated `assignIssue` Store Action (over generic `updateIssue`)

**Decision**: Add a new `assignIssue` action to `useIssuesStore` rather than reusing the existing `updateIssue` action for assignee changes.

**Rationale**: The assign endpoint (`PATCH /issues/{id}/assignee`) is a dedicated API with server-side team-membership validation. A separate action isolates the optimistic-update/rollback logic, cache invalidation, and error handling for this specific business rule. The existing `updateIssue` action uses `PATCH /issues/{id}` which does not perform the same team-membership check.

**Trade-off**: Slightly more store surface area, but clearer intent and isolated error handling for a business-rule-heavy operation.

### 2. Optimistic Update with Rollback (over pessimistic)

**Decision**: Optimistically update `assigneeId` and `assigneeName` in the store before the API responds, rolling back on failure.

**Rationale**: Matches the existing `changeStatus` action pattern (`src/entities/issue/model/store.ts:164`). Users see instant feedback. The assignee field is low-content-risk — a wrong value is visible and easily corrected.

**Trade-off**: Brief flash of incorrect state on failure (mitigated by rollback + toast).

### 3. Cache Invalidation via `useCacheStore.invalidateByPrefix('issues:list')`

**Decision**: Invalidate all `issues:list` cache entries on assign/unassign, not just the filtered list the user is viewing.

**Rationale**: The assignee change could affect any filtered view of issues (filtered by assignee, by team, etc.). Invalidating the prefix ensures all list views refresh on next load. Matches the existing `changeStatus` pattern.

**Trade-off**: May cause a re-fetch of list data that wasn't directly visible. Acceptable for this scale.

### 4. Business Rule Error Handling (422) via Toast

**Decision**: Display 422 `BUSINESS_RULE_ERROR` messages in a toast notification (not inline field error), and keep the edit modal open.

**Rationale**: The 422 response from the assign endpoint carries a human-readable message (e.g., "Assignee is not a member of this team"). This is a business rule, not a field validation error. The modal stays open so the user can correct the selection without re-opening it.

**Trade-off**: Toast auto-dismisses after 5s — user must read it quickly. Acceptable for transient errors.

### 5. No New UI Components

**Decision**: No new design-system components. The change uses existing Button, Modal, Select, Toast, and IssueStatusBadge components.

**Rationale**: The assignee selector already exists as a `<select>` in the IssueFormModal mockup. The change adds store logic and API integration, not new UI primitives.

## Component Tree

```
App
├── AppShell (header, sidebar)
│   └── Router
│       ├── IssuesPage
│       │   ├── IssueList
│       │   │   └── IssueCard (per row)
│       │   │       ├── IssueStatusBadge
│       │   │       └── AssigneeAvatar (read-only)
│       │   └── IssueFormModal (create mode)
│       │       └── IssueForm
│       │           ├── Input (title)
│       │           ├── Textarea (description)
│       │           ├── Select (status)
│       │           ├── Select (priority)
││           ├── Select (assignee) ← key field for this change
│       │           └── TagInput (labels)
│       └── IssueDetailPage ← orchestrates assign flow
│           ├── IssueDetail
│           │   ├── IssueStatusBadge
│           │   ├── AssigneeDisplay (avatar + name)
│           │   └── CommentList
│           ├── IssueFormModal (edit mode) ← triggers assignIssue
│           │   └── IssueForm
│           │       └── Select (assignee)
│           └── ConfirmDeleteDialog
```

| Component | Responsibility | Props | State |
|-----------|---------------|-------|-------|
| `IssueDetailPage` | Orchestrates issue data, edit modal, delete dialog, status changes, and assign flow | (route page — no props) | `showEditForm`, `showDeleteDialog`, `statusChanging`, `comments`, `commentsLoading`, `commentsError` |
| `IssueFormModal` | Overlay form for create/edit; delegates to `IssueForm`; shows toast on submit/error | `isOpen`, `mode`, `issue?`, `onClose`, `onSubmit` | (controlled by parent) |
| `IssueForm` | Form fields including assignee `<select>`; validates via Zod schema | `mode`, `issue?`, `onSubmit`, `onCancel` | react-hook-form state |
| `IssueStatusBadge` | Dropdown to change issue status inline | `status`, `loading?`, `onStatusChange` | `open` (dropdown toggle) |
| `IssueDetail` | Displays issue metadata, description, comments | `issue`, `comments`, `isLoading`, `error`, `onBack`, `onEdit`, `onDelete`, `onRetry`, `onStatusChange`, `statusChanging` | (presentational) |
| `Toast` | Transient feedback notifications | `title`, `variant`, `duration` | Auto-dismiss timer |
| `Modal` | Focus-trapped overlay container | `isOpen`, `onClose`, `title`, `children` | Focus management |

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| `/issues` | `IssuesPage` | protected | List view; assignee reflection via cache invalidation |
| `/issues/:id` | `IssueDetailPage` | protected | Detail view; assignee change via edit modal → `assignIssue` action |

No new routes. The existing `/issues/:id` route handles assignee changes through the edit flow.

## State Management

### Global State — `useIssuesStore` (Zustand)

**Existing slices** (no changes):
- `issues: Issue[]` — list of issues
- `selectedIssueId: string | null` — currently viewed issue
- `filters: IssueFilters` — list filters
- `cursor`, `hasMore`, `isLoading`, `error` — pagination and loading

**New action — `assignIssue`**:
```typescript
assignIssue: (id: string, assigneeId: string | null) => Promise<void>
```

**Behavior**:
1. Save `previousIssue` (deep clone of the issue before mutation)
2. Optimistically update `assigneeId` and `assigneeName` in the `issues` array
3. Invalidate `issues:list` cache via `useCacheStore.invalidateByPrefix('issues:list')`
4. Call `assignIssueApi(id, assigneeId)` from `src/entities/issue/api`
5. On success: confirm update (already applied optimistically)
6. On failure: roll back to `previousIssue`, throw error for caller to handle

### Local State — `IssueDetailPage`

| Variable | Type | Purpose |
|----------|------|---------|
| `showEditForm` | `boolean` | Controls IssueFormModal visibility |
| `showDeleteDialog` | `boolean` | Controls ConfirmDeleteDialog visibility |
| `statusChanging` | `boolean` | Loading state for inline status badge |
| `comments` | `Comment[]` | Fetched comments for the issue |
| `commentsLoading` | `boolean` | Comments fetch loading state |
| `commentsError` | `string \| null` | Comments fetch error message |

### Server State — `useCacheStore`

Cache invalidation only. No new cache keys introduced. The `issues:list` prefix is invalidated on:
- `assignIssue` success
- `changeStatus` success (existing)
- `addIssue`, `updateIssue`, `removeIssue` (existing)

### Form State — react-hook-form + Zod

The `IssueForm` uses `react-hook-form` with a Zod schema. The assignee field is:
- `<select>` with options: team members (from API) + "Unassigned" (`value=""`)
- `register('assigneeId')` — controlled by react-hook-form
- Transform: empty string → `null` before submission

## Data Fetching

### API Layer — `src/entities/issue/api/index.ts`

**New function — `assignIssue`**:
```typescript
export async function assignIssue(
  id: string,
  assigneeId: string | null,
): Promise<{ data: Issue }> {
  return apiClient.patch<{ data: Issue }>(`/issues/${id}/assignee`, {
    body: { assigneeId },
  })
}
```

**Existing functions used**:
- `updateIssue(id, data)` — for non-assignee field changes in the edit form
- `fetchComments(issueId)` — for the comments section
- `changeIssueStatus(id, statusId)` — for inline status changes

### Error Handling

| Error Type | Source | Handling |
|-----------|--------|----------|
| 422 `BUSINESS_RULE_ERROR` | `PATCH /issues/{id}/assignee` | Toast with server message (e.g., "Assignee is not a member of this team"); rollback optimistic update; modal stays open |
| Network error | Any API call | Toast "Failed to update assignee. Please try again."; rollback optimistic update |
| 401 Unauthorized | Any API call | Redirect to login (existing `apiClient` interceptor) |

### Optimistic Updates

**Pattern** (matches existing `changeStatus`):
```
1. Clone current issue state
2. Apply assignee change to store immediately
3. Invalidate issues:list cache
4. Call API
5. Success → done (store already updated)
6. Failure → restore cloned state, throw error
```

**Rollback triggers**:
- API returns non-2xx status
- Network error (fetch throws)
- Business rule rejection (422)

### Cache Strategy

| Cache Key Pattern | TTL | Invalidation |
|-------------------|-----|-------------|
| `issues:list?...` | 30s | `invalidateByPrefix('issues:list')` on any mutation |

No new cache keys. The assignee change is reflected in the existing `issues:list` cache.

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| AssigneeAvatar | `src/entities/issue/ui/IssueDetail.tsx` (inline) | 24×24 circle with initials; existing pattern |
| AssigneeSelect | `src/entities/issue/ui/IssueForm.tsx` (inline) | `<select>` dropdown; existing pattern |
| Toast | `src/shared/ui/Toast.tsx` | Reused for success/error notifications |
| Modal | `src/shared/ui/Modal.tsx` | Reused for edit form overlay |
| Button | `src/shared/ui/Button.tsx` | Reused for Edit, Delete, Cancel, Save |
| IssueStatusBadge | `src/entities/issue/ui/IssueStatusBadge.tsx` | Existing; no changes needed |
| Loader2 icon | `lucide-react` | Spinner in status badge and save button |
| ChevronDown icon | `lucide-react` | Dropdown indicator in status badge |

## Validation Strategy

| Field | Rule | Error Message | Source |
|-------|------|---------------|--------|
| `title` | Required, min 1 char | "Title is required" | Zod schema (client) |
| `description` | Optional | — | Zod schema (client) |
| `status` | Must be valid status string | — | Zod schema (client) |
| `priority` | Must be valid priority number | — | Zod schema (client) |
| `assigneeId` | Must be UUID or empty (→ null) | "Assignee is not a member of this team" | Server-side (422) |
| `labels` | Array of strings | — | Zod schema (client) |

**Note**: The assignee field has no client-side validation beyond type checking. Team-membership validation is server-only — the frontend sends the UUID and the server rejects non-team-members with a 422.

## Accessibility

### Keyboard Navigation

- **Tab order**: Back → Edit → Delete → Status badge → metadata → description → comments (IssueDetailPage)
- **Modal focus trap**: Tab cycles through form fields inside IssueFormModal; Escape closes
- **Enter/Space**: Activates buttons, selects dropdown options
- **Arrow keys**: Navigate within Select dropdowns (status, assignee)

### ARIA

| Element | ARIA | Notes |
|---------|------|-------|
| IssueStatusBadge | `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`, `aria-busy` | Existing pattern |
| Status dropdown | `role="listbox"`, `aria-label="Status options"`, `role="option"`, `aria-selected` | Existing pattern |
| Modal | `role="dialog"`, `aria-modal="true"` | Existing Modal component |
| Close button | `aria-label="Close"` | Existing pattern |
| Toast | `role="status"`, `aria-live="polite"` | Existing Toast component |
| Assignee select | `aria-label="Assignee"` | Standard `<select>` semantics |

### Screen Reader

- Status changes announced via `aria-live="polite"` toast
- Assignee changes announced via `aria-live="polite"` toast
- Loading states use `aria-busy="true"` on interactive elements
- Error toasts use `role="status"` for announcement

### Focus Management

- Modal opens: focus moves to first form field (title input)
- Modal closes: focus returns to trigger element (Edit button)
- Toast appears: no focus shift (non-interactive, auto-announced)

## Tech-Research-Digest Validation

Cross-referenced against `.agents/skills/repomix-reference/references/tech-research-digest.md`:

| Pattern | Digest Recommendation | Project Choice | Status |
|---------|----------------------|----------------|--------|
| State management | Zustand, TanStack Query, or Redux Toolkit | Zustand 5 | Aligned |
| Forms | React Hook Form | react-hook-form + Zod | Aligned |
| Architecture | Feature-Sliced Design | FSD with eslint-plugin-boundaries | Aligned |
| Testing | Vitest + Testing Library + MSW + Playwright | Same stack | Aligned |
| Lint | ESLint + Prettier | ESLint + Prettier | Aligned |
| Styling | Tailwind CSS | Tailwind CSS v4 | Aligned |

**No conflicts found.** The project's frontend architecture aligns with all digest recommendations.
