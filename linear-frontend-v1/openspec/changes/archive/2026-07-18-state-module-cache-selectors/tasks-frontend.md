# Tasks — State Module: Cache & Selectors (Frontend)

## Scaffold

- [x] Create `src/stores/` directory structure
- [x] Install dependencies: `zustand` (if not already present)
- [x] Create `src/stores/index.ts` — barrel export for all stores
- [x] Create `src/stores/types.ts` — shared store types

## State & Data — Auth Store

- [x] Implement `src/stores/auth-store.ts` with Zustand `create()`
  - [x] State shape: `user`, `accessToken`, `isAuthenticated`, `isLoading`, `error`
  - [x] Action: `login(email, password)` — set loading, call API, update state
  - [x] Action: `logout()` — clear state, call backend clear cookie
  - [x] Action: `hydrate()` — check refresh cookie, restore session
  - [x] Action: `refreshAccessToken()` — silent token refresh
  - [x] Test: login flow — loading → success/error transitions
  - [x] Test: logout — state reset
  - [x] Test: hydrate — restores session from cookie

## State & Data — Issues Store

- [x] Implement `src/features/issues/stores/issues-store.ts`
  - [x] State shape: `issues[]`, `selectedIssueId`, `filters`, `cursor`, `hasMore`, `isLoading`, `error`
  - [x] Action: `loadIssues()` — fetch via cache, update collection
  - [x] Action: `loadNextPage()` — cursor-based pagination
  - [x] Action: `selectIssue(id)` / `deselectIssue()`
  - [x] Action: `setFilters(filters)` — update filters
  - [x] Action: `clearFilters()`
  - [x] Action: `addIssue(issue)` / `updateIssue(issue)` / `removeIssue(id)` — mutation callbacks
  - [x] Test: load issues — loading → populated transitions
  - [x] Test: filter application — filtered list updates correctly
  - [x] Test: pagination — append on next page, stop at hasMore=false
  - [x] Test: select/deselect issue

## State & Data — UI Store

- [x] Implement `src/stores/ui-store.ts`
  - [x] State shape: `sidebarCollapsed`, `theme`, `activeModal`, `keyboardContext`
  - [x] Action: `toggleSidebar()` — flip + persist to localStorage
  - [x] Action: `setTheme(theme)` — "light" | "dark" | "system" + persist
  - [x] Action: `openModal(id)` / `closeModal()`
  - [x] Action: `setKeyboardContext(context)`
  - [x] Hydrate theme and sidebar state from localStorage on init
  - [x] Test: toggle sidebar persists to localStorage
  - [x] Test: theme switch and hydrate on app start
  - [x] Test: modal open/close

## State & Data — WebSocket Store

- [x] Implement `src/stores/websocket-store.ts`
  - [x] State shape: `connectionStatus`, `reconnectAttempts`, `notifications[]`, `lastEvent`
  - [x] Action: `setConnecting()` / `setConnected()` / `setReconnecting()` / `setDisconnected()`
  - [x] Action: `addNotification(notification)`
  - [x] Action: `markAsRead(notificationId)`
  - [x] Test: connection status transitions
  - [x] Test: notification add and mark read

## State & Data — Cache Layer

- [x] Implement `src/stores/cache-store.ts`
  - [x] Cache entry type: `{ data, timestamp, ttl }`
  - [x] Configure default TTL per entity type (issues: 30s, projects: 60s, cycles: 60s)
  - [x] `get(key)` — return cached value if within TTL, null if expired/miss
  - [x] `set(key, data, ttl?)` — store with timestamp
  - [x] `invalidate(key)` — remove specific entry
  - [x] `invalidateByPrefix(prefix)` — remove all entries matching prefix
  - [x] `clear()` — remove all entries (on logout)
  - [x] LRU eviction when exceeding maxSize
  - [x] Stale-while-revalidate: if past TTL, return stale + trigger background refresh
  - [x] Test: cache hit within TTL returns data, no fetch
  - [x] Test: cache miss triggers fetch
  - [x] Test: invalidation on mutation removes entry
  - [x] Test: LRU eviction

