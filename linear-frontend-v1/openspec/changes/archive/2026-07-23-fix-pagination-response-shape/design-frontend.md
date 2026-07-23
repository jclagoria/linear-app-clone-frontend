# Issues Module — Frontend Design (Pagination Shape Fix)

## Architecture Decisions

| Decision | Rationale | Trade-offs |
|----------|-----------|------------|
| Align frontend type to backend response | Backend is the source of truth for the API contract; modifying the frontend type is cheaper and safer than changing the backend | Requires updating all consumption sites |

## Affected Files

| File | Change |
|------|--------|
| `src/entities/issue/api/index.ts:13-16` | `FetchIssuesResponse`: rename `meta: { cursor, hasMore }` → `pagination: { nextCursor, hasMore }` |
| `src/entities/issue/model/store.ts:75` | Cache type annotation in `loadIssues`: `{ data: Issue[]; meta: ... }` → `{ data: Issue[]; pagination: ... }` |
| `src/entities/issue/model/store.ts:87-90` | `loadIssues` response destructuring: `{ data, meta }` → `{ data, pagination }`, `meta.cursor` → `pagination.nextCursor`, `meta.hasMore` → `pagination.hasMore` |
| `src/entities/issue/model/store.ts:94` | Cache set: `{ data, meta }` → `{ data, pagination }` |
| `src/entities/issue/model/store.ts:117` | `loadNextPage` response destructuring: `{ data, meta }` → `{ data, pagination }` |
| `src/entities/issue/model/store.ts:127-128` | `meta.cursor` → `pagination.nextCursor`, `meta.hasMore` → `pagination.hasMore` |
| `src/entities/issue/model/types.ts:36-39` | `PaginationCursor`: rename `cursor` → `nextCursor` |

## Component Tree

No component tree changes. This is a data-layer-only fix.

## State Management

**Delta**: The store's `cursor` and `hasMore` state fields remain the same. Only the response destructuring (`meta` → `pagination`) and field name (`cursor` → `nextCursor`) change. The cache-store entry type annotation in `loadIssues` line 75 also updates to match.

## Data Fetching

The `apiClient.get<FetchIssuesResponse>` call returns the typed response. After the type change, the runtime shape (`pagination.nextCursor`) will correctly align with the type, so destructuring will no longer yield `undefined`.
