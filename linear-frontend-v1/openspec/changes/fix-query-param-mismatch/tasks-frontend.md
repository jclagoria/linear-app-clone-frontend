# Tasks — Fix Query Parameter Mismatch (Frontend)

## API Layer

- [ ] Rename `FetchIssuesParams.status` → `statusId`; remove `priority` and `search` fields
- [ ] Update `fetchIssues()` to construct `statusId` param; remove `priority` and `search`; add `labelIds` as comma-separated string

## Types

- [ ] Rename `IssueFilters.status` → `statusId` in `src/entities/issue/model/types.ts`
- [ ] Remove `IssueFilters.priority` and `IssueFilters.search`
- [ ] Update `initialFilters` in store

## Store

- [ ] Update `loadIssues()` to use `filters.statusId`; remove `priority`/`search`; add `labelIds`
- [ ] Update `loadNextPage()` with same param changes
- [ ] Update `cacheKey` construction to reflect new param names

## UI Components

- [ ] Update `IssueFilters.tsx`: change `filters.status` → `filters.statusId`; update `hasActiveFilters` check
- [ ] Update `IssuesPage.tsx`: change `filters.status` → `filters.statusId`; remove `priority`/`search` from active filter check

## Testing

- [ ] Update MSW handlers to match `statusId`/`labelIds` params
- [ ] Update or add unit tests for query param construction
- [ ] Run existing test suite to confirm no regressions

## Validation

- [ ] Verify `GET /api/v1/issues` sends correct params via browser devtools
- [ ] Confirm no TypeScript errors (`npm run typecheck`)
- [ ] Confirm lint passes (`npm run lint`)
