# Review — Real-time Issue Updates

## Spec Compliance

All 13 event types from the spec have corresponding integration tasks:

| Spec Requirement | Task Coverage | Status |
|------------------|---------------|--------|
| `issue.created` | Task 47 — adds issue to list | Covered |
| `issue.updated` | Task 48 — reflects field changes | Covered |
| `issue.statusChanged` | Task 49 — updates status badge | Covered |
| `issue.assigned` / `issue.unassigned` | Task 50 — updates assignee | Covered |
| `issue.deleted` | Task 51 — removes from list | Covered |
| `comment.created` | Task 52 — appends to thread | Covered |
| `comment.updated` | Task 62 — unit test for edited indicator | Covered |
| `project.created` / `project.updated` | Task 53 — updates project list | Covered |
| `cycle.created` / `cycle.updated` | Task 54 — updates cycle list | Covered |
| `cycle.activated` / `cycle.completed` | Task 54 — updates cycle list | Covered |
| `notification.created` | Task 55 — increments badge count | Covered |
| Team filtering (teamId mismatch) | Task 56 — silently ignored | Covered |
| Deduplication (100ms window) | Task 33 — event router implementation | Covered |
| Event ordering (final state wins) | Task 63 — dedup unit test | Covered |

**Gap identified:** The spec states "Users SHALL be able to disable auto-updates via a toggle in settings." No task covers this settings toggle. This should be added to the Integration section before implementation begins.

## Edge Cases

- **Concurrent optimistic + SSE update**: Design addresses via optimistic-store rollback; covered by tasks 64, 79.
- **Network drop mid-event**: Reconnection via `Last-Event-ID` header covered by task 57.
- **Issue not in current filtered view**: Spec says event is processed but issue doesn't appear in filtered view; task 56 covers team filtering but issue-filter-level filtering is implicit in store state.
- **Comment edited indicator**: Spec requires "edited" indicator on updated comments; task 62 covers this but should be verified during implementation.
- **Cycle activation cascading**: Spec says "any previously active cycle SHALL transition to Completed"; task 54 should verify this cascade.

## Leakage Check

- No implementation details leaked into specs.
- All spec scenarios are written in user-facing terms (GIVEN/WHEN/THEN).
- Validation rules in specs reference event fields, not internal code structure.
- ADR decisions (SSE, optimistic rollback) are documented in `adr/` directory, not in spec files.

## Checklist

- [x] All 13 event types covered by tasks
- [x] Team filtering covered
- [x] Deduplication and ordering covered
- [x] Optimistic rollback covered
- [x] Reconnection with `Last-Event-ID` covered
- [x] ARIA live regions covered (task 34, 82)
- [x] Reduced motion preference covered (task 83)
- [x] Keyboard navigation preserved (task 74)
- [ ] **GAP: Settings toggle for disabling auto-updates** — not in tasks; add before implementation
- [x] Error states handled (toast, revert)
- [x] No technical detail in specs

## Artifacts Verified

| Artifact | Status | Notes |
|----------|--------|-------|
| proposal.md | Complete | Scope clear, 13 event types defined |
| specs-frontend | Complete | 15 scenarios across 6 requirements |
| user-flows.md | Complete | Auth → connection → event processing → UI update |
| design-system.md | Complete | Component library and tokens |
| wireframes | Complete | Structural layout for all views |
| mockups | Complete | 6 HTML files covering all states |
| tech-stack.md | Complete | 12 decisions, all interactive-reviewed |
| design-frontend.md | Complete | Component tree, routing, state, data flow |
| adr | Complete | 2 new ADRs (SSE, optimistic rollback) |
| tasks-frontend.md | Complete | 38 tasks, 1 gap identified |
| review | This file | Final review artifact |

**Recommendation:** Add the auto-updates toggle task to `tasks-frontend.md` before proceeding to implementation with `/opsx-apply`.
