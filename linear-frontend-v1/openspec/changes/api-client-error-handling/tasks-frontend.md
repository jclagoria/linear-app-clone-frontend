# Tasks — API Client & Error Handling (Frontend)

## Scaffold

- [ ] Create `src/lib/api-client/` directory structure with `errors/`, `interceptors/` subdirs
- [ ] Define barrel exports (`index.ts`) for the API client module

## Error Taxonomy

- [ ] Create `ApiError` base class at `src/lib/api-client/errors/ApiError.ts`
  - Properties: `code: string`, `message: string`, `status: number`, `details?: FieldError[]`
- [ ] Create `ValidationError` (400) — typed `details: FieldError[]`
- [ ] Create `UnauthorizedError` (401) — triggers token refresh flow
- [ ] Create `ForbiddenError` (403)
- [ ] Create `NotFoundError` (404)
- [ ] Create `ConflictError` (409)
- [ ] Create `BusinessRuleError` (422)
- [ ] Create `RateLimitError` (429) — typed `retryAfter: number`
- [ ] Create `InternalError` (500+)
- [ ] Export all error classes from `src/lib/api-client/errors/index.ts`
- [ ] Add type guard utilities (`isValidationError`, `isRateLimitError`, etc.)

## ErrorHandler

- [ ] Create `ErrorHandler` interface at `src/lib/api-client/ErrorHandler.ts`
  - Callbacks: `onValidationError`, `onUnauthorized`, `onForbidden`, `onNotFound`, `onConflict`, `onBusinessRuleError`, `onRateLimited`, `onServerError`, `onNetworkError`, `onUnknown`
- [ ] Implement `ErrorHandlerRegistry` — subscribe/unsubscribe/notify lifecycle

## ApiClient

- [ ] Refactor `src/shared/api/api.ts` into a class-based `ApiClient` at `src/lib/api-client/ApiClient.ts`
  - Methods: `get<T>`, `post<T>`, `patch<T>`, `delete<T>` — all return strongly-typed responses
  - Internal `request<T>` method with interceptor pipeline
- [ ] Migrate token refresh dedup (single-flight promise) from `authFetch`
- [ ] Wire error interceptor to automatically map HTTP statuses to typed errors
- [ ] Wire rate limit interceptor to parse headers and update RateLimitStore
- [ ] Expose `ApiClient` as a singleton instance for app-wide use
- [ ] Update `src/shared/api/api.ts` to delegate to `ApiClient` (backward compat) or replace callers

## Interceptors

- [ ] Create `src/lib/api-client/interceptors/auth.ts` — Bearer token injection from AuthStore
- [ ] Create `src/lib/api-client/interceptors/error.ts` — HTTP status → typed error class mapping
- [ ] Create `src/lib/api-client/interceptors/rate-limit.ts` — parse `X-RateLimit-*` headers, update RateLimitStore
- [ ] Wire interceptor pipeline in ApiClient with correct ordering: auth → (fetch) → error → rate-limit

## RateLimitStore

- [ ] Create `src/stores/rate-limit.ts` with Zustand
  - State: `Map<endpoint, { limit: number; remaining: number; resetAt: number; retryAfter?: number }>`
  - Actions: `updateEndpoint`, `isRateLimited(endpoint): boolean`, `getRetryAfter(endpoint): number | null`
- [ ] Wire store into the rate limit interceptor
- [ ] Register store in `resetAllStores` if needed

## Toast UI Components

- [ ] Create `ToastContainer` component at `src/components/ToastContainer.tsx`
  - Fixed position (top-right), portal-based or fixed DOM anchor at app root
  - Manages toast stack with auto-dismiss timers
- [ ] Create `RateLimitToast` component at `src/components/RateLimitToast.tsx`
  - Props: `retryAfter`, `onRetry`, `onDismiss`
  - Displays remaining wait time, retry button, dismiss button
  - ARIA: `role="status"`, `aria-live="polite"`
- [ ] Update `ErrorBanner` (`src/shared/ui/ErrorBanner.tsx`):
  - Add `onDismiss` prop
  - Add `type: 'validation' | 'server'` variant styling
  - Focus management when shown
- [ ] Mount `ToastContainer` in `App.tsx`

## Testing

- [ ] Unit tests for `ApiError` class hierarchy — construction, `instanceof` checks, serialization
- [ ] Unit tests for `ErrorHandlerRegistry` — subscribe, unsubscribe, notify
- [ ] Unit tests for `RateLimitStore` — update, query, reset
- [ ] Unit tests for interceptors — auth token injection, error mapping per status, rate limit header parsing
- [ ] Unit tests for `ApiClient` — request lifecycle, interceptor pipeline ordering
- [ ] Integration tests (Vitest + MSW) — token refresh on 401, single-flight dedup, rate limit toast trigger
- [ ] Update MSW handlers to include error responses (400, 403, 404, 409, 422, 429, 500)
- [ ] E2E tests (Playwright) — login → token expiry → auto-refresh → successful retry

## Review

- [ ] Verify all error types are exported and usable with `instanceof` checks
- [ ] Verify `ErrorBanner` and `RateLimitToast` meet accessibility requirements
- [ ] Verify `authFetch` callers are migrated to new `ApiClient` (or backward compat maintained)
- [ ] Verify rate limit state is reset on logout
- [ ] PR checklist: lint, typecheck, tests pass
