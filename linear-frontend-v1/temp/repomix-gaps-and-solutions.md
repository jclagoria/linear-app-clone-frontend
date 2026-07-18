# Repomix Reference Validation — Gaps & Solutions

> **Generated:** 2026-07-17  
> **Source:** `references/tech-research-digest.md`  
> **Project:** `linear-app-clone` (linear-frontend-v1)  
> **Type:** Gap remediation document

---

## Table of Contents

1. [🔴 Blocker: Refresh Token in localStorage (Security)](#1--blocker-refresh-token-in-localstorage-security)
2. [🟡 Decision: Migrate Custom CacheStore to TanStack Query](#2--decision-migrate-custom-cachestore-to-tanstack-query)
3. [🟡 Suggestion: Centralize MSW Handlers](#3--suggestion-centralize-msw-handlers)
4. [🟡 Suggestion: Add CI/CD Pipeline](#4--suggestion-add-cicd-pipeline)
5. [🟡 Suggestion: Add Dockerfile for Containerization](#5--suggestion-add-dockerfile-for-containerization)
6. [🟡 Suggestion: Co-locate Tests with Source Files](#6--suggestion-co-locate-tests-with-source-files)
7. [💭 Nit: Add Docker Compose for Local Dev](#7--nit-add-docker-compose-for-local-dev)
8. [Implementation Roadmap](#8-implementation-roadmap)

---

## 1. 🔴 Blocker: Refresh Token in localStorage (Security)

**Location:** `src/entities/session/model/store.ts` (lines 18–36)  
**Digest Directive:** *"HttpOnly cookies or token in memory — XSS-safe token storage"*

### Problem

The refresh token is stored in `localStorage` under the key `linear_refresh_token`:

```typescript
const REFRESH_TOKEN_KEY = 'linear_refresh_token'

function setStoredRefreshToken(token: string | null): void {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }
}
```

`localStorage` is accessible to any JavaScript running in the same origin. If an XSS vulnerability exists anywhere in the application (unsanitized user input, compromised dependency, `dangerouslySetInnerHTML`), an attacker can:

1. Read the refresh token from `localStorage`
2. Call `/auth/refresh` to obtain a new access token
3. Maintain a persistent authenticated session indefinitely

This is a **critical** finding because it violates the digest's explicit security directive.

### Solution Options

#### Option A: HttpOnly Cookies (Recommended — Best Security)

Requires a **backend change** in addition to the frontend change.

**How it works:**

```
┌─────────────┐   POST /auth/login      ┌─────────────┐
│  Frontend   │ ──────────────────────▶  │   Backend   │
│  (React)    │                          │  (API)      │
│             │ ◀──────────────────────  │             │
│             │    Set-Cookie:           │             │
│             │    refreshToken=...;     │             │
│             │    HttpOnly; Secure;     │             │
│             │    SameSite=Strict;      │             │
│             │    Path=/auth/refresh    │             │
└─────────────┘                          └─────────────┘
```

**Frontend changes (`store.ts`):**

```typescript
// Remove REFRESH_TOKEN_KEY, getStoredRefreshToken, setStoredRefreshToken

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      // ... initial state unchanged ...

      hydrate: async () => {
        set({ isLoading: true })
        try {
          const response = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            credentials: 'include', // ← sends HttpOnly cookie
          })

          if (!response.ok) {
            set({ isLoading: false, isAuthenticated: false })
            return
          }

          const json = (await response.json()) as { data: { accessToken: string } }
          set({
            accessToken: json.data.accessToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch {
          set({ isLoading: false, isAuthenticated: false })
        }
      },

      refreshAccessToken: async () => {
        // Check if current token is still valid
        const { accessToken } = get()
        if (accessToken) {
          const expiry = getTokenExpiry(accessToken)
          if (expiry - Date.now() > 60_000) return accessToken
        }

        try {
          const response = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            credentials: 'include', // ← sends HttpOnly cookie
          })

          if (!response.ok) {
            set({ user: null, accessToken: null, isAuthenticated: false })
            return null
          }

          const json = (await response.json()) as { data: { accessToken: string } }
          set({ accessToken: json.data.accessToken })
          return json.data.accessToken
        } catch {
          set({ user: null, accessToken: null, isAuthenticated: false })
          return null
        }
      },

      login: async (email: string, password: string) => {
        // ... unchanged, but backend will set the cookie ...
      },

      logout: async () => {
        try {
          await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            credentials: 'include', // ← sends HttpOnly cookie
          })
        } catch { /* best-effort */ }

        // On success, backend clears the cookie
        set({
          user: null, accessToken: null, isAuthenticated: false,
          isLoading: false, error: null,
        })
        resetDomainStores()
      },
    }),
  ),
)
```

**Key changes:**
- Remove all `localStorage` read/write for the refresh token
- Add `credentials: 'include'` to all auth-related fetch calls
- The backend sets an `HttpOnly; Secure; SameSite=Strict; Path=/auth/refresh` cookie on login
- The backend clears the cookie on logout
- The backend reads the refresh token from the cookie on `POST /auth/refresh`

**Trade-offs:**
- ✅ XSS-safe — JavaScript never touches the refresh token
- ✅ CSRF-safe with `SameSite=Strict` and `Path=/auth/refresh`
- ✅ Works across page refreshes (cookie persists)
- ❌ Requires backend changes
- ❌ CORS complexity if API is on a different domain (requires `WithCredentials` + specific `Access-Control-Allow-Origin`)

---

#### Option B: In-Memory Only (Frontend-Only Change)

**How it works:**

The refresh token is stored only in Zustand state (in memory). It is never written to `localStorage`. On page refresh, the token is lost and the user must re-authenticate.

**This is the simplest option but degrades UX** — refreshing the page logs the user out.

**Frontend changes (`store.ts`):**

```typescript
// Remove entirely:
// - REFRESH_TOKEN_KEY constant
// - getStoredRefreshToken()
// - setStoredRefreshToken()
```

**Trade-offs:**
- ✅ XSS-safe — no token in persistent storage
- ✅ Simplest frontend-only fix
- ❌ Page refresh = logout (poor UX)
- ❌ Cannot recover session after browser crash or tab close

**Mitigation for poor UX:**
- Use a very short-lived access token (e.g., 5 minutes)
- Implement a silent background refresh that happens before expiry
- Store non-sensitive session metadata (username, preferences) in localStorage for display while reloading

---

#### Option C: Keep localStorage + Add CSP Mitigations (Defense in Depth)

**How it works:**

Keep the current localStorage approach but add multiple layers of defense to make XSS exploitation harder.

**1. Add Content-Security-Policy header:**

```html
<!-- index.html or server response header -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'strict-dynamic';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  connect-src 'self' https://api.example.com;
  base-uri 'self';
  form-action 'self';
  object-src 'none';
">
```

**2. Add token rotation on every refresh:**

```typescript
refreshAccessToken: async () => {
  // ... existing logic ...
  // Backend invalidates the old refresh token and issues a new one
  // This limits the window for a stolen token
}
```

**3. Add token binding (backend required):**

Bind the refresh token to the client's TLS fingerprint or a hash of the `User-Agent` + IP on the backend. This prevents a stolen token from being used from a different device.

**4. Add short TTL on both tokens:**

- Access token: 5–15 minutes
- Refresh token: 1–7 days (depending on sensitivity)

**Trade-offs:**
- ✅ Keeps current UX (session survives page refresh)
- ✅ Defense in depth makes XSS exploitation harder
- ❌ Not a true fix — localStorage is still vulnerable if CSP is bypassed
- ❌ CSP can break legitimate scripts if not configured carefully
- ❌ Token binding increases backend complexity

---

#### Recommendation

**Go with Option A (HttpOnly Cookies)** if you control the backend. It is the only option that fully aligns with the digest's security directive.

**Go with Option B (In-Memory Only)** as a fast interim fix if backend changes cannot happen immediately. Accept the UX trade-off until Option A can be implemented.

**Do NOT choose Option C** as the sole solution — CSP is a mitigation, not a cure.

---

## 2. 🟡 Decision: Migrate Custom CacheStore to TanStack Query

**Location:** `src/shared/stores/cacheStore.ts`  
**Digest Reference:** TanStack Query listed as React state management option

### Problem

The project implements a custom in-memory cache (`cacheStore.ts`) with:
- TTL-based per-key expiry
- LRU eviction (max 100 entries)
- Stale-while-revalidate pattern
- Prefix-based cache invalidation

This reinvents functionality that TanStack Query provides out of the box. The Linear clone will require multiple data domains (issues, projects, cycles, teams, users, labels, comments, notifications) with complex cross-invalidation and request deduplication — the custom cache does not scale to this.

### Specific Pain Points (Current Code)

| Issue | Location | Impact |
|-------|----------|--------|
| Stale-while-revalidate hand-rolled | `src/entities/issue/model/store.ts:114-128` | ~15 lines of redundant fetch logic per domain |
| String-based invalidation | `src/entities/issue/model/store.ts:190,197,206` | Fragile, no type safety |
| No request deduplication | `store.ts` (entirely missing) | Two components mounting simultaneously fire two network requests |
| Pagination bypasses cache | `store.ts:137-176` | Cursor pagination has zero caching |
| Server state + UI state mixed | `store.ts:27-45` | Single Zustand store holds both issues and filters/selection |

### Decision

**Migrate from the custom `cacheStore` to TanStack Query as the server-state layer.** The threshold is already met: the app needs ≥3 data domains, request deduplication, and declarative invalidation.

| Factor | Custom CacheStore (before) | TanStack Query (after) |
|--------|---------------------------|------------------------|
| Bundle cost | ~1 KB | ~13 KB |
| Request deduplication | Not implemented | Built-in |
| Cache invalidation | Manual string prefix | Declarative `queryKey` dependencies |
| Pagination | Manual cursor tracking | `useInfiniteQuery` with cached pages |
| Optimistic updates | Manual | Built-in mutation callbacks |
| Devtools | None | React Query Devtools |
| Retry logic | None | Configurable per query |

### Migration Plan

#### Phase 1: Install & Configure

```bash
pnpm add @tanstack/react-query
```

Create `src/app/QueryProvider.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
})

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

Wrap the app in `main.tsx`:

```typescript
root.render(
  <QueryProvider>
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  </QueryProvider>,
)
```

#### Phase 2: Create API Hooks per Domain

Create `src/entities/issue/api/queries.ts`:

```typescript
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Issue } from '../model/store'

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api/v1'

async function fetchIssues(params: URLSearchParams): Promise<{ data: Issue[]; meta: { cursor: string | null; hasMore: boolean } }> {
  const res = await fetch(`${API_BASE}/issues?${params.toString()}`, {
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error('Failed to load issues')
  return res.json()
}

export const issueKeys = {
  all: ['issues'] as const,
  list: (filters: Record<string, string | null>) => ['issues', 'list', filters] as const,
  detail: (id: string) => ['issues', id] as const,
}

export function useIssues(filters: Record<string, string | null>) {
  return useInfiniteQuery({
    queryKey: issueKeys.list(filters),
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams()
      if (pageParam) params.set('cursor', pageParam)
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
      return fetchIssues(params)
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.meta.cursor ?? undefined,
  })
}

export function useCreateIssue() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => {
      const res = await fetch(`${API_BASE}/issues`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(issue),
      })
      if (!res.ok) throw new Error('Failed to create issue')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['issues'] }),
  })
}
```

#### Phase 3: Purge CacheStore from Zustand

- Remove `useCacheStore` import and usage from `src/entities/issue/model/store.ts`
- Remove `export { useCacheStore }` from `src/shared/stores/index.ts`
- Delete `src/shared/stores/cacheStore.ts`
- Delete `src/__tests__/cacheStore.test.ts`
- Remove cache clearing from `src/shared/stores/resetAllStores.ts`
- Simplify `IssuesPage.tsx` — replace manual cache reads with `useIssues()` hook

#### Phase 4: Simplify Issues Store

The Zustand `useIssuesStore` loses server-state fields. It keeps only UI state:

```typescript
interface IssuesUIState {
  selectedIssueId: string | null
  filters: IssueFilters

  selectIssue: (id: string) => void
  deselectIssue: () => void
  setFilters: (filters: Partial<IssueFilters>) => void
  clearFilters: () => void
}
```

Server state (`issues[]`, `cursor`, `hasMore`, `isLoading`, `error`, `loadIssues`, `loadNextPage`) moves entirely to TanStack Query hooks.

#### Phase 5: Adapt Tests

- `src/__tests__/issuesStore.test.ts` — rewrite to test UI state only, remove server-state assertions
- `src/__tests__/integration.test.ts` — replace direct store manipulation with `QueryClient` prefilling
- `src/__tests__/cacheStore.test.ts` — delete (or keep as memento if desired)
- Add MSW handlers for new query patterns (covered in §3)

### Downstream Doc Updates Required

The following documents reference the current cache approach and must be updated:

| Document | Changes Needed |
|----------|----------------|
| `docs/stack-frontend.md` | Add `@tanstack/react-query` to dependencies table; update state management line from "Zustand" to "Zustand + TanStack Query" |
| `docs/architecture-frontend.md` | Update State Management section: change "React Query (server state, future)" to "TanStack Query (server state)"; add QueryClientProvider to boot sequence; update Current Decisions table with TanStack Query row |

---

## 3. 🟡 Suggestion: Centralize MSW Handlers

**Location:** `src/__tests__/integration.test.ts` and `src/__tests__/loginFlow.test.ts`  
**Digest Reference:** MSW listed as part of testing stack

### Problem

MSW request handlers are defined inline in two test files with **different API base paths**:
- `integration.test.ts` uses `/api/v1`
- `loginFlow.test.ts` uses `/api`

This duplication means:
- Adding a new endpoint requires updating handlers in multiple files
- Handler logic diverges (login handler differs between test files)
- No shared handler to reuse in Playwright or Storybook

### Solution

Create a centralized handlers file:

```
src/
  mocks/
    handlers.ts       ← all shared MSW handlers
    server.ts         ← setupServer export
    browser.ts        ← setupWorker export (for Playwright)
```

#### `src/mocks/handlers.ts`

```typescript
import { http, HttpResponse } from 'msw'

export const API_BASE = '/api/v1'

export const defaultHandlers = [
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }
    if (body.email === 'valid@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        data: {
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          user: { id: '1', email: 'valid@example.com', name: 'Test User' },
        },
      })
    }
    return HttpResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 },
    )
  }),

  http.post(`${API_BASE}/auth/refresh`, () => {
    return HttpResponse.json({
      data: { accessToken: 'refreshed-token', refreshToken: 'refreshed-refresh' },
    })
  }),

  http.post(`${API_BASE}/auth/logout`, () => {
    return HttpResponse.json({ data: { success: true } })
  }),

  http.get(`${API_BASE}/issues`, ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')

    let filtered = [...mockIssues]
    if (status) filtered = filtered.filter((i) => i.status === status)

    return HttpResponse.json({
      data: filtered,
      meta: {
        cursor: filtered.length > 2 ? 'page2' : null,
        hasMore: filtered.length > 2,
      },
    })
  }),
]

