# Tasks — Routing Module (Frontend)

## Scaffold

- [x] Init `src/pages/IssuesPage.tsx`, `ProjectsPage.tsx`, `CyclesPage.tsx`, `SettingsPage.tsx` — stub components returning a placeholder heading
- [x] Init `src/pages/IssueDetailPage.tsx`, `ProjectDetailPage.tsx` — stub detail pages reading route params
- [x] Init `src/pages/NotFoundPage.tsx` — 404 page with "Page not found" message and "Go to Dashboard" link
- [x] Init `src/pages/DashboardPage.tsx` — main app landing page

## Components

- [x] Create `src/widgets/Sidebar/ui/Sidebar.tsx` — app shell sidebar with nav links, expand/collapse toggle, mobile overlay
- [x] Create `src/widgets/Sidebar/ui/NavLink.tsx` — nav item with icon, label, active indicator, aria-current support
- [x] Create `src/widgets/Sidebar/model/useActiveRoute.ts` — hook using `useLocation()` + `matchPath()` for parent-route matching
- [x] Create `src/widgets/Sidebar/index.ts` — barrel export
- [x] Create `src/shared/ui/Breadcrumb.tsx` — route indicator component with aria-label="Breadcrumb" and aria-current support

## State & Data

- [x] Create `src/shared/stores/uiStore.ts` — Zustand store for sidebar collapsed/expanded state (persisted to localStorage)
- [x] Create `src/shared/lib/useDocumentTitle.ts` — hook to update document `<title>` on route change

## Routing

- [x] Update `src/app/router.tsx` — add proper route objects for `/issues`, `/issues/:id`, `/projects`, `/projects/:id`, `/cycles`, `/settings` inside AuthGuard layout
- [x] Replace `*` catch-all `Navigate` → `NotFoundPage`
- [x] Remove separate `/splash` route; integrate splash into App boot sequence before RouterProvider renders
- [x] Update `src/app/App.tsx` — read `useAuthStore.isLoading` and render `<SplashPage />` conditionally before `<RouterProvider>`
- [x] Update `src/app/AppLayout.tsx` — Shell layout composing Sidebar + `<Outlet />`
- [x] Verify AppLayout renders sidebar alongside main content area

## Integration

- [x] Wire sidebar nav links to React Router's `<NavLink>` or custom `navigate()` calls
- [x] Verify post-login redirect preserves `?redirect=` param and navigates to original destination after auth success
- [x] Verify 404 page navigation to "/" triggers auth guard then dashboard
- [x] Verify browser back/forward works correctly across all route transitions

## Validation

- [x] Unit tests for `useActiveRoute` — exact match, parent match, no match, edge cases
- [x] Unit tests for `uiStore` sidebar toggle/persist behaviour
- [x] Unit tests for `useDocumentTitle` — title updates on route change
- [x] Unit tests for `NotFoundPage` — renders heading, message, navigation link
- [x] Integration tests for router config — each registered route renders expected component
- [x] Integration tests for AuthGuard — authenticated passes through, unauthenticated redirects to /login with ?redirect param
- [x] Integration tests for splash-to-app transition — loading → hidden flow
- [ ] E2E tests for sidebar navigation — click each nav link, verify URL and active state
- [ ] E2E tests for 404 page — navigate to unknown URL, verify NotFoundPage, click "Go to Dashboard"
- [ ] E2E tests for browser history — navigate pages, back/forward buttons work
- [ ] E2E tests for protected route redirect — access protected route without auth, login, land on original destination

## Review

- [x] Self-review: verify every route from spec/routing.md has a corresponding entry in router.tsx
- [x] Self-review: confirm all components map to design-frontend.md component tree
- [x] Self-review: verify accessibility contracts (aria-current, aria-label, focus management, document title)
- [x] Self-review: lint (`pnpm lint`) and typecheck (`pnpm typecheck`) pass
- [x] Self-review: `pnpm test:run` and `pnpm test:e2e` pass
