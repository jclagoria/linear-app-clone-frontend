# Remove localStorage Token Storage, Use HttpOnly Cookie via credentials: 'include'

## Problem Statement

The frontend currently stores the refresh token in `localStorage`, making it accessible to JavaScript and vulnerable to XSS attacks. The backend has migrated the refresh token to an HttpOnly cookie, but the frontend still contains legacy code that reads/writes the token from `localStorage` and does not send the cookie on auth requests.

## Motivation

Moving the refresh token to an HttpOnly cookie eliminates the XSS attack surface for long-lived credentials. The cookie is sent automatically by the browser on auth requests, requires no JavaScript access, and supports rotation on each refresh. This is a critical security improvement that also simplifies the frontend by removing persistent token storage code.

## Scope

- **In scope**:
  - Remove `REFRESH_TOKEN_KEY`, `getStoredRefreshToken()`, `setStoredRefreshToken()` from the session store
  - Add `credentials: 'include'` to all auth fetch calls: login, logout, refresh, hydrate
  - Remove code that reads or stores `refreshToken` from login response body
  - Keep access token handling unchanged (still returned in body, stored in memory/Zustand state)
  - Update MSW handlers to no longer return `refreshToken` in login response

- **Out of scope**:
  - Backend changes (LAG-38, already complete)
  - Changes to access token storage or lifespan
  - Changes to other non-auth API endpoints
  - Session UI changes

## Impact

- **Session store** (`src/entities/session/model/store.ts`): remove `REFRESH_TOKEN_KEY`, `getStoredRefreshToken()`, `setStoredRefreshToken()`; stop reading/sending refreshToken from body; add `credentials: 'include'` to login, logout, hydrate, and refreshAccessToken calls
- **Auth types** (`src/entities/session/model/types.ts`): remove `refreshToken` from `LoginResponse` and `RefreshResponse`
- **Auth fetch calls** (login, logout, hydrate/refresh): cookie-based auth replaces manual token header/body
- **MSW handlers** (create `src/mocks/handlers.ts`): login/refresh handlers no longer return `refreshToken` in response body
- **Register endpoint**: backend sends HttpOnly cookie on register, but no frontend register flow exists — no changes needed
- **Security**: refresh token no longer exposed to XSS; cookie is HttpOnly, Secure, SameSite, path-scoped to `/api/v1/auth/refresh`
- **User experience**: transparent — session persistence on page refresh still works via cookie
