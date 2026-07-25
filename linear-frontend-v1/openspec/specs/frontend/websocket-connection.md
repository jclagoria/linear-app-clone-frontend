# Realtime Module — WebSocket Connection Management

## Behaviour

**Feature:** WebSocket Connection Lifecycle

The system SHALL establish and maintain a WebSocket connection to the backend gateway for real-time event delivery. The connection lifecycle SHALL handle authentication, heartbeats, and automatic reconnection with exponential backoff.

### Requirement: Connection Establishment

#### Scenario: Initial Connection After Authentication

- **GIVEN** the user is authenticated with a valid access token
- **WHEN** the application loads and auth state is ready
- **THEN** a WebSocket connection attempt SHALL be initiated within 2 seconds
- **AND** the connection status in the WebSocket store SHALL be set to "connecting"
- **AND** the authentication token SHALL be included in the connection handshake

#### Scenario: Connection Timeout

- **GIVEN** a WebSocket connection attempt is in progress
- **WHEN** the connection does not establish within 5 seconds
- **THEN** the connection attempt SHALL be marked as failed
- **AND** the connection status SHALL be set to "disconnected"
- **AND** a reconnection attempt SHALL be scheduled after 1 second

### Requirement: Connection States

#### Scenario: State Transitions

- **GIVEN** the WebSocket connection is in "disconnected" state
- **WHEN** a connection attempt begins
- **THEN** the state SHALL transition to "connecting"
- **AND** when the connection succeeds, the state SHALL transition to "connected"
- **AND** when the connection drops, the state SHALL transition to "reconnecting"

#### Scenario: Connection Status Display

- **GIVEN** the WebSocket connection status changes
- **WHEN** the status updates in the store
- **THEN** the UI SHALL reflect the current connection state
- **AND** a visual indicator SHALL show when the connection is not "connected"

### Requirement: Heartbeat Mechanism

#### Scenario: Periodic Heartbeat

- **GIVEN** the WebSocket connection is in "connected" state
- **WHEN** 30 seconds elapse since the last heartbeat
- **THEN** a heartbeat ping SHALL be sent to the server
- **AND** the heartbeat timestamp SHALL be updated in the store

#### Scenario: Heartbeat Timeout

- **GIVEN** a heartbeat ping was sent
- **WHEN** no pong response is received within 10 seconds
- **THEN** the connection SHALL be considered stale
- **AND** the connection SHALL be closed and reconnection initiated

### Requirement: Automatic Reconnection

#### Scenario: Reconnection with Exponential Backoff

- **GIVEN** the WebSocket connection drops unexpectedly
- **WHEN** the reconnection logic triggers
- **THEN** the first reconnection attempt SHALL occur after 1 second
- **AND** subsequent attempts SHALL use exponential backoff (1s, 2s, 4s, 8s, etc.)
- **AND** the maximum reconnection delay SHALL be 30 seconds
- **AND** the connection status SHALL be "reconnecting" during attempts

#### Scenario: Maximum Reconnection Attempts

- **GIVEN** the WebSocket connection has failed to reconnect
- **WHEN** 10 reconnection attempts have been exhausted
- **THEN** the connection status SHALL remain "disconnected"
- **AND** a toast notification SHALL inform the user of connection failure
- **AND** manual reconnection SHALL be available via UI action

#### Scenario: Successful Reconnection

- **GIVEN** the WebSocket is in "reconnecting" state
- **WHEN** a reconnection attempt succeeds
- **THEN** the connection status SHALL transition to "connected"
- **AND** the reconnection attempt counter SHALL reset to 0
- **AND** event subscriptions SHALL be re-established

### Requirement: Graceful Disconnection

#### Scenario: User Logout

- **GIVEN** the user is authenticated and WebSocket is connected
- **WHEN** the user logs out
- **THEN** the WebSocket connection SHALL be closed gracefully
- **AND** all event subscriptions SHALL be cleared
- **AND** the connection status SHALL be "disconnected"

#### Scenario: Tab Close or Navigation

- **GIVEN** the user closes the browser tab or navigates away
- **WHEN** the page unloads
- **THEN** the WebSocket connection SHALL be closed

## User Flow

1. User authenticates successfully
2. Application initiates WebSocket connection with auth token
3. Connection establishes, status becomes "connected"
4. Heartbeats maintain connection health
5. If connection drops, automatic reconnection begins
6. User sees connection status indicator during reconnection
7. Connection restores, event subscriptions re-established
8. On logout, connection closes gracefully

## Components

### WebSocketProvider

- **Purpose**: Top-level provider that manages WebSocket connection lifecycle
- **Props**: children (React nodes)
- **States**: connecting, connected, reconnecting, disconnected
- **Events**: connectionEstablished, connectionLost, reconnectionAttempt

### ConnectionStatusIndicator

- **Purpose**: Visual indicator showing WebSocket connection state
- **Props**: status (ConnectionStatus), className
- **States**: connected (green), connecting (yellow), reconnecting (orange), disconnected (red)
- **Events**: click (triggers manual reconnection when disconnected)

### useWebSocketConnection

- **Purpose**: Hook that exposes connection state and controls
- **Props**: none
- **Returns**: { status, connect, disconnect, reconnect }
- **States**: manages internal connection lifecycle

## Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| (global) | WebSocketProvider | Wraps app root, manages connection |

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| authToken | Must be non-empty string | "Authentication required for WebSocket connection" |
| reconnectAttempts | Must be integer 0-10 | "Maximum reconnection attempts exceeded" |

## Accessibility

- Connection status indicator SHALL include `aria-label` describing current state
- Connection status changes SHALL be announced via `aria-live` region
- Manual reconnection button SHALL be keyboard accessible
- Screen readers SHALL announce "Connection restored" when reconnection succeeds