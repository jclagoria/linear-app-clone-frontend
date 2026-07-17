# Tasks — Auth Module (Frontend)

## Scaffold

- [ ] `chore: initialize Vite + React 19 + TypeScript project`
- [ ] `chore: configure Tailwind CSS + shadcn/ui (Button, Input, Card, Dialog)`
- [ ] `chore: set up Zustand with devtools middleware`
- [ ] `chore: configure Vitest + Playwright with MSW`
- [ ] `chore: add React Router v7 with route skeleton`
- [ ] `chore: add lint-staged + commitlint for Conventional Commits`

## Components

- [ ] `feat: implement TextInput component (email + password variants, error state, disabled state)`
- [ ] `feat: implement Button component (primary variant, loading spinner, disabled)`
- [ ] `feat: implement ErrorBanner component (role="alert", icon + message, dismiss on input)`
- [ ] `feat: implement Spinner component (CSS rotation animation, aria-label)`
- [ ] `feat: implement LoginForm composite (email + password inputs, validation, submit, error display)`
- [ ] `feat: implement AuthGuard route wrapper (checking, authenticated, unauthenticated states)`
- [ ] `feat: implement UserAvatar component (avatar + name, logout dropdown, aria-haspopup)`
- [ ] `feat: implement SplashPage (centered spinner + status text, role="status")`
- [ ] `feat: implement LoginPage (card layout, logo, LoginForm)`

## State & Data

- [ ] `feat: create AuthStore (Zustand) with user, accessToken, isAuthenticated, isLoading, error`
- [ ] `feat: implement login action (POST /auth/login, handle success/error/network failure)`
- [ ] `feat: implement logout action (POST /auth/logout, clear tokens, redirect)`
- [ ] `feat: implement token refresh logic (pre-emptive refresh at 80% expiry)`
- [ ] `feat: implement hydrate action (check refresh cookie, fetch access token, set state)`
- [ ] `feat: implement fetch interceptor (attach Bearer token, auto-refresh on 401, deduplicate)`
- [ ] `feat: implement useAuth hook (selector for AuthStore state)`
- [ ] `feat: implement useLogin hook (validation, submit handler, loading guard)`

## Routing

- [ ] `feat: configure /login route (LoginPage, redirect to app if authenticated)`
- [ ] `feat: configure /splash route (SplashPage, shown during hydration)`
- [ ] `feat: apply AuthGuard to protected routes (redirect to /login if unauthenticated)`

## Validation

- [ ] `test: unit test AuthStore (login, logout, hydrate, refresh)`
- [ ] `test: unit test validation rules (email format, password length, required fields)`
- [ ] `test: integration test login flow with MSW (success + error + network failure)`
- [ ] `test: integration test token refresh cycle`
- [ ] `test: e2e test login with valid credentials (Playwright)`
- [ ] `test: e2e test login with invalid credentials`
- [ ] `test: e2e test logout flow`
- [ ] `test: e2e test session hydration (reload with valid session)`
- [ ] `test: e2e test protected route redirect to /login when unauthenticated`

## Review

- [ ] `docs: verify all specs-frontend scenarios are covered by tests`
- [ ] `docs: verify accessibility contract (keyboard, ARIA, target sizes)`
- [ ] `chore: PR readiness checklist — lint, typecheck, test, build`
