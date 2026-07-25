# Realtime Module — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| WebSocket API | Native `WebSocket` | No protocol overhead; custom reconnect per spec | No auto-fallback to HTTP long-polling |
| State integration | Zustand slices | Existing pattern; no new dependencies | No built-in devtools like Redux Toolkit |
| Optimistic tracking | Dedicated Zustand slice | Centralized pending state; 30s staleness check | Custom code vs TanStack Query built-in |
| Event routing | Prefix matching (`issue.*`) | Simple; maps 15 events to 4 stores | Less flexible than pub/sub bus |
| Deduplication | Set-based with 5min TTL | Simple; prevents retry-induced duplicates | Memory grows with event volume |
| Heartbeat | Custom ping/pong frames | 30s interval, 10s timeout per spec | No socket.io keepalive magic |
| Reconnection | Exponential backoff (1s–30s, 10 max) | Per spec; prevents server spam | Manual reconnect button needed after exhaustion |
| Auth handshake | JWT in first message | Simple; no custom protocol headers | Requires server to handle auth-on-connect |

## Component Tree

```
App
├── WebSocketProvider (manages WS lifecycle)
│   ├── OptimisticProvider (context for optimistic updates)
│   │   ├── Header
│   │   │   ├── ConnectionStatusIndicator
│   │   │   └── NotificationBadge → NotificationPanel
│   │   ├── IssueListPage
│   │   │   └── IssueCard[]
│   │   ├── IssueDetailPage
│   │   │   ├── IssueCard (detail-header variant)
│   │   │   ├── StatusCycleIndicator
│   │   │   └── IssueAssigneeSelector
│   │   ├── ProjectListPage
│   │   │   └── ProjectCard[]
│   │   ├── CycleListPage
│   │   └── ConnectionErrorModal (conditional)
│   └── ReconnectionToast (conditional)
│   └── RevertToast (conditional)
```

| Component | Responsibility | Props | States |
|-----------|---------------|-------|--------|
| WebSocketProvider | Manages WS connection lifecycle, heartbeat, reconnection | children | connecting, connected, reconnecting, disconnected |
| OptimisticProvider | Exposes optimistic update context | children | idle, processing, reverting |
| ConnectionStatusIndicator | Shows WS connection state in header | status, className | connected, connecting, reconnecting, disconnected |
| NotificationBadge | Shows unread notification count | count | empty, counting, overflow |
| NotificationPanel | Dropdown listing recent notifications | isOpen, notifications | empty, populated, loading, error |
| IssueCard | Displays issue summary with real-time updates | issue, variant | idle, optimistic, confirmed, reverted |
| StatusCycleIndicator | Shows status cycling during optimistic update | status | idle, cycling, confirmed |
| IssueAssigneeSelector | Dropdown for assigning issues | issueId, currentAssignee | closed, open, selecting, applied |
| ProjectCard | Displays project summary with real-time updates | project | idle, optimistic, confirmed, reverted |
| ConnectionErrorModal | Modal after 10 failed reconnect attempts | onReconnect, onLogout | visible, dismissed |
| ReconnectionToast | Toast when connection drops or fails | variant, message | visible, dismissed |
| RevertToast | Toast when optimistic update fails | message, onRetry | visible, dismissed |

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| `/issues` | IssueListPage | protected | Real-time issue list with WS events |
| `/issues/:id` | IssueDetailPage | protected | Detail view with live comments + status |
| `/projects` | ProjectListPage | protected | Grid of projects with real-time updates |
| `/projects/:id` | ProjectDetailPage | protected | Project detail (existing) |
| `/cycles` | CycleListPage | protected | Active/past/upcoming cycles |
| (global) | WebSocketProvider | protected | Wraps all protected routes |
| (global) | ConnectionErrorModal | protected | Shown after 10 failed reconnects |
| (global) | ReconnectionToast | protected | Shown during reconnection |
| (global) | RevertToast | protected | Shown on optimistic failure |

## State Management

### Global Stores (Zustand)

| Store | Slice | Data | Notes |
|-------|-------|------|-------|
| `useWebSocketStore` | connection | status, reconnectAttempts, lastHeartbeat | Connection lifecycle |
| `useWebSocketStore` | notifications | list[], unreadCount | Real-time notification delivery |
| `useOptimisticStore` | pending | OptimisticUpdate[] | Tracks in-flight optimistic ops with timestamps |
| `useIssuesStore` | issues | Issue[] | Extended with `applyEvent(event)` handler |
| `useProjectsStore` | projects | Project[] | Extended with `applyEvent(event)` handler |
| `useCyclesStore` | cycles | Cycle[] | Extended with `applyEvent(event)` handler |

### Local State

| Component | State | Type | Notes |
|-----------|-------|------|-------|
| NotificationPanel | isOpen | boolean | Toggle panel visibility |
| IssueAssigneeSelector | isOpen | boolean | Toggle dropdown visibility |
| ConnectionErrorModal | isOpen | boolean | Toggle modal visibility |

### Server State

- No React Query / SWR for this feature
- All data flows through Zustand stores
- API requests triggered by optimistic updates or user actions
- Cache invalidation handled explicitly on optimistic success

## Data Fetching

### API Client

- Native `fetch` wrapped in existing `apiClient` utility
- Headers: `Authorization: Bearer {token}`, `Content-Type: application/json`
- Error handling: parse response, throw typed errors

### Error Handling

