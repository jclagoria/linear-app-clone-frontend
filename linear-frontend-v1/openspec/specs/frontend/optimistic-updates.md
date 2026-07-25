# Realtime Module — Optimistic Updates

## Behaviour

**Feature:** Optimistic Update Interface

The system SHALL implement an OptimisticUpdate interface that allows immediate UI state changes before server confirmation, with automatic revert on failure and cache bypass strategy.

### Requirement: OptimisticUpdate Interface

#### Scenario: Interface Definition

- **GIVEN** a user action triggers a state change (e.g., issue status change)
- **WHEN** the optimistic update is initiated
- **THEN** an OptimisticUpdate object SHALL be created containing:
  - `action`: "update" | "add" | "remove"
  - `target`: the store/entity identifier (e.g., "issues", "issues:uuid")
  - `data`: the new state to apply immediately
  - `revert`: action, target, and data to restore on failure
  - `request`: method, url, and optional body for the API call

### Requirement: Immediate State Application

#### Scenario: Optimistic State Update

- **GIVEN** a user changes an issue's status via keyboard shortcut 'S'
- **WHEN** the status change action is triggered
- **THEN** the issue's status SHALL update immediately in the Zustand store
- **AND** the UI SHALL re-render to reflect the new status
- **AND** the API request SHALL be sent in the background
- **AND** the pending update SHALL be tracked in the OptimisticUpdates store

#### Scenario: Cache Bypass

- **GIVEN** an optimistic update is applied
- **WHEN** the state is updated
- **THEN** the update SHALL bypass the cache layer
- **AND** the store state SHALL be updated directly
- **AND** cache invalidation SHALL only occur on API success

### Requirement: Success Confirmation

#### Scenario: API Call Succeeds

- **GIVEN** an optimistic update is pending
- **WHEN** the API call returns a successful response
- **THEN** the optimistic state SHALL be confirmed as final
- **AND** the pending update SHALL be removed from the OptimisticUpdates store
- **AND** related cache entries SHALL be invalidated
- **AND** the UI SHALL remain in the updated state

### Requirement: Failure Revert

#### Scenario: API Call Fails

- **GIVEN** an optimistic update is pending
- **WHEN** the API call returns an error response
- **THEN** the store state SHALL revert to the previous state using the revert data
- **AND** the UI SHALL re-render to show the original state
- **AND** the pending update SHALL be removed from the OptimisticUpdates store
- **AND** an error toast SHALL be displayed with the failure message
- **AND** the error toast SHALL include a "Retry" option

#### Scenario: Network Failure During Optimistic Update

- **GIVEN** an optimistic update is pending
- **WHEN** the network connection is lost
- **THEN** the state SHALL revert to the previous state
- **AND** an error toast SHALL inform the user of the network issue
- **AND** the user SHALL be able to retry the action when network restores

### Requirement: Duplicate Action Prevention

#### Scenario: Prevent Duplicate Pending Updates

- **GIVEN** an optimistic update is already pending for a specific entity
- **WHEN** the user attempts the same action again
- **THEN** the second action SHALL be ignored
- **AND** the UI SHALL show a brief loading indicator on the pending element
- **AND** the action SHALL be re-enabled after the first update completes

### Requirement: Optimistic Update Store

#### Scenario: Pending Updates Tracking

- **GIVEN** multiple optimistic updates are in progress
- **WHEN** checking the OptimisticUpdates store
- **THEN** all pending updates SHALL be listed with their target entities
- **AND** each update SHALL include a timestamp for staleness detection
- **AND** updates older than 30 seconds SHALL be considered stale and reverted

#### Scenario: Bulk Update Handling

- **GIVEN** multiple optimistic updates target the same entity
- **WHEN** updates are applied sequentially
- **THEN** each update SHALL use the previous update's state as its revert target
- **AND** a failure SHALL revert all subsequent updates in the chain

## User Flow

1. User triggers action (e.g., presses 'S' to cycle issue status)
2. OptimisticUpdate object is created with current and new state
3. Store state updates immediately
4. UI re-renders to show new status
5. API request sent in background
6. On success: cache invalidated, pending update cleared
7. On failure: state reverted, error toast shown with retry option
8. User can retry or continue working

## Components

### OptimisticUpdateManager

- **Purpose**: Core manager for creating, tracking, and resolving optimistic updates
- **Props**: none (singleton service)
- **States**: idle, processing, reverting
- **Events**: updateApplied, updateConfirmed, updateReverted, updateFailed

### OptimisticUpdateProvider

- **Purpose**: Context provider that exposes optimistic update capabilities
- **Props**: children (React nodes)
- **States**: manages pending updates array
- **Events**: pendingCountChanged

### useOptimisticUpdate

- **Purpose**: Hook that wraps actions with optimistic update logic
- **Props**: none
- **Returns**: { applyOptimistic, isPending, pendingCount }
- **States**: idle, pending, confirmed, reverted

### RevertToast

- **Purpose**: Toast notification shown on optimistic update failure
- **Props**: message, onRetry, onDismiss
- **States**: visible, dismissed
- **Events**: retryClicked, dismissed

## Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| (global) | OptimisticUpdateProvider | Wraps app root, manages optimistic updates |
| (global) | RevertToast | Displays failure notifications |

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| action | Must be "update", "add", or "remove" | "Invalid optimistic update action" |
| target | Must be non-empty string | "Target entity required" |
| data | Must be defined | "Update data required" |
| revert | Must contain action, target, data | "Revert information required" |
| request.method | Must be POST, PATCH, or DELETE | "Invalid request method" |
| request.url | Must be valid URL | "Invalid request URL" |

## Accessibility

- Optimistic updates SHALL NOT cause focus loss
- Revert toasts SHALL be announced via `aria-live` region
- Retry buttons SHALL be keyboard accessible
- Loading indicators during pending updates SHALL include `aria-busy`
- Screen readers SHALL announce "Update applied" and "Update reverted" states