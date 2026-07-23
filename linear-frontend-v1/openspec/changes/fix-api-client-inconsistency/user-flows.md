# User Flows — Fix: API Client Inconsistency

## Actors

| Actor | Description |
|-------|-------------|
| Authenticated User | Logged-in user viewing and paginating through issues |

## Flow Inventory

### Issues: Browse and Paginate Issues

**Actor**: Authenticated User  
**Entry**: Navigate to /issues  
**Exit**: Click an issue to see details, or navigate away

#### Screen List

| Screen | States Visited | Description |
|--------|----------------|-------------|
| IssuesList | loading, populated, error | List of issues with pagination |
| IssueDetail | loading, populated, error | Single issue detail (navigated to from list) |

#### Navigation Graph

No new screens or navigation paths. The existing Issues → IssueDetail flow is unchanged.

#### State Transitions

| From | Action | To | Notes |
|------|--------|----|-------|
| IssuesList | page load | (same) loading → populated/error | `loadIssues()` now uses `apiClient` |
| IssuesList | scroll to bottom | (same) appends items | `loadNextPage()` now uses `apiClient` |
| IssuesList | token expired mid-session | (same) auto-refreshes, retries | Previously failed with generic error |

No new user-facing flows. This change is purely infrastructural — all existing flows behave identically, except auth errors during pagination now auto-recover instead of failing.