const mockIssues = [
  { id: '1', title: 'Bug fix', description: 'Fix the bug', status: 'todo', priority: 1, assigneeId: 'u1', projectId: null, cycleId: null, labels: ['bug'], createdAt: '', updatedAt: '' },
  { id: '2', title: 'Add feature', description: 'New feature', status: 'in_progress', priority: 2, assigneeId: 'u1', projectId: 'p1', cycleId: null, labels: [], createdAt: '', updatedAt: '' },
  { id: '3', title: 'Documentation', description: 'Write docs', status: 'done', priority: 3, assigneeId: null, projectId: null, cycleId: null, labels: ['docs'], createdAt: '', updatedAt: '' },
]
```

#### `src/mocks/server.ts`

```typescript
import { setupServer } from 'msw/node'
import { defaultHandlers } from './handlers'

export const server = setupServer(...defaultHandlers)
```

#### Updated `integration.test.ts` (cleaner):

```typescript
import { server } from '@/mocks/server'

// beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
// afterAll(() => server.close())
// afterEach(() => server.resetHandlers())
```

#### Benefits:
- Single source of truth for API mocks
- Handlers can be extended per test with `server.use(overrideHandler)`
- Reusable in Playwright (via `setupWorker` in `browser.ts`)
- Reusable in Storybook stories

---

## 4. 🟡 Suggestion: Add CI/CD Pipeline

**Location:** Project root (missing `.github/` directory)  
**Digest Reference:** *"GitHub Actions / GitLab CI — Automated lint, test, build, deploy"*

### Problem

No automated CI pipeline exists. Quality gates are local-only (Husky + lint-staged). There is no guard against:
- Code that fails type-checking being merged
- Failing tests reaching `main`
- Build errors being discovered late

### Solution

#### `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '22'
  PNPM_VERSION: '10'

