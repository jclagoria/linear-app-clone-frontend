# Label Management — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| Label entity location | New `entities/label/` slice | Labels are a distinct business entity shared across issues; avoids coupling to `entities/issue/` | Cross-slice dependency: `entities/issue/` imports `entities/label/` types |
| Label state | Dedicated `useLabelsStore` (Zustand) | Separate concerns from `useIssuesStore`; labels are a resource with their own CRUD lifecycle | Two stores to hydrate on issue detail page |
| Optimistic attach/detach | Store action with snapshot rollback | Consistent with existing `changeStatus` / `assignIssue` pattern in issues store | Extra boilerplate per action; rollback must handle edge case where label list changes between actions |
| LabelPicker UI | Inline popover (no modal) | Faster interaction; escape to close matches wireframe spec | Popover must handle focus trap and scroll confinement manually |
| Issue form labels field | Multi-select variant in IssueForm | Reuses existing form pattern; `labelIds: string[]` submitted in payload | No inline popover in form — uses native multi-select UX |

## Label Data Model

```typescript
// src/entities/label/model/types.ts
export interface Label {
  id: string
  name: string
  color: string  // hex color for the badge dot
  createdAt: string
  updatedAt: string
}
```

The existing `Issue.labels: string[]` SHALL be replaced with a `Label[]` slice on the issue entity, and `IssueFilters.labelIds: string[]` SHALL remain for filter query params. The `CreateIssueData.labels` and `UpdateIssueData.labels` SHALL remain `string[]` (label IDs) for API submission.

## Component Tree

```
IssueDetailPage
├── IssueDetail
│   ├── BackButton
│   ├── IssueStatusBadge
│   ├── LabelList (new)                  ← labels section
│   │   ├── LabelBadge (new) [0..*]
│   │   ├── SkeletonLoader (loading state)
│   │   ├── EmptyState (empty state)
│   │   └── ErrorBanner (error state)
│   ├── DescriptionSection
│   ├── ActionButtons
│   ├── WatcherSection
│   ├── CommentList
│   └── LabelPicker (new, conditional)   ← popover for add
│       ├── TextInput (search)
│       └── LabelPickerOption [0..*]

IssueFormModal
└── IssueForm
    ├── TextInput (title)
    ├── Textarea (description)
    ├── LabelsMultiSelect (new)          ← multi-select field
    │   ├── Tag (selected labels)
    │   └── Dropdown (available labels)
    ├── Select (priority)
    └── Select (assignee)
```

| Component | Responsibility | Props | State |
|-----------|---------------|-------|-------|
| LabelBadge | Renders single label as pill badge with optional remove | `label: Label`, `onRemove?: (id: string) => void`, `removable?: boolean` | default, removable, disabled (during API call) |
| LabelList | Composes LabelBadge with states (loading/empty/error/populated) | `labels: Label[]`, `onDetach`, `onAdd`, `isLoading`, `error` | loading, empty, populated, error |
| LabelPicker | Popover to search and select label definitions | `labels: Label[]`, `selectedIds: string[]`, `onSelect`, `onClose` | closed, open-populated, open-empty, open-loading |
| LabelsMultiSelect | Multi-select field inside issue form | `options: Label[]`, `selected: string[]`, `onChange`, `error?` | default, open, error |

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| `/issues/:id` | IssueDetailPage | protected | Label management embedded; no new routes |

## State Management

| Scope | Store | Data | Pattern |
|-------|-------|------|---------|
| Label definitions (all) | `useLabelDefinitionsStore` | `Label[]`, `isLoading`, `error` | Fetch once, cache; used by LabelPicker |
| Label attachments (per issue) | `useIssueLabelsStore` | `Label[]`, `isLoading`, `error` | Fetch on IssueDetail mount; optimistic attach/detach |
| Issue form labels | Local form state (react-hook-form) | `string[]` (label IDs) | Submitted with form; no separate API call for labels |

