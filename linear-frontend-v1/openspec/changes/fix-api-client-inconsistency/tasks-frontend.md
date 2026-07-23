# Tasks — Fix: API Client Inconsistency (Frontend)

## State & Data

- [ ] **T1**: Import `fetchIssues` and `FetchIssuesParams` in `store.ts`
- [ ] **T2**: Remove local `API_BASE` constant from `store.ts` (if not used elsewhere)
- [ ] **T3**: Rewrite `loadIssues()` — replace raw `fetch()` block with `fetchIssues(params)` call
- [ ] **T4**: Rewrite `loadNextPage()` — replace raw `fetch()` block with `fetchIssues({ cursor, ...filters })` call

## Validation

- [ ] **T5**: Run existing store tests — verify `loadIssues()` and `loadNextPage()` tests pass
- [ ] **T6**: Run integration tests — verify issue listing and pagination end-to-end
- [ ] **T7**: Manual smoke test — load issues page, paginate, verify auth flow still works

## Review

- [ ] **T8**: Verify no raw `fetch()` calls remain in `store.ts` for issue loading
- [ ] **T9**: Confirm lint passes (`npm run lint`)
- [ ] **T10**: Confirm type-check passes (`npm run typecheck`)