jobs:
  quality:
    name: Lint & TypeCheck & Test & Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type-check
        run: pnpm typecheck

      - name: Lint
        run: pnpm lint

      - name: Unit & Integration tests
        run: pnpm test:run

      - name: Build
        run: pnpm build
```

#### `.github/workflows/e2e.yml` (optional — separate workflow)

```yaml
name: E2E

on:
  pull_request:
    branches: [main]

jobs:
  e2e:
    name: Playwright Tests
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: '10' }
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: npx playwright install --with-deps chromium
      - run: pnpm test:e2e
```

#### Benefits:
- ✅ All quality gates run on every PR
- ✅ Prevents broken code from merging
- ✅ Build artifacts are validated
- ✅ E2E tests run in CI against the real dev server

---

## 5. 🟡 Suggestion: Add Dockerfile for Containerization

**Location:** Project root (missing `Dockerfile`)  
**Digest Reference:** *"Multi-stage Docker, distroless images, non-root user"*

### Problem

No containerization. The app can only run via `pnpm dev` or `pnpm build && pnpm preview`. There is no reproducible deployment artifact.

### Solution

#### `Dockerfile`

```dockerfile
# ============================================================
# Stage 1: Build
# ============================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency manifests
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# ============================================================
# Stage 2: Production (nginx)
# ============================================================
FROM nginx:stable-alpine AS production

