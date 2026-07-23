# Issues — Frontend Specification

## Behaviour

**Feature:** Consistent API Client Usage

All issue data-fetching operations SHALL use the shared `apiClient` singleton to ensure auth token injection, 401 auto-refresh, and error interceptors are applied uniformly.

### Requirement: LoadIssuesUsesApiClient

#### Scenario: Initial load uses apiClient

- **GIVEN** the issues store is initialised
- **WHEN** `loadIssues()` is called
- **THEN** the request is sent through `apiClient.get()` instead of raw `fetch()`
- **AND** the auth token is injected by the request interceptor
- **AND** a 401 response triggers token auto-refresh instead of a generic error

#### Scenario: Cache-before-fetch is preserved

- **GIVEN** a valid cached response exists for the current filter params
- **WHEN** `loadIssues()` is called
- **THEN** the cached data is returned immediately without an API call

### Requirement: LoadNextPageUsesApiClient

#### Scenario: Pagination uses apiClient

- **GIVEN** the issues list has more pages (`hasMore` is true)
- **WHEN** `loadNextPage()` is called
- **THEN** the request is sent through `apiClient.get()` with the cursor param
- **AND** the auth token is injected by the request interceptor
- **AND** a 401 response triggers token auto-refresh instead of a generic error

#### Scenario: Early return guards are preserved

- **GIVEN** `hasMore` is false OR `isLoading` is true OR `cursor` is null
- **WHEN** `loadNextPage()` is called
- **THEN** no API call is made

## User Flow

1. User navigates to Issues page
2. Store calls `loadIssues()` → request goes through `apiClient` → auth token injected automatically
3. User scrolls to bottom → store calls `loadNextPage()` → request goes through `apiClient` → auth token injected automatically
4. If token expires during step 2 or 3 → `apiClient` auto-refreshes and retries → request succeeds transparently

## Components

No new components. Existing `useIssuesStore` methods are modified.

## Routing

No routing changes.

## Validation Rules

N/A — no form validation involved.

## Accessibility

No accessibility impact.
