# Auth Store — Frontend Specification

## Behaviour

**Feature:** Authentication State Management

The Auth Store SHALL manage authentication tokens, user data, and login/logout flows. It MUST handle token lifecycle including refresh and hydration via HttpOnly cookie.

### Requirement: AuthState

#### Scenario: Authenticated state after login

- **GIVEN** an unauthenticated auth store
- **WHEN** login succeeds with credentials
- **THEN** `isAuthenticated` SHALL be true
- **AND** `user` SHALL contain the authenticated user
- **AND** `accessToken` SHALL be set
- **AND** `isLoading` SHALL be false

#### Scenario: Loading state during authentication

- **GIVEN** an auth store
- **WHEN** a login request is in progress
- **THEN** `isLoading` SHALL be true

#### Scenario: Logout clears auth state

- **GIVEN** an authenticated auth store
- **WHEN** logout is dispatched
- **THEN** `isAuthenticated` SHALL be false
- **AND** `user` SHALL be null
- **AND** `accessToken` SHALL be null

#### Scenario: Hydrate state via cookie on app start

- **GIVEN** a valid HttpOnly refresh token cookie
- **WHEN** the application starts
- **THEN** a POST request is sent to `/auth/refresh` with `credentials: 'include'`
- **AND** the browser automatically sends the HttpOnly cookie
- **AND** a new access token is returned and stored in Zustand state
- **AND** `isAuthenticated` and `user` SHALL be restored

## User Flow

1. App starts → POST `/auth/refresh` with `credentials: 'include'` → browser sends cookie → accessToken restored to Zustand
2. If no valid cookie → stay unauthenticated → redirect to login
3. User visits protected route → redirect to login if not authenticated
4. User submits login form → POST `/auth/login` with `credentials: 'include'` → store sets loading → API call → store updates with user + accessToken
5. User clicks logout → POST `/auth/logout` → cookie cleared → store clears → redirect to login
6. Token refresh via POST `/auth/refresh` with cookie pre-emptively

## Components

### AuthStore

- **Purpose**: Manages authentication state and tokens
- **Props**: initialState (optional for testing)
- **States**: loading, authenticated, unauthenticated, error
- **Events**: onLogin, onLogout, onTokenRefresh

## Routing

Auth state gates protected routes. Unauthenticated users SHALL be redirected to `/login`.

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| accessToken | MUST be a JWT string when set | "Invalid access token format" |
| user | MUST have id and email when set | "User data incomplete" |

## Accessibility

Login/logout state changes SHOULD announce to screen readers via a live region.
