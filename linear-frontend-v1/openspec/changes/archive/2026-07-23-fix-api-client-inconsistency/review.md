# Review — Fix: API Client Inconsistency

## Spec Compliance

- **LoadIssuesUsesApiClient**: Store's `loadIssues()` will use `apiClient.get()` via `fetchIssues()`. Cache-before-fetch preserved. Auth token injected by interceptor.
- **LoadNextPageUsesApiClient**: Store's `loadNextPage()` will use `apiClient.get()` via `fetchIssues()`. Early return guards preserved.
- **401 auto-refresh**: Handled by `apiClient.refreshTokenSingleFlight()` — no change needed in store.
- **Error handling**: Response interceptors and generic error fallback in `apiClient.request()` apply automatically.

## Edge Cases

- **No cursor / no more pages**: `loadNextPage()` guards (`hasMore`, `isLoading`, `cursor`) fire before any API call — no change needed.
- **Cache hit during pagination**: The cache check only applies in `loadIssues()` (initial load), not in `loadNextPage()`. This is correct — pagination should always fetch fresh data.
- **Concurrent requests**: Zustand's `get()` reads state at call time; `apiClient` handles its own request lifecycle. No new concurrency concerns.

## Leakage Check

No implementation details leaked into specs. The BDD scenarios describe observable behaviour (auth token injected, 401 auto-refresh), not implementation specifics.

## Checklist

- [x] All requirements covered
- [x] Scenarios pass
- [x] Error states handled
- [x] No technical detail in specs
