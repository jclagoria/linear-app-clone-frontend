# Tasks — Label Management Endpoints for Issues (Frontend)

## Scaffold

- [ ] Create `src/entities/label/` directory with `model/`, `api/`, `ui/` subdirectories
- [ ] Define `Label` interface in `src/entities/label/model/types.ts` (`id`, `name`, `color`, `createdAt`, `updatedAt`)
- [ ] Generate Zod validation schemas in `src/entities/label/model/validation.ts` (`labelIdSchema`, `labelIdsSchema`)
- [ ] Export label selectors from `src/entities/label/model/selectors/index.ts`
- [ ] Add `label` to `DEFAULT_TTLS` in `src/shared/stores/cacheStore.ts` (120s TTL)

## Components

- [ ] Create `LabelBadge` (`src/entities/label/ui/LabelBadge.tsx`) — pill badge with optional X remove button; states: default, removable, disabled (during API call)
- [ ] Create `LabelList` (`src/entities/label/ui/LabelList.tsx`) — composes LabelBadge; states: loading (skeleton), empty ("No labels" + "Add label" button), error (message + retry), populated
- [ ] Create `LabelPicker` (`src/entities/label/ui/LabelPicker.tsx`) — popover with search input; states: closed, open-loading, open-populated, open-empty; focus trap + escape to close
- [ ] Create `LabelsMultiSelect` (`src/entities/label/ui/LabelsMultiSelect.tsx`) — multi-select field for issue form; states: default, open, error; tag removal + dropdown
- [ ] Wire ARIA attributes per design: `role="list"`, `role="listitem"`, `aria-label` on remove/add buttons, `role="dialog"` on picker, `role="alert"` on toast

## State & Data

- [ ] Create `useLabelDefinitionsStore` (`src/entities/label/model/store.ts`) — fetch all label definitions, cache, `isLoading`, `error`
- [ ] Create `useIssueLabelsStore` (`src/entities/label/model/store.ts`) — fetch labels per issue, `isLoading`, `error`
- [ ] Implement optimistic `attachLabel(issueId, labelId)` with snapshot rollback in `useIssueLabelsStore`
- [ ] Implement optimistic `detachLabel(issueId, labelId)` with snapshot rollback in `useIssueLabelsStore`
- [ ] Create API functions in `src/entities/label/api/index.ts`: `fetchIssueLabels(id)`, `attachLabel(issueId, labelId)`, `detachLabel(issueId, labelId)`, `fetchLabelDefinitions()`
- [ ] Use `apiClient` from `@/shared/lib/api-client` for all API calls (consistent with existing pattern)

## Routing

- [ ] No new routes required — label management is embedded in `/issues/:id` via `IssueDetailPage`

## Integration

- [ ] Add `LabelList` + `LabelPicker` to `IssueDetailPage` — render in place of the current inline label badges (`src/pages/IssueDetailPage.tsx` lines 137-148)
- [ ] Wire `onDetach` and `onAdd` through `IssueDetail` component props to `IssueDetailPage`
- [ ] Add `LabelsMultiSelect` to `IssueForm` — replace `labels` field with multi-select widget (`src/entities/issue/ui/IssueForm.tsx`)
- [ ] Preserve `labels: string[]` in IssueFormSchema and API payloads — LabelsMultiSelect outputs `string[]` of label IDs
- [ ] Add `fetchLabelDefinitions` call on label picker open to load available labels
- [ ] Integrate cache invalidation on attach/detach (invalidate `issues:list` and `labels:` prefixes in cache store)

## Validation

- [ ] Unit tests for `useIssueLabelsStore` — `fetchLabels`, `attachLabel` (success + rollback), `detachLabel` (success + rollback)
- [ ] Unit tests for `useLabelDefinitionsStore` — `fetchLabelDefinitions`, loading/error states
- [ ] Unit tests for `LabelBadge` — renders label name, removable state, disabled state
- [ ] Unit tests for `LabelPicker` — open/close, search filter, select label, escape to close
- [ ] Unit tests for `LabelsMultiSelect` — default, open dropdown, select/deselect, error state
- [ ] Unit tests for label API functions (`src/entities/label/api/index.ts`) — fetchIssueLabels, attachLabel, detachLabel
- [ ] Update `IssueDetailPage.test.tsx` to cover label display, attach, detach flows
- [ ] Update `issuesStore.test.ts` if store-level label logic changes occur in useIssuesStore
- [ ] Integration test for label attach/detach flow on issue detail page

## Review

- [ ] Self-review: verify all file paths match `src/entities/label/` convention
- [ ] PR checklist: lint (`npm run lint`), typecheck (`npm run typecheck`), all tests pass
- [ ] Verify optimistic rollback correctly restores label list when API fails
- [ ] Verify cache invalidation fires on attach/detach
- [ ] Verify ARIA attributes and keyboard navigation per accessibility spec
