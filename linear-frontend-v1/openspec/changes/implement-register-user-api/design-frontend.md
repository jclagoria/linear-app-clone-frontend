# Frontend Design — Register User API Integration

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Form library | React Hook Form + Zod | Already in stack (docs/stack-frontend.md), schema-based validation, minimal re-renders |
| Auth store | Zustand `authStore` (existing) | Already handles tokens/user info, add `register` action |
| API client | `src/shared/api/` (existing fetch wrapper) | Reuse auth interceptor, add `POST /api/v1/auth/register` |
| Feature structure | `src/features/auth/` (existing) | Add `useRegisterForm` hook + `RegisterForm` component alongside existing `LoginForm` |
| Route | `/register` in `src/app/routes/` | Lazy-loaded, public (no auth guard) |

## Component Tree

```
RegisterPage (route component)
  └── RegisterForm
        ├── Card (wrapper)
        ├── FormField × 4 (name, email, password, confirmPassword)
        │     └── Input (text/email/password)
        ├── Alert (server error, top of form)
        ├── Button (submit, loading state)
        └── Link (to login)
```

| Component | Responsibility | Props | States |
|-----------|---------------|-------|--------|
| `RegisterPage` | Route wrapper, handles redirect on success | none | idle, loading, error |
| `RegisterForm` | Form logic, validation, API call | `onSuccess`, `onSwitchToLogin` | idle, loading, error (client/server) |
| `FormField` | Wraps Input + label + error message (existing) | `label`, `error`, `children` | default, error |
| `Input` | Text/email/password input (existing) | `type`, `error`, `disabled` | default, focus, error, disabled |
| `Button` | Submit with loading spinner (existing) | `loading`, `disabled`, `children` | default, loading, disabled |
| `Alert` | Server error display (existing) | `message`, `type="error"` | visible |

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| `/register` | `RegisterPage` | public | Redirect to `/` if already authenticated |

## State Management

- **Global state**: `authStore` — add `register(data)` action, store `user` + `accessToken` on success
- **Local state**: React Hook Form — form values, validation errors, submission state
- **Server state**: No caching needed; mutation only, redirect on success

### Auth Store Extension

```typescript
// src/shared/stores/authStore.ts — add:
register: (data: RegisterPayload) => Promise<void>
```

Calls `POST /api/v1/auth/register`, stores access token in memory, refresh token set via HttpOnly cookie by backend.

## Data Fetching

- **Client**: `src/shared/api/` fetch wrapper with auth interceptors
- **Endpoint**: `POST /api/v1/auth/register` — `{ email, name, password }` → `{ user, accessToken }`
- **Error handling**: 
  - 400 → map field errors to form fields
  - 409 → "An account with this email already exists" (top-level Alert)
  - Network error → "Something went wrong. Please try again."
- **Optimistic updates**: None (pessimistic — wait for server response)

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| Spinner | `src/shared/ui/Spinner.tsx` | Used in Button loading state |
| Alert icon | SVG inline or `src/shared/assets/` | Error/success icons |

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| name | Required, non-empty | "Name is required" |
| email | Required, valid email format | "Email is required" / "Please enter a valid email" |
| password | Required, min 8 characters | "Password must be at least 8 characters" |
| confirmPassword | Required, must match password | "Passwords do not match" |

Zod schema:

```typescript
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Passwords do not match"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})
```

## Accessibility

- **Keyboard navigation**: Tab through fields (Name → Email → Password → Confirm → Submit → Sign in link), Enter submits
- **ARIA**: `aria-describedby` linking error messages to inputs, `aria-invalid="true"` on errored fields, `aria-live="assertive"` on error Alert
- **Screen reader**: All inputs have visible `<label>` elements, heading uses `h1`, error announced via `role="alert"`
- **Focus management**: Focus stays on form after error, first error field receives focus on validation failure
- **Target size**: All interactive elements ≥24×24 CSS px
- **Non-color intent**: Error icon + text message, never color alone

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/features/auth/hooks/useRegisterForm.ts` | create | React Hook Form + Zod schema, API submission |
| `src/features/auth/ui/RegisterForm.tsx` | create | Registration form component |
| `src/pages/RegisterPage.tsx` | create | Route component, redirect if authenticated |
| `src/app/routes/index.tsx` | modify | Add `/register` route (lazy-loaded) |
| `src/shared/stores/authStore.ts` | modify | Add `register` action |
| `src/shared/api/auth.ts` | modify (or create) | Add `registerUser` API function |
