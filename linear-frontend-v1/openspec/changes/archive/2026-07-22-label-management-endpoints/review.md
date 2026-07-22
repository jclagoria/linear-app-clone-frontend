# Review — Label Management Endpoints for Issues

## Spec Compliance

- **ViewIssueLabels**: All 4 scenarios (displayed, empty state, load, failure) covered in tasks and design. `LabelList` handles loading/empty/error/populated states. ✅
- **AttachLabelToIssue**: Both scenarios (success, failure rollback) covered. `useIssueLabelsStore.attachLabel` implements optimistic update with snapshot rollback. ✅
- **DetachLabelFromIssue**: Both scenarios (success, failure rollback) covered. `useIssueLabelsStore.detachLabel` implements optimistic update with snapshot rollback. ✅
- **LabelManagementInIssueForm**: Both scenarios (create form, edit form) covered. `LabelsMultiSelect` in IssueForm with pre-selected labels for edit. ✅
- **Label data model**: `Label` interface with `id`, `name`, `color` matches spec. Issue form maintains `labelIds: string[]` submission convention. ✅

## Edge Cases

- **Double-click on attach/detach**: No guard against rapid successive clicks. Add disabled state on LabelBadge remove button during API call (covered in tasks: "disabled (during API call)").
- **LabelPicker closing on outside click**: Design specifies Escape to close but does not explicitly mention click-outside. Popover pattern typically includes both; should be confirmed during implementation.
- **Concurrent label mutations**: If two browser tabs both attach labels, optimistic updates may diverge. Acceptable for MVP; cache invalidation on success re-syncs.
- **LabelPicker with 100+ labels**: No pagination or virtualization mentioned. Acceptable MVP scope; list is typically small (<50).
- **Network offline**: Optimistic update succeeds locally, then API fails → rollback + toast. Pattern matches existing `changeStatus` / `assignIssue` error handling.

## Leakage Check

- `specs/frontend/label-management.md`: No implementation details leaked. Describes behaviour, scenarios, and component contracts without referencing Zustand, API URLs, or file paths. ✅
- `design-frontend.md`: Appropriate level of technical detail — architecture decisions, data flow, file map. ✅
- `user-flows.md`: Describes user interaction flows without implementation specifics. ✅

## Checklist

- [x] All requirements covered
- [x] Scenarios pass
- [x] Error states handled
- [x] No technical detail in specs
- [x] Optimistic rollback pattern matches existing codebase conventions
- [x] Tasks break down into independently implementable, testable units
