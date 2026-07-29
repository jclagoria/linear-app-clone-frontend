# List Projects — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| API Client | `src/shared/api/projects.ts` with `apiClient.get` | Consistent with existing pattern, reusable across features |
| State Management | Zustand store (`useProjectsStore`) | Project data is global across list and detail views |
| Pagination | Cursor-based, append-on-scroll | API contract uses cursors; append avoids re-render flicker |
| Error Handling | Inline error message + retry button | Non-blocking, keeps page context visible |

## Component Tree

```
ProjectsPage
  └── ProjectList
        ├── StatusFilter (dropdown)
        ├── ProjectCard (x N, scrollable)
        ├── LoadingSpinner (shown during fetch)
        ├── EmptyState (filtered-to-zero or first-run variants)
        └── ErrorMessage (inline + retry)
```

| Component | Responsibility | Props | States |
|-----------|---------------|-------|--------|
| ProjectsPage | Fetches projects on mount, orchestrates list | none (reads teamId from auth store) | — |
| ProjectList | Renders scrollable list with infinite scroll | teamId, status, limit | loading, populated, empty, error |
| StatusFilter | Dropdown to filter by status | value, onChange | default, expanded, disabled |
| ProjectCard | Single project display, click → detail | project, onClick | default, hover, active |
| LoadingSpinner | Skeleton during fetch | — | default |
| EmptyState | Empty list messaging | variant (filtered-to-zero / first-run) | default |
| ErrorMessage | Error display with retry | message, onRetry | default |

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| /projects | ProjectsPage | protected | Main listing, loads on mount |

## State Management

- **Global state**: `useProjectsStore` (Zustand) — holds `projects[]`, `pagination`, `loading`, `error`
- **Local state**: `StatusFilter` internal selected value; `ProjectsPage` filter selection
- **Server state**: fetched via `apiClient.get`, stored in Zustand, manual invalidation on filter change

## Data Fetching

- **Client**: `apiClient.get<PaginatedResponse<Project>>('/projects', { params })` (fetch-based)
- **Error handling**: catch 400/401 errors, store in Zustand `error` field, render `ErrorMessage` inline
- **Loading**: set `loading` flag before fetch, clear on resolve/reject
- **Pagination**: append on scroll via cursor, `hasMore` guard to prevent redundant fetches

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| StatusBadge icons | Inline text (○ ● ✓ ✗) | No icon library dependency |
| LoadingSpinner | CSS animation | Purely CSS, no SVG |
| EmptyState icon | Inline SVG or emoji 📭 | Placeholder for hi-fi pass |
| ProjectCard icons | Per-project emoji | Placeholder, determined by backend data |

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| teamId | Required, valid UUID | "A valid team ID is required to load projects." |
| status | Must be: planned, in_progress, completed, canceled | "Invalid status filter selected." |
| limit | 1-100, default 20 | "Limit must be between 1 and 100." |

## Accessibility

- **Keyboard navigation**: Tab through StatusFilter → ProjectCards → load more indicator; Enter/Space activates card; Escape closes filter dropdown
- **ARIA**: `aria-live="polite"` on LoadingSpinner and ErrorMessage; `role="article"` on ProjectCard; `aria-label="Filter projects by status"` on StatusFilter
- **Screen reader**: One `<h1>` per page ("Projects"); `aria-label` on avatar and icon-only controls; semantic `<ul>`/`<li>` for card list