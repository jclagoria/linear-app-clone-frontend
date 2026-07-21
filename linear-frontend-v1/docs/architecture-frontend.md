# Architecture — Linear App Clone (Frontend)

## Overview

SPA built with React 19 + Vite 8, using Feature-Sliced Design (FSD) for module organization. State is managed via Zustand with optimistic updates and MSW for API mocking during development and testing.

The architecture follows Feature-Sliced Design: clear layer boundaries enforced by eslint-plugin-boundaries, with `entities/`, `features/`, `pages/`, `shared/`, `widgets/`, and `app/` slices.

## Technical Direction

- **Architecture style**: Feature-Sliced Design (FSD)
- **Frontend framework**: React 19 with Vite 8 CSR
- **API style**: REST with JSON (OpenAPI 3.1 contract)
- **State pattern**: Zustand for client state; MSW handlers for API simulation
- **Forms**: react-hook-form + Zod validation
- **Real-time**: SSE for live updates

## Project Structure

```
src/
  app/          # App shell, router, providers
  pages/        # Route-level page components
  features/     # User-facing features (auth, issues, etc.)
  entities/     # Business entities (issue, project, user)
  widgets/      # Compositional UI blocks (sidebar, header)
  shared/       # Reusable UI kit, lib, types
  __tests__/    # Integration-level tests
```

### FSD Layer Rules

| Layer | Responsibility | Examples |
|-------|---------------|----------|
| `app/` | App initialization, router, global providers | `App.tsx`, `router.tsx`, `StoreProvider.tsx` |
| `pages/` | Route pages, composes features + widgets | `IssueDetailPage.tsx`, `DashboardPage.tsx` |
| `features/` | User-facing actions with business logic | `auth/`, issue create/edit flows |
| `entities/` | Business entities, store, API, UI parts | `issue/` (store, API, IssueCard, IssueForm) |
| `widgets/` | Reusable composition of shared + entities | `Sidebar/`, `Header/` |
| `shared/` | UI primitives, lib utils, types | `ui/Button.tsx`, `api/client.ts` |

### Dependency Direction

```
pages/      → features, widgets, entities, shared, app
features/   → entities, shared (NOT other features)
widgets/    → entities, shared, features
entities/   → shared (NOT features or pages)
shared/     → itself, node_modules (NOT features, entities, pages)
app/        → all layers (composition root)
```

## State Management

- **Server state**: Zustand stores with action thunks for API calls; cache invalidation via store actions
- **Client state**: Zustand (auth, UI state, theme)
- **Optimistic updates**: Store actions save previous state before API call, roll back on failure
- **Real-time state**: SSE events update Zustand stores directly

### Data Flow

```
User Action → Page/Feature → Store Action
  → optimistic update (save previous)
  → API call (fetch/axios)
    → success: confirm update, invalidate related caches
    → failure: rollback to previous state, show toast
```

## Component Design

- React functional components with hooks
- Design-system components in `shared/ui/` (Button, Modal, Select, Toast, etc.)
- Entity-specific UI in `entities/*/ui/` (IssueCard, IssueForm, CommentList)
- Forms validated client-side (Zod schema) + server-side (API response)

## Security

- **Auth**: JWT dual token — access (short-lived, in-memory) + refresh (httpOnly cookie)
- **API calls**: Bearer token in Authorization header; refresh on 401
- **Protected routes**: AuthGuard component wraps authenticated pages
- **Rate limiting**: Toast notification on 429 responses

## Current Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture | Feature-Sliced Design | Clear layer boundaries, enforced by eslint-plugin-boundaries |
| Framework | React 19 + Vite 8 | CSR sufficient for this app; fast dev experience |
| State | Zustand 5 | Simple, hook-based, optimistic update friendly |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration |
| Routing | react-router-dom v7 | SPA routing, lazy loading |
| Forms | react-hook-form + Zod | Type-safe validation, minimal re-renders |
| Testing | Vitest + Testing Library + Playwright | Fast unit tests, reliable E2E |
| API | REST (OpenAPI 3.1) | Design-first contract, clear documentation |
