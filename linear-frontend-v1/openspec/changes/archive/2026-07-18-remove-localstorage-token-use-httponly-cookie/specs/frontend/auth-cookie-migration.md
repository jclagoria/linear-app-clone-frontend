# Auth — Frontend Specification

## Behaviour

**Feature:** HttpOnly Cookie Auth Migration

The frontend SHALL rely on browser-sent HttpOnly cookies for refresh token management instead of `localStorage`. All auth fetch requests SHALL include `credentials: 'include'` so the browser automatically sends and receives the HttpOnly cookie. The access token SHALL remain in memory (Zustand state) and continue to be returned in the response body.

### Requirement: LoginStoresCookie

#### Scenario: Successful login sets HttpOnly cookie

- **GIVEN** the user is on the login page
- **WHEN** the user submits valid credentials
- **THEN** a POST request is sent to `/auth/login` with `credentials: 'include'`
- **AND** the browser stores the HttpOnly refresh token cookie from the `Set-Cookie` response header
- **AND** the access token is stored in the Zustand session store
- **AND** the user is redirected to the home page
- **AND** no refresh token is written to `localStorage`

#### Scenario: Login response omits refreshToken field

- **GIVEN** the backend returns a login response without `refreshToken` in the body
- **WHEN** the frontend processes the login response
- **THEN** it SHALL NOT attempt to read or store `refreshToken` from the response body

### Requirement: RefreshUsesCookie

#### Scenario: Page refresh restores session via cookie

- **GIVEN** the user has a valid HttpOnly refresh token cookie
- **WHEN** the app hydrates on page load
- **THEN** a POST request is sent to `/auth/refresh` with `credentials: 'include'`
- **AND** the browser automatically sends the HttpOnly cookie
- **AND** a new access token is returned and stored in Zustand state
- **AND** no refresh token value is read from or written to `localStorage`

#### Scenario: Silent token refresh uses cookie

- **GIVEN** the user has an active session
- **WHEN** the access token is expired or about to expire
- **THEN** the refresh logic SHALL POST to `/auth/refresh` with `credentials: 'include'`
- **AND** the browser automatically sends the HttpOnly cookie
- **AND** the new access token replaces the old one in Zustand state

#### Scenario: Expired or missing cookie clears session

- **GIVEN** the user has no valid HttpOnly cookie
- **WHEN** a refresh request is made
- **THEN** the server returns an error or empty response
- **AND** the frontend SHALL clear the access token from Zustand state
- **AND** the user SHALL be set as unauthenticated

### Requirement: LogoutClearsCookie

#### Scenario: Logout clears server-side cookie

- **GIVEN** the user is authenticated
- **WHEN** the user clicks "Log out"
- **THEN** a POST request is sent to `/auth/logout` with `credentials: 'include'`
- **AND** the backend clears the HttpOnly cookie via `Set-Cookie` with `Max-Age=0`
- **AND** the frontend SHALL clear the access token from Zustand state
- **AND** the user SHALL be set as unauthenticated
- **AND** local domain stores SHALL be reset

### Requirement: NoLocalStorageTokenPersistence

#### Scenario: No refresh token stored in localStorage

- **GIVEN** the application initialises
- **WHEN** any auth flow executes (login, refresh, hydrate, logout)
- **THEN** the code SHALL NOT call `localStorage.getItem`, `localStorage.setItem`, or `localStorage.removeItem` for refresh token keys
- **AND** the `REFRESH_TOKEN_KEY` constant, `getStoredRefreshToken()`, and `setStoredRefreshToken()` SHALL NOT exist in the codebase

### Requirement: MSWHandlersReflectNewContract

#### Scenario: MSW login handler omits refreshToken

- **GIVEN** MSW is active in development or test mode
- **WHEN** a login request is intercepted
- **THEN** the mocked response SHALL contain `{ data: { user, accessToken } }` without `refreshToken`

#### Scenario: MSW refresh handler omits refreshToken

- **GIVEN** MSW is active in development or test mode
- **WHEN** a refresh request is intercepted
- **THEN** the mocked response SHALL contain `{ data: { accessToken } }` without `refreshToken`

## User Flow

1. User visits app → `hydrate()` runs → POST `/auth/refresh` with `credentials: 'include'` → browser sends cookie → if valid, accessToken restored to Zustand
2. User logs in → POST `/auth/login` with `credentials: 'include'` → browser receives cookie → accessToken stored in Zustand → redirect to home
3. During session → `refreshAccessToken()` runs pre-emptively → POST `/auth/refresh` with cookie → new accessToken stored
4. User logs out → POST `/auth/logout` with `credentials: 'include'` → cookie cleared → Zustand reset → redirect to login

## Components

No new components. Changes are limited to the session store and types.

### useAuthStore (session store — modified)

- **Purpose**: manage auth state; all auth fetch calls
- **Changes**: remove localStorage helpers; add `credentials: 'include'` to all fetch calls; remove `refreshToken` reads/writes from response handling
- **Unchanged**: access token in memory, user state, loading/error states

### Auth types (modified)

- **Purpose**: define API response shapes
- **Changes**: remove `refreshToken` from `LoginResponse` and `RefreshResponse`

## Routing

No routing changes.

## Validation Rules

No validation changes — validation is on the login form only and is unaffected.

## Accessibility

No accessibility changes — no UI components are added or modified.
