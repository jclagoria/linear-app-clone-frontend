# Tasks — Real-time Issue Updates (Frontend)

## Scaffold

- [x] Verify SSE client (`features/realtime/lib/ws-client.ts`) connects to backend endpoint
- [x] Verify event router (`features/realtime/model/event-router.ts`) dispatches to handlers
- [x] Verify event schema (`features/realtime/lib/event-schema.ts`) validates incoming events
- [x] Verify optimistic store (`features/realtime/lib/optimistic-store.ts`) supports snapshot/rollback

## Components

- [x] Create `NotificationBadge` — reads `notificationsStore.count`, displays bell icon with unread count
- [x] Create `NotificationPanel` — dropdown list of notifications; empty, loading, error states
- [x] Verify `IssueCard` renders all issue fields (title, status, assignee, priority)
- [x] Verify `ProjectCard` renders project name, status, and member count
- [x] Verify `StatusCycleIndicator` displays cycle state (active, completed, upcoming)
- [x] Verify `ConnectionStatusIndicator` shows connected/disconnected/reconnecting states
- [x] Verify `ReconnectionToast` displays on reconnect with duration
- [x] Verify `RevertToast` displays on failed optimistic update with rollback message

## State & Data

- [x] Create `notificationsStore` in `src/shared/stores/` — `items[]`, `count`, `addNotification`, `markRead`, `clearAll`
- [x] Add `addIssue`, `updateIssue`, `removeIssue` actions to issues store in `src/shared/stores/`
- [x] Add `addProject`, `updateProject` actions to projects store in `src/shared/stores/`
- [x] Add `addCycle`, `updateCycle` actions to cycles store in `src/shared/stores/`
- [x] Verify `websocketStore` exposes `status` (connected/disconnected/reconnecting) and `reconnectAttempts`
- [x] Implement issue event handler in `entities/issue/model/store.ts` — maps `issue.*` events to store mutations
- [x] Implement `project-store.ts` event handler in `features/realtime/lib/` — maps `project.*` events to store mutations
- [x] Implement `cycle-store.ts` event handler in `features/realtime/lib/` — maps `cycle.*` events to store mutations
- [x] Implement notification event handler in `shared/stores/notificationsStore.ts` — maps `notification.*` events to store mutations
- [x] Wire event handlers to `event-router.ts` — each event type routes to correct handler
- [x] Implement 100ms deduplication window for same-entity events in event router
- [x] Add `aria-live="polite"` to `NotificationBadge` count and `IssueCard` list container

## Routing

- [x] Verify `/issues` route renders `IssuesPage` with real-time `IssueCard` list
- [x] Verify `/issues/:id` route renders `IssueDetailPage` with `CommentThread`
- [x] Verify `/projects` route renders `ProjectsPage` with real-time `ProjectCard` list
- [x] Verify `/cycles` route renders `CyclesPage` with real-time `CycleCard` list
- [x] Verify `AuthGuard` prevents access to real-time routes without authentication

## Accessibility Settings

- [x] Create `AutoUpdateToggle` component in `features/realtime/ui/` — toggle in settings to enable/disable real-time updates
- [x] Wire toggle to `websocketStore` — when disabled, SSE events are received but not applied to stores
- [x] Add toggle to `SettingsPage` — "Real-time updates" toggle with description

## Integration

- [x] Connect SSE client to backend `/api/events` endpoint on app mount
- [x] Verify `issue.created` event adds new issue to list without page refresh
- [x] Verify `issue.updated` event reflects field changes in real-time
- [x] Verify `issue.statusChanged` event updates status badge on issue card
- [x] Verify `issue.assigned` / `issue.unassigned` event updates assignee on issue card
- [x] Verify `issue.deleted` event removes issue from list with visual feedback
- [x] Verify `comment.created` event appends comment to issue detail thread
- [x] Verify `project.created` / `project.updated` event updates project list
- [x] Verify `cycle.activated` / `cycle.completed` event updates cycle list
- [x] Verify `notification.created` event increments badge count and adds to notification panel
- [x] Verify events from other teams are silently ignored (teamId mismatch)
- [x] Verify reconnection after network drop restores state and replays missed events via `Last-Event-ID`

## Validation

- [x] Unit tests: event schema validates all 13 event types with correct payloads (`event-schema.test.ts` + `event-schema-full.test.ts`)
- [x] Unit tests: event router dispatches to correct handler per event type (`event-router-dispatch.test.ts`)
- [x] Unit tests: deduplication drops duplicate events within 100ms window (`entity-dedup.test.ts` + `event-processor.test.ts`)
- [x] Unit tests: store actions apply optimistic update and rollback on failure (`optimistic-store.test.ts` + `optimistic-rollback.test.ts` + `optimistic-manager.test.ts`)
- [x] Unit tests: `notificationsStore` addNotification, markRead, clearAll (`notifications-store.test.ts`)
- [x] Unit tests: `IssueCard`, `NotificationBadge`, `ConnectionStatusIndicator` render correctly (`components-render.test.tsx`)
- [x] Integration tests: SSE event triggers store mutation and UI re-render (`integration-pipeline.test.ts` + `sse-ui-integration.test.tsx`)
- [x] Integration tests: optimistic update shows revert toast on server rejection (`revert-toast.test.tsx` + `optimistic-manager.test.ts`)
- [x] Integration tests: reconnection restores event stream after disconnect (`reconnection.test.ts` + `reconnection.test.tsx`)
- [x] E2E tests: create issue in second tab → appears in first tab without refresh (`cross-tab-issue.test.ts`)
- [x] E2E tests: change issue status → badge updates in real-time (`status-badge-realtime.test.ts`)
- [x] E2E tests: add comment → thread appends without page load (`comment-thread-realtime.test.ts`)
- [x] E2E tests: notification count increments on new notification (`notification-count-realtime.test.ts`)
- [x] Accessibility tests: `aria-live` regions announce new content; tab order preserved (`aria-live-announce.test.tsx` + `accessibility.test.tsx`)

## Review

- [x] Verify all 13 event types are handled (issue.created/updated/statusChanged/assigned/unassigned/deleted, comment.created/updated, project.created/updated, cycle.created/updated/activated/completed, notification.created)
- [x] Verify optimistic updates rollback correctly on simulated server error
- [x] Verify deduplication prevents duplicate DOM updates
- [x] Verify connection status indicator reflects real-time state
- [x] Verify accessibility: screen reader announces new items via `aria-live="polite"`
- [x] Verify accessibility: reduced motion preference disables flash animations
- [x] Run full test suite (unit + integration + E2E)
- [x] Manual review of all mockup states against implemented UI
