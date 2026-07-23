# Tasks — Fix Delete Issue Response Type (Frontend)

## Scaffold

- [x] Create OpenSpec change with all required artifacts

## Components

- [x] No component changes — API layer only

## State & Data

- [x] Fix `deleteIssue()` return type in `src/entities/issue/api/index.ts` (line 48-52):
  - Change return type from `Promise<{ data: { success: boolean } }>` to `Promise<void>`
  - Remove the generic type parameter from `apiClient.delete<>()` call
  - Match the pattern already used by `deleteComment()` at lines 98-102

## Routing

- [x] No routing changes

## Integration

- [x] Verify `IssueDetailPage.tsx` (line 85) still compiles — caller ignores return value, should be unaffected

## Validation

- [x] Run TypeScript type check (`tsc --noEmit`) to confirm no type errors
- [x] Run existing tests to confirm no regressions
- [x] Verify no other callers of `deleteIssue()` depend on the old return type

## Review

- [x] Self-review: confirm the change matches the API contract (204 No Content = void)
- [x] PR checklist: type safety, no breaking changes, tests pass
