# Tasks — Fix Pagination Response Shape (Frontend)

## API Layer

- [ ] Update `FetchIssuesResponse` in `src/entities/issue/api/index.ts`: rename `meta: { cursor, hasMore }` → `pagination: { nextCursor, hasMore }`

## Types

- [ ] Update `PaginationCursor` in `src/entities/issue/model/types.ts`: rename `cursor` → `nextCursor`

## Store

- [ ] Update `loadIssues()` in `src/entities/issue/model/store.ts`: destructure `pagination` instead of `meta`; use `pagination.nextCursor` / `pagination.hasMore`
- [ ] Update cache type annotation on line 75: `meta` → `pagination`
- [ ] Update cache `set()` on line 94: `{ data, meta }` → `{ data, pagination }`
- [ ] Update `loadNextPage()`: destructure `pagination` instead of `meta`; use `pagination.nextCursor` / `pagination.hasMore`

## Validation

- [ ] Run `npm run typecheck` — confirm no TypeScript errors
- [ ] Run `npm run lint` — confirm lint passes
- [ ] Verify runtime: open issues page, check that "Load more" button renders when `hasMore` is true
