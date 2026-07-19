# API Client & Error Handling — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| API client location | `src/lib/api-client/` | Shared library module, consumed by all features; not owned by any single feature | No feature encapsulation — but correct for cross-cutting infrastructure |
| Error taxonomy | Class hierarchy extending `ApiError` | Typed catch blocks; consumer can `instanceof`-check or use ErrorHandler callback | More boilerplate than error-code enums; clearer DX |
| Interceptor pipeline | Array of functions, synchronous before/after hooks | Simple, testable, no middleware library dependency | Manual ordering; no async middleware chaining |
| Token refresh dedup | Shared promise ref (single-flight) | Multiple concurrent 401s reuse one refresh; no redundant requests | Slightly more complex than naive retry |
| ErrorBanner placement | Shared `src/components/ErrorBanner` | Reused across all forms that display API errors | Consuming page must manage visibility state |
| Toast placement | `src/components/Toast` + toast container at app root | Fixed position, non-blocking, accessible via `role="status"` | Global singleton; requires portal or fixed DOM anchor |
| Rate limit tracking | Zustand store (`RateLimitStore`) | Per-endpoint map, accessible outside React (interceptors), reactive UI | Slightly more complexity than inline Map |
| ErrorHandler pattern | Subscriber object with typed callbacks | Loose coupling; any component can register without knowing about others | Manual subscribe/unsubscribe lifecycle |
| UI framework for components | shadcn/ui primitives (Toast, Alert) + Tailwind | Consistent with existing design-system decisions; accessible by default | Toast primitive may need wrapping for auto-dismiss |

## Component Tree

```
<App>
  <ToastContainer />          // Fixed position, top-right
  <Router>
    <Layout>
      <AppHeader />
      <main>
        <ErrorBanner />       // Conditionally rendered within forms
        <PageContent />       // Consumes ApiClient via hooks
      </main>
    </Layout>
  </Router>
</App>
```

| Component | Responsibility | Props | State |
|-----------|---------------|-------|-------|
| `ApiClient` | Singleton HTTP client; interceptor pipeline, auth injection, error mapping | (singleton) | idle, loading, error |
| `ErrorBanner` | Inline alert banner for API errors within forms/pages | `message: string`, `type: 'validation' \| 'server'`, `onDismiss?: () => void` | hidden, visible |
| `ToastContainer` | Fixed-position container for notification toasts | (none — renders children via context/portal) | has-toasts, empty |
| `RateLimitToast` | Toast specific to rate-limit events | `retryAfter: number`, `onRetry?: () => void`, `onDismiss: () => void` | visible, dismissing, hidden |
| `RateLimitStore` | Zustand store tracking per-endpoint rate limit state | (store — not a component) | map of endpoint states |
| `ErrorHandler` | Subscriber registry for typed error callbacks | (interface — not a component) | registered callbacks |

## Routing

N/A — The API Client & Error Handling module is a library layer, not a page-level route. It is consumed by all route-level components:

| Route | Consumes | Error/Toast behaviour |
|-------|----------|----------------------|
| `/login` | ApiClient (POST /auth/login) | ErrorBanner for validation/credentials |
| `/issues` | ApiClient (GET /issues) | RateLimitToast on 429 |
| `/issues/:id` | ApiClient (GET /issues/:id) | ErrorBanner on 404, RateLimitToast on 429 |
| `/settings` | ApiClient (PATCH /settings) | ErrorBanner for validation errors |

## State Management

- **Global state (Zustand)**:
  - `AuthStore` — `accessToken`, `user`, `isAuthenticated`, `isLoading`
  - `RateLimitStore` — `Map<endpoint, { limit, remaining, resetAt, retryAfter? }>`
- **Local state**:
  - `ErrorBanner` — visibility, message text, error type
  - `Toast` — visibility, auto-dismiss timer, retry loading state
- **Server state**: ApiClient responses (future: React Query for caching/optimistic updates)

## Data Fetching

- **Client**: `fetch` with interceptor pipeline wrapping `src/lib/api-client/ApiClient`
- **Error handling**:
  - Typed errors via class hierarchy (`ValidationError`, `UnauthorizedError`, etc.)
  - `ErrorHandler` subscriber pattern for decoupled consumers
  - Inline `ErrorBanner` for form/page errors
  - `RateLimitToast` for 429 responses (auto-dismiss after retry window)
  - Fallback: generic error banner for unknown/unhandled errors
- **Optimistic updates**: Not in scope for this change (future with React Query)

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| `ApiClient` | `src/lib/api-client/ApiClient.ts` | Singleton class |
| `ApiError` | `src/lib/api-client/errors/ApiError.ts` | Base class + type guards |
| `ErrorHandler` | `src/lib/api-client/ErrorHandler.ts` | Subscriber interface |
| `ErrorBanner` | `src/components/ErrorBanner.tsx` | shadcn/ui Alert wrapper |
| `ToastContainer` | `src/components/ToastContainer.tsx` | Fixed-position toast host |
| `RateLimitToast` | `src/components/RateLimitToast.tsx` | Auto-dismiss toast |
| `RateLimitStore` | `src/stores/rate-limit.ts` | Zustand store |
| Auth interceptor | `src/lib/api-client/interceptors/auth.ts` | Bearer token injection |
| Error interceptor | `src/lib/api-client/interceptors/error.ts` | HTTP→typed error mapping |
| Rate limit interceptor | `src/lib/api-client/interceptors/rate-limit.ts` | Header parsing + store update |

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| HTTP status 400 | → `ValidationError` with field-level `details[]` | Displayed per-field + ErrorBanner summary |
| HTTP status 401 | → `UnauthorizedError` (auto-refresh attempted) | Redirect to login if refresh fails |
| HTTP status 403 | → `ForbiddenError` | ErrorBanner: "You don't have permission" |
| HTTP status 404 | → `NotFoundError` | ErrorBanner: "Resource not found" |
| HTTP status 409 | → `ConflictError` | ErrorBanner: server message |
| HTTP status 422 | → `BusinessRuleError` | ErrorBanner: server message |
| HTTP status 429 | → `RateLimitError` | Toast: "Rate limit reached. Wait {retryAfter}s." |
| HTTP 5xx | → `InternalError` | ErrorBanner: "Something went wrong. Try again." |
| Network error | → `ApiError` (base) | ErrorBanner: "Network error. Check your connection." |

## Accessibility

- **Keyboard navigation**:
  - ErrorBanner receives focus when shown (`aria-live="polite"`, focus management via ref)
  - Toast auto-dismiss + dismiss button; does not trap focus
  - Retry button in toast is keyboard-accessible (native button)
- **ARIA**:
  - ErrorBanner: `role="alert"`, `aria-live="polite"`
  - RateLimitToast: `role="status"`, `aria-live="polite"`
  - Toast dismiss button: `aria-label="Close notification"`
  - Retry button: `aria-label="Retry"`
- **Screen reader**:
  - Error messages announce automatically via `aria-live` regions
  - Field-level errors use `aria-describedby` linking input to error text
  - Toast status announcements do not interrupt other screen reader output
