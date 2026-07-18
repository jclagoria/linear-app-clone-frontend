# Auth Store — Frontend Specification

## Behaviour

**Feature:** Authentication State Management

The Auth Store SHALL manage authentication tokens, user data, and login/logout flows. It MUST handle token lifecycle including refresh and hydration from secure storage.

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
- **AND** `refreshToken` SHALL be null

#### Scenario: Hydrate state from storage on app start

- **GIVEN** a stored auth session
- **WHEN** the application starts
- **THEN** the store SHALL hydrate `isAuthenticated` and `user` from storage
- **AND** tokens SHALL be restored

## User Flow

1. App starts → auth state hydrated from storage
2. If tokens exist → attempt validation/refresh
3. User visits protected route → redirect to login if not authenticated
4. User submits login form → store sets loading → API call → store updates with user + tokens
5. User clicks logout → store clears → all caches cleared → redirect to login
6. Token refresh interval refreshes access token silently

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
