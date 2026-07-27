# WebSocket Frontend — Frontend Specification

## Behaviour

**Feature:** WebSocket Authentication

The WebSocket client SHALL send an `authenticate` message immediately upon connection open and receive an `authenticated` response from the server.

### Requirement: AuthenticationMessage

#### Scenario: ClientSendsAuthenticateOnConnect

- **GIVEN** the user is authenticated with a valid JWT token
- **WHEN** the WebSocket connection opens
- **THEN** the client sends `{ type: "authenticate", token: "<jwt>" }` to the server
- **AND** the client waits for the `authenticated` response

#### Scenario: ServerRespondsWithAuthenticated

- **GIVEN** the client has sent an `authenticate` message
- **WHEN** the server validates the token successfully
- **THEN** the server responds with `{ type: "authenticated", userId: "<uuid>", connectionId: "<uuid>" }`
- **AND** the client stores the `userId` and `connectionId`

#### Scenario: ServerRejectsInvalidToken

- **GIVEN** the client has sent an `authenticate` message with an invalid token
- **WHEN** the server validates the token and finds it invalid
- **THEN** the server responds with `{ type: "error", code: "invalid_token", message: "..." }`
- **AND** the client closes the connection
- **AND** the client displays an "Authentication failed" error modal

#### Scenario: AuthFailedError

- **GIVEN** the client has sent an `authenticate` message
- **WHEN** the server responds with `{ type: "error", code: "auth_failed" }`
- **THEN** the client closes the connection
- **AND** the client clears stored auth tokens
- **AND** the client displays an "Authentication failed" error modal
- **AND** the client redirects to `/login` after 3 seconds

---

**Feature:** Channel Subscription

The server SHALL automatically subscribe the client to user, team, and issue channels after authentication. The client SHALL be able to manually subscribe to additional channels.

### Requirement: AutoSubscription

#### Scenario: ServerAutoSubscribesAfterAuth

- **GIVEN** the client has received an `authenticated` response
- **WHEN** the server completes auto-subscription
- **THEN** the client receives `{ type: "subscribed", channel: "user:<userId>" }`
- **AND** the client receives `{ type: "subscribed", channel: "team:<teamId>" }`

#### Scenario: ClientReceivesSubscribedConfirmation

- **GIVEN** the client has sent a `subscribe` message
- **WHEN** the server processes the subscription
- **THEN** the client receives `{ type: "subscribed", channel: "<channel>" }`

### Requirement: ManualSubscription

#### Scenario: ClientSubscribesToChannel

- **GIVEN** the client is authenticated
- **WHEN** the client sends `{ type: "subscribe", channel: "issue:<issueId>" }`
- **THEN** the client receives `{ type: "subscribed", channel: "issue:<issueId>" }`
- **AND** the client receives events for that channel

#### Scenario: ClientUnsubscribesFromChannel

- **GIVEN** the client is subscribed to a channel
- **WHEN** the client sends `{ type: "unsubscribe", channel: "<channel>" }`
- **THEN** the client receives `{ type: "unsubscribed", channel: "<channel>" }`
- **AND** the client stops receiving events for that channel

#### Scenario: InvalidChannelSubscription

- **GIVEN** the client is authenticated
- **WHEN** the client sends `{ type: "subscribe", channel: "admin:settings" }`
- **THEN** the client receives `{ type: "error", code: "invalid_channel", message: "..." }`
- **AND** the subscription is not created

---

**Feature:** Event Processing

The client SHALL receive events in the format `{ type: "event", channel, event, data, timestamp, userId }` and route them to appropriate handlers.

### Requirement: EventParsing

#### Scenario: ClientReceivesEvent

- **GIVEN** the client is subscribed to a channel
- **WHEN** the server broadcasts an event
- **THEN** the client receives `{ type: "event", channel: "team:<teamId>", event: "issue.updated", data: {...}, timestamp: "...", userId: "..." }`

#### Scenario: EventRouting

- **GIVEN** the client receives an event with `event: "issue.updated"`
- **WHEN** the event processor parses the event
- **THEN** the event router calls `handleIssueEvent` with the event data
- **AND** the issue store is updated

### Requirement: NewEventTypes

#### Scenario: LabelEvent

- **GIVEN** the client is subscribed to a team channel
- **WHEN** the server broadcasts `{ type: "event", event: "label.created", data: {...} }`
- **THEN** the label store is updated

#### Scenario: SessionRevokedEvent

