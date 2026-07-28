# WebSocket Frontend: Align Client with AsyncAPI Specification

## Problem Statement

The backend WebSocket gateway (LAG-56) introduced auto-subscription, channel validation, and event broadcasting via ModuleEventBridge. The frontend `ws-client.ts` currently uses a different message format (`auth` instead of `authenticate`), manual team subscription during handshake, and event payloads with `eventId/type/payload/timestamp/teamId` shape. This misalignment prevents real-time features from functioning correctly with the new backend.

## Motivation

The backend changes deliver:
- **Auto-subscription**: Server subscribes clients to user/team/issue channels automatically after authentication
- **Channel validation**: Access control on channel subscriptions (users can only subscribe to authorized channels)
- **Event broadcasting**: All domain events routed through ModuleEventBridge with structured payloads

Without frontend alignment:
- Real-time updates (issue changes, comments, notifications) will not be received
- Authentication handshake will fail (wrong message type)
- Event parsing will break (wrong payload shape)

## Scope

- **In scope**:
  - Message format updates (auth → authenticate, subscribe channel format)
  - Authentication flow reversal (client sends authenticate first, server responds with authenticated)
  - Event schema updates (new WSEvent interface with type/channel/event/data)
  - Event processing and routing for new event types (label.*, watcher.*, team.*, user.*, session.*)
  - WebSocket provider changes (remove manual team subscription, expose channel methods)
  - Error handling for new error codes (auth_failed, invalid_token, forbidden, rate_limited, invalid_channel)
  - UX updates: error message display, session revoked handling, auth failed handling
  - Testing updates for new message format

- **Out of scope**:
  - Backend changes (handled in LAG-56)
  - New real-time features beyond alignment (e.g., online indicators for team members)
  - Performance optimization of WebSocket connection
  - Mobile-specific WebSocket handling

## Impact

- **Frontend files affected**: 9 files (ws-client.ts, event-schema.ts, event-processor.ts, event-router.ts, WebSocketProvider.tsx, websocketStore.ts, ConnectionErrorModal.tsx, WebSocketErrorToast.tsx, AppLayout.tsx)
- **Breaking changes**: Auth message type, subscribe message format, event payload shape
- **Teams/consumers**: Frontend team must implement changes before backend deployment; QA must update test suites
- **Linear issue**: LAG-57
- **Related**: LAG-56 (backend WebSocket gateway changes)
