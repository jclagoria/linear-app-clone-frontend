# Review — List Projects API (Frontend)

## Spec Compliance

All 6 spec requirements map to tasks:

| Spec Requirement | Covered By |
|-----------------|------------|
| Fetch on mount (loading → populated) | Tasks: `listProjects` function, `ProjectsPage` wiring, loading state |
| Status filter refetch | Tasks: `StatusFilter` component, re-fetch on filter change |
| Cursor pagination (append + hasMore guard + end indicator) | Tasks: pagination tasks in State & Data |
| 400 validation error (inline message) | Tasks: `ErrorMessage` component, loading states |
| 401 unauthorized (redirect to login) | Already handled by `apiClient` auth interceptor per existing codebase pattern |
| Empty states (filtered-to-zero, first-run) | Tasks: `EmptyState` variant refinement |

## Edge Cases

- **Network errors beyond 400/401** (500, timeout): Covered by `ErrorMessage` + retry button inline — consistent with ADR-0008
- **Missing/null teamId**: Spec validation requires it — task covers `listProjects` params validation
- **Rapid filter changes**: Re-fetch replaces list (not append) per task; implementation should debounce or cancel previous request
- **Concurrent scroll fetches**: `hasMore` guard prevents redundant fetches, but could race if cursor doesn't advance between calls — flag for implementation

## Leakage Check

- Spec stays at behaviour level (GIVEN/WHEN/THEN) — no implementation details (no Zustand, no `apiClient`, no component internals)
- Design systems referenced by component name only (StatusFilter, ProjectCard) — no HTML/CSS leak

## Checklist

- [x] All requirements covered
- [x] Scenarios pass
- [x] Error states handled (400 inline, 401 redirect, generic network via retry)
- [x] No technical detail in specs