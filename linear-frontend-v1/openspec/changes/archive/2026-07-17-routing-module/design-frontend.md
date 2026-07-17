# Routing — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| Router library | React Router v7 (createBrowserRouter) | Standard SPA router, nested route trees, loader/action pattern for future data-loading | Heavier than wouter or react-location; no built-in lazy loading |
| Route config | Central config module at `src/router/routes.ts` | Single source of truth for all routes; easy to audit auth guards and add new pages | Every route change touches one file; could grow large |
| Auth guard | Wrapper component (`AuthGuard`) using Zustand `useAuthStore` | Reuses existing auth store; no need for route-level loaders or React Router context | Guard runs after route match, not before — brief flash possible |
| Sidebar active state | `useLocation()` + `useMatch()` in a custom `useActiveRoute` hook | Leverages React Router's built-in path matching for parent-route detection | Computes on every render; trivial cost |
| Query param state | React Router's `useSearchParams()` + URLSearchParams | Native to React Router, no extra deps; filters read/write directly to URL | Filter state not persisted in Zustand; re-mount on nav clears local filter state |
| Splash / auth hydration | Top-level loading state in App before `<RouterProvider>` renders | Prevents any route from mounting until auth is known; avoids guard redirect flash | App component holds conditional render logic |
| 404 catch-all | React Router's catch-all `*` route as last child | Native pattern; returns NotFoundPage component | Cannot distinguish server 404 from client 404 (all client-side) |
| History integration | `createBrowserRouter` with default browser history | HTML5 History API; back/forward work natively | Requires Vercel SPA fallback rewrite rule for direct URL access |

## Component Tree

```
<App>
  <AuthStore.hydrate()>
  {isLoading
    ? <SplashPage />
    : <RouterProvider router={router}>
        <Shell>
          <Sidebar />
          <main>
            <Outlet />
          </main>
        </Shell>
      </RouterProvider>
  }
```

**Route-level component hierarchy** (inside the router):

```
<AuthGuard>                          // wraps protected groups
  <DashboardPage />                  // route: /
  <IssuesPage />                     // route: /issues
  <IssueDetailPage />                // route: /issues/:id
  <ProjectsPage />                   // route: /projects
  <ProjectDetailPage />              // route: /projects/:id
  <CyclesPage />                     // route: /cycles
  <SettingsPage />                   // route: /settings
</AuthGuard>
<LoginPage />                        // route: /login (public)
<NotFoundPage />                     // route: * (catch-all)
```

### Page Components

| Component | Responsibility | Props | States |
|-----------|---------------|-------|--------|
| SplashPage | Full-screen loading overlay during auth hydration | none | loading → hidden (auto-dismiss) |
| LoginPage | Email/password authentication form | none | default, loading (submitting), error (invalid creds), success (triggers redirect) |
| DashboardPage | Main app landing after login | none | loading (data fetch), populated (metrics/recent items) |
| IssuesPage | Issue list with filter controls | none | loading, populated, empty (no issues match filter), error |
| IssueDetailPage | Single issue detail view | none (reads `:id` param) | loading, populated, error (404/forbidden), not-found |
| ProjectsPage | Project list | none | loading, populated, empty, error |
| ProjectDetailPage | Single project detail | none (reads `:id` param) | loading, populated, error, not-found |
| CyclesPage | Cycles list | none | loading, populated, empty, error |
| SettingsPage | User preferences | none | loading, populated, saving, error |
| NotFoundPage | 404 unmatched route | none | default (static, single state) |

### Shared Components

| Component | Responsibility | Props | States |
|-----------|---------------|-------|--------|
| Sidebar | App navigation shell with route links | `collapsed: boolean`, `onToggle: () => void` | expanded, collapsed, mobile-overlay |
| NavLink | Individual sidebar nav item | `to: string`, `icon: ReactNode`, `label: string` | default, hover, active, collapsed (icon-only) |
| RouteLink | Inline navigation link | `to: string`, `icon?: ReactNode` | default, hover, visited, focus |
| AuthGuard | Route protection wrapper | `children: ReactNode` | authenticating (brief), authenticated (pass-through), unauthenticated (redirect) |
| Breadcrumb | Current location path indicator | `segments: {label, href?}[]` | default, truncated |

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| `/login` | LoginPage | Public | No sidebar shown |
| `/` | DashboardPage | Protected | App root after login |
| `/issues` | IssuesPage | Protected | Query params: `?status=`, `?assignee=`, `?priority=` |
| `/issues/:id` | IssueDetailPage | Protected | `:id` = issue UUID |
| `/projects` | ProjectsPage | Protected | Project list |
| `/projects/:id` | ProjectDetailPage | Protected | `:id` = project UUID |
| `/cycles` | CyclesPage | Protected | Cycle list |
| `/settings` | SettingsPage | Protected | User preferences |
| `*` | NotFoundPage | Public | Catch-all — always last route |

### Route Config Structure (`src/router/routes.ts`)

```
export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <AuthGuard />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'issues', element: <IssuesPage /> },
      { path: 'issues/:id', element: <IssueDetailPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:id', element: <ProjectDetailPage /> },
      { path: 'cycles', element: <CyclesPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
];
```

