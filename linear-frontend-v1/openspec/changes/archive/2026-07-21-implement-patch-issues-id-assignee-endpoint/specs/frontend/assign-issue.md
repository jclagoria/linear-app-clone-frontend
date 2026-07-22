# Issue Assign — Frontend Specification

## Behaviour

**Feature:** Issue Assign/Unassign

The frontend SHALL provide a dedicated mechanism to assign or unassign an issue to a team member, using the dedicated `PATCH /issues/{id}/assignee` endpoint. The operation MUST validate team membership on the server and display appropriate user feedback.

### Requirement: AssignIssueApiFunction

#### Scenario: Successful assign

- **GIVEN** the user is on the issue detail page for an existing issue
- **WHEN** a valid `assigneeId` (UUID of a team member) is submitted
- **THEN** the `assignIssue(id, assigneeId)` API function sends a `PATCH /issues/{id}/assignee` request with `{ "assigneeId": "<uuid>" }`
- **AND** the response returns HTTP 200 with the updated Issue object
- **AND** the store updates the issue's `assigneeId` and `assigneeName` fields

#### Scenario: Successful unassign

- **GIVEN** the user is on the issue detail page for an assigned issue
- **WHEN** `null` is passed as `assigneeId`
- **THEN** the `assignIssue(id, null)` API function sends a `PATCH /issues/{id}/assignee` request with `{ "assigneeId": null }`
- **AND** the response returns HTTP 200 with `assigneeId: null`

#### Scenario: Assignee is not a team member

- **GIVEN** the user submits an `assigneeId` that is not a member of the issue's team
- **WHEN** the API responds with HTTP 422 and a `BUSINESS_RULE_ERROR`
- **THEN** an error notification with the business rule message is displayed to the user
- **AND** the issue's assignee state is rolled back to the previous value

### Requirement: AssignIssueStoreAction

#### Scenario: Optimistic update on assign

- **GIVEN** the issue list or detail view displays the current assignee
- **WHEN** the `assignIssue` store action is called
- **THEN** the local state optimistically updates the issue's `assigneeId` and `assigneeName` before the API responds
- **AND** the store invalidates the `issues:list` cache

#### Scenario: Rollback on failure

- **GIVEN** the store optimistically updated the issue assignee
- **WHEN** the API call fails (network error or business rule rejection)
- **THEN** the issue's assignee state is rolled back to the previous value
- **AND** a toast notification with the error message is shown

### Requirement: IssueDetailPageAssignment

#### Scenario: Assignee change via edit form

- **GIVEN** the user has the IssueDetailPage open
- **WHEN** the user opens the edit modal and changes the assignee field
- **THEN** on form submit, the page calls the store's `assignIssue` action
- **AND** a success toast "Assignee updated" is shown on completion

#### Scenario: Business rule error toast

- **GIVEN** the user submits an assignee change for a non-team member
- **WHEN** the `assignIssue` action catches a `BUSINESS_RULE_ERROR`
- **THEN** the toast displays the business rule error message from the 422 response
- **AND** the edit modal does not close (or the assignee reverts to the previous value)

## User Flow

1. User navigates to an issue detail page
2. User clicks "Edit" to open the IssueFormModal
3. User modifies the assignee field (select a different user or clear selection)
4. User submits the form
5. Frontend calls `assignIssue(id, assigneeId)` via the store action
6. On success: issue updates in the list/detail view, toast shown
7. On 422 business rule error: toast shows "Assignee is not a member of this team", state rolls back
8. On network error: toast shows "Failed to update assignee. Please try again.", state rolls back

## Components

### IssueDetailPage (modified)

- **Purpose**: Handles assignee changes through the IssueFormModal edit flow
- **Props**: (none — route page)
- **States**: same as currently (loading, error, issue loaded)
- **Events**: calls `useIssuesStore.getState().assignIssue(id, assigneeId)` on form submit

### useIssuesStore.assignIssue (new)

- **Purpose**: Dedicated action to assign/unassign an issue with optimistic update and rollback
- **Input**: `id: string`, `assigneeId: string | null`
- **Behavior**: saves previous state, calls API, updates on success, rolls back on failure
- **Side effects**: invalidates `issues:list` cache, pops toast on error

## Routing

No new routes. The existing `/issues/:id` route continues to handle assignee changes through the edit flow.

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| assigneeId | Must be UUID or null | (server-side — `BUSINESS_RULE_ERROR` if not a team member) |

## Accessibility

- Success and error toasts use `role="status"` with `aria-live="polite"` (existing pattern)
- The IssueFormModal assignee field (Select component) has appropriate ARIA labels (existing pattern)
- No new keyboard navigation required for this change
