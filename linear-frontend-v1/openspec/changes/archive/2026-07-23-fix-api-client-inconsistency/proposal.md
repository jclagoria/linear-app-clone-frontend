# Fix: API Client Inconsistency — Store Uses Raw Fetch Instead of apiClient

## Problem Statement

The issues store's `loadIssues()` and `loadNextPage()` methods use raw `fetch()` calls instead of the shared `apiClient` singleton that the rest of the API layer uses. This bypasses critical infrastructure: auth token injection, 401 auto-refresh, and error interceptors. If the access token expires during pagination or initial load, the request fails with a generic error instead of auto-refreshing.

## Motivation

- Consistent auth handling: all API calls should go through the same token injection and refresh pipeline
- Reliable pagination: cursor-based pagination is unusable when the session expires mid-session
- Proper error handling: rate limit tracking and error mapping interceptors are bypassed for the two most frequently called endpoints
- Maintenance: eliminates duplicated `API_BASE` constant and fetch boilerplate

## Scope

- **In scope**:
  - Replace raw `fetch()` in `store.ts:loadIssues()` with `apiClient.get<FetchIssuesResponse>()`
  - Replace raw `fetch()` in `store.ts:loadNextPage()` with `apiClient.get<FetchIssuesResponse>()`
  - Wire query parameter construction into the existing `fetchIssues()` API function
  - Update or remove cache integration if needed
- **Out of scope**:
  - Changes to other store methods that already use API functions (e.g., `changeStatus`, `assignIssue`)
  - Refactoring the cache layer
  - Other entities (watchers, labels, projects)

## Impact

- **File changed**: `src/entities/issue/model/store.ts` — two methods rewritten
- **No API contract change**: the /issues endpoint remains unchanged
- **No user-facing change**: behavior is identical, except auth failures now auto-recover
- **Tests**: existing store tests should continue passing; may need minor updates if mock expectations change