# Security: run as non-root
RUN adduser -D -H -u 1000 appuser

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Security: drop root
USER appuser

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

#### `nginx.conf`

```nginx
server {
    listen       80;
    server_name  localhost;

    root   /usr/share/nginx/html;
    index  index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self';" always;

    # SPA routing: serve index.html for all non-file routes
    location / {
        try_files $uri $uri/ /index.html;
        expires -1;
    }

    # Static assets with long cache
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
        return 404;
    }
}
```

#### Build & Run

```bash
docker build -t linear-app-clone:latest .
docker run -p 8080:80 linear-app-clone:latest
```

#### Benefits:
- ✅ Reproducible deployment artifact
- ✅ Non-root user (security hardening)
- ✅ Multi-stage build (small final image)
- ✅ SPA routing config included
- ✅ Security headers in nginx
- ✅ Cache control for assets

---

## 6. 🟡 Suggestion: Co-locate Tests with Source Files

**Location:** `src/__tests__/` (flat, 17 test files)  
**Digest Reference:** Not explicitly covered, but implied by FSD maintainability principles

### Problem

All tests live in a flat `src/__tests__/` directory, disconnected from their source files:

```
src/
  __tests__/
    authStore.test.ts         ← tests entities/session/model/store.ts
    issuesStore.test.ts       ← tests entities/issue/model/store.ts
    AuthGuard.test.tsx        ← tests features/auth/ui/AuthGuard.tsx
    cacheStore.test.ts        ← tests shared/stores/cacheStore.ts
    loginFlow.test.ts         ← tests features/auth/hooks/useLoginForm.ts
    ...
  entities/
    session/model/store.ts
    issue/model/store.ts
  features/auth/ui/AuthGuard.tsx
  shared/stores/cacheStore.ts
  features/auth/hooks/useLoginForm.ts
```

