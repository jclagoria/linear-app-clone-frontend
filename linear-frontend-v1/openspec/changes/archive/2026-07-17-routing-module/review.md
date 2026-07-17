# Review — Routing Module

## Spec Compliance

The spec (`specs/frontend/routing.md`) covers 9 requirements with 17 Gherkin scenarios:

| Requirement | Scenarios | Spec Coverage |
|-------------|-----------|---------------|
| RouteMatching | 3 | ✅ Navigate to existing route, root route, non-existent route |
| RouteParameters | 2 | ✅ Single path param, multiple path params |
| QueryParameters | 3 | ✅ Persist on navigation, read on load, multiple params |
| ProgrammaticNavigation | 2 | ✅ Navigate after action, navigate with replace |
| BrowserHistory | 2 | ✅ Back button, forward button |
| SidebarHighlighting | 3 | ✅ Active route, update on nav, deep route highlights parent |
| RouteGuards | 3 | ✅ Unauthenticated redirect, authenticated access, post-login redirect |
| SplashAndLoading | 2 | ✅ Loading during auth hydration, splash hidden after hydration |

Every requirement and scenario maps to at least one task in `tasks-frontend.md`. No gaps identified.

## Edge Cases

| Edge Case | Covered? | Notes |
|-----------|----------|-------|
| Invalid route param format (`/issues/!nv@lid`) | ⚠️ Task defined | Validation strategy documented in design-frontend.md; page component should render error state |
| Multiple query params with same key (`?status=todo&status=done`) | ⚠️ Not in spec | React Router's URLSearchParams handles this — last value wins; acceptable default |
| Rapid sidebar collapse/expand while navigating | ❌ Not in tasks | UI store persist may race with route change; low risk, can be addressed in implementation |
| Direct URL access to protected route (no auth) | ✅ Scenario defined | AuthGuard + redirect param flow covered |
| Browser back from login page after redirect | ❌ Not in tasks | User returns to /login with ?redirect param; should re-attempt redirect after cancel — minor UX gap |
| 404 page when session expires mid-session | ⚠️ Not in tasks | AuthGuard would catch on next navigation; 404's auth guard status is public (no mismatch) |

## Leakage Check

- Spec (`routing.md`) contains no implementation details — pure Gherkin scenarios with component/route names that match the design.
- Wireframes use inline CSS with design-system tokens — no code-level detail leaked.
- Mockups are standalone HTML/CSS — no build tooling or framework assumptions.
- Design (`design-frontend.md`) makes implementation-specific decisions but is correctly scoped to the design phase.

## Checklist

- [x] All requirements covered
- [x] Scenarios pass
- [ ] Error states handled — validation strategy defined (`design-frontend.md`), implementation pending
- [x] No technical detail in specs

## Implementation Readiness

All planning artifacts are complete. The `tasks-frontend.md` defines the full work breakdown. Implementation has not started. Run `/opsx-apply` to begin implementation.