### Optimistic Update Pattern

```
attachLabel(issueId, labelId) →
  1. Save previous labels snapshot
  2. Optimistically add label to UI
  3. POST /api/v1/issues/{issueId}/labels
  4a. Success → invalidate cache, confirm
  4b. Failure → rollback to snapshot, toast "Failed to attach label"
```

## Data Fetching

| Operation | Method | Endpoint | Cache Strategy |
|-----------|--------|----------|----------------|
| List issue labels | GET | `/api/v1/issues/{issueId}/labels` | Cache with `useCacheStore`; invalidate on attach/detach |
| List label definitions | GET | `/api/v1/labels` | Cache with `useCacheStore`; invalidate on create |
| Attach label | POST | `/api/v1/issues/{issueId}/labels` | Optimistic; invalidate issue labels cache |
| Detach label | DELETE | `/api/v1/issues/{issueId}/labels/{labelId}` | Optimistic; invalidate issue labels cache |
| Create label (admin) | POST | `/api/v1/labels` | Pessimistic; invalidate definitions cache |

- **Error handling**: ErrorBanner in LabelList for fetch failures; Toast for attach/detach failures
- **Optimistic updates**: Snapshot + rollback pattern matching existing `changeStatus` in `useIssuesStore`

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| Tag icon | `lucide-react` `Tag` | Label badge decorative icon |
| X icon | `lucide-react` `X` | Remove button on badges and multi-select tags |
| Plus icon | `lucide-react` `Plus` | "+ Add label" button |
| Search icon | `lucide-react` `Search` | LabelPicker search input |
| Check icon | `lucide-react` `Check` | Selected state in dropdown options |
| AlertCircle icon | `lucide-react` `AlertCircle` | Error toast icon |

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| `labelIds` (issue form) | MUST be array of valid UUID strings | "One or more selected labels are invalid" |
| `labelId` (attach/detach) | MUST be non-empty valid UUID | "Invalid label identifier" |
| LabelPicker search | Client-side filter, no validation | — |

Validation is applied:
- **Client-side**: Zod schema in `entities/label/model/validation.ts` for label form data
- **Server-side**: API response error for `labelIds` — rendered as inline field error in IssueForm

## Accessibility

| Concern | Implementation |
|---------|----------------|
| Keyboard: LabelList | Tab through badges; Enter/Space on remove button to detach; Tab to "Add label" to open picker |
| Keyboard: LabelPicker | Arrow Up/Down navigate options; Enter/Space to select; Escape to close; focus trapped |
| Keyboard: LabelsMultiSelect | Tab to field; Arrow keys navigate dropdown; Enter/Space toggle; Escape close |
| ARIA: LabelList | `role="list"` with `aria-label="Issue labels"`; each badge `role="listitem"` |
| ARIA: LabelPicker | `role="dialog"` with `aria-label="Select a label"`; options `role="option"` |
| ARIA: Remove button | `aria-label="Remove {label name} label"` on each badge X button |
| ARIA: Add label button | `aria-label="Add label to issue"` |
| ARIA: Form labels field | Search input `aria-label="Search labels"`; tag remove `aria-label="Remove {name} label"` |
| ARIA: Toast | `role="alert"` on failure notifications |
| Focus management | After LabelPicker closes, focus returns to "Add label" trigger button |
| Target size | All interactive elements ≥24×24 CSS px |

## File Map

```
src/entities/label/
  model/
    types.ts          — Label interface
    validation.ts     — Zod schemas for label operations
    store.ts          — useLabelDefinitionsStore, useIssueLabelsStore
    selectors/
      index.ts        — Label selectors
  api/
    index.ts          — fetchIssueLabels, attachLabel, detachLabel API calls
  ui/
    LabelBadge.tsx    — Single label pill badge
    LabelList.tsx     — Label section with states
    LabelPicker.tsx   — Label definition picker popover
    LabelsMultiSelect.tsx — Multi-select for issue form
```
