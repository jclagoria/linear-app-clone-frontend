# Auth Module — Frontend Specification

## Behaviour

**Feature:** Login & Token Management

The authentication module SHALL provide email/password login, secure token storage, automatic token refresh, session persistence, and logout. The module MUST operate as the first initialized layer so downstream modules (HTTP client, WebSocket) can depend on auth state.

### Requirement: LoginFlow

#### Scenario: Successful login

- **GIVEN** the user is on the login page
- **WHEN** the user enters valid email and password and submits the form
- **THEN** the login button shows a loading state
- **AND** the application receives an access token (refresh token is set as HttpOnly cookie by the server)
- **AND** the auth state updates to `isAuthenticated: true` with the user profile
- **AND** the user is redirected to the main application page

#### Scenario: Login with invalid credentials

- **GIVEN** the user is on the login page
- **WHEN** the user enters invalid email or password and submits the form
- **THEN** the login button shows a loading state
- **AND** an error message is displayed: "Invalid email or password"
- **AND** the auth state remains `isAuthenticated: false`

#### Scenario: Login network failure

- **GIVEN** the user is on the login page
- **WHEN** the user submits credentials and the network request fails
- **THEN** an error message is displayed indicating a network issue
- **AND** the user can retry without re-entering credentials

#### Scenario: Prevent duplicate login requests

- **GIVEN** the user has submitted the login form
- **WHEN** the user clicks the submit button again before the request completes
- **THEN** no additional request is sent
- **AND** the loading state persists until the first request completes

### Requirement: TokenStorage

#### Scenario: Access token stored in memory

- **GIVEN** the user has logged in successfully
- **WHEN** the application stores the access token
- **THEN** the access token is held in memory only (not persisted to localStorage or cookies)

#### Scenario: Refresh token stored in secure cookie

- **GIVEN** the user has logged in successfully
- **WHEN** the server sets the refresh token via `Set-Cookie`
- **THEN** the refresh token is stored in a secure, HTTP-only cookie
- **AND** the cookie is not accessible to JavaScript

### Requirement: TokenRefresh

#### Scenario: Automatic refresh before expiry

- **GIVEN** the user has an active session
- **WHEN** the access token is about to expire
- **THEN** the application automatically requests a new access token by POSTing to `/auth/refresh` with `credentials: 'include'`
- **AND** the browser sends the HttpOnly refresh token cookie
- **AND** the new access token replaces the old one in memory
- **AND** the user's experience is uninterrupted

#### Scenario: HttpOnly cookie expired or missing

- **GIVEN** the HttpOnly refresh token cookie is expired or absent
- **WHEN** the application attempts to refresh the access token
- **THEN** the refresh request fails
- **AND** the auth state is cleared
- **AND** the user is redirected to the login page

### Requirement: Logout

#### Scenario: Manual logout

- **GIVEN** the user is authenticated
- **WHEN** the user clicks the logout button
- **THEN** the access token is cleared from memory
- **AND** the refresh token cookie is cleared
- **AND** the auth state resets to `isAuthenticated: false`
- **AND** the user is redirected to the login page

### Requirement: StateHydration

#### Scenario: Hydrate auth state on app start

- **GIVEN** the application starts
- **WHEN** the app initializes
- **THEN** the auth module POSTs to `/auth/refresh` with `credentials: 'include'`
- **AND** if the HttpOnly cookie is valid, a new access token is fetched
- **AND** the auth state is set to `isAuthenticated: true` with the user profile
- **AND** if no valid cookie exists, the auth state remains `isAuthenticated: false`

#### Scenario: Hydration loading prevents premature navigation

- **GIVEN** the application is starting
- **WHEN** the auth state is being hydrated
- **THEN** `isLoading` is `true`
- **AND** protected routes show a loading indicator instead of redirecting to login

## User Flow

1. App starts → POST `/auth/refresh` with `credentials: 'include'` → browser sends HttpOnly cookie
2. If valid cookie → access token returned → state restored → redirect to app
3. If no session → stay unauthenticated → redirect to login page
4. User enters email + password → submits form
5. Loading state shown → POST to `/auth/login` with `credentials: 'include'`
6. On success → access token in memory, refresh token set as HttpOnly cookie by server → state updated → redirect to app
7. On error → error message displayed → user retries
8. During session → interceptor checks access token expiry before each API call
9. Token near expiry → POST `/auth/refresh` with cookie → new access token stored
10. Refresh fails (expired cookie) → clear state → redirect to login
11. User clicks logout → POST `/auth/logout` → cookie cleared → clear state → redirect to login

## Components

### LoginForm

- **Purpose**: Renders email/password inputs, validation, and submit button
- **Props**: none (self-contained)
- **States**: default, loading (disabled inputs + spinner on button), error (inline error message), success (triggers redirect)
- **Events**: `onLoginSuccess(authResponse)`

### AuthGuard

- **Purpose**: Wraps protected routes, redirects unauthenticated users to login
- **Props**: `children` (protected component tree)
- **States**: checking (loading during hydration), authenticated (renders children), unauthenticated (redirects to login)
- **Events**: none

### UserAvatar

- **Purpose**: Displays current user info and logout action
- **Props**: `user` (UserProfile), `onLogout` (callback)
- **States**: default (avatar + name), dropdown open (logout option)
- **Events**: `onLogout`

## Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| `/login` | LoginForm | Email/password authentication |
| `*` (protected) | AuthGuard + page components | All app routes behind authentication |

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Email | Required, valid email format | "Please enter a valid email address" |
| Password | Required, min 8 characters | "Password must be at least 8 characters" |

## Accessibility

- Login form uses proper `<label>` elements associated with inputs via `htmlFor`
- Form submission is triggered by Enter key in addition to button click
- Error messages are announced via `aria-live="polite"` region
- Loading state disables form inputs and button to prevent duplicate submission
- Focus moves to first error field on validation failure
- AuthGuard uses `role="status"` and `aria-live="polite"` during hydration loading state
- Logout button has `aria-label="Log out {user.name}"` for screen reader context
