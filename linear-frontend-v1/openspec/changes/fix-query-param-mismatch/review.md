# Review — Fix Query Parameter Mismatch

## Spec Compliance

Pre-implementation review. All artifacts are aligned:

- **Proposal**: Clearly defines the problem, scope, and impact
- **Specs-frontend**: BDD scenarios cover statusId rename, labelIds wiring, and search/priority removal
- **User-flows**: No navigation changes — data plumbing only
- **Design-frontend**: Maps exact code changes per file with minimal blast radius
- **Tasks-frontend**: Covers API layer, types, store, UI, and testing

## Edge Cases

- Empty/null `statusId` should omit the param entirely (not send `?statusId=`)
- Empty `labelIds` array should omit the param
- `labelIds` with one item should not have a trailing comma
- Cache key (`issues:list?...`) must update to reflect new param names

## Leakage Check

All artifacts stay within their scope. No implementation details leaked into specs.

## Checklist

- [x] All requirements covered
- [x] Scenarios defined
- [x] Error states handled (params omitted when null/empty)
- [x] No technical detail in specs
