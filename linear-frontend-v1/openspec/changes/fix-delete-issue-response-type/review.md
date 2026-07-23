# Review — Fix Delete Issue Response Type

## Spec Compliance

| Requirement | Status | Notes |
|-------------|--------|-------|
| DeleteIssueReturnType: DeleteIssueReturnsVoid | ✅ Planned | `deleteIssue()` will return `Promise<void>` matching 204 No Content |
| DeleteIssueReturnType: DeleteIssueTypeAnnotation | ✅ Planned | Return type will be `Promise<void>`, no `.data` property accessible |

## Edge Cases

- Caller in `IssueDetailPage.tsx:85` ignores return value — no breakage expected
- No other callers found that depend on the `{ data: { success: boolean } }` shape

## Leakage Check

No implementation details leaked into specs — all artifacts focus on behavior and types.

## Checklist

- [x] All requirements covered
- [x] Scenarios pass (type-level, not runtime)
- [x] Error states handled (API errors remain unchanged)
- [x] No technical detail in specs
- [ ] Implementation pending — run `/opsx-apply` to execute tasks
