# Architecture — Frontend

## Overview

The Linear App Clone frontend is a single-page application (SPA) built with React 19, TypeScript, and Vite. It follows a feature-slice architecture with shared modules for cross-cutting concerns. Auth guards, API clients, and websocket connections are layered at the app boundary.

The architecture follows **feature-first modular monolith**: each domain (work, projects, cycles, auth) is self-contained with its own store, components, types, and API calls. Shared infrastructure lives in `src/shared/`.

## Technical Direction

- **Architecture style**: Feature-slice modular monolith
- **Framework**: React 19 with react-router-dom v7
- **Routing**: react-router-dom v7 nested layouts with AuthGuard + AppLayout
- **API style**: REST with JSON, custom interceptor-based ApiClient
- **State management**: Zustand v5 stores per domain, selectors for derived data
- **Styling**: Tailwind CSS v4 with design-system tokens as CSS custom properties

## Project Structure

```
src/
  app/              # App shell: router, layouts, providers
  pages/            # Top-level route pages
  entities/         # Domain entities (session, issue, etc.)
    session/
      model/        # Zustand store
      api/          # API calls
      ui/           # Auth UI (AuthGuard)
  features/         # Feature modules (coming soon)
  shared/           # Cross-cutting shared code
    lib/            # API client, utils
    stores/         # Shared stores (websocket, notifications)
    ui/             # Shared primitives (Button, Input, Modal, etc.)
    types/          # Shared TypeScript types
  __tests__/        # Integration / module-level tests
```

### Frontend — React SPA (Vite)

| Directory | Responsibility |
|-----------|---------------|
| `src/app/` | Router config, app layouts, providers |
| `src/pages/` | Route page components (one per route) |
| `src/entities/` | Domain modules with store, API, UI |
| `src/shared/lib/` | ApiClient, auth helpers, utilities |
| `src/shared/stores/` | Cross-domain state (websocket, notifications) |
| `src/shared/ui/` | Design-system primitives (Button, Input, Badge, Modal, etc.) |
| `src/shared/types/` | Shared TypeScript interfaces |

## Component Design

### Frontend

- **React 19** with functional components and hooks.
- **react-router-dom v7** for routing with nested layouts (`AppLayout` wraps authenticated pages).
- **AuthGuard** wraps the app layout — redirects to `/login` if no session.
- **Design-system components** in `src/shared/ui/` are co-located with tests and follow consistent API (cva for variants, tailwind-merge for class composition).
- **API client** wraps fetch with interceptor pipeline (auth token injection, 401 retry with single-flight refresh).
- **Forms** validated client-side with react-hook-form + Zod schemas.
- **Domain stores** (Zustand) follow consistent pattern: `model/store.ts`, typed actions, selectors in `selectors/`.

## State Management

- **Server state**: Fetched on demand via ApiClient, stored in Zustand domain stores (no React Query — keeping it simple).
- **Client state**: Zustand stores per domain — auth, issues, projects, cycles, UI preferences.
- **Cross-cutting state**: Websocket store in `src/shared/stores/` for real-time notifications.
- **Derived state**: Memoized selectors via `createMemoizedSelector` in `src/shared/stores/selectors/`.

## Data Flow

```
Page Component
    |
    |-- mounts --> reads from Zustand store (useIssueStore)
    |                    |
    |                    |-- no data? --> dispatches fetchIssues()
    |                    |                    |
    |                    |                    |-- ApiClient.get('/issues')
    |                    |                    |       |
    |                    |                    |       |-- interceptor: injects Bearer token
    |                    |                    |       |-- fetch() --> server
    |                    |                    |       |-- interceptor: 401? refresh + retry
    |                    |                    |       |-- response --> JSON
    |                    |                    |
    |                    |               store.setIssues(data)
    |                    |
    |               re-renders with data
    |
    |-- User clicks filter --> store.setFilter(...) --> re-render
    |-- User clicks card --> router.navigate('/issues/:id')
```

## Security

- **Auth**: JWT dual token — access (short-lived, in-memory) + refresh (httpOnly cookie).
- **API Client**: Auto-injects `Authorization: Bearer <token>` via request interceptor. On 401, triggers single-flight token refresh and retries.
- **Route protection**: `AuthGuard` component checks session store; redirects unauthenticated users to `/login`.
- **Error format**: Backend returns RFC 7807 Problem Details; `ApiError` class maps status codes to typed errors.

## Current Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture | Feature-slice modular monolith | Clear domain boundaries, scales well for medium app |
| Framework | React 19 + Vite | Existing, fast DX, SPA model fits project needs |
| State | Zustand v5 | Existing, minimal, works outside React |
| Styling | Tailwind CSS v4 | Existing, utility-first, design-system tokens |
| Routing | react-router-dom v7 | Existing, nested layouts, loaders |
| API Client | Custom fetch-based | Existing, interceptor pipeline, lightweight |
| Validation | react-hook-form + Zod | Existing, performant, shared schemas |
| Testing | Vitest + Playwright | Existing, fast, Vite-native |