## State & Data — Selectors

- [x] Implement `src/stores/selectors/` directory
- [x] `selectIssuesByStatus(state)` — group issues by status, apply active filters
- [x] `selectProjectProgress(issues, projectId)` — compute completion %
- [x] `selectActiveCycle(cycles)` — find cycle containing current date
- [x] `selectUnreadCount(notifications)` — count unread notifications
- [x] `selectFilteredIssues(issues, filters)` — pure filter function
- [x] Memoization: use `useShallow` for components + manual memo for multi-store selectors
- [x] Test: each selector returns correct derived data
- [x] Test: memoized selectors don't recompute on unchanged inputs
- [x] Test: selectors recompute on dependency change
- [x] Test: cross-store selectors handle partial updates

## State & Data — Store Reset

- [x] Implement `resetAllStores()` utility
  - [x] Map of known stores to their initial state
  - [x] Called on logout — clears all domain stores (preserves UI preferences)
- [x] Test: reset restores initial state for each store
- [x] Test: UI store preferences preserved on auth reset

## Components — StoreProvider

- [x] Implement `src/stores/StoreProvider.tsx`
  - [x] Initialize all stores on mount
  - [x] Hydrate persisted state (auth, UI prefs)
  - [x] Render children after hydration (or show splash)
  - [x] States: `initialising`, `ready`, `error`
- [x] Test: provider renders children after hydration
- [x] Test: provider shows error state on hydrate failure

## Components — AuthGuard

- [x] Implement `src/router/AuthGuard.tsx`
  - [x] Read `isAuthenticated` from authStore
  - [x] If loading → show spinner/splash
  - [x] If unauthenticated → redirect to `/login`
  - [x] If authenticated → render children
- [x] Test: guard redirects unauthenticated to /login
- [x] Test: guard renders children when authenticated

## Routing

- [x] Wire React Router routes in `src/router/index.tsx`
  - [x] `/login` — LoginPage (public)
  - [x] `/` — redirect to `/issues`
  - [x] `/issues` — IssueListPage (protected)
  - [x] `/issues/:id` — IssueDetailPage (protected)
- [x] Implement protected route wrapper using AuthGuard
- [x] Login redirect — preserve original target URL
- [x] Test: protected route redirects to /login without auth

## Integration

- [x] Wire all stores in `src/main.tsx` via StoreProvider
- [x] Connect login form to authStore.login()
- [x] Connect issue list to issuesStore.loadIssues() on mount
- [x] Connect issue detail to selectedIssueId from issuesStore
- [x] Connect header notification badge to websocketStore selectUnreadCount
- [x] Connect sidebar toggle to uiStore
- [x] Connect filter controls to issuesStore setFilters/clearFilters
- [x] Connect "New Issue" button to uiStore openModal
- [x] Wire cache layer read-through for issues loading
- [x] Wire cache invalidation on issue create/update/delete
- [x] Wire authStore.hydrate() on app boot
- [x] Wire resetAllStores() on logout

## Validation

- [x] Unit test: authStore — login, logout, hydrate
- [x] Unit test: issuesStore — load, filter, paginate, select
- [x] Unit test: uiStore — sidebar, theme, modal
- [x] Unit test: websocketStore — connection, notifications
- [x] Unit test: cacheStore — TTL, invalidation, LRU, stale-while-revalidate
- [x] Unit test: selectors — each selector + memoization
- [x] Unit test: StoreProvider — init, hydrate, error
- [x] Unit test: AuthGuard — loading, unauthenticated, authenticated
- [x] Integration test: full auth flow — login → store update → guard allows access
- [x] Integration test: issue list loading with cache layer
- [x] Integration test: filter → selector update → UI re-render

## Review

- [x] Verify all stores follow the interface pattern from store-architecture spec
- [x] Verify selectors are pure and memoized
- [x] Verify cache TTLs are set per entity type
- [x] Verify resetAllStores preserves UI store
- [x] Verify auth interceptor reads from authStore
- [x] Verify all tests pass
- [x] PR checklist: new files documented, no dead code, types correct