| Error Type | Handling | UI Feedback |
|------------|----------|-------------|
| Network failure | Retry with backoff | ReconnectionToast (network variant) |
| API 4xx | Show error, revert optimistic | RevertToast with message |
| API 5xx | Retry once, then revert | RevertToast with retry option |
| WebSocket disconnect | Auto-reconnect (exponential backoff) | ConnectionStatusIndicator updates |
| WS auth failure | Force logout | ConnectionErrorModal (fatal) |

### Optimistic Update Flow

```
1. User action → create OptimisticUpdate object
2. Apply data to target Zustand store (immediate, bypass cache)
3. Track in useOptimisticStore with timestamp
4. Send API request in background
5. On success:
   - Remove from pending updates
   - Invalidate related cache entries
   - UI stays in updated state
6. On failure:
   - Apply revert data to store
   - Show RevertToast with retry option
   - Remove from pending updates
7. Auto-revert if pending > 30 seconds
```

### WebSocket Event Flow

```
1. Event received on WS connection
2. EventProcessor.validate(event) → schema check
3. EventProcessor.deduplicate(eventId) → Set-based check
4. EventProcessor.route(event) → prefix match
5. Domain store.applyEvent(event) → state update
6. UI re-renders via Zustand subscription
```

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| ConnectionStatusIndicator | `src/features/realtime/ui/ConnectionStatusIndicator.tsx` | Green/yellow/orange/red dot |
| ReconnectionToast | `src/features/realtime/ui/ReconnectionToast.tsx` | Fixed bottom-right, auto-dismiss 5s |
| ConnectionErrorModal | `src/features/realtime/ui/ConnectionErrorModal.tsx` | Centered overlay, focus trapped |
| RevertToast | `src/features/realtime/ui/RevertToast.tsx` | Fixed bottom-right, retry button |
| IssueCard | `src/features/realtime/ui/IssueCard.tsx` | Card with status, title, labels, avatar |
| StatusCycleIndicator | `src/features/realtime/ui/StatusCycleIndicator.tsx` | Inline status dot with animation |
| IssueAssigneeSelector | `src/features/realtime/ui/IssueAssigneeSelector.tsx` | Combobox dropdown |
| ProjectCard | `src/features/realtime/ui/ProjectCard.tsx` | Card with icon, progress, avatars |
| NotificationBadge | `src/features/realtime/ui/NotificationBadge.tsx` | Red circle with count |
| NotificationPanel | `src/features/realtime/ui/NotificationPanel.tsx` | Dropdown list with items |
| Icons | `lucide-react` | Existing icon library in project |
| Fonts | System font stack | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` |

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| authToken | Must be non-empty string | "Authentication required for WebSocket connection" |
| reconnectAttempts | Must be integer 0–10 | "Maximum reconnection attempts exceeded" |
| eventType | Must be one of 15 registered types | "Unknown event type: {type}" |
| eventId | Must be non-empty string | "Event ID required for deduplication" |
| eventPayload | Must match event type schema | "Invalid payload for event type: {type}" |
| OptimisticUpdate.action | Must be "update", "add", or "remove" | "Invalid optimistic update action" |
| OptimisticUpdate.target | Must be non-empty string | "Target entity required" |
| OptimisticUpdate.data | Must be defined | "Update data required" |
| OptimisticUpdate.revert | Must contain action, target, data | "Revert information required" |
| OptimisticUpdate.request.method | Must be POST, PATCH, or DELETE | "Invalid request method" |
| OptimisticUpdate.request.url | Must be valid URL | "Invalid request URL" |

## Accessibility

### Keyboard Navigation

- **Tab order**: Header → main content → floating elements (toasts, modals)
- **Focus trap**: ConnectionErrorModal traps focus while open
- **Escape**: Dismisses modals, toasts, dropdown panels
- **Enter/Space**: Activates buttons, opens dropdowns, navigates to links
- **Arrow keys**: Navigate within IssueAssigneeSelector dropdown
- **Shortcuts**: `S` cycles issue status (existing keyboard shortcut)

### ARIA

| Component | Role | Key Attributes |
|-----------|------|----------------|
| ConnectionStatusIndicator | `status` | `aria-label="Connection status: {state}"`, `aria-live="polite"` |
| ReconnectionToast | `alert` | `role="alert"`, `aria-live="assertive"` |
| RevertToast | `alert` | `role="alert"`, `aria-live="assertive"` |
| ConnectionErrorModal | `dialog` | `aria-modal="true"`, `aria-labelledby`, `aria-describedby` |
| NotificationPanel | `region` | `aria-label="Notifications"` |
| IssueCard | `article` | `aria-label="Issue: {title}, Status: {status}"`, `aria-busy` during optimistic |
| IssueAssigneeSelector | `combobox` | `aria-expanded`, `aria-haspopup="listbox"`, `aria-activedescendant` |
| ProjectCard | `article` | `aria-label="Project: {name}"`, `aria-busy` during optimistic |
| NotificationItem | `article` | `aria-label="{notification title}"`, `aria-read="true"/"false"` |

### Screen Reader

- Connection status changes announced via `aria-live="polite"` region
- Notification count announced as "{count} unread notifications"
- Optimistic update applied: "Update applied" announced
- Optimistic update reverted: "Update reverted" announced
- Toast messages announced on appear via `aria-live="assertive"`
- Focus NOT moved by real-time events (prevents disorientation)
- Retry buttons in toasts are keyboard accessible
