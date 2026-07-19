# Tasks — API Client & Error Handling (Frontend)

## Scaffold

- [x] Create `src/shared/lib/api-client/` directory structure with `errors/`, `interceptors/` subdirs
- [x] Define barrel exports (`index.ts`) for the API client module

## Error Taxonomy

- [x] Create `ApiError` base class at `src/lib/api-client/errors/ApiError.ts`
  - Properties: `code: string`, `message: string`, `status: number`, `details?: FieldError[]`
- [x] Create `ValidationError` (400) — typed `details: FieldError[]`
- [x] Create `UnauthorizedError` (401) — triggers token refresh flow
- [x] Create `ForbiddenError` (403)
- [x] Create `NotFoundError` (404)
- [x] Create `ConflictError` (409)
- [x] Create `BusinessRuleError` (422)
- [x] Create `RateLimitError` (429) — typed `retryAfter: number`
- [x] Create `InternalError` (500+)
- [x] Export all error classes from `src/lib/api-client/errors/index.ts`
- [x] Add type guard utilities (`isValidationError`, `isRateLimitError`, etc.)

## ErrorHandler

- [x] Create `ErrorHandler` interface at `src/shared/lib/api-client/ErrorHandler.ts`
  - Callbacks: `onValidationError`, `onUnauthorized`, `onForbidden`, `onNotFound`, `onConflict`, `onBusinessRuleError`, `onRateLimited`, `onServerError`, `onNetworkError`, `onUnknown`
- [x] Implement `ErrorHandlerRegistry` — subscribe/unsubscribe/notify lifecycle

## ApiClient

- [x] Refactor `src/shared/api/api.ts` into a class-based `ApiClient` at `src/shared/lib/api-client/ApiClient.ts`
  - Methods: `get<T>`, `post<T>`, `patch<T>`, `delete<T>` — all return strongly-typed responses
  - Internal `request<T>` method with interceptor pipeline
- [x] Migrate token refresh dedup (single-flight promise) from `authFetch`
- [x] Wire error interceptor to automatically map HTTP statuses to typed errors
- [x] Wire rate limit interceptor to parse headers and update RateLimitStore
- [x] Expose `ApiClient` as a singleton instance for app-wide use
- [x] Update `src/shared/api/api.ts` to delegate to `ApiClient` (backward compat) or replace callers

## Interceptors

- [x] Create `src/shared/lib/api-client/interceptors/auth.ts` — Bearer token injection from AuthStore
- [x] Create `src/shared/lib/api-client/interceptors/error.ts` — HTTP status → typed error class mapping
- [x] Create `src/shared/lib/api-client/interceptors/rate-limit.ts` — parse `X-RateLimit-*` headers, update RateLimitStore
- [x] Wire interceptor pipeline in ApiClient with correct ordering: auth → (fetch) → error → rate-limit

## RateLimitStore

- [x] Create `src/shared/stores/rate-limit.ts` with Zustand
  - State: `Map<endpoint, { limit: number; remaining: number; resetAt: number; retryAfter?: number }>`
  - Actions: `updateEndpoint`, `isRateLimited(endpoint): boolean`, `getRetryAfter(endpoint): number | null`
- [x] Wire store into the rate limit interceptor
- [x] Register store in `resetAllStores` if needed

## Toast UI Components

- [x] Create `ToastContainer` component at `src/shared/ui/ToastContainer.tsx`
  - Fixed position (top-right), portal-based or fixed DOM anchor at app root
  - Manages toast stack with auto-dismiss timers
- [x] Create `RateLimitToast` component at `src/shared/ui/RateLimitToast.tsx`
  - Props: `retryAfter`, `onRetry`, `onDismiss`
  - Displays remaining wait time, retry button, dismiss button
  - ARIA: `role="status"`, `aria-live="polite"`
- [x] Update `ErrorBanner` (`src/shared/ui/ErrorBanner.tsx`):
  - Add `onDismiss` prop
  - Add `type: 'validation' | 'server'` variant styling
  - Focus management when shown
- [x] Mount `ToastContainer` in `App.tsx`

## Testing

- [x] Unit tests for `ApiError` class hierarchy — construction, `instanceof` checks, serialization
- [x] Unit tests for `ErrorHandlerRegistry` — subscribe, unsubscribe, notify
- [x] Unit tests for `RateLimitStore` — update, query, reset
- [x] Unit tests for interceptors — auth token injection, error mapping per status, rate limit header parsing
- [x] Unit tests for `ApiClient` — request lifecycle, interceptor pipeline ordering
- [ ] Integration tests (Vitest + MSW) — token refresh on 401, single-flight dedup, rate limit toast trigger
- [x] Update MSW handlers to include error responses (400, 403, 404, 409, 422, 429, 500)
- [ ] E2E tests (Playwright) — login → token expiry → auto-refresh → successful retry

## Review

- [x] Verify all error types are exported and usable with `instanceof` checks
- [x] Verify `ErrorBanner` and `RateLimitToast` meet accessibility requirements
- [x] Verify `authFetch` callers are migrated to new `ApiClient` (or backward compat maintained)
- [x] Verify rate limit state is reset on logout
- [x] PR checklist: lint, typecheck, tests pass
