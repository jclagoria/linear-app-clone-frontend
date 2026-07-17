# Tasks — State Module: Cache & Selectors (Frontend)

## Scaffold

- [ ] Create `src/stores/` directory structure
- [ ] Install dependencies: `zustand` (if not already present)
- [ ] Create `src/stores/index.ts` — barrel export for all stores
- [ ] Create `src/stores/types.ts` — shared store types

## State & Data — Auth Store

- [ ] Implement `src/stores/auth-store.ts` with Zustand `create()`
  - [ ] State shape: `user`, `accessToken`, `isAuthenticated`, `isLoading`, `error`
  - [ ] Action: `login(email, password)` — set loading, call API, update state
  - [ ] Action: `logout()` — clear state, call backend clear cookie
  - [ ] Action: `hydrate()` — check refresh cookie, restore session
  - [ ] Action: `refreshAccessToken()` — silent token refresh
  - [ ] Test: login flow — loading → success/error transitions
  - [ ] Test: logout — state reset
  - [ ] Test: hydrate — restores session from cookie

## State & Data — Issues Store

- [ ] Implement `src/features/issues/stores/issues-store.ts`
  - [ ] State shape: `issues[]`, `selectedIssueId`, `filters`, `cursor`, `hasMore`, `isLoading`, `error`
  - [ ] Action: `loadIssues()` — fetch via cache, update collection
  - [ ] Action: `loadNextPage()` — cursor-based pagination
  - [ ] Action: `selectIssue(id)` / `deselectIssue()`
  - [ ] Action: `setFilters(filters)` — update filters
  - [ ] Action: `clearFilters()`
  - [ ] Action: `addIssue(issue)` / `updateIssue(issue)` / `removeIssue(id)` — mutation callbacks
  - [ ] Test: load issues — loading → populated transitions
  - [ ] Test: filter application — filtered list updates correctly
  - [ ] Test: pagination — append on next page, stop at hasMore=false
  - [ ] Test: select/deselect issue

## State & Data — UI Store

- [ ] Implement `src/stores/ui-store.ts`
  - [ ] State shape: `sidebarCollapsed`, `theme`, `activeModal`, `keyboardContext`
  - [ ] Action: `toggleSidebar()` — flip + persist to localStorage
  - [ ] Action: `setTheme(theme)` — "light" | "dark" | "system" + persist
  - [ ] Action: `openModal(id)` / `closeModal()`
  - [ ] Action: `setKeyboardContext(context)`
  - [ ] Hydrate theme and sidebar state from localStorage on init
  - [ ] Test: toggle sidebar persists to localStorage
  - [ ] Test: theme switch and hydrate on app start
  - [ ] Test: modal open/close

## State & Data — WebSocket Store

- [ ] Implement `src/stores/websocket-store.ts`
  - [ ] State shape: `connectionStatus`, `reconnectAttempts`, `notifications[]`, `lastEvent`
  - [ ] Action: `setConnecting()` / `setConnected()` / `setReconnecting()` / `setDisconnected()`
  - [ ] Action: `addNotification(notification)`
  - [ ] Action: `markAsRead(notificationId)`
  - [ ] Test: connection status transitions
  - [ ] Test: notification add and mark read

## State & Data — Cache Layer

- [ ] Implement `src/stores/cache-store.ts`
  - [ ] Cache entry type: `{ data, timestamp, ttl }`
  - [ ] Configure default TTL per entity type (issues: 30s, projects: 60s, cycles: 60s)
  - [ ] `get(key)` — return cached value if within TTL, null if expired/miss
  - [ ] `set(key, data, ttl?)` — store with timestamp
  - [ ] `invalidate(key)` — remove specific entry
  - [ ] `invalidateByPrefix(prefix)` — remove all entries matching prefix
  - [ ] `clear()` — remove all entries (on logout)
  - [ ] LRU eviction when exceeding maxSize
  - [ ] Stale-while-revalidate: if past TTL, return stale + trigger background refresh
  - [ ] Test: cache hit within TTL returns data, no fetch
  - [ ] Test: cache miss triggers fetch
  - [ ] Test: invalidation on mutation removes entry
  - [ ] Test: LRU eviction

## State & Data — Selectors

