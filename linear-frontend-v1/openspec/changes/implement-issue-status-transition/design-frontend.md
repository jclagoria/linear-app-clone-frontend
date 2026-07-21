# Issue Status Transition — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| Status change endpoint | Dedicated `PATCH /issues/{id}/status` | Backend validates workflow transitions; `completedAt`/`canceledAt` set automatically | Requires separate API path from generic `updateIssue` |
| Error handling | Pessimistic — revert on failure; show toast from `BusinessRuleError` | Keeps UI consistent with server state; no optimistic rollback complexity | Flash of old status on slow responses |
| Status dropdown | Custom `IssueStatusBadge` wrapping existing `Select` component | Reuses a11y patterns and keyboard nav from Select; custom trigger for status colors | Slight divergence from pure Select API |
| Store action | New `changeStatus(id, statusId)` action in `useIssuesStore` | Keeps status mutation separate from generic `updateIssue`; dedicated error path | Additional store action to maintain |
| Loading state | Spinner replaces dropdown arrow on the badge trigger | Minimal visual disruption; dropdown disabled during request | No per-option loading indicator |

## Component Tree

```
IssueDetailPage (existing)
  └── IssueDetail (existing — modified)
        ├── IssueStatusBadge (new)
        │     └── Select (reused — trigger replaced by status pill)
        └── Toast (existing — via useToastStore.addToast)
```

| Component | Responsibility | Props | States |
|-----------|---------------|-------|-------|
| `IssueDetailPage` | Orchestrates data loading, passes callbacks to IssueDetail | (none — reads route params) | loading, populated, error |
| `IssueDetail` | Renders issue detail layout, delegates to child components | `issue`, `comments`, `isLoading`, `error`, `onBack`, `onEdit`, `onDelete`, `onRetry`, `onStatusChange` | loading, not-found, error, populated |
| `IssueStatusBadge` | Status pill trigger + dropdown menu with transition call | `status: string`, `onStatusChange: (statusId: string) => void` | default, open, loading, success, error |
| `Select` (reused) | Dropdown listbox used inside IssueStatusBadge | `options`, `value`, `onChange` | closed, open, empty |

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| `/issues/:id` | `IssueDetailPage` | protected (AuthGuard) | Existing — status dropdown added here |

No new routes. The status dropdown lives within the existing issue detail route.

## State Management

- **Global state** (`useIssuesStore`): New `changeStatus(id, statusId)` action calls `changeIssueStatus` API, then calls `updateIssue` on success to update the local issue record. On `BusinessRuleError`, status reverts to previous value and error is surfaced via toast.
- **Local state**: `IssueStatusBadge` tracks dropdown open/closed, loading spinner state. `IssueDetailPage` tracks edit modal and delete dialog visibility.
- **Server state**: Fetched on demand via ApiClient, cached in `useCacheStore`. After a status change succeeds, invalidates the relevant cache keys.

## Data Fetching

- **Client**: `apiClient` (custom fetch-based with interceptor pipeline)
- **New API function**: `changeIssueStatus(id: string, statusId: string): Promise<{ data: Issue }>` — calls `PATCH /issues/{id}/status` with `{ statusId }`
- **Error handling**:
  - 422 `BUSINESS_RULE_ERROR` → throw `BusinessRuleError` → store catches → reverts status → error toast with API message
  - 401 → token refresh + retry (existing interceptor)
  - Network error → generic error toast, status reverts
- **Optimistic updates**: Pessimistic — wait for server confirmation before updating UI

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| `Select` component | `src/shared/ui/Select.tsx` | Existing — reused with custom status pill trigger |
| `useToastStore` | `src/shared/stores/toastStore.ts` | Existing — `addToast` for success/error feedback |
| `IssueDetail` | `src/entities/issue/ui/IssueDetail.tsx` | Existing — modified to include `IssueStatusBadge` |
| `useIssuesStore` | `src/entities/issue/model/store.ts` | Existing — new `changeStatus` action |
| `changeIssueStatus` | `src/entities/issue/api/index.ts` | New API function |
| `BusinessRuleError` class | `src/shared/lib/api-client/errors/BusinessRuleError.ts` | Existing — thrown on 422 responses |

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| `statusId` | Must be a valid UUID | "Invalid status selection" (client-side guard) |
| transition | Server-validated against workflow map | Displayed from API `BusinessRuleError` message |

Client-side: basic UUID format check on `statusId`. All workflow transition validation is server-side (the backend validates against the transition map).

## Accessibility

- **Keyboard navigation**: Tab to status badge, Enter/Space opens dropdown, Arrow keys navigate options, Enter selects, Escape closes (inherited from `Select` component)
- **ARIA**: `role="combobox"` + `aria-expanded` + `aria-haspopup="listbox"` on trigger; `role="option"` + `aria-selected` on dropdown items (existing Select patterns)
- **Screen reader**: `aria-label="Status: {name}. Click to change"` on trigger button; error toasts use `role="alert"`; loading state uses `aria-busy="true"`
- **Target size**: Status badge ≥32px height (≥44px on mobile per design-system contract)
