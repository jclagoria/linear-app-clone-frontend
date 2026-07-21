# Issue Status — Frontend Specification

## Behaviour

**Feature:** Issue Status Transition

The frontend SHALL provide a status dropdown in the issue detail view that allows users to transition an issue through the default workflow. Status changes MUST be sent to the dedicated `PATCH /issues/{id}/status` endpoint which validates transitions. Invalid transitions MUST surface an error toast to the user.

### Requirement: ChangeStatusFromDropdown

#### Scenario: User transitions issue to a valid next status

- **GIVEN** the user is on the issue detail page viewing an issue with status "Todo"
- **WHEN** the user opens the status dropdown and selects "In Progress"
- **THEN** the dropdown displays a loading state while the request is in flight
- **AND** the status updates to "In Progress" on success
- **AND** a success toast is shown

#### Scenario: User attempts an invalid transition

- **GIVEN** the user is on the issue detail page viewing an issue with status "Todo"
- **WHEN** the user opens the status dropdown and selects "Done"
- **THEN** the status reverts to "Todo"
- **AND** an error toast is displayed with the message "Invalid transition: Cannot move from Todo to Done directly"

#### Scenario: User moves issue to a terminal state

- **GIVEN** the user is on the issue detail page viewing an issue with status "In Progress"
- **WHEN** the user opens the status dropdown and selects "Done"
- **THEN** the status updates to "Done"
- **AND** the completed timestamp is reflected in the UI metadata

#### Scenario: Network error on status change

- **GIVEN** the user is on the issue detail page
- **WHEN** the user changes the status but the network request fails
- **THEN** the status reverts to its previous value
- **AND** an error toast is displayed

### Requirement: StatusDropdownStates

#### Scenario: Dropdown shows available transitions

- **GIVEN** the user is on the issue detail page
- **WHEN** the user opens the status dropdown
- **THEN** the dropdown lists all statuses from the workflow: Backlog, Todo, In Progress, Done, Canceled

#### Scenario: Loading state during transition

- **GIVEN** the user has selected a new status
- **WHEN** the API request is pending
- **THEN** the dropdown button shows a spinner
- **AND** the dropdown is disabled to prevent concurrent changes

## User Flow

1. User navigates to the issue detail page
2. User sees the current status displayed as a pill/badge with a dropdown affordance
3. User clicks the status pill to open the dropdown menu
4. Dropdown lists all workflow statuses (Backlog, Todo, In Progress, Done, Canceled)
5. User selects a target status
6. Frontend sends `PATCH /issues/{id}/status` with `{ statusId }`
7. On 200: UI updates optimistically to new status, success toast appears
8. On 422: UI reverts status, error toast shows BUSINESS_RULE_ERROR message
9. On network error: UI reverts status, generic error toast

## Components

### IssueStatusBadge

- **Purpose**: Displays current issue status as a styled pill with a dropdown to change status
- **Props**: `issue: Issue`, `onStatusChange: (statusId: string) => Promise<void>`
- **States**:
  - `default`: Shows status label with color-coded background
  - `open`: Dropdown menu visible listing all status options
  - `loading`: Shows spinner on the button, dropdown disabled
  - `error`: Toast notification with error message
- **Events**: `onStatusChange(selectedStatusId)`

### ToastNotification

- **Purpose**: Displays success or error feedback after a status transition attempt
- **Props**: `title: string`, `variant: 'success' | 'error'`, `duration: number`

## Routing

No new routes. The status dropdown lives within the existing `IssueDetailPage` route (`/issues/:id`).

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| statusId | Must be a valid UUID format | "Invalid status selection" |
| transition | Must be a valid workflow transition (422 from API) | Displayed from API error response |

## Accessibility

- Status dropdown SHALL use `aria-haspopup="listbox"` and `aria-expanded`
- Dropdown items SHALL have `role="option"` with `aria-selected`
- Keyboard navigation: Enter/Space to open dropdown, Arrow keys to navigate options, Enter to select, Escape to close
- Status change announcements SHALL be conveyed via a live region or toast
- Loading state SHALL use `aria-busy="true"` on the trigger button
- Error toasts SHALL have `role="alert"`