## State Management

- **Global state (Zustand)**: `useAuthStore` — `isAuthenticated`, `user`, `accessToken`, `isLoading`, `error`. Hydrated once on app mount. Consumed by AuthGuard for route protection and by the fetch interceptor for token injection.
- **Route-derived state**: Current route, path params, and search params live in React Router context (not Zustand). Components use `useParams()`, `useSearchParams()`, `useLocation()`, and `useMatches()` to read them. Sidebar reads current route via `useLocation().pathname` and `useMatch()` for parent-route matching.
- **Local state**: Sidebar collapsed/expanded toggle stored as local React state or persisted in localStorage via a small Zustand `useUIStore`. Filter selections on IssuesPage read/write URL search params — no local state duplication.

### Active Route Hook (`useActiveRoute`)

```
function useActiveRoute(): { isActive: (path: string) => boolean; currentPath: string }
```

Returns a matcher function checking `useMatch({ path, end: false })` — matches parent routes so `/issues/abc-123` highlights the "Issues" nav link.

### Post-Login Redirect State

- Stored as URL query param (`?redirect=/issues`) by AuthGuard before redirecting to `/login`
- LoginPage reads `searchParams.get('redirect')` on success and navigates there
- No Zustand store needed — redirect target lives in the URL

## Data Fetching

- **Client**: Native `fetch()` via a shared `apiClient` in `src/lib/api-client.ts` with an auth interceptor that reads `accessToken` from `useAuthStore`. No Axios or GraphQL.
- **Error handling**: Per-page error states managed locally. A shared `ErrorBanner` component displays fetch errors with a retry action. Network errors show a toast notification via a future toast store.
- **Optimistic updates**: Not used in the routing module. Data mutation (create issue, update project) is handled by feature pages. Use pessimistic updates with loading spinners for now — React Query will be introduced later for server-state caching and optimistic UI.
- **Loading states**: Each page component manages its own `isLoading` flag. SplashPage is the only route-level loading state (auth hydration).

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| Lucide icons | `lucide-react` package | Used for sidebar nav icons, inline RouteLink icons |
| App logo | `public/logo.svg` | SplashPage display |
| Font: Inter | `next/font` or `@fontsource/inter` | Body and heading font family |
| Favicon | `public/favicon.ico` | Browser tab icon |
| Sidebar collapse icon | `lucide-react` (`PanelLeftClose`, `PanelLeftOpen`) | Collapse toggle button |
| Spinner | CSS-only (Tailwind `animate-spin`) | SplashPage loading indicator; no asset file needed |

Icons from `lucide-react` to use per nav item:

| Nav Item | Lucide Icon |
|----------|-------------|
| Dashboard | `LayoutDashboard` |
| Issues | `ListTodo` or `CircleDot` |
| Projects | `FolderKanban` |
| Cycles | `RefreshCw` |
| Settings | `Settings` |

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| Route param `:id` (issue) | Must be a valid team-key format or UUID (e.g., `LAG-21`, `abc-123`) | "Invalid issue identifier" |
| Route param `:id` (project) | Must be a valid project slug or UUID | "Invalid project identifier" |
| Query param `status` | Must match a known workflow status key (`todo`, `in-progress`, `done`, `backlog`, `cancelled`) | — (invalid values silently ignored) |
| Query param `assignee` | Must be `me` or a valid user UUID | — (invalid values silently ignored) |
| Query param `priority` | Must be `0`, `1`, `2`, `3`, or `4` | — (invalid values silently ignored) |
| Redirect param | Must be a valid app URL (path only, no external) | — (invalid redirect falls back to `/`) |

Validation is applied in page components when reading route params, not at the router level. Route params that fail validation render the page in an error state rather than throwing a navigation error.

## Accessibility

- **Keyboard navigation**: Sidebar nav links are keyboard-focusable `<button>` or `<a>` elements. Tab order follows visual order (sidebar first, then main content). Collapse/expand toggle is a `<button>` with `aria-label`. On mobile, Escape key closes the sidebar overlay.
- **ARIA**: Sidebar uses `role="navigation"` or `<nav aria-label="Main navigation">`. Active nav link gets `aria-current="page"`. Breadcrumb uses `<nav aria-label="Breadcrumb">` with `aria-current="page"` on the last segment. SplashPage uses `role="status"` and `aria-live="polite"`. NotFoundPage uses `<main role="alert">`.
- **Screen reader**: Document `<title>` updates on route change to reflect the current page (e.g., "Issues — Linear Clone"). SplashPage announces "Loading..." via live region. Sidebar nav links include visible labels — no icon-only navigation without text equivalents. Route changes trigger focus management: focus moves to the page `<h1>` on navigation (not to the top of the page).
- **Focus management**: On route transition, focus is programmatically moved to the main content area heading. SplashPage auto-dismisses with no focusable elements. NotFoundPage moves focus to its `<h1>` on mount. Sidebar mobile overlay traps focus while open.
- **Target size**: NavLink targets are ≥36px height (exceeds WCAG 2.5.8 minimum of 24×24px). Collapse toggle is ≥24×24px.
