# Issue Watchers — Frontend Specification

## Behaviour

**Feature:** Issue Watchers

The issue detail view SHALL display a list of users watching the issue and provide a toggle for the authenticated user to subscribe or unsubscribe.

### Requirement: ViewWatchers

#### Scenario: Watchers displayed on issue detail

- **GIVEN** the user is viewing an issue detail page
- **WHEN** the page loads
- **THEN** a list of watchers is displayed below the issue metadata
- **AND** each watcher entry shows the user's name and avatar

#### Scenario: Empty watcher list

- **GIVEN** the issue has no watchers
- **WHEN** the page loads
- **THEN** a label reading "No watchers yet" is shown

#### Scenario: Loading state

- **GIVEN** the watchers are being fetched
- **WHEN** the page is loading
- **THEN** a skeleton loader is displayed in place of the watcher list

#### Scenario: Fetch failure

- **GIVEN** the watcher API request fails
- **WHEN** the page has loaded
- **THEN** an error message is displayed with a retry action

### Requirement: ToggleWatch

#### Scenario: Subscribe to an issue

- **GIVEN** the user is not watching the current issue
- **WHEN** the user clicks the "Watch" button
- **THEN** the button text changes to "Watching"
- **AND** the user is added to the watcher list optimistically
- **AND** a success toast is shown

#### Scenario: Unsubscribe from an issue

- **GIVEN** the user is watching the current issue
- **WHEN** the user clicks the "Watching" button
- **THEN** the button text changes to "Watch"
- **AND** the user is removed from the watcher list optimistically
- **AND** a success toast is shown

#### Scenario: Conflict on subscribe (already watching)

- **GIVEN** the user is already watching the issue
- **WHEN** the watch request returns a 409 Conflict
- **THEN** the optimistic state is reverted
- **AND** the UI refreshes to reflect actual server state

#### Scenario: Business rule violation on action

- **GIVEN** the API returns a 422 Business Rule Error
- **WHEN** any watcher action is attempted
- **THEN** the error message from the server is displayed in a toast
- **AND** the UI state is reverted

## User Flow

1. User navigates to an issue detail page
2. Page loads issue metadata and watchers in parallel
3. Watcher list renders — shows "Watch" button if user is not watching, "Watching" if they are
4. User clicks "Watch" → optimistic add → POST /api/v1/issues/{id}/watchers → UI updates
5. User clicks "Watching" → optimistic remove → DELETE /api/v1/issues/{id}/watchers/{userId} → UI updates
6. On error, optimistic changes are reverted and a toast shows the error

## Components

### WatcherList

- **Purpose**: Displays the list of users watching an issue
- **Props**: `watchers: Watcher[]`, `isLoading: boolean`, `error: string | null`, `onRetry: () => void`
- **States**: loading (skeleton), empty ("No watchers yet"), error (retry prompt), populated (list)
- **Events**: none

### WatchButton

- **Purpose**: Toggle button to subscribe/unsubscribe from an issue
- **Props**: `isWatching: boolean`, `isLoading: boolean`, `onToggle: () => void`
- **States**: watching (filled icon + "Watching"), not watching (outline icon + "Watch"), loading (spinner)
- **Events**: `onToggle` emitted on click

## Routing

No new routes. Watchers are rendered on the existing issue detail page at `/issues/:id`.

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| userId (POST body) | MUST be a valid UUID | "Invalid user identifier" |

## Accessibility

- WatchButton SHALL use `aria-pressed` to reflect toggle state
- WatchButton SHALL have an `aria-label` describing the action (e.g., "Watch this issue", "Unwatch this issue")
- WatcherList SHALL use a `<ul>` with `role="list"` and `aria-label="Watchers"`
- Error states SHALL use `role="alert"` for screen reader announcements
- Loading skeleton SHALL have `aria-busy="true"`
