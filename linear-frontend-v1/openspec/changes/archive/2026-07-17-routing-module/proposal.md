# Routing Module — Navigation & Route Matching

## Problem Statement

The Linear App Clone requires URL-based navigation to display different pages (Issues, Projects, Cycles, Settings, etc.) and to support deep-linking, shareable URLs with filter state, and browser history navigation (back/forward). Currently no routing infrastructure exists — page components have no way to mount based on URL, extract dynamic segments, or navigate programmatically between views.

## Motivation

URL-based routing is the foundation of a multi-page SPA. Without it, users cannot bookmark pages, share filtered views, or use browser navigation. A routing module enables:

- Direct navigation to specific issues, projects, and cycles via URL
- Persisting filter state in query parameters for sharing
- Sidebar highlighting of the active route for orientation
- Auth-protected routes via guard integration
- Standard browser back/forward behaviour

## Scope

- **In scope**:
  - Route configuration mapping URL patterns to page components
  - Dynamic path parameter extraction (e.g., `/issues/:id`, `/projects/:id`)
  - Query parameter persistence for filter state
  - Programmatic navigation helper for post-action redirects
  - 404 catch-all page for unmatched routes
  - Browser history integration (back/forward navigation)
  - Current route detection for sidebar active-state highlighting
  - Auth guard integration (redirect unauthenticated users to `/login`)
  - Feature-level directory for route definitions under `src/router/`

- **Out of scope**:
  - Data fetching or preloading on route enter (handled by page components)
  - Route-level code splitting or lazy loading
  - Nested route layouts or outlet patterns beyond top-level pages
  - Role-based or feature-flag route guards

## Impact

The Routing Module is consumed by every page component in the application. It defines the top-level navigation structure and integrates with:

- **Auth Module** — AuthGuard wraps protected routes
- **Layout Module / Sidebar** — reads current route to highlight active nav item
- **All feature pages** (Issues, Projects, Cycles, Settings) — mounted by the router
- **URL state** — query parameters reflect and drive filter state
