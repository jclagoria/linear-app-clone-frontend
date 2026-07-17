# Architecture — Linear App Clone (Frontend)

## Overview

Single-page application built with React 19 + Vite, following a layered frontend architecture. Auth is the foundational module — initialized first, consumed by every other layer. The app uses client-side routing with React Router, Zustand for state, and Tailwind CSS + shadcn/ui for styling.

The architecture follows **feature-based modular monolith**: each feature owns its components, stores, and types.

## Technical Direction

- **Architecture style**: Feature-based modular monolith
- **Frontend framework**: React 19 with Vite
- **Routing**: React Router v7 (client-side)
- **State**: Zustand (auth) + React Query (server state, future)
- **API style**: REST with fetch + interceptor pattern
- **Styling**: Tailwind CSS + shadcn/ui component primitives

## Project Structure

```
src/
  features/
    auth/
      components/     # LoginForm, AuthGuard, UserAvatar
      stores/         # AuthStore (Zustand)
      types/          # Auth types (User, Tokens, AuthState)
      api/            # login(), logout(), refresh()
      hooks/          # useAuth, useLogin
      pages/          # LoginPage, SplashPage
  components/         # Shared UI (shadcn/ui + custom)
  lib/                # API client, utils, token interceptor
  router/             # Route config, protected routes
  types/              # Global TypeScript types
```

### Auth Module Architecture

| Directory | Responsibility |
|-----------|---------------|
| `features/auth/stores/` | Zustand store: `isAuthenticated`, `user`, `accessToken`, `isLoading` |
| `features/auth/api/` | `login()`, `logout()`, `refresh()` — fetch wrappers |
| `features/auth/components/` | LoginForm, AuthGuard, UserAvatar |
| `features/auth/hooks/` | `useAuth` (store selector), `useLogin` (form handler + validation) |
| `features/auth/pages/` | LoginPage, SplashPage (route-level components) |

### Shared Layer

| Directory | Responsibility |
|-----------|---------------|
| `components/` | Design-system components (Button, Input, ErrorBanner, Spinner) using shadcn/ui primitives |
| `lib/` | API client with auth interceptor, token management |
| `router/` | Route definitions, AuthGuard wrapper, navigation utilities |

## State Management

- **Auth state**: Zustand store — holds `accessToken`, `user`, `isAuthenticated`, `isLoading`
- **Server state** (future): React Query — API data caching, optimistic updates
- **Client state**: Zustand stores for UI state (theme, sidebar, etc.)

### AuthStore Interface

```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  refreshAccessToken: () => Promise<string>;
}
```

## Data Flow

```
User                    AuthStore                    API (Backend)
  |                         |                            |
  |-- login(email, pw) ---->|                            |
  |                         |-- POST /auth/login ------->|
  |                         |<-- { access, refresh } ----|
  |                         |                            |
  |                         |-- store access in memory    |
  |                         |-- refresh in httpOnly cookie|
  |                         |                            |
  |<-- isAuthenticated: true|                            |
  |                         |                            |
  |-- (API call) ---------->|                            |
  |                         |-- interceptor checks token  |
  |                         |-- if expired: refresh ---->|
  |                         |<-- new access token -------|
  |                         |-- attach Bearer token      |
  |                         |-- fetch() -------------->|
  |<-- response ------------|                            |
```

## Boot Sequence

```
App mount
  → AuthStore.hydrate()     // check refresh cookie
  → isLoading = true
  → [SplashScreen shown]
  → if refresh valid:
      → fetch new access token
      → isAuthenticated = true
      → render protected app
  → if refresh invalid/missing:
      → isAuthenticated = false
      → redirect to /login
```

## Security

- **Access token**: In-memory only (Zustand state) — never persisted to localStorage/sessionStorage
- **Refresh token**: httpOnly secure cookie — set by backend, not accessible to JS
- **Token injection**: Fetch interceptor reads `accessToken` from AuthStore, attaches `Authorization: Bearer <token>`
- **Auto-refresh**: Interceptor checks token expiry before each request; silent refresh if near expiry
- **Logout**: Clears in-memory token, calls backend to clear refresh cookie, redirects

## Current Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture | Feature-based modular monolith | Direct mapping to features, easy to navigate, no over-engineering |
| Framework | React 19 + Vite | Latest React, fast dev, SPA-appropriate |
| State | Zustand | Minimal, works outside React, perfect for auth |
| Styling | Tailwind CSS + shadcn/ui | Rapid dev, accessible primitives, design-system aligned |
| Routing | React Router v7 | Standard, nested routes, loader/action pattern |
| Auth | JWT dual token | Stateless, secure refresh rotation |
| API | REST + fetch | No additional deps, easy interceptor pattern |
