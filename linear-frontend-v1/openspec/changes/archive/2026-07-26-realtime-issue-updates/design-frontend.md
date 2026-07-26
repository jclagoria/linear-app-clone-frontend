# Real-time Issue Updates — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| Event transport | SSE (existing ws-client.ts) | Already implemented in `features/realtime/lib/ws-client.ts`; simpler than WebSocket for one-way server→client | No bidirectional capability; acceptable for this change |
| Event routing | Event router + per-entity handlers | Central `event-router.ts` dispatches to typed handlers; follows FSD feature isolation | Adds indirection layer; justified by 13 event types |
| State updates | Optimistic with rollback | Store actions save previous state, apply SSE mutation, rollback on conflict | Slightly more complex store actions; prevents UI flicker |
| Store structure | Per-entity Zustand stores | `issuesStore`, `projectsStore`, `cyclesStore`, `notificationsStore` — each owns its slice | Store sprawl; mitigated by shared selectors |
| Notification count | Zustand + badge component | `NotificationBadge` reads from `notificationsStore.count`; no context overhead | Badge re-renders on count change; acceptable |
| Deduplication | Event ID + timestamp window | 100ms debounce window for same-entity events; prevents duplicate DOM updates | May drop legitimate rapid updates; acceptable for UX |

## Component Tree

```
AppLayout
├── Header
│   ├── NotificationBadge          ← reads notificationsStore.count
│   └── NotificationPanel          ← reads notificationsStore.items
├── Sidebar
│   └── IssueCountBadge            ← reads issuesStore filtered count
└── <Outlet/>                      ← page content
    ├── IssuesPage
    │   ├── IssueList
    │   │   └── IssueCard          ← reads issuesStore, subscribes to issue.* events
    │   └── IssueFilters
    ├── IssueDetailPage
    │   ├── IssueHeader
    │   ├── IssueDescription
    │   ├── CommentThread
    │   │   └── CommentCard        ← reads issue comments, subscribes to comment.* events
    │   └── CommentForm
    ├── ProjectsPage
    │   └── ProjectList
    │       └── ProjectCard        ← reads projectsStore, subscribes to project.* events
    └── CyclesPage
        └── CycleList
            └── CycleCard          ← reads cyclesStore, subscribes to cycle.* events
```

| Component | Responsibility | Props | State |
|-----------|---------------|-------|-------|
| `NotificationBadge` | Display unread count in header | — | `count` from notificationsStore |
| `NotificationPanel` | Dropdown list of notifications | — | `items[]` from notificationsStore; empty/loading/error |
| `IssueCard` | Render single issue in list | `issue: Issue` | populated, loading, error, not-found |
| `IssueCountBadge` | Show team issue count in sidebar | `teamId: string` | populated |
| `CommentCard` | Render single comment in thread | `comment: Comment` | populated, edited, loading |
| `CommentThread` | List comments for an issue | `issueId: string` | populated, empty, loading, error |
| `ProjectCard` | Render project in list | `project: Project` | populated, loading, error |
| `CycleCard` | Render cycle in list | `cycle: Cycle` | populated, loading, error |
| `ConnectionStatusIndicator` | Show WebSocket connection state | — | connected, disconnected, reconnecting |
| `ReconnectionToast` | Notify user of reconnection | — | visible, hidden |
| `RevertToast` | Notify user of failed optimistic update | `message: string` | visible, hidden |

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| `/` | DashboardPage | protected | Summary view, no real-time subscriptions needed |
| `/issues` | IssuesPage | protected | Real-time issue list; subscribes to `issue.*` events |
| `/issues/:id` | IssueDetailPage | protected | Real-time issue detail + comments; subscribes to `issue.*` and `comment.*` |
| `/projects` | ProjectsPage | protected | Real-time project list; subscribes to `project.*` events |
| `/cycles` | CyclesPage | protected | Real-time cycle list; subscribes to `cycle.*` events |

**No route changes required** — all existing routes serve real-time content via store mutations.

## State Management

- **Issues state**: `src/shared/stores/` — issues store with `setIssues`, `updateIssue`, `removeIssue`, `addIssue` actions
- **Projects state**: `src/shared/stores/` — projects store with `setProjects`, `updateProject`, `addProject`
- **Cycles state**: `src/shared/stores/` — cycles store with `setCycles`, `updateCycle`, `addCycle`
- **Notifications state**: `src/shared/stores/` — notifications store with `setNotifications`, `addNotification`, `markRead`, `clearAll`
- **Connection state**: `src/shared/stores/websocketStore.ts` — connection status, reconnect attempts
- **Optimistic state**: `src/features/realtime/lib/optimistic-store.ts` — pending updates, rollback support

### Event Processing Pipeline

```
SSE Event → ws-client.ts → event-router.ts
  → validates event schema (event-schema.ts)
  → deduplicates (event ID + 100ms window)
  → routes to handler (issue/project/cycle/notification)
  → optimistic-store saves previous state
  → store action applies mutation
  → UI re-renders
  → on failure: revert-toast shown, rollback applied
```

## Data Fetching

- **Client**: `src/shared/api/` — fetch wrapper with auth interceptors
- **Error handling**: Toast notification on API errors; retry with exponential backoff for network failures
- **Optimistic updates**: All SSE-triggered mutations are optimistic — save previous state, apply new state, rollback on conflict
- **Cache invalidation**: SSE events directly mutate store state; no separate cache invalidation needed

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| Connection icon | `lucide-react` — Wifi, WifiOff | ConnectionStatusIndicator |
| Notification bell | `lucide-react` — Bell | NotificationBadge |
| Status badges | `class-variance-authority` | StatusCycleIndicator |
| Avatar fallback | `shared/ui/` | Initials-based fallback |
| Toast icons | `lucide-react` — CheckCircle, AlertTriangle | RevertToast, ReconnectionToast |

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| `event.type` | Must be one of 13 defined types | Unknown event type |
| `event.teamId` | Must match current user's team | Event ignored — different team |
| `event.issueId` | Required for issue events | Missing issue identifier |
| `event.timestamp` | Valid ISO 8601 | Invalid event timestamp |
| `event.payload` | Must match event type schema | Invalid event payload |

## Accessibility

- **Keyboard navigation**: Tab order preserved during state updates; no focus traps on real-time content
- **ARIA live regions**: `aria-live="polite"` on notification count and issue list updates; screen readers announce new items without interrupting
- **Screen reader**: New items announced via `aria-live`; status changes use `role="status"`; loading states use `aria-busy`
- **Focus management**: No automatic focus movement on new content; user-initiated navigation only
- **Reduced motion**: Respects `prefers-reduced-motion` — flash animations disabled; transitions instant
