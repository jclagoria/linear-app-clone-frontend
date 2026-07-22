# Issue Labels — Frontend Specification

## Behaviour

**Feature:** Issue Label Management

The application SHALL allow users to view, attach, and detach labels on an issue detail page. Label operations SHALL perform optimistically and roll back on failure. Labels SHALL be represented by a `Label` interface with a UUID-based `id` and a `name` string, replacing the current opaque `string[]` approach.

### Requirement: ViewIssueLabels

#### Scenario: LabelsAreDisplayedOnIssueDetail

- **GIVEN** the issue has two attached labels "bug" and "frontend"
- **WHEN** the user navigates to the issue detail page
- **THEN** the label badges "bug" and "frontend" are displayed in the labels section
- **AND** each label badge shows the label name

#### Scenario: NoLabelsShowsEmptyState

- **GIVEN** the issue has no labels attached
- **WHEN** the user navigates to the issue detail page
- **THEN** the labels section displays an empty state message "No labels"
- **AND** an "Add label" button is visible

#### Scenario: LabelsLoadFromServer

- **GIVEN** the user is viewing an issue
- **WHEN** the issue detail page loads
- **THEN** `fetchIssueLabels(id)` is called
- **AND** returned labels are displayed as badges

#### Scenario: LabelsLoadFailure

- **GIVEN** the server returns an error when fetching labels
- **WHEN** the issue detail page loads
- **THEN** an error message is shown in the labels section
- **AND** a retry button is available

### Requirement: AttachLabelToIssue

#### Scenario: UserAttachesLabelViaButton

- **GIVEN** the user is on the issue detail page
- **AND** a label picker or "Add label" button is visible
- **WHEN** the user selects the label "bug" from a label list
- **THEN** the label "bug" appears optimistically in the labels section
- **AND** `attachLabel(id, labelId)` is called with the issue ID and label ID
- **AND** on success, the optimistic update is confirmed

#### Scenario: AttachLabelFailure

- **GIVEN** the user attempts to attach a label
- **AND** the optimistic update has applied the label to the UI
- **WHEN** the API call fails
- **THEN** the label is removed from the labels section (rollback)
- **AND** a toast message "Failed to attach label" is shown

### Requirement: DetachLabelFromIssue

#### Scenario: UserDetachesLabelViaRemoveButton

- **GIVEN** the issue has an attached label "frontend"
- **AND** the user is on the issue detail page
- **WHEN** the user clicks the remove (X) button on the "frontend" label badge
- **THEN** the label "frontend" is removed optimistically from the labels section
- **AND** `detachLabel(id, labelId)` is called with the issue ID and label ID
- **AND** on success, the optimistic update is confirmed

#### Scenario: DetachLabelFailure

- **GIVEN** the user attempts to detach a label
- **AND** the optimistic update has removed the label from the UI
- **WHEN** the API call fails
- **THEN** the label is restored to the labels section (rollback)
- **AND** a toast message "Failed to detach label" is shown

### Requirement: LabelManagementInIssueForm

#### Scenario: LabelsFieldInCreateForm

- **GIVEN** the user opens the create issue form
- **WHEN** the form renders
- **THEN** a labels multi-select field is available
- **AND** existing label definitions are listed for selection

#### Scenario: LabelsFieldInEditForm

- **GIVEN** the user opens the edit issue form
- **WHEN** the form renders
- **THEN** the current issue labels are pre-selected in the labels field
- **AND** the user can add or remove labels
- **AND** the edited labels are submitted as `labelIds: string[]`

## User Flow

1. User navigates to `/issues/{id}` and sees the issue detail page
2. The page calls `fetchIssueLabels(id)` to load labels via the store action
3. Labels display as removable badge tags in a labels section
4. User clicks "Add label" — a label picker dropdown/modal opens showing all available labels
5. User selects a label — it attaches optimistically, API call fires, toast on failure
6. User clicks X on a label badge — it detaches optimistically, API call fires, toast on failure
7. In create/edit form, user selects/deselects labels via multi-select; labels submitted as part of the issue payload

## Components

### LabelBadge

- **Purpose**: Renders a single label name as a pill badge with optional remove button
- **Props**: `label: Label`, `onRemove?: (labelId: string) => void`, `removable?: boolean`
- **States**: default, removable (with X button)
- **Events**: `onRemove` when X is clicked

### LabelList

- **Purpose**: Renders the list of attached labels in the issue detail view
- **Props**: `labels: Label[]`, `onDetach: (labelId: string) => void`, `onAdd: () => void`, `isLoading: boolean`, `error: string | null`
- **States**: loading (skeleton), empty (no labels message + add button), error (message + retry), populated
- **Events**: `onDetach`, `onAdd`

### LabelPicker

- **Purpose**: Dropdown or popover to search and select from available label definitions
- **Props**: `labels: Label[]`, `selectedIds: string[]`, `onSelect: (labelId: string) => void`, `onClose: () => void`
- **States**: closed, open (loading available labels), open (populated), empty (no labels to pick)
- **Events**: `onSelect`, `onClose`

## Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| `/issues/:id` | `IssueDetailPage` | Shows issue detail with label management section |

No new routes are introduced. Label management is embedded in the existing issue detail page.

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| `labelIds` (on issue create/update) | MUST be an array of valid UUID label IDs | "One or more selected labels are invalid" |
| `labelId` (on attach/detach) | MUST be a non-empty valid UUID | "Invalid label identifier" |

## Accessibility

- Label badges SHALL have `role="listitem"` within a `role="list"` container
- Remove button on each badge SHALL have `aria-label="Remove {label name} label"`
- "Add label" button SHALL have `aria-label="Add label to issue"`
- Label picker SHALL use `role="listbox"` with `aria-label="Select a label"`
- Keyboard navigation: Tab to label badges, Enter/Space on remove button to detach, Escape to close label picker
- Focus MUST return to the "Add label" button after closing the label picker
- Toast notifications for attach/detach failures SHALL use `role="alert"`
