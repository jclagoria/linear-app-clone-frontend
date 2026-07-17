# Auth Module — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth state location | Zustand store (global, outside React tree) | API interceptor needs token access without React context; Zustand supports this natively |
| Token storage | Access token in-memory (Zustand), refresh token in httpOnly cookie | Security: access token never persisted to disk (XSS-safe); refresh cookie not JS-accessible |
| Token refresh strategy | Interceptor-based, pre-emptive refresh at 80% expiry | Silent refresh before request, no request queue needed for this scope |
| Route protection | AuthGuard wrapper component | Reusable, declarative, works with any router config |

## Component Tree

```
App
├── SplashPage              (loading / hydration)
├── LoginPage               (empty / loading / error)
│   └── LoginForm
│       ├── TextInput (email)
│       ├── TextInput (password)
│       ├── ErrorBanner
│       └── Button (submit)
└── ProtectedApp (AuthGuard)
    ├── UserAvatar           (default / dropdown open)
    └── ... (app shell)
```

| Component | Responsibility | Props | States |
|-----------|---------------|-------|--------|
| SplashPage | Full-viewport loading interstitial during auth hydration | none | loading |
| LoginPage | Route-level page rendering LoginForm | none | empty, loading, error |
| LoginForm | Email/password form with validation and submit | none | empty, loading, error |
| TextInput | Single-line text input with label and error | `type`, `label`, `placeholder`, `error`, `disabled`, `value`, `onChange` | default, focus, filled, error, disabled |
| ErrorBanner | Inline alert for API errors | `message` | visible, hidden |
| Button | Action trigger with loading state | `variant`, `loading`, `disabled`, `children`, `onClick` | default, hover, active, disabled, loading |
| AuthGuard | Route wrapper checking auth state | `children` | checking, authenticated, unauthenticated |
| UserAvatar | User info display with logout dropdown | `user`, `onLogout` | default, dropdown open |

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| `/login` | LoginPage | public | Redirect to app if already authenticated |
| `/splash` | SplashPage | public | App start hydration interstitial |
| `/*` | AuthGuard + pages | protected | All app routes redirect to `/login` if unauthenticated |

## State Management

- **Global state (auth)**: Zustand store — `AuthStore` holds `user`, `accessToken`, `isAuthenticated`, `isLoading`, `error`
- **Local state**: Form state managed via React state within LoginForm (controlled inputs, field-level validation)
- **Server state**: Not needed for auth (login/logout are imperative actions, not cached data)

### AuthStore Shape

```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
}
```

## Data Fetching

- **Client**: Plain `fetch` with interceptor wrapping
- **Auth interceptor**: Checks `accessToken` expiry before every request; refreshes if needed; attaches `Authorization: Bearer <token>`
- **Error handling**: Login errors surface via AuthStore `error` field → ErrorBanner in LoginForm
- **Retry**: Login supports immediate retry (inputs preserved after error); token refresh retries once before failing

## Asset Map

| Asset | Source | Notes |
|-------|--------|-------|
| App logo | Inline SVG (mockups) | Checkmark icon in blue square; replaced with proper logo later |
| Icons | `lucide-react` | Logout door icon, warning triangle for ErrorBanner, eye for password toggle |
| Font | Inter (Google Fonts) | Defined in design-system; loaded via `<link>` in HTML |
| User avatar | Placeholder `<div>` with initials | Future: replace with uploaded image |

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| Email | Required, valid email format (RFC 5322 simplified) | "Please enter a valid email address" |
| Password | Required, min 8 characters | "Password must be at least 8 characters" |
| Form (API) | Backend validates credentials | "Invalid email or password" (generic) |
| Network | Request fails | "Connection error. Please try again." |

## Accessibility

- **Keyboard navigation**: Tab order: Email → Password → Submit → ErrorBanner. Enter submits form. Escape clears error banner.
- **ARIA**: `form` with `aria-label="Login"`, ErrorBanner `role="alert"` + `aria-live="polite"`, Spinner `role="status"` + `aria-label="Loading"`
- **Screen reader**: Labels via `<label htmlFor>`, error via `aria-describedby` on inputs, logo image `alt="Linear App Clone"`
- **Focus management**: Focus first error field on validation failure; no auto-redirect on success (route change handles focus)
- **Target sizes**: All interactive elements ≥24×24 CSS px
