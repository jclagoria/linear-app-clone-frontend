# Issues — Frontend Design

## Architecture Decisions

**Decision**: Replace raw `fetch()` calls in `store.ts` with `apiClient.get()` using the existing `fetchIssues()` API function.

**Rationale**:
- `fetchIssues()` in `src/entities/issue/api/index.ts` already accepts a `FetchIssuesParams` object and calls `apiClient.get()` — it's the correct entry point
- The store's `loadIssues()` and `loadNextPage()` duplicate parameter construction, fetch boilerplate, and response parsing
- Using `fetchIssues()` eliminates the local `API_BASE` constant and all raw fetch logic
- Auth interceptors, 401 auto-refresh, error mapping, and rate-limit tracking are applied automatically

**Trade-offs**:
- Cache integration (`useCacheStore`) in `loadIssues()` is handled before the API call, so it works independently of the transport — no change needed there
- `fetchIssues()` returns `FetchIssuesResponse` directly (`{ data, meta }`), matching the structure the store already expects from its JSON parsing

## Data Flow (After Fix)

```
loadIssues()
  ├─ check cache → hit? return cached data
  └─ miss → fetchIssues(params)
              └─ apiClient.get('/issues', { params })
                   ├─ request interceptors inject auth token
                   ├─ fetch() → 401? refreshTokenSingleFlight → retry
                   ├─ response interceptors (rate limit, error mapping)
                   └─ return FetchIssuesResponse
              └─ set store state + cache

loadNextPage()
  └─ guards (hasMore, isLoading, cursor)
     └─ fetchIssues({ ...filters, cursor })
           └─ (same apiClient pipeline as above)
        └─ append to store issues array
```

## Component Tree

No changes. Issue list UI (`IssueList`, `IssueCard`) remains identical — this is a data-layer-only change.

## State Management

No changes. The Zustand `useIssuesStore` continues to manage issues state identically.

## Data Fetching

| Aspect | Before | After |
|--------|--------|-------|
| HTTP client | Raw `fetch()` with local `API_BASE` | `apiClient.get()` via `fetchIssues()` |
| Auth injection | None (bypassed) | Request interceptor adds `Authorization` header |
| 401 handling | Generic error thrown | `refreshTokenSingleFlight` → retry |
| Error mapping | Generic "Failed to load issues" | Response interceptors provide context |
| Rate limit tracking | None | Response interceptor tracks limits |
| Parameter construction | Manual `URLSearchParams` in store | `FetchIssuesParams` → `apiClient` query params |
| Response parsing | Manual `.json()` + type cast | Auto-parsed by `apiClient.parseResponse()` |

## Change Map

### `src/entities/issue/model/store.ts`

1. **Import** `fetchIssues` and `FetchIssuesParams` from `../api/index`
2. **Remove** the local `API_BASE` constant (if defined locally and not used elsewhere)
3. **Rewrite `loadIssues()`**: Replace lines 91-103 with `fetchIssues(params)` call
4. **Rewrite `loadNextPage()`**: Replace lines 136-148 with `fetchIssues(params)` call
5. **Parameter mapping**: Convert store's filter/cursor state to `FetchIssuesParams` shape

**`loadIssues()` parameter construction**:
```typescript
// Before (raw fetch)
const params = new URLSearchParams()
if (filters.status) params.set('status', filters.status)
// ... build URL, fetch, parse manually

// After (apiClient)
fetchIssues({
  status: filters.status,
  assigneeId: filters.assigneeId,
  priority: filters.priority,
  projectId: filters.projectId,
  search: filters.search,
})
```

**`loadNextPage()` parameter construction**:
```typescript
// After (apiClient)
fetchIssues({
  cursor,
  status: filters.status,
  assigneeId: filters.assigneeId,
  priority: filters.priority,
  projectId: filters.projectId,
  search: filters.search,
})
```

### `src/entities/issue/api/index.ts`

No changes needed — `fetchIssues()` already exists and accepts all the parameters the store needs. The function already handles `cursor` for pagination.

## Accessibility

No accessibility impact — no DOM or UI changes.