This breaks FSD principles: related code (source + tests) is scattered across directories.

### Solution

Move each test file to sit alongside its source:

```
# Before                              # After
src/__tests__/                         
  authStore.test.ts                   src/entities/session/model/store.test.ts
  issuesStore.test.ts                 src/entities/issue/model/store.test.ts
  AuthGuard.test.tsx                  src/features/auth/ui/AuthGuard.test.tsx
  cacheStore.test.ts                  src/shared/stores/cacheStore.test.ts
  loginFlow.test.ts                   src/features/auth/hooks/useLoginForm.test.ts
  uiStore.test.ts                     src/shared/stores/uiStore.test.ts
  websocketStore.test.ts              src/shared/stores/websocketStore.test.ts
  resetAllStores.test.ts              src/shared/stores/resetAllStores.test.ts
  selectors.test.ts                   src/shared/stores/selectors/index.test.ts
  useDocumentTitle.test.ts            src/shared/lib/useDocumentTitle.test.ts
  StoreProvider.test.tsx              src/app/StoreProvider.test.tsx
  integration.test.ts                 src/__tests__/integration.test.ts (keep — integration tests)
  routerConfig.test.tsx               src/__tests__/routerConfig.test.tsx (keep — cross-cutting)
  validation.test.ts                  src/shared/lib/validation.test.ts
  memoization.test.ts                 src/shared/stores/selectors/memoize.test.ts
  useActiveRoute.test.tsx             src/shared/hooks/useActiveRoute.test.tsx
  NotFoundPage.test.tsx               src/pages/NotFoundPage.test.tsx
```

