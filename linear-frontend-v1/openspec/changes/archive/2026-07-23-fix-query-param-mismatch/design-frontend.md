# Issues Filtering — Frontend Design

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Rename `status` param to `statusId` | Aligns with OpenAPI spec — backend expects UUID key |
| Add `labelIds` to fetch params | Spec-compliant label filtering was never wired |
| Remove `search` and `priority` from API call | These params are not in the OpenAPI spec; backend ignores them silently |
| Keep `labelIds` as comma-separated string | Matches spec: `type: string, description: Comma-separated label IDs` |
| API layer handles param rename; store holds current type | Minimizes blast radius — only query construction changes |

## Changes by File

### `src/entities/issue/api/index.ts` — `FetchIssuesParams` + `fetchIssues`

- Rename `status?: string | null` → `statusId?: string | null`
- Remove `priority?: number | null`
- Remove `search?: string | null`
- Keep `labelIds?: string[]` (already defined but never populated from store)
- In `fetchIssues`: change `queryParams.status` → `queryParams.statusId`
- In `fetchIssues`: remove `priority` and `search` param construction
- In `fetchIssues`: add `labelIds` serialization as comma-separated string

### `src/entities/issue/model/types.ts` — `IssueFilters`

- Rename `status: string | null` → `statusId: string | null`
- Remove `priority: number | null`
- Remove `search: string | null`
- Keep `labelIds: string[]`

### `src/entities/issue/model/store.ts` — `loadIssues`, `loadNextPage`

- In `loadIssues`: change `params.set('status', filters.status)` → `params.set('statusId', filters.statusId)`
- In `loadIssues`: remove `params.set('priority', ...)` and `params.set('search', ...)`
- In `loadIssues`: add `params.set('labelIds', filters.labelIds.join(','))` when labelIds.length > 0
- Pass `statusId` and `labelIds` to `fetchIssues()` call; remove `priority` and `search`
- Same changes in `loadNextPage`
- Update `initialFilters` to use `statusId` instead of `status`, remove `priority` and `search`

### `src/entities/issue/ui/IssueFilters.tsx` — Component

- Change `filters.status` references to `filters.statusId`
- Change `onFilterChange({ status: ... })` to `onFilterChange({ statusId: ... })`
- Remove priority select dropdown (or keep UI but don't send to API — but per spec, remove from API call)
- Update `hasActiveFilters` check to use `statusId` instead of `status` and remove `priority` check

### `src/pages/IssuesPage.tsx`

- Update `hasActiveFilters` check to use `filters.statusId` instead of `filters.status`
- Remove `filters.priority` and `filters.search` from active filters check

## Status UUID Mapping

The `IssueFilters` component currently selects status by name string (e.g. "Todo", "In Progress"). The `IssueFilters` interface stores this as a name. The `Issue` model also has `status: string` (name).

For the `statusId` query param to carry a valid UUID, either:
- **Short-term**: The UI select value is used as-is (name string) with the renamed query key `statusId` — partial compliance
- **Longer-term**: Fetch workflow statuses (pending addition of workflow endpoint) to build a name→UUID lookup

This design implements the param rename. UUID value mapping will be completed when the workflow statuses endpoint is available.

## Data Flow

```
IssueFilters (UI)
  │ onFilterChange({ statusId: "Todo" })
  ▼
IssuesStore.setFilters()
  │ stores in state.filters.statusId, labelIds
  ▼
IssuesStore.loadIssues()
  │ constructs query params: statusId=Todo&labelIds=uuid1,uuid2
  ▼
fetchIssues(params) via apiClient.get('/issues', { params })
  │ sends GET /api/v1/issues?statusId=Todo&labelIds=uuid1,uuid2
  ▼
API response → store → re-render
```

## Risk & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Removing `priority` from API call breaks UI priority filter | Users can't filter by priority on the server | Priority filtering was never server-functional (param not in spec); keep UI control for local client-side filtering or remove |
| `statusId` with name string doesn't match backend UUID | Filtering by status won't work until UUID values are used | Same as before — param name fix is first step; UUID mapping is follow-up |
| `labelIds` wires incorrectly | Label filter returns wrong results | Test with MSW handlers |

## Testing

- Update MSW handlers to use `statusId` and `labelIds` params
- Add test for `fetchIssues` query param construction
- Verify store correctly constructs query params