- [ ] Implement `src/stores/selectors/` directory
- [ ] `selectIssuesByStatus(state)` — group issues by status, apply active filters
- [ ] `selectProjectProgress(issues, projectId)` — compute completion %
- [ ] `selectActiveCycle(cycles)` — find cycle containing current date
- [ ] `selectUnreadCount(notifications)` — count unread notifications
- [ ] `selectFilteredIssues(issues, filters)` — pure filter function
- [ ] Memoization: use `useShallow` for components + manual memo for multi-store selectors
- [ ] Test: each selector returns correct derived data
- [ ] Test: memoized selectors don't recompute on unchanged inputs
- [ ] Test: selectors recompute on dependency change
- [ ] Test: cross-store selectors handle partial updates

## State & Data — Store Reset

- [ ] Implement `resetAllStores()` utility
  - [ ] Map of known stores to their initial state
  - [ ] Called on logout — clears all domain stores (preserves UI preferences)
- [ ] Test: reset restores initial state for each store
- [ ] Test: UI store preferences preserved on auth reset

## Components — StoreProvider

- [ ] Implement `src/stores/StoreProvider.tsx`
  - [ ] Initialize all stores on mount
  - [ ] Hydrate persisted state (auth, UI prefs)
  - [ ] Render children after hydration (or show splash)
  - [ ] States: `initialising`, `ready`, `error`
- [ ] Test: provider renders children after hydration
- [ ] Test: provider shows error state on hydrate failure

## Components — AuthGuard

- [ ] Implement `src/router/AuthGuard.tsx`
  - [ ] Read `isAuthenticated` from authStore
  - [ ] If loading → show spinner/splash
  - [ ] If unauthenticated → redirect to `/login`
  - [ ] If authenticated → render children
- [ ] Test: guard redirects unauthenticated to /login
- [ ] Test: guard renders children when authenticated

## Routing

- [ ] Wire React Router routes in `src/router/index.tsx`
  - [ ] `/login` — LoginPage (public)
  - [ ] `/` — redirect to `/issues`
  - [ ] `/issues` — IssueListPage (protected)
  - [ ] `/issues/:id` — IssueDetailPage (protected)
- [ ] Implement protected route wrapper using AuthGuard
- [ ] Login redirect — preserve original target URL
- [ ] Test: protected route redirects to /login without auth

## Integration

- [ ] Wire all stores in `src/main.tsx` via StoreProvider
- [ ] Connect login form to authStore.login()
- [ ] Connect issue list to issuesStore.loadIssues() on mount
- [ ] Connect issue detail to selectedIssueId from issuesStore
- [ ] Connect header notification badge to websocketStore selectUnreadCount
- [ ] Connect sidebar toggle to uiStore
- [ ] Connect filter controls to issuesStore setFilters/clearFilters
- [ ] Connect "New Issue" button to uiStore openModal
- [ ] Wire cache layer read-through for issues loading
- [ ] Wire cache invalidation on issue create/update/delete
- [ ] Wire authStore.hydrate() on app boot
- [ ] Wire resetAllStores() on logout

## Validation

- [ ] Unit test: authStore — login, logout, hydrate
- [ ] Unit test: issuesStore — load, filter, paginate, select
- [ ] Unit test: uiStore — sidebar, theme, modal
- [ ] Unit test: websocketStore — connection, notifications
- [ ] Unit test: cacheStore — TTL, invalidation, LRU, stale-while-revalidate
- [ ] Unit test: selectors — each selector + memoization
- [ ] Unit test: StoreProvider — init, hydrate, error
- [ ] Unit test: AuthGuard — loading, unauthenticated, authenticated
- [ ] Integration test: full auth flow — login → store update → guard allows access
- [ ] Integration test: issue list loading with cache layer
- [ ] Integration test: filter → selector update → UI re-render

## Review

- [ ] Verify all stores follow the interface pattern from store-architecture spec
- [ ] Verify selectors are pure and memoized
- [ ] Verify cache TTLs are set per entity type
- [ ] Verify resetAllStores preserves UI store
- [ ] Verify auth interceptor reads from authStore
- [ ] Verify all tests pass
- [ ] PR checklist: new files documented, no dead code, types correct
