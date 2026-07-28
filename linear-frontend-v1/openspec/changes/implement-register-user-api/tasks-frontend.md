# Tasks — Register User API Integration (Frontend)

## Scaffold

- [ ] Add `registerUser` function to `src/shared/api/auth.ts` (or create if missing) — `POST /api/v1/auth/register` with `{ email, name, password }` body
- [ ] Add `register` action to `src/shared/stores/authStore.ts` — stores access token in memory, relies on HttpOnly cookie for refresh token

## Components

- [ ] Create `src/features/auth/hooks/useRegisterForm.ts` — React Hook Form + Zod schema (name, email, password, confirmPassword with match refinement), submit handler calling `authStore.register`, loading/error state
- [ ] Create `src/features/auth/ui/RegisterForm.tsx` — form UI using existing `FormField`, `Input`, `Button`, `Alert` components; props: `onSuccess`, `onSwitchToLogin`; states: idle, loading, error (client/server)
- [ ] Create `src/pages/RegisterPage.tsx` — route wrapper, redirect to `/` if already authenticated, renders `RegisterForm`

## Routing

- [ ] Add `/register` route to `src/app/routes/index.tsx` — lazy-loaded `RegisterPage`, public (no `AuthGuard`)

## Validation

- [ ] Unit tests for `useRegisterForm` hook — validation rules (required fields, email format, min 8 chars password, password match), submit calls API, error mapping
- [ ] Unit tests for `RegisterForm` component — renders all fields, shows validation errors, shows server errors, loading state disables form
- [ ] Unit tests for `RegisterPage` — redirects if authenticated, shows form if not
- [ ] E2E test: navigate from login to register, fill valid form, submit, verify redirect to dashboard
- [ ] E2E test: submit with existing email, verify 409 error message displayed
- [ ] E2E test: submit with short password, verify client-side validation error

## Review

- [ ] Self-review: all spec scenarios covered, accessibility requirements met (labels, aria-describedby, aria-invalid, focus management)
- [ ] Verify loading text is "Creating..." (consistent with spec)
- [ ] Verify no double-submit (button disabled during loading)
- [ ] Run lint, typecheck, and tests before PR
