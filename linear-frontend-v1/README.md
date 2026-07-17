# Linear App Clone — Frontend

> **🚧 Site under development.** This project is in active construction.

A Linear.app frontend clone built with React, TypeScript and Vite.

## Available Features

### Authentication & Session
- Login — email/password form against `POST /api/v1/auth/login`
- Logout — button in user menu, clears state and redirects to login
- Automatic session hydration — restores session on app startup using refresh token
- Automatic token refresh — `authFetch` intercepts 401, refreshes access token and retries
- Route protection (AuthGuard) — redirects to `/login` if unauthenticated
- Post-login redirect — already authenticated users visiting `/login` are redirected to `/`

### User Interface
- Splash screen — logo, spinner and "Loading..." on startup
- Login page — centered card layout with logo and welcome message
- Main layout — header with logo, app name and user avatar
- User dropdown menu (UserAvatar) — initials, name, email and logout button

### Shared Components (Design System)
- **Button** — variants: `primary`, `secondary`, `danger`, `ghost`. Supports loading, icon and disabled states.
- **TextInput** — field with label, errors, helper text and ARIA attributes
- **Spinner** — animated loading indicator with `sm`, `md`, `lg` sizes
- **ErrorBanner** — error display with `role="alert"`

### Form Validation
- Client-side validation with Zod (email format, password minimum 8 chars)
- Integration with react-hook-form and `zodResolver`
- Per-field error messages
- Duplicate submission prevention

### Client API
- `authFetch` — authenticated requests with Bearer token + automatic 401 refresh
- Network error handling with user-friendly messages

### Styles & Theme
- Tailwind CSS v4 with custom theme (`@theme`)
- Custom color palette (primary, danger, success, warning, etc.)
- Typography: 'Inter' font

### Tests
- Unit tests for auth store (`authStore.test.ts`)
- Integration tests for login flow with MSW
- Validation tests (`validation.test.ts`)
- E2E tests with Playwright (`e2e/login.spec.ts`)

### Infrastructure
- React Router v7 (`createBrowserRouter`)
- Zustand for global state
- Feature-Sliced architecture (`app/`, `pages/`, `features/`, `entities/`, `shared/`)
- Husky + commitlint + lint-staged
- Environment variables via `.env`

---

Built with React + TypeScript + Vite.
