# Auth Module — Login & Token Management

## Problem Statement

The application has no authentication system. Users cannot log in, maintain session state, or securely access protected resources. Without auth, the app cannot support personalized experiences, secure API access, or user-specific data.

## Motivation

Authentication is the foundational layer everything else depends on. Three downstream modules (API client, Realtime WebSocket, Integration Tests) are blocked until auth exists. Delivering email/password login with secure token management enables the entire feature stack to proceed. Auth has no external dependencies, making it the ideal first module to build.

## Scope

- **In scope**:
  - `AuthStore` with `isAuthenticated`, `user`, `accessToken`, `refreshToken`, `isLoading` state
  - Login flow: send credentials → receive tokens → store securely → update state
  - Token storage: access token in memory, refresh token in secure cookie
  - Automatic token refresh when access token expires
  - Redirect to login when refresh token expires
  - Logout: clear tokens, clear state, redirect to login
  - Hydrate auth state from storage on app start
  - Loading state to prevent duplicate requests
- **Out of scope**:
  - OAuth / social login providers
  - Multi-factor authentication (MFA)
  - Password reset / forgot password flows
  - User registration / sign-up
  - Role-based access control (RBAC)
  - Session management UI (session list, revoke devices)

## Impact

- **Blocks**: LAG-23 (API Module — HTTP Client & Error Handling), LAG-28 (Realtime Module — WebSocket & Events), LAG-32 (Integration Testing — Critical Paths)
- **Affected areas**: Frontend auth state management, HTTP client integration, route guards, app bootstrap sequence
- **No impact** on backend — the API contract (OpenAPI spec) already defines auth endpoints
