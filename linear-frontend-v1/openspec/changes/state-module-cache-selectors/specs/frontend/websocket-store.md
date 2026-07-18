# WebSocket Store — Frontend Specification

## Behaviour

**Feature:** WebSocket Connection & Notification State

The WebSocket Store SHALL track real-time connection status and manage notification state. It MUST expose connection transitions and unread notification count.

### Requirement: ConnectionState

#### Scenario: Track connection status transitions

- **GIVEN** a websocket store
- **WHEN** the connection is initiated
- **THEN** `connectionStatus` SHALL be set to "connecting"
- **WHEN** the connection succeeds
- **THEN** `connectionStatus` SHALL be set to "connected"
- **WHEN** the connection drops
- **THEN** `connectionStatus` SHALL be set to "reconnecting"

#### Scenario: Track reconnection attempts

- **GIVEN** a websocket store
- **WHEN** reconnection is attempted
- **THEN** `reconnectAttempts` SHALL increment

### Requirement: Notifications

#### Scenario: Receive notification

- **GIVEN** a websocket store
- **WHEN** a real-time notification event is received
- **THEN** the notification SHALL be appended to `notifications`
- **AND** `lastEvent` SHALL be updated

#### Scenario: Mark notification as read

- **GIVEN** a websocket store with unread notifications
- **WHEN** a mark as read action is dispatched
- **THEN** the specified notification SHALL be marked as read

## User Flow

1. App starts → WebSocket connection initiated → status set to "connecting"
2. Connection established → status set to "connected"
3. Server sends event → store updates `lastEvent` and appends to `notifications`
4. Selector (`selectUnreadCount`) recomputes → header badge updates
5. Connection lost → status set to "reconnecting" → exponential backoff begins
6. User opens notification panel → list renders from `notifications`

## Components

### WebSocketStore

- **Purpose**: Manages WebSocket connection state and notifications
- **Props**: initialState (optional for testing)
- **States**: disconnected, connecting, connected, reconnecting
- **Events**: onStatusChange, onNotification, onReconnect

## Routing

Connection status is global. Notification state is consumed by the header component across all routes.

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| connectionStatus | MUST be one of "disconnected", "connecting", "connected", "reconnecting" | "Invalid connection status" |

## Accessibility

Connection status changes SHOULD be communicated to screen readers. New notifications SHOULD trigger an `aria-live` region update.
