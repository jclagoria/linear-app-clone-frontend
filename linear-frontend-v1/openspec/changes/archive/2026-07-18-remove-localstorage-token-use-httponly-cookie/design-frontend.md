# Auth — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth method | HttpOnly cookie via `credentials: 'include'` | Browser sends cookie automatically; no JS access to token |
| Token storage | Access token in memory (Zustand), refresh token in cookie | Short-lived access token is XSS-safe in memory; long-lived refresh token is HttpOnly-protected |
| API change surface | Minimal — only session store and types | No new components, routes, or UI changes |

## Component Tree

No component changes. All modifications are in data/state layers:

```
src/
  entities/
    session/
      model/
        store.ts      ← MODIFIED: remove localStorage, add credentials: 'include'
        types.ts      ← MODIFIED: remove refreshToken from response types
  mocks/
    handlers.ts       ← CREATED: MSW handlers without refreshToken
```

### Store Changes (store.ts)

**Remove:**

| Code | Lines | Reason |
|------|-------|--------|
| `REFRESH_TOKEN_KEY = 'linear_refresh_token'` | 7 | No longer needed |
| `getStoredRefreshToken()` | 18-24 | No longer needed |
| `setStoredRefreshToken(token)` | 26-36 | No longer needed |

**Method: `login`**

| Change | Lines | Detail |
|--------|-------|--------|
| Add `credentials: 'include'` | 70-74 | `fetch(url, { method: 'POST', credentials: 'include', headers, body })` |
| Remove `refreshToken` from destructure | 88 | `const { user, accessToken } = json.data` |
| Remove `setStoredRefreshToken(refreshToken)` | 90 | Delete line |

**Method: `logout`**

| Change | Lines | Detail |
|--------|-------|--------|
| Add `credentials: 'include'` | 119-124 | `fetch(url, { method: 'POST', credentials: 'include', headers })` |
| Remove `setStoredRefreshToken(null)` | 129 | Delete line |

**Method: `hydrate`**

| Change | Lines | Detail |
|--------|-------|--------|
| Remove localStorage read + early return | 141-145 | Cookie is sent automatically — no need to read from localStorage |
| Replace body with `credentials: 'include'` | 150-154 | `fetch(url, { method: 'POST', credentials: 'include' })` — no body, no `Content-Type` |
| Remove `setStoredRefreshToken(null)` on error | 157 | Cookie cleared server-side |
| Remove `refreshToken` from response destructure | 163 | `const { accessToken } = json.data` |
| Remove `setStoredRefreshToken(newRefreshToken)` | 165 | Delete line |
| Remove `setStoredRefreshToken(null)` in catch | 173 | Delete line |

**Method: `refreshAccessToken`**

| Change | Lines | Detail |
|--------|-------|--------|
| Remove localStorage read + early return | 188-196 | Cookie is sent automatically instead |
| Replace body with `credentials: 'include'` | 199-203 | `fetch(url, { method: 'POST', credentials: 'include' })` — no body |
| Remove `setStoredRefreshToken(null)` on error | 206 | Cookie cleared server-side |
| Remove `refreshToken` from destructure | 216-217 | `const { accessToken: newToken } = json.data` |
| Remove `setStoredRefreshToken(newRefreshToken)` | 219 | Delete line |
| Remove `setStoredRefreshToken(null)` in catch | 223 | Delete line |

### Type Changes (types.ts)

| Type | Change | Lines |
|------|--------|-------|
| `LoginResponse` | Remove `refreshToken: string` from `data` | 12 |
| `RefreshResponse` | Remove `refreshToken: string` from `data` | 19 |

### MSW Handlers (create src/mocks/handlers.ts)

**POST /auth/login** — returns `{ data: { user, accessToken } }` without `refreshToken`

**POST /auth/refresh** — returns `{ data: { accessToken } }` without `refreshToken`. Accepts cookie instead of body token.

## Routing

No routing changes. Existing auth guard logic is unaffected:
- `/login` — public
- `/*` (all other routes) — protected by AuthGuard, redirects to `/login` if unauthenticated

## State Management

- **Global state**: Zustand `useAuthStore` holds `user`, `accessToken`, `isAuthenticated`, `isLoading`, `error`
- **Local state**: Login form state (react-hook-form) — unchanged
- **Server state**: None — auth is purely client-side fetch

**Hydrate flow changes:**

```
Before: store reads refreshToken from localStorage → sends in body → stores new refreshToken in localStorage
After:  store POSTs to /auth/refresh with credentials: 'include' → cookie sent by browser → accessToken stored in memory
```

## Data Fetching

- **Client**: Plain `fetch` with `credentials: 'include'` on all auth endpoints
- **Error handling**: Same as before — `!response.ok` branches per method
- **Optimistic updates**: None

## Asset Map

No new assets.

## Validation Strategy

No changes. Login form validation remains:
- `email`: required, valid email format
- `password`: required, min 8 characters

## Accessibility

No changes. Auth flows have no new UI surfaces.
