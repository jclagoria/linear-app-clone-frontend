# Review — Implement Issue Status Transitions

## Spec Compliance

The specification covers 4 scenarios across 2 requirements. All artifacts are consistent:

| Artifact | Covers | Status |
|----------|--------|--------|
| `proposal.md` | Problem statement, motivation, scope, impact | ✅ |
| `specs/frontend/issue-status-transition.md` | 4 BDD scenarios, components, validation, a11y | ✅ |
| `user-flows.md` | Navigation graph, state transitions | ✅ |
| `design-system.md` | IssueStatusBadge anatomy, states, variants, a11y contract | ✅ |
| `wireframes/issue-detail-status-dropdown.wireframes` | Layout, states, affordances, responsive, a11y | ✅ |
| `mockups/issue-detail.html` | Interactive mockup with all states, keyboard nav | ✅ |
| `tech-stack.md` | Stack decisions validated against codebase | ✅ |
| `design-frontend.md` | Architecture decisions, component tree, data flow, error handling | ✅ |
| `adr/0010-dedicated-status-endpoint.md` | Dedicated endpoint decision recorded | ✅ |
| `tasks-frontend.md` | Scaffold, components, state, integration, validation tasks | ✅ |

## Edge Cases

- **422 BUSINESS_RULE_ERROR**: Spec covers reverting status + error toast with API message. Design adds `BusinessRuleError` class usage for type-safe handling.
- **Network error**: Spec Covers status revert + generic error toast. Design proposes pessimistic update strategy.
- **Rapid status changes**: Wireframes note queue multiple toasts. Design restricts via loading state disabling the dropdown.
- **Missing status on issue**: Wireframes note "Unknown" fallback in neutral color.
- **Concurrent generic update + status change**: Not explicitly covered — unlikely in single-user UI flow but worth noting.

## Leakage Check

- No implementation details leaked into specs
- No data-model labels in UI microcopy (user-facing status names vs internal IDs are clearly separated)
- Design decisions are in `design-frontend.md` and `adr/`, not in specs

## Checklist

- [x] All requirements covered — 4 scenarios across ChangeStatusFromDropdown + StatusDropdownStates
- [x] Scenarios pass — valid transition, invalid transition (422), terminal state, network error
- [x] Error states handled — 422 BUSINESS_RULE_ERROR, network error, missing issue
- [x] No technical detail in specs — specs are behaviour-only; implementation decisions in design/adr
- [x] All artifacts reference each other consistently — component names, route paths, API contracts align
