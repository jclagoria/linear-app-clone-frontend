# Realtime Module — Event Subscription & Processing

## Behaviour

**Feature:** Real-time Event Subscription and Processing

The system SHALL subscribe to 15 event types from the WebSocket gateway and route each event to the appropriate Zustand store for state updates. Events SHALL be processed in order, deduplicated, and validated before state mutation.

### Requirement: Event Type Registry

#### Scenario: All Event Types Registered

- **GIVEN** the WebSocket connection is established
- **WHEN** the event subscription system initializes
- **THEN** subscriptions SHALL be registered for all 15 event types:
  - Issue: `issue.created`, `issue.updated`, `issue.statusChanged`, `issue.assigned`, `issue.unassigned`, `issue.deleted`
  - Comment: `comment.created`, `comment.updated`
  - Project: `project.created`, `project.updated`
  - Cycle: `cycle.created`, `cycle.updated`, `cycle.activated`, `cycle.completed`
  - Notification: `notification.created`

### Requirement: Team Channel Auto-Subscription

#### Scenario: Subscribe to Current Team Channel

- **GIVEN** the user is authenticated and has an active team selected
- **WHEN** the WebSocket connection establishes
- **THEN** the system SHALL automatically subscribe to the current team's event channel
- **AND** events from other teams SHALL be ignored

#### Scenario: Team Switch Subscription Update

- **GIVEN** the user switches to a different team
- **WHEN** the team selection changes
- **THEN** the system SHALL unsubscribe from the previous team's channel
- **AND** subscribe to the new team's channel
- **AND** no events SHALL be missed during the transition

### Requirement: Event Processing Pipeline

#### Scenario: Valid Event Processing

- **GIVEN** a valid event is received from the WebSocket
- **WHEN** the event enters the processing pipeline
- **THEN** the event SHALL be validated against the expected schema
- **AND** the event SHALL be deduplicated (duplicate event IDs ignored)
- **AND** the event SHALL be routed to the appropriate store handler
- **AND** the store state SHALL be updated accordingly

#### Scenario: Invalid Event Handling

- **GIVEN** an event is received with invalid payload structure
- **WHEN** the event fails validation
- **THEN** the event SHALL be logged to console with error details
- **AND** the event SHALL NOT be processed further
- **AND** the invalid event SHALL NOT affect other pending events

#### Scenario: Event Deduplication

- **GIVEN** two events with the same event ID are received
- **WHEN** the second event arrives
- **THEN** the second event SHALL be silently ignored
- **AND** the first event SHALL have already been processed

### Requirement: Event Routing

#### Scenario: Issue Event Routing

- **GIVEN** an `issue.*` event is received
- **WHEN** the event is processed
- **THEN** the event SHALL be routed to the Issues Store
- **AND** the Issues Store SHALL update the issue list or selected issue accordingly

#### Scenario: Comment Event Routing

- **GIVEN** a `comment.*` event is received
- **WHEN** the event is processed
- **THEN** the event SHALL be routed to the Issues Store (comments are nested in issues)
- **AND** the comment list for the relevant issue SHALL be updated

#### Scenario: Project Event Routing

- **GIVEN** a `project.*` event is received
- **WHEN** the event is processed
- **THEN** the event SHALL be routed to the Projects Store
- **AND** the project list SHALL be updated

#### Scenario: Cycle Event Routing

- **GIVEN** a `cycle.*` event is received
- **WHEN** the event is processed
- **THEN** the event SHALL be routed to the Cycles Store
- **AND** the cycle list or active cycle SHALL be updated

#### Scenario: Notification Event Routing

- **GIVEN** a `notification.*` event is received
- **WHEN** the event is processed
- **THEN** the event SHALL be routed to the WebSocket Store (notifications array)
- **AND** the unread notification count SHALL increment
- **AND** a toast notification MAY be displayed for urgent notifications

### Requirement: Event Ordering

#### Scenario: Sequential Processing

- **GIVEN** multiple events arrive in rapid succession
- **WHEN** events are queued for processing
- **THEN** events SHALL be processed in the order they were received
- **AND** no event SHALL be processed out of sequence

#### Scenario: Event Processing Async

- **GIVEN** an event is being processed
- **WHEN** another event arrives
- **THEN** the second event SHALL be queued
- **AND** processing SHALL NOT block the main thread

## User Flow

1. WebSocket connection establishes
2. System subscribes to current team channel
3. Real-time events arrive from other users' actions
4. Events are validated and deduplicated
5. Events route to appropriate Zustand stores
6. UI re-renders with updated state
7. Notifications appear in real-time
8. On team switch, subscriptions update seamlessly

## Components

### EventProcessor

- **Purpose**: Core event processing pipeline with validation and deduplication
- **Props**: none (singleton service)
- **States**: processing, idle
- **Events**: eventProcessed, eventFailed, eventDuplicated

### EventRouter

- **Purpose**: Routes events to appropriate store handlers based on event type
- **Props**: none (singleton service)
- **States**: routing, idle
- **Events**: eventRouted, eventUnhandled

### useEventSubscription

- **Purpose**: Hook that subscribes to events and exposes processed events
- **Props**: eventTypes (string[])
- **Returns**: { lastEvent, eventCount, isConnected }
- **States**: subscribed, unsubscribed

### TeamChannelManager

- **Purpose**: Manages team channel subscriptions on team switch
- **Props**: teamId (string)
- **States**: subscribing, subscribed, unsubscribing
- **Events**: channelChanged, subscriptionFailed

## Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| (global) | EventProcessor | Processes all incoming events |
| (global) | TeamChannelManager | Manages team subscriptions |

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| eventType | Must be one of 15 registered types | "Unknown event type: {type}" |
| eventId | Must be non-empty string | "Event ID required for deduplication" |
| eventPayload | Must match event type schema | "Invalid payload for event type: {type}" |

## Accessibility

- Notification events SHALL be announced via `aria-live` region
- Event count updates SHALL be accessible to screen readers
- Event processing failures SHALL NOT disrupt user focus
- Toast notifications for events SHALL be dismissible via keyboard