The vitest config already supports this:

```typescript
// vitest.config.ts — already matches both patterns
include: ['src/**/*.test.{ts,tsx}', 'src/__tests__/**/*.test.{ts,tsx}']
```

Keep `src/__tests__/` for cross-cutting integration tests and router tests that span multiple layers. Move everything else.

#### Benefits:
- ✅ FSD-aligned — source and test are in the same layer/slice
- ✅ Easier to find tests when working on a feature
- ✅ Easier to delete — when a feature is removed, its tests go with it
- ✅ Better import paths — no need for deep relative imports in tests

---

## 7. 💭 Nit: Add Docker Compose for Local Dev

**Location:** Project root (missing `docker-compose.yml`)  
**Digest Reference:** *"Docker Compose for local dev"*

### Problem

Local development requires `pnpm dev` and assumes the API backend is at `/api/v1` on the same host. There's no integration test environment that runs both the frontend and an API mock.

### Solution

#### `docker-compose.yml`

```yaml
services:
  # Frontend — Vite dev server with HMR
  frontend:
    build:
      dockerfile: Dockerfile.dev
      context: .
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - VITE_DEV_PORT=5173
      - VITE_API_BASE=http://api:3001/api/v1
    depends_on:
      - api

  # Mock API server (for local development without real backend)
  api:
    build:
      context: .
      dockerfile: Dockerfile.mock-api
    ports:
      - "3001:3001"
```

#### `Dockerfile.dev`

```dockerfile
FROM node:22-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 5173
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
```

#### Benefits:
- ✅ Reproducible local dev environment
- ✅ No need to install Node.js/pnpm locally
- ✅ Includes mock API for full-stack local dev
- ✅ Environment parity with production container

---

## 8. Implementation Roadmap

| Priority | Item | Effort | Dependencies | Target |
|----------|------|--------|--------------|--------|
| **P0** | 🔴 Migrate refresh token to HttpOnly cookies | Medium | Backend changes | Sprint current |
| **P1** | 🟡 Add CI pipeline (GitHub Actions) | Low | None | Sprint next |
| **P1** | 🟡 Centralize MSW handlers | Low | None | Sprint next |
| **P2** | 🟡 Co-locate tests with source | Medium | None | Sprint +2 |
| **P1** | 🟡 Migrate custom cacheStore to TanStack Query | Medium | None | Sprint next |
| **P3** | 🟡 Add Dockerfile | Low | None | Sprint +3 |
| **P3** | 💭 Add Docker Compose | Low | Dockerfile | Sprint +3 |

---

*End of document*
