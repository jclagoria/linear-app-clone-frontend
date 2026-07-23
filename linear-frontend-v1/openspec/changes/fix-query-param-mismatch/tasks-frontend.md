# Tasks — Fix Query Parameter Mismatch (Frontend)

## API Layer

- [x] Rename `FetchIssuesParams.status` → `statusId`; remove `priority` and `search` fields
- [x] Update `fetchIssues()` to construct `statusId` param; remove `priority` and `search`; add `labelIds` as comma-separated string

## Types

- [x] Rename `IssueFilters.status` → `statusId` in `src/entities/issue/model/types.ts`
- [x] Remove `IssueFilters.priority` and `IssueFilters.search`
- [x] Update `initialFilters` in store

## Store

- [x] Update `loadIssues()` to use `filters.statusId`; remove `priority`/`search`; add `labelIds`
- [x] Update `loadNextPage()` with same param changes
- [x] Update `cacheKey` construction to reflect new param names

## UI Components

- [x] Update `IssueFilters.tsx`: change `filters.status` → `filters.statusId`; update `hasActiveFilters` check
- [x] Update `IssuesPage.tsx`: change `filters.status` → `filters.statusId`; remove `priority`/`search` from active filter check

## Testing

- [x] Update MSW handlers to match `statusId`/`labelIds` params
- [x] Update or add unit tests for query param construction
- [x] Run existing test suite to confirm no regressions

## Validation

- [ ] Verify `GET /api/v1/issues` sends correct params via browser devtools
- [x] Confirm no TypeScript errors (`npm run typecheck`)
- [x] Confirm lint passes (`npm run lint`)
