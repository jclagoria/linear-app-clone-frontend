# Frontend Architecture — Linear App Clone

## Overview

This project is a single-page application (SPA) built with React 19 + Vite 8 + TypeScript 6. The architecture follows a component-based pattern with Zustand for state management and a WebSocket provider for real-time updates.

The architecture follows modular monolith: a single build output with lazy-loaded routes and feature-based directory organization.

## Technical Direction

- **Architecture style**: Component-based SPA with feature modules
- **Frontend framework**: React 19 with React Router 7 (client-side routing)
- **Build tool**: Vite 8 with React plugin
- **Styling**: Tailwind CSS 4 with design tokens
- **State management**: Zustand 5 (global stores)
- **Real-time**: WebSocket with custom provider
- **API**: REST with fetch API (no axios)
- **Validation**: Zod 4 schemas for form and API validation

## Project Structure

```
linear-frontend-v1/
  src/
    app/              # React Router routes and layouts
      routes/         # Route components (lazy-loaded)
    components/       # Shared UI components (design-system)
      ui/             # Primitive components (Button, Modal, Toast)
      layout/         # Layout components (Header, Sidebar)
      websocket/      # WebSocket-specific UI components
    lib/              # Utilities, API client, WebSocket client
      api/            # REST API client
      ws/             # WebSocket client and handlers
    stores/           # Zustand stores
    types/            # Shared TypeScript types
    hooks/            # Custom React hooks
  docs/               # Generated documentation
  public/             # Static assets
  vite.config.ts      # Vite configuration
  tailwind.config.ts  # Tailwind configuration
  tsconfig.json       # TypeScript configuration
```

### Frontend — Component Architecture

| Directory | Responsibility |
|-----------|---------------|
| `src/app/routes/` | Page components, lazy-loaded by React Router |
| `src/components/ui/` | Design-system primitives (Button, Modal, Toast, Input) |
| `src/components/layout/` | App shell (Header, Sidebar, MainContent) |
| `src/components/websocket/` | WebSocket UI (ConnectionStatus, ErrorModal, ErrorToast) |
| `src/lib/api/` | REST API client with auth interceptors |
| `src/lib/ws/` | WebSocket client, message parsers, event handlers |
| `src/stores/` | Zustand stores (auth, issues, notifications, websocket) |
| `src/types/` | Shared TypeScript interfaces and types |
| `src/hooks/` | Custom hooks (useWebSocket, useAuth, useIssues) |

## Component Design

### Frontend

- Use React 19 with functional components and hooks.
- Design-system components are shared and co-located with tests.
- WebSocket provider wraps the app and exposes connection state via context.
- Forms validated client-side with Zod schemas + React Hook Form.
- Lazy-loaded routes for code splitting.

### WebSocket Layer

The WebSocket layer is a separate module within `src/lib/ws/`:

| Module | Responsibility |
|--------|---------------|
| `client.ts` | WebSocket connection, reconnect logic, message sending |
| `handlers.ts` | Message type handlers (authenticated, subscribed, event, error) |
| `types.ts` | TypeScript types for all WebSocket messages |
| `schema.ts` | Zod schemas for message validation |

### WebSocket Provider Pattern

```
WebSocketProvider
  ├── client.ts (connection management)
  ├── handlers.ts (message routing)
  └── stores/ (state updates)
       ├── websocketStore.ts (connection state)
       ├── issueStore.ts (issue data)
       └── notificationStore.ts (notifications)
```

## State Management

- **Server state**: REST API data cached in Zustand stores with manual invalidation.
- **Client state**: Zustand stores for auth, UI state, WebSocket connection.
- **Real-time state**: WebSocket events update Zustand stores directly.

### Store Design

| Store | Responsibility | Persists |
|-------|---------------|----------|
| `authStore` | JWT tokens, user info | localStorage |
| `websocketStore` | Connection state, status | No |
| `issueStore` | Issue data, board state | No |
| `notificationStore` | Notifications, unread count | No |
| `labelStore` | Label definitions | No |

## Data Flow

```
Frontend                     Backend (WebSocket)
   |                            |
   |-- connect(ws://) --------->|
   |-- { type: "authenticate" }->|
   |<-- { type: "authenticated" }|
   |<-- { type: "subscribed" }--|
   |                            |
   |<-- { type: "event" }-------|
   |    (issue.updated, etc.)   |
   |                            |
   |-- { type: "subscribe" }--->|
   |<-- { type: "subscribed" }--|
```

## Security

- **Auth**: JWT (RS256) dual token — access (15 min, memory) + refresh (24h, httpOnly cookie).
- **WebSocket auth**: Token sent in `authenticate` message, validated server-side.
- **Token refresh**: Automatic refresh on 401 responses, WebSocket re-auth on new token.
- **Session revocation**: Server can revoke session via `session.revoked` event.

## Current Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture | Component-based SPA | Simplicity, team expertise, no SSR needed |
| Framework | React 19 + Vite 8 | Mature ecosystem, fast builds, React 19 features |
| State | Zustand 5 | Lightweight, TypeScript-first, minimal boilerplate |
| Styling | Tailwind CSS 4 | Utility-first, rapid development, design-token compatible |
| Real-time | WebSocket with custom provider | Full-duplex, bidirectional, AsyncAPI spec compliance |
| Testing | Vitest + Playwright | Fast unit tests, reliable E2E, Vite-native |

## WebSocket Alignment Context

This architecture supports the WebSocket alignment change (LAG-57) by providing:

1. **Clean separation**: WebSocket client is isolated in `src/lib/ws/`
2. **Type safety**: All messages validated with Zod schemas
3. **Event routing**: Handlers map event types to store updates
4. **Error handling**: Centralized error processing with UI feedback
5. **Reconnection**: Automatic reconnect with exponential backoff

### Files Affected by WebSocket Alignment

| File | Change |
|------|--------|
| `src/lib/ws/client.ts` | Update message format, remove manual subscription |
| `src/lib/ws/types.ts` | New WSEvent interface, error codes |
| `src/lib/ws/handlers.ts` | New event types, error handling |
| `src/components/websocket/ConnectionStatus.tsx` | New states (connecting, reconnecting) |
| `src/components/websocket/ConnectionErrorModal.tsx` | New error codes |
| `src/components/websocket/WebSocketErrorToast.tsx` | New error codes |
| `src/stores/websocketStore.ts` | New connection states |
| `src/app/AppLayout.tsx` | Integrate new components |
