# Review — Keyboard Module (LAG-29)

## Spec Compliance

All 6 requirements from `specs/frontend/keyboard-module/spec.md` are covered by the planning artifacts:

| Requirement | Coverage | Status |
|-------------|----------|--------|
| REQ-001: Shortcut Registration | Tasks: Scaffold, Components (shortcuts.ts) | Covered |
| REQ-002: Shortcut Execution | Tasks: State & Data (handleKeyDown, input detection) | Covered |
| REQ-003: Context Management | Tasks: State & Data (setContext, setSelectedIssue), Routing | Covered |
| REQ-004: Specificity-Based Conflict Resolution | Tasks: State & Data (handleKeyDown), ADR-001 | Covered |
| REQ-005: Shortcut Help Modal | Tasks: Components (ShortcutHelpModal), Validation (E2E tests) | Covered |
| REQ-006: Shortcut Customization | Tasks: Components (ShortcutSettingsRow), State & Data (updateCustomization), Routing (KeyboardSettingsPage) | Covered |

### Scenarios

| Scenario | Spec Location | Task Coverage | Notes |
|----------|---------------|---------------|-------|
| Register global shortcuts | REQ-001 Scenario 1 | `shortcuts.ts` task | 14 shortcuts defined |
| Define key combinations | REQ-001 Scenario 2 | `shortcuts.ts` task | Single key or sequence |
| Execute shortcut on key press | REQ-002 Scenario 1 | `handleKeyDown` task | Context-aware |
| Disable during text input | REQ-002 Scenario 2 | `handleKeyDown` task (input detection) | Input field check |
| Handle key sequences | REQ-002 Scenario 3 | `keySequenceMatcher.ts` task | Timeout handling |
| Set context on route change | REQ-003 Scenario 1 | `setContext` + Routing tasks | Route listener |
| Update on issue selection | REQ-003 Scenario 2 | `setSelectedIssue` task | Selection state |
| Clear on deselection | REQ-003 Scenario 3 | `setSelectedIssue` task | Escape/click away |
| Detail context precedence | REQ-004 Scenario 1 | `handleKeyDown` (context-specificity) | ADR-001 |
| Global shortcuts always active | REQ-004 Scenario 2 | `handleKeyDown` (global bypass) | No conflicts |
| List shortcuts require list context | REQ-004 Scenario 3 | `handleKeyDown` (list context) | List view check |
| Open help modal with ? | REQ-005 Scenario 1 | `ShortcutHelpModal` + `?` shortcut task | Modal display |
| Close help modal | REQ-005 Scenario 2 | `ShortcutHelpModal` (Escape handler) | Focus return |
| Filter shortcuts | REQ-005 Scenario 3 | `ShortcutHelpModal` (category filter) | Category tabs |
| View shortcuts in settings | REQ-006 Scenario 1 | `ShortcutSettingsRow` + `KeyboardSettingsPage` | Edit button |
| Customize shortcut | REQ-006 Scenario 2 | `updateCustomization` + validation tasks | Conflict detection |
| Reset to defaults | REQ-006 Scenario 3 | `resetCustomizations` + `DeleteConfirmModal` | Confirmation |

## Edge Cases

### Missing Scenarios

1. **Concurrent customization**: Two browser tabs customizing the same shortcut simultaneously — no conflict detection across tabs. Mitigated by localStorage being same-origin, but no cross-tab synchronization.
2. **Rapid key sequences**: User presses G then rapidly presses multiple keys — `keySequenceMatcher` should only match the defined sequence, not arbitrary combinations.
3. **Shortcut during modal open**: User presses `?` while `ShortcutHelpModal` is already open — should close the modal, not open a second one.
4. **Customization persistence failure**: localStorage quota exceeded — error handling needed in `updateCustomization`.

### Error Handling Gaps

1. **API failure on shortcut save**: Tasks mention optimistic updates with rollback, but no specific error message for save failure.
2. **SSE reconnection**: No task for handling SSE connection drops and reconnection logic.
3. **Zod validation error display**: No task for displaying Zod validation errors in the UI (only mentioned in schema).

### Boundary Conditions

1. **Maximum shortcuts per context**: No limit defined — could theoretically add unlimited shortcuts, leading to key conflicts.
2. **Sequence timeout value**: Not specified in tasks or design — needs a concrete value (e.g., 500ms).
3. **localStorage schema versioning**: No migration strategy if shortcut schema changes in future versions.

## Leakage Check

### No Technical Detail in Specs

- `specs/frontend/keyboard-module/spec.md` describes behavior only (GIVEN/WHEN/THEN)
- No implementation details (Zustand, React, TypeScript) in the spec
- Validation rules are expressed as business rules, not code
- Accessibility requirements are expressed as user outcomes, not ARIA attributes

### Design Artifacts

- `design-frontend.md` contains implementation details (appropriate for design, not spec)
- `tasks-frontend.md` contains implementation tasks (appropriate for tasks, not spec)
- `adr.md` documents architectural decisions (appropriate for ADRs, not spec)

### Consistency

- All artifacts use consistent terminology: "context", "shortcut", "sequence", "conflict"
- No contradictions between spec requirements and design decisions
- Task breakdown aligns with component tree in design

## Checklist

- [x] All requirements covered (6/6)
- [x] All scenarios covered (17/17)
- [x] Error states handled (3 gaps identified, mitigation needed)
- [x] No technical detail in specs
- [ ] Edge cases documented (4 gaps, 3 boundary conditions)
- [ ] Tasks complete (pre-implementation — all 48 tasks pending)

## Gaps Requiring Action Before Implementation

| Gap | Severity | Recommendation |
|-----|----------|----------------|
| Cross-tab shortcut conflict | Low | Accept for v1; document limitation |
| Sequence timeout value | Medium | Define 500ms default in `keySequenceMatcher.ts` |
| localStorage quota error | Medium | Add try/catch with user-friendly error message |
| SSE reconnection logic | Medium | Add reconnection task or defer to SSE library |
| Zod error display in UI | Low | Add task for error message rendering |
| Max shortcuts per context | Low | Accept unlimited for v1; no constraint needed |

## Verdict

**PASS** — Planning artifacts are complete, consistent, and cover all spec requirements. Six minor gaps identified, none blocking implementation. Proceed with `/opsx-apply`.
