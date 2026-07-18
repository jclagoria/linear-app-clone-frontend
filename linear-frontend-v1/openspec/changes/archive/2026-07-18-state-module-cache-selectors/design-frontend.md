# State Module: Cache & Selectors — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| State library | Zustand | Minimal boilerplate, subscriptions outside React, TS-first | No devtools middleware built-in |
| Cache layer | Zustand store + manual TTL map | Lightweight, no extra deps, fine-grained control | Must implement LRU eviction manually |
| Selectors | Zustand `useShallow` + custom memoized fns | Reuses Zustand's built-in equality checks | Need explicit dependency tracking for multi-store selectors |
| Store isolation | Separate Zustand stores per domain | No cross-store coupling, easy reset on logout | Cross-store selectors must combine manually |
| Persistence | Zustand `persist` middleware (localStorage) | Built-in, configurable serialize/deserialize | Secure tokens not in localStorage |

## Component Tree

```
<App>
  <StoreProvider>
    <AuthGuard>
      <AppShell>
        <Sidebar>
          <NavItem />          — Issues, Board, Projects
          <ProjectList />
          <CycleList />
          <UserInfo />
        </Sidebar>
        <Header>
          <Breadcrumb />
          <SearchToggle />
          <NotificationBadge />  — selectUnreadCount
          <UserAvatar />         — DropdownMenu
        </Header>
        <main>
          <Routes>
            <LoginPage />        — public
            <IssueListPage />    — protected
            <IssueDetailPage />  — protected
          </Routes>
        </main>
        <IssueFormModal />       — activeModal === "issue-form"
      </AppShell>
    </AuthGuard>
  </StoreProvider>
</App>
```

| Component | Responsibility | Props | State |
|-----------|---------------|-------|-------|
| StoreProvider | Init + provide all stores | children | initialising, ready, error |
| AuthGuard | Gate protected routes | children | loading, authenticated, unauthenticated |
| AppShell | Layout frame (sidebar + header + content) | children | — |
| Sidebar | Primary navigation, collapsible | — | expanded, collapsed |
| NavItem | Single nav link, active state | to, icon, label | active, inactive |
| NotificationBadge | Unread count indicator | count | has-unread, empty |
| Header | Breadcrumb, search, user area | — | — |
| LoginPage | Email/password form | — | empty, loading, error |
| IssueListPage | Filter bar + paginated table | — | loading, populated, empty, error |
| IssueDetailPage | Single issue + comments | issueId | loading, populated, error |
| IssueFormModal | Create/edit modal overlay | issue? (edit mode) | empty, loading, error, success |

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| `/login` | LoginPage | public | Redirect to `/` if already authenticated |
| `/` | IssueListPage | protected | Default dashboard |
| `/issues` | IssueListPage | protected | Full issue list with filters |
| `/issues/:id` | IssueDetailPage | protected | Single issue view |
| `/board` | BoardPage (future) | protected | Kanban view |
| `/projects/:id` | ProjectPage (future) | protected | Project issues |

## State Management

- **Global state** (Zustand stores):
  - `authStore` — user, tokens, isAuthenticated, isLoading
  - `issuesStore` — issues[], selectedIssueId, filters, cursor, hasMore
  - `uiStore` — sidebarCollapsed, theme, activeModal, keyboardContext
  - `websocketStore` — connectionStatus, reconnectAttempts, notifications[], lastEvent
- **Derived state**: Custom memoized selectors — `selectIssuesByStatus`, `selectProjectProgress`, `selectActiveCycle`, `selectUnreadCount`
- **Cache layer**: `cacheStore` — Map<key, { data, timestamp, ttl }> with LRU eviction
- **Local state**: Form input values, validation errors, dropdown open/close

## Data Fetching

- **Client**: Plain `fetch()` with auth interceptor (reads `accessToken` from authStore)
- **Cache strategy**: Cache-first with stale-while-revalidate. TTLs by entity type (issues: 30s, projects: 60s, cycles: 60s)
- **Error handling**: ErrorBanner component driven by store error state. Retry button for fetch failures
- **Optimistic updates**: Pessimistic (wait for API response before updating store). Cache invalidation triggered after mutation success
- **Mutation flow**: Component dispatch → store action → API call → on success: update store + invalidate cache → on error: set store error + revert
- **Revalidation on focus**: Optional — pages refetch stale cache entries on window focus (configurable per store)

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| Login page illustration | `assets/login-illustration.svg` | Optional decorative |
| App logo | `assets/logo.svg` | Sidebar header |
| User avatar fallback | `assets/avatar-placeholder.svg` | When user has no image |
| Icons | `lucide-react` package | All interactive icons |
| Font | Inter (Google Fonts) | Body + headings |
| Font | JetBrains Mono (Google Fonts) | Mono code/IDs |

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| Login email | Required, email format | "Please enter a valid email" |
| Login password | Required, min 8 chars | "Password must be at least 8 characters" |
| Issue title | Required, max 255 chars | "Title is required" / "Title must be 255 characters or fewer" |
| Issue description | Optional | — |
| Issue status | Must be valid workflow state | "Invalid status" |
| Issue priority | Must be 0-4 | "Invalid priority" |
| Assignee | Optional (null = unassigned) | — |
| Labels | Optional (empty array = none) | — |
| Email format | RFC 5322 simplified regex | "Invalid email format" |
| API errors | Server validation errors mapped to fields | Displayed inline or as banner |

## Accessibility

- **Keyboard navigation**:
  - Sidebar: Arrow keys to navigate items, Enter to select
  - Issue list: Tab through filters → table → load more; Enter on row opens detail
  - Issue form: Tab between fields, Escape closes modal, Enter to submit
  - Global shortcuts: `n` new issue, `e` edit (detail), `/` focus search
- **ARIA**:
  - Sidebar: `role="navigation"`, `aria-label="Main navigation"`
  - Modals: `role="dialog"`, `aria-modal="true"`, focus trap
  - Error banners: `role="alert"` for live region
  - Notifications: `aria-live="polite"` on count
  - Loading: `aria-busy="true"` on parent container
- **Screen reader**:
  - Heading hierarchy: h1 per page, h2 for sections
  - Icon-only controls: descriptive `aria-label`
  - Status badges: text label + color (never color alone)
  - Empty states: descriptive text, not just icon
  - Connection status: `aria-live="polite"` on connection indicator
