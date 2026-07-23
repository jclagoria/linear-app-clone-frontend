# Tasks — Fix: API Client Inconsistency (Frontend)

## State & Data

- [x] **T1**: Import `fetchIssues` in `store.ts`
- [x] **T2**: Remove local `API_BASE` constant from `store.ts` (if not used elsewhere)
- [x] **T3**: Rewrite `loadIssues()` — replace raw `fetch()` block with `fetchIssues(params)` call
- [x] **T4**: Rewrite `loadNextPage()` — replace raw `fetch()` block with `fetchIssues({ cursor, ...filters })` call

## Validation

- [x] **T5**: Run existing store tests — verify `loadIssues()` and `loadNextPage()` tests pass
- [x] **T6**: Run integration tests — verify issue listing and pagination end-to-end
- [x] **T7**: Manual smoke test — load issues page, paginate, verify auth flow still works

## Review

- [x] **T8**: Verify no raw `fetch()` calls remain in `store.ts` for issue loading
- [x] **T9**: Confirm lint passes (`npm run lint`)
- [x] **T10**: Confirm type-check passes (`npm run typecheck`)
