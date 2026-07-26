# Real-time Events — Frontend Specification

## Behaviour

**Feature:** Real-time Event Processing via WebSocket

The frontend SHALL process incoming WebSocket events and mutate application state accordingly, ensuring all connected users see consistent, up-to-date data without manual refresh.

### Requirement: Issue Event Processing

#### Scenario: Issue Created Event Received

- **GIVEN** the user is authenticated and connected to the WebSocket
- **WHEN** an `issue.created` event is received for the current team
- **THEN** the new issue SHALL appear in the relevant issue list view
- **AND** the issue count in sidebar navigation SHALL update
- **AND** the issue SHALL NOT appear in views filtered to other teams

#### Scenario: Issue Updated Event Received

- **GIVEN** the user is viewing an issue list or detail panel
- **WHEN** an `issue.updated` event is received for an existing issue
- **THEN** the issue's displayed fields SHALL update to reflect the new values
- **AND** the update SHALL NOT cause a full page reload
- **AND** any in-progress edits by the current user on the same issue SHALL NOT be overwritten

#### Scenario: Issue Status Changed Event Received

- **GIVEN** the user is viewing a board or list view grouped by status
- **WHEN** an `issue.statusChanged` event is received
- **THEN** the issue SHALL move to the column/section matching its new status
- **AND** the status badge on the issue card SHALL display the updated status
- **AND** the transition SHALL be visually smooth without layout jump

#### Scenario: Issue Assigned Event Received

- **GIVEN** the user is viewing an issue list with assignee visible
- **WHEN** an `issue.assigned` event is received
- **THEN** the assignee avatar/name SHALL update on the issue card
- **AND** if the issue was assigned to the current user, it SHALL appear in "My Issues" view

#### Scenario: Issue Unassigned Event Received

- **GIVEN** the user is viewing an issue with an assignee
- **WHEN** an `issue.unassigned` event is received
- **THEN** the assignee field SHALL display as unassigned
- **AND** the issue SHALL be removed from the assignee's "My Issues" view

#### Scenario: Issue Deleted Event Received

- **GIVEN** the user is viewing an issue list containing the target issue
- **WHEN** an `issue.deleted` event is received
- **THEN** the issue SHALL be removed from all list views
- **AND** if the user is viewing the issue detail, a "Issue not found" state SHALL be shown
- **AND** the issue count SHALL decrement

### Requirement: Comment Event Processing

#### Scenario: Comment Created Event Received

- **GIVEN** the user is viewing an issue's detail panel with comments visible
- **WHEN** a `comment.created` event is received for that issue
- **THEN** the new comment SHALL appear at the correct position in the comment thread
- **AND** the comment count badge SHALL increment
- **AND** the comment author's avatar and timestamp SHALL be displayed

#### Scenario: Comment Updated Event Received

- **GIVEN** the user is viewing an issue's comment thread
- **WHEN** a `comment.updated` event is received
- **THEN** the edited comment SHALL reflect the updated content
- **AND** an "edited" indicator SHALL be visible on the comment
- **AND** the original timestamp SHALL be preserved

### Requirement: Project Event Processing

#### Scenario: Project Created Event Received

- **GIVEN** the user is viewing the project list
- **WHEN** a `project.created` event is received
- **THEN** the new project SHALL appear in the project list
- **AND** the project count SHALL increment
- **AND** the project's team filter SHALL be respected

#### Scenario: Project Updated Event Received

- **GIVEN** the user is viewing a project list or detail
- **WHEN** a `project.updated` event is received
- **THEN** the project's displayed properties SHALL update
- **AND** if the project name changed, the sidebar link SHALL reflect the new name

### Requirement: Cycle Event Processing

#### Scenario: Cycle Created Event Received

- **GIVEN** the user is viewing the cycles list for a team
- **WHEN** a `cycle.created` event is received
- **THEN** the new cycle SHALL appear in the cycles list
- **AND** the cycle SHALL show as "Upcoming" status

#### Scenario: Cycle Activated Event Received

- **GIVEN** the user is viewing the cycles list
- **WHEN** a `cycle.activated` event is received
- **THEN** the cycle's status badge SHALL change to "Active"
- **AND** the cycle SHALL move to the active cycle position in the UI
- **AND** any previously active cycle SHALL transition to "Completed"

#### Scenario: Cycle Completed Event Received

- **GIVEN** the user is viewing the cycles list
- **WHEN** a `cycle.completed` event is received
- **THEN** the cycle's status badge SHALL change to "Completed"
- **AND** the completion date SHALL be displayed

