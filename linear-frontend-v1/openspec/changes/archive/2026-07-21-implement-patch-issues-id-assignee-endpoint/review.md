# Review — Issue Assign/Unassign Endpoint

## Spec Compliance

All three spec requirements are fully covered by the task breakdown:

| Requirement | Scenarios | Tasks Covering |
|-------------|-----------|----------------|
| `AssignIssueApiFunction` | Successful assign, successful unassign, non-team-member 422 | API Layer task (request shape, 200/422/network handling) |
| `AssignIssueStoreAction` | Optimistic update, rollback on failure | Store tasks (optimistic update, cache invalidation, rollback, error rethrow) |
| `IssueDetailPageAssignment` | Assignee change via edit form, business rule error toast | Page Integration tasks (store action call, success toast, 422 toast, network error toast) |

All scenarios from the spec map to concrete implementation tasks. No requirements are orphaned.

## Edge Cases

| Scenario | Covered | Task |
|----------|---------|------|
| Unassign (null assigneeId) | Yes | API Layer task accepts `string \| null`; Validation task verifies empty string → null transform |
| Modal stays open on 422 | Yes | Page Integration task + Validation task |
| Network failure rollback | Yes | Store rollback task + Page Integration network error toast |
| Cache invalidation for all list views | Yes | Store cache invalidation task (prefix-based, matches design) |
| No client-side assignee validation | Yes | Design decision — server-only team-membership check; no Zod rule needed |
| No new UI components | Yes | Design decision confirmed; all tasks use existing components |

No gaps identified. All error states, boundary conditions, and happy paths from the spec are traceable to tasks.

## Leakage Check

- Specs contain no implementation details (file paths, function names, library internals)
- Design document references file paths and function signatures appropriately (implementation guidance, not spec content)
- Tasks reference specific files and patterns from the design (appropriate for implementation guidance)
- ADR-0011 documents architectural decisions without exposing implementation specifics

No technical detail leakage into spec artifacts.

## Architecture Consistency

| Design Decision | ADR | Tasks |
|-----------------|-----|-------|
| Dedicated `assignIssue` store action | ADR-0011 | Store tasks |
| Optimistic update with rollback | ADR-0011 | Store tasks |
| Cache invalidation via prefix | ADR-0011 | Store cache task |
| 422 toast with modal open | ADR-0011 | Page Integration tasks |
| No new UI components | — | Confirmed in design; no scaffold tasks needed |

All decisions from design-frontend.md are recorded in ADR-0011 and reflected in tasks.

## Checklist

- [x] All requirements covered (3/3 requirements, 6/6 scenarios)
- [x] Scenarios pass (task breakdown addresses each scenario)
- [x] Error states handled (422, network, rollback all covered)
- [x] No technical detail in specs
- [x] ADR-0011 aligns with design decisions
- [x] Tasks follow existing patterns (mirrors `changeStatus` action from ADR-0010)
- [x] Testing tasks cover unit, integration, and E2E levels
