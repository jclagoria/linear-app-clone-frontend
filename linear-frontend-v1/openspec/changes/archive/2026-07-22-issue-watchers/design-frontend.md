# Issue Watchers — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| Feature placement | New `features/watchers/` slice | Watching is a user-facing action with its own loading/error/optimistic-update lifecycle, distinct from the issue entity | Adds a new FSD slice instead of extending `entities/issue/`; cleaner separation of concerns |
| Data entity | New `entities/watcher/` slice | Watcher is a distinct business entity (user + issue relationship) with its own API path | Minor slice duplication; could have lived in `entities/issue/` |
| State management | Dedicated Zustand store (`useWatchersStore`) | Optimistic update pattern (save → API → revert on error) mirrors existing `useIssuesStore` pattern; separate lifecycle from issue loading | One more store instance; small bundle cost |
| Component location | `WatcherList` in `entities/watcher/ui/`, `WatchButton` in `features/watchers/ui/` | List is a pure presentation component; button carries the toggle business logic | Two import paths for closely related UI |
| API module | `entities/watcher/api/` with `fetchWatchers`, `addWatcher`, `removeWatcher` | Co-located with the entity; follows existing `entities/issue/api/` pattern | Duplicates the issue entity API module path pattern |

## Component Tree

```
IssueDetailPage (pages/)
  └── IssueDetail (entities/issue/ui/)
       ├── IssueStatusBadge
       ├── CommentList
       └── WatcherSection (features/watchers/)
            ├── WatcherList (entities/watcher/ui/)
            │    └── WatcherItem (entities/watcher/ui/)
            └── WatchButton (features/watchers/ui/)
```

| Component | Responsibility | Props | State |
|-----------|---------------|-------|-------|
| `WatcherSection` | Composes WatcherList + WatchButton; coordinates data fetching and toggle | `issueId: string` | loading, populated, empty, error |
| `WatcherList` | Renders the list of watchers with avatars and names | `watchers: Watcher[]`, `isLoading: boolean`, `error: string | null`, `onRetry: () => void` | loading (skeleton), empty ("No watchers yet"), error (retry prompt), populated (list) |
| `WatcherItem` | Single watcher row with avatar and name | `watcher: Watcher`, `isSelf: boolean` | — (pure presentational) |
| `WatchButton` | Toggle to subscribe/unsubscribe | `isWatching: boolean`, `isLoading: boolean`, `onToggle: () => void` | not-watching ("Watch"), watching ("Watching"), loading (spinner), disabled (unauthenticated) |

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| `/issues/:id` | `IssueDetailPage` | protected | No new route; watchers render inline on the existing issue detail page |

## State Management

- **Global state (Zustand)**: `useWatchersStore` — watchers array, loading/error state, optimistic update logic. Independent from `useIssuesStore`; invalidated on toggle to keep watcher count in sync.
- **Local state (useState)**: `WatchButton` toggle loading spinner, toast display timing.
- **Server state**: No external cache layer (React Query/SWR). Zustand store actions fetch on mount and invalidate on mutation, matching the existing pattern in `useIssuesStore`.

### Store Shape

```
interface WatchersState {
  watchersByIssue: Record<string, Watcher[]>
  isLoading: boolean
  error: string | null
  fetchWatchers: (issueId: string) => Promise<void>
  addWatcher: (issueId: string) => Promise<void>
  removeWatcher: (issueId: string, userId: string) => Promise<void>
}
```

### Data Flow

```
IssueDetailPage mounts
  → WatcherSection useEffect fetchWatchers(issueId)
  → store: watchersByIssue[issueId] = data
  → WatcherList renders watchers
  → User clicks WatchButton
    → store: optimistic add → POST /watchers → success: confirm
    → failure: revert to previous state + error toast
```

## Data Fetching

- **Client**: `apiClient` singleton (existing `axios`-like wrapper in `shared/lib/api-client/`), same as all existing entity APIs.
- **Endpoints**:
  - `GET /issues/{id}/watchers` → `Watcher[]`
  - `POST /issues/{id}/watchers` → `{ data: Watcher }` (body: `{ userId }`)
  - `DELETE /issues/{id}/watchers/{userId}` → `204`
- **Error handling**: Server errors → revert optimistic state + toast via `useToastStore.addToast({ title, variant: 'error' })`. 409 Conflict → re-fetch server state to resolve.
- **Optimistic updates**: Pessimistic UI with optimistic preview. Store saves previous watcher list before mutation; reverts on any non-success response. 409 Conflict triggers a full re-fetch instead of revert.
- **Cache invalidation**: After successful toggle, invalidate `watchersByIssue[issueId]` entry and any issue-list caches that display watcher count (future).

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| `Eye` icon | `lucide-react` (existing dependency) | Used in `WatchButton`; `eye` for "Watch", `eye-off` for "Watching" |
| User avatar | `<img>` or initials fallback | Existing user avatar pattern from `entities/session/`; 24×24px |
| Spinner | `shared/ui/Spinner` (existing component) | Inline loading state for `WatchButton` |
| Toast | `shared/stores/toastStore` (existing) | Success/error feedback on toggle |

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| `userId` (POST body) | MUST be a valid UUID | Server returns 422 with field error |
| `issueId` (path param) | MUST exist | Server returns 404 |

No client-side form validation. WatchButton is a single-click toggle with no text input. Server-side validation is sufficient; errors surface via toast.

## Accessibility

- **Keyboard navigation**: WatchButton operable via Enter/Space. Existing tab order preserved — WatchButton placed after issue metadata, before comments section.
- **ARIA**: `WatchButton` uses `aria-pressed` (true/false) to reflect toggle state. `aria-label` dynamically describes action ("Watch this issue" / "Unwatch this issue"). `WatcherList` uses `<ul>` with `role="list"` and `aria-label="Watchers"`. Error state uses `role="alert"`. Loading skeleton uses `aria-busy="true"`.
- **Screen reader**: Section heading "Watchers" (`<h3>`) provides landmark for navigation. Each `WatcherItem` announces user name. Toast notifications use `role="status"` with `aria-live="polite"`.
- **Focus management**: After successful toggle, focus remains on `WatchButton` so the user can immediately toggle again. On error revert, a toast announces the failure.
- **Touch targets**: `WatchButton` minimum 44×44px (exceeds WCAG 2.5.8). `WatcherItem` rows minimum 24px height.
