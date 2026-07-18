# User Flows — Remove localStorage Token Storage, Use HttpOnly Cookie via credentials: 'include'

## Actors

| Actor | Description |
|-------|-------------|
| Unauthenticated User | Visitor with no valid session |
| Authenticated User | User with a valid HttpOnly cookie (stored by browser) |
| Expired User | User whose cookie has expired or was cleared server-side |

## Flow Inventory

### Auth: Login

**Actor**: Unauthenticated User
**Entry**: Login page (`/login`)
**Exit**: Home page (`/`)

#### Screen List

| Screen | States Visited | Description |
|--------|----------------|-------------|
| Login | loading, error, success | User submits email + password; cookie set server-side |

#### Navigation Graph

```mermaid
graph TD
    Start((User)) -->|navigates to protected route| Login[Login Page]
    Login -->|submit credentials| Loading[Loading State]
    Loading -->|POST /auth/login credentials:include| Error[Error State]
    Loading -->|response OK| Home[Home Page]
    Error -->|retry| Login
```

#### State Transitions

| From | Action | To | Notes |
|------|--------|----|-------|
| Protected route | No session cookie | Login page | Redirect by auth guard |
| Login page | Submit valid credentials | Home page | Cookie set by `Set-Cookie` header; accessToken stored in Zustand |
| Login page | Submit invalid credentials | Login page (error) | Error banner shown; no cookie set |
| Login page | Network error | Login page (error) | "Connection error" message |

---

### Auth: Session Hydrate (Page Refresh)

**Actor**: Authenticated User / Expired User
**Entry**: Any page after full page load or refresh
**Exit**: Same page (authenticated) or login redirect

#### Screen List

| Screen | States Visited | Description |
|--------|----------------|-------------|
| Any | loading, success, error | App boot with no stored token—relies on cookie |

#### Navigation Graph

```mermaid
graph TD
    Refresh((Page Load)) --> Hydrate[hydrate call]
    Hydrate -->|POST /auth/refresh credentials:include| CookiePresent[Cookie Sent]
    CookiePresent -->|200 OK: new accessToken| Authenticated[Authenticated - stay on page]
    CookiePresent -->|401/error| CookieExpired[Cookie Invalid]
    CookieExpired -->|clear session| Login[Redirect to Login]
    Hydrate -->|no cookie| Unauthenticated[Unauthenticated - show login]
```

#### State Transitions

| From | Action | To | Notes |
|------|--------|----|-------|
| Page load | No cookie exists | Unauthenticated | Store sets `isAuthenticated: false` immediately |
| Page load | Cookie exists, valid | Authenticated | Cookie sent automatically via `credentials: 'include'`; accessToken returned |
| Page load | Cookie exists, expired/revoked | Unauthenticated | Server returns error; store clears any stale state |

---

### Auth: Silent Token Refresh

**Actor**: Authenticated User
**Entry**: During active session, before access token expires
**Exit**: Same session (new accessToken in Zustand) or session cleared

#### Screen List

| Screen | States Visited | Description |
|--------|----------------|-------------|
| Any (background) | loading, success, error | Transparent to user |

#### Navigation Graph

```mermaid
graph TD
    Session((Active Session)) -->|accessToken nearing expiry| Refresh[refreshAccessToken]
    Refresh -->|POST /auth/refresh credentials:include| Success[200 OK]
    Success -->|new accessToken stored| Session
    Refresh -->|401/error| Clear[Clear session]
    Clear --> Login[Redirect to Login]
```

#### State Transitions

| From | Action | To | Notes |
|------|--------|----|-------|
| Any page | Token expires, cookie valid | Same page | New accessToken fetched in background |
| Any page | Token expired, cookie also invalid | Login page | Full session clear, auth guard redirect |

---

### Auth: Logout

**Actor**: Authenticated User
**Entry**: Any authenticated page
**Exit**: Login page

#### Screen List

| Screen | States Visited | Description |
|--------|----------------|-------------|
| Any | loading, success | User-initiated logout |

#### Navigation Graph

```mermaid
graph TD
    App((Authenticated App)) -->|user clicks Logout| Logout[POST /auth/logout credentials:include]
    Logout -->|cookie cleared server-side| ClearSession[Clear Zustand state]
    ClearSession -->|resetDomainStores| Login[Redirect to Login]
```

#### State Transitions

| From | Action | To | Notes |
|------|--------|----|-------|
| Any authenticated page | User clicks Log out | Login page | Cookie cleared by `Max-Age=0`; accessToken removed; domain stores reset |

---

### Auth: Session Expiry (Passive)

**Actor**: Authenticated User / Expired User
**Entry**: Any authenticated page
**Exit**: Login page

#### Screen List

| Screen | States Visited | Description |
|--------|----------------|-------------|
| Any | loading (failed refresh), error | User does not initiate—app detects stale session |

#### Navigation Graph

```mermaid
graph TD
    Session((Authenticated Session)) -->|fetch fails with 401| RefreshAttempt[refreshAccessToken]
    RefreshAttempt -->|cookie invalid or missing| ClearSession[Clear Zustand state]
    ClearSession --> Login[Redirect to Login]
```

#### State Transitions

| From | Action | To | Notes |
|------|--------|----|-------|
| Any page (authenticated) | API call returns 401 | Login page | `refreshAccessToken` tries cookie; fails; session cleared |
