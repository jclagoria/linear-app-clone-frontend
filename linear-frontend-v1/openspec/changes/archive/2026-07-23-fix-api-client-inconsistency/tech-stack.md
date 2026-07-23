# Tech Selection — Fix: API Client Inconsistency

## Decision Summary

No new technology decisions. This change operates entirely within the existing stack:

| Category | Decision | Rationale |
|----------|----------|-----------|
| API Client | Existing `apiClient` singleton (no change) | Already in use by all other API modules |
| State Management | Existing Zustand store (no change) | `useIssuesStore` continues as-is |
| HTTP | Existing fetch-based `apiClient` (no change) | No migration to alternatives needed |

The existing stack is documented in `docs/stack-frontend.md`. This change only replaces direct `fetch()` calls with the already-available `apiClient` wrapper.