### Requirement: Notification Event Processing

#### Scenario: Notification Created Event Received

- **GIVEN** the user is authenticated and connected
- **WHEN** a `notification.created` event is received for the current user
- **THEN** the notification count badge in the header SHALL increment
- **AND** the notification SHALL appear in the notifications dropdown
- **AND** the notification content SHALL match the event payload

### Requirement: Event Relevance Filtering

#### Scenario: Event for Different Team Received

- **GIVEN** the user is viewing issues for team "Frontend"
- **WHEN** an `issue.updated` event is received for team "Backend"
- **THEN** the event SHALL be silently ignored
- **AND** no UI update SHALL occur
- **AND** the event processing latency SHALL NOT be impacted

#### Scenario: Event for Issue Not in Current View

- **GIVEN** the user is viewing a filtered issue list
- **WHEN** an event is received for an issue not matching the current filter
- **THEN** the event SHALL be processed for state consistency
- **AND** the issue SHALL NOT appear in the current filtered view
- **AND** the issue SHALL appear when the user navigates to an unfiltered view

### Requirement: Event Ordering and Deduplication

#### Scenario: Multiple Events for Same Issue Received

- **GIVEN** the user receives `issue.updated` and `issue.statusChanged` events for the same issue within 100ms
- **WHEN** both events are processed
- **THEN** the issue SHALL reflect the final state from the last event
- **AND** no intermediate flicker SHALL be visible
- **AND** the UI SHALL update once with the final state

#### Scenario: Duplicate Event Received

- **GIVEN** the same event is received twice due to network conditions
- **WHEN** the duplicate event is processed
- **THEN** the state mutation SHALL be applied only once
- **AND** no duplicate DOM elements SHALL be created

## User Flow

1. User authenticates and WebSocket connection is established
2. User navigates to issue list, project list, or cycle view
3. Frontend subscribes to relevant events for the current team/view
4. Incoming events are validated and deduplicated
5. Events matching current view trigger state mutations
6. UI re-renders with updated data without page refresh
7. Events for other teams/views are silently discarded

## Components

### RealtimeEventProcessor

- **Purpose**: Routes incoming WebSocket events to appropriate store mutations
- **Props**: `eventBus`, `stores`
- **States**: connected, disconnected, reconnecting
- **Events**: eventReceived, eventProcessed, eventIgnored

### IssueEvent handler

- **Purpose**: Processes issue-related WebSocket events
- **Props**: `issuesStore`, `eventPayload`
- **States**: idle, processing, error
- **Events**: issueCreated, issueUpdated, issueDeleted

### CommentEvent handler

- **Purpose**: Processes comment-related WebSocket events
- **Props**: `issuesStore`, `eventPayload`
- **States**: idle, processing, error
- **Events**: commentCreated, commentUpdated

### ProjectEvent handler

- **Purpose**: Processes project-related WebSocket events
- **Props**: `projectsStore`, `eventPayload`
- **States**: idle, processing, error
- **Events**: projectCreated, projectUpdated

### CycleEvent handler

- **Purpose**: Processes cycle-related WebSocket events
- **Props**: `cyclesStore`, `eventPayload`
- **States**: idle, processing, error
- **Events**: cycleCreated, cycleActivated, cycleCompleted

### NotificationEvent handler

- **Purpose**: Processes notification-related WebSocket events
- **Props**: `notificationsStore`, `eventPayload`
- **States**: idle, processing, error
- **Events**: notificationCreated

## Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| /teams/:teamId/issues | IssueListView | Displays real-time issue list for team |
| /teams/:teamId/issues/:issueId | IssueDetailView | Displays real-time issue details and comments |
| /teams/:teamId/projects | ProjectListView | Displays real-time project list |
| /teams/:teamId/cycles | CycleListView | Displays real-time cycle list |

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| event.type | Must be one of the 13 defined event types | Unknown event type |
| event.teamId | Must match a valid team | Invalid team reference |
| event.issueId | Required for issue events | Missing issue identifier |
| event.timestamp | Must be valid ISO 8601 | Invalid event timestamp |

## Accessibility

- Screen readers SHALL announce real-time updates via ARIA live regions
- Focus SHALL NOT be moved automatically when new items appear
- Users SHALL be able to disable auto-updates via a toggle in settings
- Keyboard navigation SHALL remain functional during state updates
- Updated content SHALL have appropriate ARIA attributes for assistive technology
