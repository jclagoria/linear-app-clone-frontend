# Tasks — Realtime WebSocket Events (Frontend)

## Scaffold

- [x] Create feature directory structure: `src/features/realtime/model/`, `src/features/realtime/ui/`, `src/features/realtime/lib/`
- [x] Add WebSocket-related type definitions in `src/features/realtime/lib/event-schema.ts` (15 event types, payloads, OptimisticUpdate interface)
- [x] Create `src/app/providers/WebSocketProvider.tsx` shell (wraps children, exports context)
- [x] Create `src/app/providers/OptimisticProvider.tsx` shell (wraps children, exports context)

## Components

- [x] Build `ConnectionStatusIndicator` — colored dot with status label, aria-live
- [x] Build `ReconnectionToast` — fixed bottom-right toast, auto-dismiss 5s, retry button
- [x] Build `ConnectionErrorModal` — centered overlay, focus trap, reconnect/logout actions
- [x] Build `RevertToast` — fixed bottom-right toast, retry button, shows revert message
- [x] Build `NotificationBadge` — red circle with count, overflow indicator
- [x] Build `NotificationPanel` — dropdown list, empty/populated/loading/error states
- [x] Build `IssueCard` — card with status, title, labels, avatar; idle/optimistic/confirmed/reverted states
- [x] Build `StatusCycleIndicator` — inline status dot with animation during cycling
- [x] Build `IssueAssigneeSelector` — combobox dropdown with search, keyboard navigation
- [x] Build `ProjectCard` — card with icon, progress bar, avatars; idle/optimistic states

## State & Data

- [x] Create `useWebSocketStore` — connection status, reconnect attempts, last heartbeat, notifications list
- [x] Create `useOptimisticStore` — pending updates array with timestamps, revert data
- [x] Create `event-processor.ts` — validate event type, deduplicate by eventId (Set + 5min TTL), route by prefix
- [x] Create `event-router.ts` — map `issue.*`, `project.*`, `cycle.*`, `notification.*` to store handlers
- [x] Create `reconnection.ts` — exponential backoff (1s–30s, max 10 attempts), reset on success
- [x] Create `heartbeat.ts` — 30s ping interval, 10s pong timeout, close on timeout
- [x] Create `ws-client.ts` — WebSocket wrapper: connect, send, close, onMessage, reconnect logic
- [x] Create `optimistic-manager.ts` — create, track, confirm, revert optimistic updates; auto-revert at 30s
- [x] Extend `useIssuesStore` with `applyEvent(event)` handler for real-time mutations
- [x] Extend `useProjectsStore` with `applyEvent(event)` handler for real-time mutations
- [x] Extend `useCyclesStore` with `applyEvent(event)` handler for real-time mutations

## Routing

- [x] Wrap protected routes in `WebSocketProvider` and `OptimisticProvider` in `App.tsx`
- [x] Add `ConnectionErrorModal` to app root (conditionally rendered after 10 failed reconnects)
- [x] Add `ReconnectionToast` to app root (shown during reconnection state)
- [x] Add `RevertToast` to app root (shown on optimistic update failure)
- [x] Wire `ConnectionStatusIndicator` into existing `Header` component
- [x] Wire `NotificationBadge` + `NotificationPanel` into existing `Header` component

## Integration

- [x] Connect `WebSocketProvider` to auth store for JWT token
- [x] Wire `ws-client.ts` to backend WebSocket endpoint
- [x] Wire `optimistic-manager.ts` to existing API client for background requests
- [x] Replace mock data in `IssueListPage` with real-time Zustand store subscription
- [x] Replace mock data in `IssueDetailPage` with real-time Zustand store subscription
- [x] Replace mock data in `ProjectListPage` with real-time Zustand store subscription
- [x] Replace mock data in `CycleListPage` with real-time Zustand store subscription

## Validation

- [x] Unit tests: `event-processor.ts` — validate, deduplicate, route
- [x] Unit tests: `reconnection.ts` — backoff timing, max attempts, reset
- [x] Unit tests: `heartbeat.ts` — ping/pong interval, timeout handling
- [x] Unit tests: `optimistic-manager.ts` — create, track, confirm, revert, auto-revert at 30s
- [ ] Unit tests: `ws-client.ts` — connect, reconnect, close, message handling
- [x] Unit tests: Zustand stores — applyEvent for each event type
- [ ] Unit tests: UI components — render states, keyboard interaction, ARIA attributes
- [ ] Integration tests: MSW WebSocket handler — full event flow from WS to store
- [ ] Integration tests: Optimistic update flow — apply, confirm, revert paths
- [ ] E2E tests: Playwright — real-time issue update appears without refresh
- [ ] E2E tests: Playwright — optimistic status change with revert on failure
- [ ] E2E tests: Playwright — reconnection after disconnect, toast appears
- [ ] E2E tests: Playwright — connection error modal after 10 failed attempts

## Review

- [x] Self-review: verify all 15 event types handled in event-router
- [x] Self-review: verify all optimistic paths (success, failure, timeout) tested
- [x] Self-review: verify ARIA attributes match design-frontend.md spec
- [x] Self-review: verify keyboard navigation works for all interactive components
- [x] Self-review: verify no secrets or tokens in committed code
- [x] PR checklist: lint passes, typecheck passes, tests pass, no console errors
