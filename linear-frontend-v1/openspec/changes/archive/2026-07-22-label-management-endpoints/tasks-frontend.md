# Tasks — Label Management Endpoints for Issues (Frontend)

## Scaffold

- [x] Create `src/entities/label/` directory with `model/`, `api/`, `ui/` subdirectories
- [x] Define `Label` interface in `src/entities/label/model/types.ts` (`id`, `name`, `color`, `createdAt`, `updatedAt`)
- [x] Generate Zod validation schemas in `src/entities/label/model/validation.ts` (`labelIdSchema`, `labelIdsSchema`)
- [x] Export label selectors from `src/entities/label/model/selectors/index.ts`
- [x] Add `label` to `DEFAULT_TTLS` in `src/shared/stores/cacheStore.ts` (120s TTL)

## Components

- [x] Create `LabelBadge` (`src/entities/label/ui/LabelBadge.tsx`) — pill badge with optional X remove button; states: default, removable, disabled (during API call)
- [x] Create `LabelList` (`src/entities/label/ui/LabelList.tsx`) — composes LabelBadge; states: loading (skeleton), empty ("No labels" + "Add label" button), error (message + retry), populated
- [x] Create `LabelPicker` (`src/entities/label/ui/LabelPicker.tsx`) — popover with search input; states: closed, open-loading, open-populated, open-empty; focus trap + escape to close
- [x] Create `LabelsMultiSelect` (`src/entities/label/ui/LabelsMultiSelect.tsx`) — multi-select field for issue form; states: default, open, error; tag removal + dropdown
- [x] Wire ARIA attributes per design: `role="list"`, `role="listitem"`, `aria-label` on remove/add buttons, `role="dialog"` on picker, `role="alert"` on toast

## State & Data

- [x] Create `useLabelDefinitionsStore` (`src/entities/label/model/store.ts`) — fetch all label definitions, cache, `isLoading`, `error`
- [x] Create `useIssueLabelsStore` (`src/entities/label/model/store.ts`) — fetch labels per issue, `isLoading`, `error`
- [x] Implement optimistic `attachLabel(issueId, labelId)` with snapshot rollback in `useIssueLabelsStore`
- [x] Implement optimistic `detachLabel(issueId, labelId)` with snapshot rollback in `useIssueLabelsStore`
- [x] Create API functions in `src/entities/label/api/index.ts`: `fetchIssueLabels(id)`, `attachLabel(issueId, labelId)`, `detachLabel(issueId, labelId)`, `fetchLabelDefinitions()`
- [x] Use `apiClient` from `@/shared/lib/api-client` for all API calls (consistent with existing pattern)

## Routing

- [x] No new routes required — label management is embedded in `/issues/:id` via `IssueDetailPage`

## Integration

- [x] Add `LabelList` + `LabelPicker` to `IssueDetailPage` — render in place of the current inline label badges (`src/pages/IssueDetailPage.tsx` lines 137-148)
- [x] Wire `onDetach` and `onAdd` through `IssueDetail` component props to `IssueDetailPage`
- [x] Add `LabelsMultiSelect` to `IssueForm` — replace `labels` field with multi-select widget (`src/entities/issue/ui/IssueForm.tsx`)
- [x] Preserve `labels: string[]` in IssueFormSchema and API payloads — LabelsMultiSelect outputs `string[]` of label IDs
- [x] Add `fetchLabelDefinitions` call on label picker open to load available labels
- [x] Integrate cache invalidation on attach/detach (invalidate `issues:list` and `labels:` prefixes in cache store)

## Validation

- [x] Unit tests for `useIssueLabelsStore` — `fetchLabels`, `attachLabel` (success + rollback), `detachLabel` (success + rollback)
- [x] Unit tests for `useLabelDefinitionsStore` — `fetchLabelDefinitions`, loading/error states
- [x] Unit tests for `LabelBadge` — renders label name, removable state, disabled state
- [x] Unit tests for `LabelPicker` — open/close, search filter, select label, escape to close
- [x] Unit tests for `LabelsMultiSelect` — default, open dropdown, select/deselect, error state
- [x] Unit tests for label API functions (`src/entities/label/api/index.ts`) — fetchIssueLabels, attachLabel, detachLabel
- [x] Update `IssueDetailPage.test.tsx` to cover label display, attach, detach flows
- [ ] Update `issuesStore.test.ts` if store-level label logic changes occur in useIssuesStore (no label-specific changes in issuesStore — `labels: string[]` is part of Issue type, not separate logic)
- [x] Integration test for label attach/detach flow on issue detail page

## Review

- [x] Self-review: all file paths follow `src/entities/label/` convention
- [ ] PR checklist: lint (`npm run lint`), typecheck (`npm run typecheck`), all tests pass (run before merge)
- [x] Verify optimistic rollback correctly restores label list when API fails — implemented in `store.ts` lines 117-123, 145-151; tested in `useIssueLabelsStore.test.ts`
- [x] Verify cache invalidation fires on attach/detach — implemented in `store.ts` lines 111-112, 139-140; tested in `useIssueLabelsStore.test.ts`
- [x] Verify ARIA attributes and keyboard navigation per accessibility spec — present in all components; tested in component tests
