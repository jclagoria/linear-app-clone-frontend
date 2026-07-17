# Tasks — Auth Module (Frontend)

## Scaffold

- [x] `chore: initialize Vite + React 19 + TypeScript project`
- [x] `chore: configure Tailwind CSS + shadcn/ui (Button, Input, Card, Dialog)`
- [x] `chore: set up Zustand with devtools middleware`
- [x] `chore: configure Vitest + Playwright with MSW`
- [x] `chore: add React Router v7 with route skeleton`
- [x] `chore: add lint-staged + commitlint for Conventional Commits`

## Components

- [x] `feat: implement TextInput component (email + password variants, error state, disabled state)`
- [x] `feat: implement Button component (primary variant, loading spinner, disabled)`
- [x] `feat: implement ErrorBanner component (role="alert", icon + message, dismiss on input)`
- [x] `feat: implement Spinner component (CSS rotation animation, aria-label)`
- [x] `feat: implement LoginForm composite (email + password inputs, validation, submit, error display)`
- [x] `feat: implement AuthGuard route wrapper (checking, authenticated, unauthenticated states)`
- [x] `feat: implement UserAvatar component (avatar + name, logout dropdown, aria-haspopup)`
- [x] `feat: implement SplashPage (centered spinner + status text, role="status")`
- [x] `feat: implement LoginPage (card layout, logo, LoginForm)`

## State & Data

- [x] `feat: create AuthStore (Zustand) with user, accessToken, isAuthenticated, isLoading, error`
- [x] `feat: implement login action (POST /api/v1/auth/login, handle success/error/network failure)`
- [x] `feat: implement logout action (POST /api/v1/auth/logout with Bearer token, clear state)`
- [x] `feat: implement token refresh logic (send refreshToken in body, rotate stored token)`
- [x] `feat: implement hydrate action (read stored refreshToken, call /auth/refresh, set state)`
- [x] `feat: implement fetch interceptor (attach Bearer token, auto-refresh on 401, deduplicate)`
- [x] `feat: implement useAuth hook (selector for AuthStore state)`
- [x] `feat: implement useLogin hook (validation, submit handler, loading guard)`

## Routing

- [x] `feat: configure /login route (LoginPage, redirect to app if authenticated)`
- [x] `feat: configure /splash route (SplashPage, shown during hydration)`
- [x] `feat: apply AuthGuard to protected routes (redirect to /login if unauthenticated)`

## Validation

- [x] `test: unit test AuthStore (login, logout, hydrate, refresh)`
- [x] `test: unit test validation rules (email format, password length, required fields)`
- [x] `test: integration test login flow with MSW (success + error + network failure)`
- [x] `test: integration test token refresh cycle`
- [x] `test: e2e test login with valid credentials (Playwright)`
- [x] `test: e2e test login with invalid credentials`
- [x] `test: e2e test logout flow`
- [x] `test: e2e test session hydration (reload with valid session)`
- [x] `test: e2e test protected route redirect to /login when unauthenticated`

## Review

- [x] `docs: verify all specs-frontend scenarios are covered by tests`
- [x] `docs: verify accessibility contract (keyboard, ARIA, target sizes)`
- [x] `chore: PR readiness checklist — lint, typecheck, test, build`
