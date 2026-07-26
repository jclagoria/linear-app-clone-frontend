# Tasks — Real-time Issue Updates (Frontend)

## Scaffold

- [x] Verify SSE client (`features/realtime/lib/ws-client.ts`) connects to backend endpoint
- [x] Verify event router (`features/realtime/model/event-router.ts`) dispatches to handlers
- [x] Verify event schema (`features/realtime/model/event-schema.ts`) validates incoming events
- [x] Verify optimistic store (`features/realtime/lib/optimistic-store.ts`) supports snapshot/rollback

## Components

- [ ] Create `NotificationBadge` — reads `notificationsStore.count`, displays bell icon with unread count
- [ ] Create `NotificationPanel` — dropdown list of notifications; empty, loading, error states
- [ ] Verify `IssueCard` renders all issue fields (title, status, assignee, priority)
- [ ] Verify `ProjectCard` renders project name, status, and member count
- [ ] Verify `StatusCycleIndicator` displays cycle state (active, completed, upcoming)
- [ ] Verify `ConnectionStatusIndicator` shows connected/disconnected/reconnecting states
- [ ] Verify `ReconnectionToast` displays on reconnect with duration
- [ ] Verify `RevertToast` displays on failed optimistic update with rollback message

## State & Data

- [ ] Create `notificationsStore` in `src/shared/stores/` — `items[]`, `count`, `addNotification`, `markRead`, `clearAll`
- [ ] Add `addIssue`, `updateIssue`, `removeIssue` actions to issues store in `src/shared/stores/`
- [ ] Add `addProject`, `updateProject` actions to projects store in `src/shared/stores/`
- [ ] Add `addCycle`, `updateCycle` actions to cycles store in `src/shared/stores/`
- [ ] Verify `websocketStore` exposes `status` (connected/disconnected/reconnecting) and `reconnectAttempts`
- [ ] Implement `issue-store.ts` event handler in `features/realtime/lib/` — maps `issue.*` events to store mutations
- [ ] Implement `project-store.ts` event handler in `features/realtime/lib/` — maps `project.*` events to store mutations
- [ ] Implement `cycle-store.ts` event handler in `features/realtime/lib/` — maps `cycle.*` events to store mutations
- [ ] Implement `notification-store.ts` event handler in `features/realtime/lib/` — maps `notification.*` events to store mutations
- [ ] Wire event handlers to `event-router.ts` — each event type routes to correct handler
- [ ] Implement 100ms deduplication window for same-entity events in event router
- [ ] Add `aria-live="polite"` to `NotificationBadge` count and `IssueCard` list container

## Routing

- [ ] Verify `/issues` route renders `IssuesPage` with real-time `IssueCard` list
- [ ] Verify `/issues/:id` route renders `IssueDetailPage` with `CommentThread`
- [ ] Verify `/projects` route renders `ProjectsPage` with real-time `ProjectCard` list
- [ ] Verify `/cycles` route renders `CyclesPage` with real-time `CycleCard` list
- [ ] Verify `AuthGuard` prevents access to real-time routes without authentication

## Accessibility Settings

- [ ] Create `AutoUpdateToggle` component in `features/realtime/ui/` — toggle in settings to enable/disable real-time updates
- [ ] Wire toggle to `websocketStore` — when disabled, SSE events are received but not applied to stores
- [ ] Add toggle to `SettingsPage` — "Real-time updates" toggle with description

## Integration

- [ ] Connect SSE client to backend `/api/events` endpoint on app mount
- [ ] Verify `issue.created` event adds new issue to list without page refresh
- [ ] Verify `issue.updated` event reflects field changes in real-time
- [ ] Verify `issue.statusChanged` event updates status badge on issue card
- [ ] Verify `issue.assigned` / `issue.unassigned` event updates assignee on issue card
- [ ] Verify `issue.deleted` event removes issue from list with visual feedback
- [ ] Verify `comment.created` event appends comment to issue detail thread
- [ ] Verify `project.created` / `project.updated` event updates project list
- [ ] Verify `cycle.activated` / `cycle.completed` event updates cycle list
- [ ] Verify `notification.created` event increments badge count and adds to notification panel
- [ ] Verify events from other teams are silently ignored (teamId mismatch)
- [ ] Verify reconnection after network drop restores state and replays missed events via `Last-Event-ID`

## Validation

- [ ] Unit tests: event schema validates all 13 event types with correct payloads
- [ ] Unit tests: event router dispatches to correct handler per event type
- [ ] Unit tests: deduplication drops duplicate events within 100ms window
- [ ] Unit tests: store actions apply optimistic update and rollback on failure
- [ ] Unit tests: `notificationsStore` addNotification, markRead, clearAll
- [ ] Unit tests: `IssueCard`, `NotificationBadge`, `ConnectionStatusIndicator` render correctly
- [ ] Integration tests: SSE event triggers store mutation and UI re-render
- [ ] Integration tests: optimistic update shows revert toast on server rejection
- [ ] Integration tests: reconnection restores event stream after disconnect
- [ ] E2E tests: create issue in second tab → appears in first tab without refresh
- [ ] E2E tests: change issue status → badge updates in real-time
- [ ] E2E tests: add comment → thread appends without page load
- [ ] E2E tests: notification count increments on new notification
- [ ] Accessibility tests: `aria-live` regions announce new content; tab order preserved

## Review

- [ ] Verify all 13 event types are handled (issue.created/updated/statusChanged/assigned/unassigned/deleted, comment.created/updated, project.created/updated, cycle.created/updated/activated/completed, notification.created)
- [ ] Verify optimistic updates rollback correctly on simulated server error
- [ ] Verify deduplication prevents duplicate DOM updates
- [ ] Verify connection status indicator reflects real-time state
- [ ] Verify accessibility: screen reader announces new items via `aria-live="polite"`
- [ ] Verify accessibility: reduced motion preference disables flash animations
- [ ] Run full test suite (unit + integration + E2E)
- [ ] Manual review of all mockup states against implemented UI
