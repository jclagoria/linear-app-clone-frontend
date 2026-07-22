# Tasks — Issue Watchers (Frontend)

## Scaffold

- [x] Create `src/entities/watcher/` directory with `model/`, `api/`, `ui/` subdirectories
- [x] Create `src/features/watchers/` directory with `model/`, `ui/` subdirectories

## Components

- [x] **`WatcherItem`** (`entities/watcher/ui/WatcherItem.tsx`): Single watcher row — avatar (24×24), display name, optional "you" tag for current user. Pure presentational, no state.
- [x] **`WatcherList`** (`entities/watcher/ui/WatcherList.tsx`): Renders array of `WatcherItem` in a `<ul role="list" aria-label="Watchers">`. States: loading (3 skeleton rows with `aria-busy="true"`), empty ("No watchers yet"), error (`role="alert"` + retry button), populated (list).
- [x] **`WatcherSection`** (`features/watchers/ui/WatcherSection.tsx`): Composes `WatcherList` + `WatchButton`. Coordinates data fetch on mount. Passes `issueId` to store actions. Handles retry.
- [x] **`WatchButton`** (`features/watchers/ui/WatchButton.tsx`): Toggle button with `aria-pressed`, dynamic `aria-label`. States: not-watching (outline icon + "Watch"), watching (filled icon + "Watching"), loading (spinner replaces icon, disabled), disabled (unauthenticated). Uses existing `Button` component with `variant="secondary"`.
- [x] **Integrate into `IssueDetail`**: Add `<WatcherSection issueId={issue.id} />` in `IssueDetail.tsx` below the description, above the `<hr />` before `CommentList`.

## State & Data

- [x] **Define `Watcher` type** (`entities/watcher/model/types.ts`): `{ id: string, userId: string, issueId: string, name: string, avatarUrl?: string, createdAt: string }`
- [x] **Create watcher API module** (`entities/watcher/api/index.ts`):
  - `fetchWatchers(issueId: string): Promise<{ data: Watcher[] }>`
  - `addWatcher(issueId: string): Promise<{ data: Watcher }>`
  - `removeWatcher(issueId: string, userId: string): Promise<void>`
- [x] **Create `useWatchersStore`** (`features/watchers/model/store.ts`): Zustand store with Zustand devtools middleware. Actions:
  - `fetchWatchers(issueId)`: sets loading, fetches, stores in `watchersByIssue[issueId]`, handles error
  - `addWatcher(issueId)`: optimistic add to `watchersByIssue[issueId]`, POST API, revert on error, toast on success/error. Handle 409 by re-fetching server state.
  - `removeWatcher(issueId, userId)`: optimistic remove from `watchersByIssue[issueId]`, DELETE API, revert on error, toast on success/error
- [x] **Wire toast feedback**: On successful toggle, `addToast({ title: "You are now watching this issue" | "You are no longer watching this issue", variant: "success" })`. On error, `addToast({ title: errorMessage, variant: "error" })`.

## Routing

- [x] No new routes needed. WatcherSection renders inline on the existing `/issues/:id` page in `IssueDetail.tsx`.

## Integration

- [x] Verify `WatcherSection` fetches watchers on mount and re-fetches when `issueId` changes
- [x] Verify optimistic add: user clicks "Watch" → watcher appears immediately → POST succeeds → no UI change needed
- [x] Verify optimistic remove: user clicks "Watching" → watcher disappears immediately → DELETE succeeds → no UI change needed
- [x] Verify error revert: failed POST/DELETE restores previous watcher list and shows error toast
- [x] Verify 409 conflict: server says already watching → re-fetch server state → UI syncs
- [x] Verify empty state: issue with no watchers shows "No watchers yet" and "Watch" button
- [x] Verify error state: network failure shows error message with retry button
- [x] Verify loading state: skeleton shown while fetching
- [x] Verify unauthenticated: WatchButton is disabled when no active session

## Validation

- [ ] **Unit tests** (`src/__tests__/watchers/`):
  - `useWatchersStore` — test fetch success/failure, optimistic add/remove, rollback on error, 409 re-fetch
  - `WatcherItem` — renders with avatar, name, "you" tag
  - `WatcherList` — renders populated/empty/loading/error states
  - `WatchButton` — renders watching/not-watching/loading states, emits onToggle, respects disabled
- [ ] **Component/Lab tests**: Verify accessibility contract — `aria-pressed` toggles, `aria-label` changes, `role="list"` on list, `role="alert"` on error, `aria-busy="true"` on skeleton
- [ ] **Integration tests** (MSW): Mock apiClient watcher endpoints, verify store actions call correct endpoints with correct methods and bodies
- [ ] **E2E tests** (Playwright): Navigate to `/issues/:id`, toggle watch, verify toast appears, verify button text toggles

## Review

- [ ] Self-review: all components handle their four states (loading, empty, error, populated)
- [ ] Self-review: optimistic update pattern matches existing `assignIssue`/`changeStatus` in `useIssuesStore`
- [ ] Self-review: FSD layer rules respected — `entities/watcher/` imports only `shared/`, `features/watchers/` imports `entities/watcher/` and `shared/`
- [ ] Self-review: accessibility — WatchButton has `aria-pressed` and `aria-label`, WatcherList has `role="list"` and `aria-label`, error uses `role="alert"`
- [ ] PR checklist: lint passes, typecheck passes, tests pass, new files follow naming conventions
