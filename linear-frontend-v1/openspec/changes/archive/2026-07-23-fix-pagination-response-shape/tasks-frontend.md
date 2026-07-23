# Tasks — Fix Pagination Response Shape (Frontend)

## API Layer

- [x] Update `FetchIssuesResponse` in `src/entities/issue/api/index.ts`: rename `meta: { cursor, hasMore }` → `pagination: { nextCursor, hasMore }`

## Types

- [x] Update `PaginationCursor` in `src/entities/issue/model/types.ts`: rename `cursor` → `nextCursor`

## Store

- [x] Update `loadIssues()` in `src/entities/issue/model/store.ts`: destructure `pagination` instead of `meta`; use `pagination.nextCursor` / `pagination.hasMore`
- [x] Update cache type annotation on line 75: `meta` → `pagination`
- [x] Update cache `set()` on line 94: `{ data, meta }` → `{ data, pagination }`
- [x] Update `loadNextPage()`: destructure `pagination` instead of `meta`; use `pagination.nextCursor` / `pagination.hasMore`

## Validation

- [x] Run `npm run typecheck` — confirmed no TypeScript errors
- [x] Run `npm run lint` — confirmed lint passes (pre-existing warnings unrelated to this change)
- [ ] Verify runtime: open issues page, check that "Load more" button renders when `hasMore` is true
