# Work Module: Issues Store & UI — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| Store location | `src/entities/issue/model/store.ts` | Follows existing entity pattern (session store at `src/entities/session/model/store.ts`). Issue is a domain entity, not a "feature". | Co-locates store with entity rather than in a separate `features/` dir. |
| Store pattern | Zustand v5 with separate selectors file | Consistent with existing stores (auth, websocket, notifications). Selectors in `selectors/` for composability and memoization. | More files per module; selector tests needed separately. |
| API layer | ApiClient via `src/entities/issue/api/` | Reuses existing fetch-based ApiClient with interceptor pipeline. Avoids coupling store to HTTP directly. | Extra abstraction layer; must maintain parity with API contract. |
| Component location | `src/entities/issue/ui/` | Follows entity pattern — co-locates IssueCard, IssueList, IssueDetail, IssueForm, IssueFilters with the entity. Pages (`IssuesPage`, `IssueDetailPage`) stay in `src/pages/`. | Distinction between entity UI components and page components may blur. |
| IssueForm implementation | react-hook-form + Zod schema | Already in stack. Zod schema in `src/entities/issue/model/validation.ts` doubles as API validation. | Form state is local (not in store); store only receives final data. |
| Modal for IssueForm | Shared Modal component from `src/shared/ui/` | Consistent with design-system. Focus trap managed at Modal level. | IssueForm is a compound form, not a primitive — may need custom focus management. |

## Component Tree

```
AppLayout
├── IssuesPage
│   ├── IssueFilters
│   │   ├── Select (Status)
│   │   ├── Select (Assignee)
│   │   ├── Select (Project)
│   │   └── Button (Clear)
│   ├── IssueList
│   │   ├── IssueCard (×N)
│   │   │   ├── Badge (Status)
│   │   │   ├── Badge (Priority)
│   │   │   └── Avatar (Assignee)
│   │   ├── EmptyState (no issues / no results)
│   │   ├── SkeletonLoader
│   │   └── ErrorBanner
│   └── Button (New Issue)
│
├── IssueDetailPage
│   ├── Button (Back)
│   ├── Badge (Status)
│   ├── Badge (Priority)
│   ├── Avatar + Name (Assignee)
│   ├── Badge (Labels)
│   ├── CommentList
│   │   ├── CommentCard (×N)
│   │   └── EmptyState (no comments)
│   ├── CommentForm
│   ├── Button (Edit)
│   ├── Button (Delete)
│   ├── SkeletonLoader
│   ├── NotFoundState
│   └── ErrorBanner
│
├── IssueFormModal <Modal>
│   ├── Input (Title)
│   ├── Textarea (Description)
│   ├── Select (Status)
│   ├── Select (Priority)
│   ├── Select (Assignee)
│   ├── LabelsInput (multi-tag)
│   ├── Button (Cancel)
│   └── Button (Save)
│
└── ConfirmDeleteDialog <Modal>
    ├── Warning text
    ├── Button (Cancel)
    └── Button (Delete)
```

| Component | Responsibility | Props | State |
|-----------|---------------|-------|-------|
| IssuesPage | Page container — reads from IssuesStore, renders IssueFilters + IssueList | none (reads store) | — |
| IssueDetailPage | Page container — reads selected issue from store, renders detail | none (reads store) | loading, populated, not-found, error |
| IssueFilters | Filter bar — reads/writes IssuesStore filters | none (reads/writes store) | default, active-filters |
| IssueList | Scrollable list of IssueCards | none (reads store) | loading (skeleton), empty (no issues), populated, error (with cached data) |
| IssueCard | Compact single-issue display | `issue: Issue` | default, hover, focused |
| IssueFormModal | Create/edit issue modal | `mode: 'create' \| 'edit'`, `issueId?: string` | create, edit, submitting, validation-error, api-error |
| ConfirmDeleteDialog | Delete confirmation dialog | `issueId: string`, `issueTitle: string` | default, submitting, api-error |
| CommentList | Chronological comment list | `comments: Comment[]` | populated, empty |
| CommentCard | Individual comment display | `comment: Comment` | default |

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| `/issues` | IssuesPage | protected (AuthGuard) | Issue list with filters |
| `/issues/:id` | IssueDetailPage | protected (AuthGuard) | Full issue detail via selectedIssueId |
| — | IssueFormModal | protected | Rendered as overlay modal on both IssuesPage and IssueDetailPage |
| — | ConfirmDeleteDialog | protected | Rendered as overlay modal on IssueDetailPage |

## State Management

- **Global state**: `IssuesStore` (Zustand) in `src/entities/issue/model/store.ts`
  - `issues: Issue[]` — canonical list
  - `selectedIssueId: string | null` — currently viewed issue
  - `filters: { status, assigneeId, projectId, cycleId, labelIds }` — active filters
  - `isLoading: boolean` — fetch in progress
  - `error: string | null` — last error message
  - `pagination: { cursor, hasMore }` — pagination state
- **Local state**: Form state is managed by react-hook-form (uncontrolled). Modal open/close is local to the parent page. Submitting/validation-error states are local to the form.
- **Server state**: Fetched on mount via `fetchIssues()`. No React Query — keeping with existing pattern of direct store dispatch.

## Data Fetching

- **Client**: Custom fetch-based ApiClient (`src/shared/lib/api-client/ApiClient.ts`)
- **API module**: `src/entities/issue/api/` — `fetchIssues(filters)`, `createIssue(data)`, `updateIssue(id, partial)`, `deleteIssue(id)`
- **Error handling**: ApiError with code/status/details fields. Store sets `error` field, UI shows error banner with retry option.
- **Optimistic updates**: Pessimistic — wait for API response before updating store. Simpler and safer for MVP.
- **Cache strategy**: None at API layer. Store holds the latest fetched list. Re-fetch on filter change.

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| lucide-react icons | via package | All icons (Plus, Trash2, Edit3, ArrowLeft, AlertCircle, CheckCircle2, Loader2, X, ChevronDown, Search, Filter) |
| Avatar initials | inline CSS | Generated from user name initials, no image required |
| Skeleton loaders | inline Tailwind | Animated pulse gradient via CSS, no images |
| Empty state illustrations | inline SVG or emoji | Using Unicode emoji for MVP (📋, 🔍, ⚠️) |

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| title | Required, max 255 chars | "Title is required" / "Title must be 255 characters or fewer" |
| description | Max 50000 chars | "Description must be 50000 characters or fewer" |
| status | Must be valid workflow state | — (select, always valid) |
| priority | Must be valid priority level | — (select, always valid) |

Zod schema in `src/entities/issue/model/validation.ts`. Rules shared with backend validation contract.

## Accessibility

- **Keyboard navigation**: Tab through IssueFilters in logical order; Enter to select filter value; J/K to navigate cards; Enter on card to open detail; Esc to close modals; Ctrl+Enter to submit forms.
- **ARIA**: IssueCard has `role="button"` and `tabindex="0"`. Form inputs have associated `<label>`. Error messages linked via `aria-describedby`. Modal has `role="dialog"` and `aria-modal="true"`. ConfirmDelete has `role="alertdialog"` with `aria-describedby`.
- **Screen reader**: Status badges use visible text labels (not just color). Priority uses icon + text. Loading state uses `aria-busy="true"`. Skeleton loaders use `aria-label="Loading"`.
- **Focus management**: Modal traps focus; initial focus on first input (create) or title (edit); focus restored on close. Error banner receives focus on mount.
- **Color contrast**: DS-owned — WCAG AA (4.5:1 normal, 3:1 large). Status/priority indicators never use color alone.
- **Target size**: All interactive elements ≥24×24 CSS px.
