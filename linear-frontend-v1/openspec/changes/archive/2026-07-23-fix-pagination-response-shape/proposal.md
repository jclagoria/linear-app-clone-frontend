# Fix: Pagination response shape mismatch — meta vs pagination

## Problem Statement

The API endpoint `GET /issues` returns pagination metadata under the key `pagination` with fields `nextCursor` and `hasMore`. However, the frontend `FetchIssuesResponse` type defines it as `meta` with fields `cursor` and `hasMore`. This mismatch causes `meta` to be `undefined` at runtime, making `meta.cursor` and `meta.hasMore` resolve to `undefined`. Since `hasMore` is always falsy, the "Load more" button never renders and pagination is silently broken.

## Motivation

Pagination on the issues list is completely non-functional. Users cannot load more than the initial page of issues. This is a functional regression that blocks the core browse experience. Fixing the shape alignment restores the expected behaviour without backend changes, since the frontend controls the type interpretation.

## Scope

- **In scope**: Update `FetchIssuesResponse` in the API layer to match the actual backend response shape (`pagination.nextCursor` / `pagination.hasMore`). Update all destructuring sites in the Issues Store to consume the corrected shape. Update the `PaginationCursor` type in `types.ts` for consistency.

- **Out of scope**: Backend changes. Renaming the type utility `PaginationCursor` to `PaginationInfo` or similar. Changes to other paginated endpoints (if any). Updating tests — no tests currently exercise the pagination path.

## Impact

- `src/entities/issue/api/index.ts` — type-only change to `FetchIssuesResponse`
- `src/entities/issue/model/store.ts` — destructure `pagination` instead of `meta`, use `nextCursor` instead of `cursor` in both `loadIssues` and `loadNextPage`, and update the cache-type annotation
- `src/entities/issue/model/types.ts` — update `PaginationCursor` shape to use `nextCursor`
- No other modules consume `FetchIssuesResponse` or the pagination fields