- **GIVEN** the client is connected
- **WHEN** the server broadcasts `{ type: "event", event: "session.revoked", data: {...} }`
- **THEN** the client clears all auth tokens
- **AND** the client redirects to `/login`
- **AND** the client displays a "Session expired" toast message

#### Scenario: UserOnlineEvent

- **GIVEN** the client is subscribed to a team channel
- **WHEN** the server broadcasts `{ type: "event", event: "user.online", data: { userId: "..." } }`
- **THEN** the user's online status is updated in the UI

---

**Feature:** Error Handling

The client SHALL handle error messages from the server with appropriate UI feedback.

### Requirement: ErrorCodes

#### Scenario: RateLimitedError

- **GIVEN** the client is connected
- **WHEN** the server sends `{ type: "error", code: "rate_limited", retryAfter: 30 }`
- **THEN** the client displays a toast message "Rate limited. Retry after 30 seconds"
- **AND** the client does not attempt to reconnect for 30 seconds

#### Scenario: ForbiddenError

- **GIVEN** the client is connected
- **WHEN** the server sends `{ type: "error", code: "forbidden", message: "Access denied" }`
- **THEN** the client displays an error modal with "Access denied" message
- **AND** the client does not attempt to reconnect

#### Scenario: InvalidChannelError

- **GIVEN** the client attempts to subscribe to a channel
- **WHEN** the server sends `{ type: "error", code: "invalid_channel" }`
- **THEN** the client displays a toast message "Invalid channel subscription"
- **AND** the subscription is not created

---

**Feature:** Connection Status Display

The client SHALL display the WebSocket connection status to the user.

### Requirement: ConnectionStatusIndicator

#### Scenario: ConnectedStatus

- **GIVEN** the WebSocket connection is active
- **WHEN** the user views the header
- **THEN** a green dot is displayed with aria-label "Connected"

#### Scenario: DisconnectedStatus

- **GIVEN** the WebSocket connection is closed
- **WHEN** the user views the header
- **THEN** a red dot is displayed with aria-label "Disconnected"

#### Scenario: ReconnectingStatus

- **GIVEN** the WebSocket is attempting to reconnect
- **WHEN** the user views the header
- **THEN** a yellow dot is displayed with aria-label "Reconnecting"

### Requirement: ErrorModalDisplay

#### Scenario: AuthFailedModal

- **GIVEN** the client receives an `auth_failed` error
- **WHEN** the error modal is displayed
- **THEN** the modal shows "Authentication failed" message
- **AND** the modal shows a "Return to Login" button
- **AND** clicking the button redirects to `/login`

#### Scenario: SessionRevokedModal

- **GIVEN** the client receives a `session.revoked` event
- **WHEN** the error modal is displayed
- **THEN** the modal shows "Session expired" message
- **AND** the modal shows a "Return to Login" button
- **AND** clicking the button redirects to `/login`

---

## User Flow

1. User opens the application
2. WebSocket connection is established
3. Client sends `authenticate` message with JWT token
4. Server responds with `authenticated` (userId, connectionId)
5. Server auto-subscribes client to user/team channels
6. Client receives `subscribed` confirmations
7. Client receives events and updates UI in real-time
8. If error occurs, client displays appropriate UI feedback
9. If session revoked, client redirects to login

---

## Components

### ConnectionStatusIndicator

- **Purpose**: Displays WebSocket connection status in header
- **Props**: none (subscribes to websocketStore)
- **States**: connected (green), connecting (yellow), reconnecting (yellow), disconnected (red)
- **Events**: none

### ConnectionErrorModal

- **Purpose**: Displays error messages when connection fails
- **Props**: none (subscribes to websocketStore)
- **States**: hidden, visible
- **Events**: onRetry, onReturnToLogin

### WebSocketErrorToast

- **Purpose**: Displays transient error messages
- **Props**: error (code, message, retryAfter)
- **States**: visible, dismissed
- **Events**: onDismiss

---

## Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| `/login` | LoginPage | Redirect target for auth failures |
| `/*` | AppLayout | Contains ConnectionStatusIndicator |

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| token | Must be valid JWT | "Invalid token" |
| channel | Must match pattern `user:<uuid>`, `team:<uuid>`, or `issue:<uuid>` | "Invalid channel format" |

---

## Accessibility

- ConnectionStatusIndicator: `role="status"`, `aria-label` with current status
- ConnectionErrorModal: `role="dialog"`, `aria-modal="true"`, focus trapped within modal
- WebSocketErrorToast: `role="alert"`, `aria-live="polite"`
