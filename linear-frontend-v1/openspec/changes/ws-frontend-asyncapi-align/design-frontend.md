# WebSocket Frontend Alignment — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| WebSocket Layer | Isolated module (`src/lib/ws/`) | Clean separation from React, testable without UI | Requires manual integration with React context |
| State Updates | Direct Zustand store mutations from WS handlers | Real-time performance, no middleware overhead | No automatic optimistic rollback (manual implementation) |
| Error Handling | Centralized handler with UI dispatch | Consistent error UX, single source of truth | Handler complexity increases with error types |
| Message Validation | Zod schemas at boundary | Type safety, runtime validation, catches malformed messages | Schema maintenance overhead |
| Reconnection | Exponential backoff (1s → 2s → 4s → 8s → 16s, max 5 retries) | Prevents server flood, recovers from transient issues | User may see "Reconnecting" state for up to 31s |
| Component Communication | Zustand subscriptions (not Context) | Granular re-renders, no provider overhead | More boilerplate than Context for simple state |

## Component Tree

```
App
├── WebSocketProvider (context)
│   ├── AppLayout
│   │   ├── Header
│   │   │   ├── Logo
│   │   │   ├── Navigation
│   │   │   ├── ConnectionStatusIndicator ← websocketStore
│   │   │   └── UserMenu
│   │   ├── MainContent
│   │   │   ├── Routes (lazy-loaded)
│   │   │   │   ├── IssueBoardPage
│   │   │   │   │   ├── BoardColumn × N
│   │   │   │   │   │   └── IssueCard × N
│   │   │   │   │   └── EmptyState
│   │   │   │   ├── NotificationPanelPage
│   │   │   │   │   └── NotificationItem × N
│   │   │   │   └── CommentThreadPage
│   │   │   │       └── CommentItem × N
│   │   │   └── Sidebar (optional)
│   │   └── ToastContainer ← errorStore
│   │       ├── WebSocketErrorToast × N
│   │       ├── RevertToast
│   │       └── ReconnectionToast
│   └── ConnectionErrorModal ← websocketStore
└── LoginPage (public)
```

| Component | Responsibility | Props | State |
|-----------|---------------|-------|-------|
| `WebSocketProvider` | Manages WS connection, exposes context | `children` | connection, status, error |
| `AppLayout` | App shell with header, content, toasts | none | — |
| `Header` | Top navigation bar | none | — |
| `ConnectionStatusIndicator` | Displays WS status as colored dot | none | connected, connecting, reconnecting, disconnected |
| `ConnectionErrorModal` | Critical error overlay (auth, forbidden) | none | hidden, visible |
| `WebSocketErrorToast` | Transient error notification | `error: WSError` | visible, dismissed |
| `ToastContainer` | Renders active toasts | none | toasts: WSError[] |
| `IssueBoardPage` | Kanban board with real-time updates | none | issues: Issue[], columns: Column[] |
| `NotificationPanelPage` | Notification list with unread indicators | none | notifications: Notification[], unreadCount |
| `CommentThreadPage` | Comment list with real-time additions | `issueId` | comments: Comment[] |

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| `/login` | LoginPage | public | Redirect target for auth failures |
| `/` | AppLayout → IssueBoardPage | protected | Default route, board view |
| `/issues` | AppLayout → IssueBoardPage | protected | Board with all issues |
| `/notifications` | AppLayout → NotificationPanelPage | protected | Notification list |
| `/issues/:id/comments` | AppLayout → CommentThreadPage | protected | Comment thread for issue |
| `*` | Navigate to `/` | — | Catch-all redirect |

## State Management

- **Global state**: Zustand stores (auth, websocket, issues, notifications, labels)
- **Local state**: Component-level form state (React Hook Form)
- **Real-time state**: WebSocket events update Zustand stores directly

### Store Design

| Store | Responsibility | Persist | Schema |
|-------|---------------|---------|--------|
| `authStore` | JWT tokens, user info, login/logout | localStorage | `auth.schema.ts` |
| `websocketStore` | Connection status, error state, retry count | No | `websocket.schema.ts` |
| `issueStore` | Issue data, board columns, optimistic updates | No | `issue.schema.ts` |
| `notificationStore` | Notifications, unread count | No | `notification.schema.ts` |
| `labelStore` | Label definitions | No | `label.schema.ts` |

### Store Actions

```typescript
// websocketStore
interface WebSocketStore {
  status: 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'disconnected'
  error: WSError | null
  retryCount: number
  connect: () => void
  disconnect: () => void
  handleError: (error: WSError) => void
  clearError: () => void
}

// issueStore
interface IssueStore {
  issues: Map<string, Issue>
  columns: Column[]
  updateIssue: (id: string, patch: Partial<Issue>) => void
  moveIssue: (id: string, toColumn: string) => void
  addIssue: (issue: Issue) => void
  removeIssue: (id: string) => void
}
```

## Data Fetching

- **REST API**: Fetch API with auth interceptor (Bearer JWT)
- **WebSocket**: Real-time events update stores directly
- **Error handling**: Toast for transient errors, modal for critical errors
- **Retry logic**: Exponential backoff for WS, manual retry for REST

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        REST API                              │
│  GET /issues → issueStore.issues                            │
│  POST /issues → issueStore.addIssue → WS broadcast          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     WebSocket Gateway                        │
│  { type: "event", event: "issue.updated" }                  │
│  → issueStore.updateIssue(id, data)                         │
│                                                              │
│  { type: "error", code: "rate_limited" }                    │
│  → websocketStore.handleError(error)                        │
│  → toastStore.addToast(error)                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     React Components                         │
│  ConnectionStatusIndicator ← websocketStore.status          │
│  IssueBoardPage ← issueStore.issues                         │
│  ToastContainer ← toastStore.toasts                         │
└─────────────────────────────────────────────────────────────┘
```

### Optimistic Updates

| Operation | Strategy | Rollback |
|-----------|----------|----------|
| Move issue | Optimistic (update store immediately) | Revert on WS error |
| Add comment | Optimistic (append to list) | Remove on WS error |
| Update issue | Optimistic (patch store) | Revert on WS error |

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| Logo | `public/logo.svg` | Linear Clone logo |
| Icons | `src/components/ui/icons/` | Lucide React icons |
| Connection Status Dot | `src/components/websocket/ConnectionStatusIndicator.tsx` | CSS animation for pulse |
| Error Modal Overlay | `src/components/websocket/ConnectionErrorModal.tsx` | Backdrop blur, focus trap |
| Toast Progress Bar | `src/components/websocket/WebSocketErrorToast.tsx` | Auto-dismiss countdown |
| Empty State Illustration | `public/empty-state.svg` | No issues placeholder |
| User Avatar | `public/avatar-default.svg` | Default user avatar |

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| `token` | Must be valid JWT (RS256, not expired) | "Invalid token" |
| `channel` | Must match `user:<uuid>`, `team:<uuid>`, or `issue:<uuid>` | "Invalid channel format" |
| `issue.title` | Required, 1-255 chars | "Title is required" |
| `issue.description` | Optional, max 10,000 chars | "Description too long" |
| `comment.body` | Required, 1-5,000 chars | "Comment is required" |

### Zod Schemas

```typescript
// src/lib/ws/schema.ts
const WSAuthenticateMessage = z.object({
  type: z.literal('authenticate'),
  token: z.string().jwt(),
})

const WSSubscribeMessage = z.object({
  type: z.literal('subscribe'),
  channel: z.string().regex(/^(user|team|issue):[a-f0-9-]+$/),
})

const WSEventMessage = z.object({
  type: z.literal('event'),
  channel: z.string(),
  event: z.string(),
  data: z.record(z.unknown()),
  timestamp: z.string().datetime(),
  userId: z.string().uuid(),
})

const WSErrorMessage = z.object({
  type: z.literal('error'),
  code: z.enum(['auth_failed', 'invalid_token', 'forbidden', 'rate_limited', 'invalid_channel']),
  message: z.string().optional(),
  retryAfter: z.number().optional(),
})
```

## Accessibility

### Keyboard Navigation

- **Tab order**: Logo → Navigation → ConnectionStatus → UserMenu → Main Content
- **Focus trap**: ConnectionErrorModal traps focus within modal
- **Escape**: Dismisses modal and toast notifications
- **Enter/Space**: Activates buttons and links
- **Arrow keys**: Navigate within board columns (optional enhancement)

### ARIA

| Component | Role | Attributes |
|-----------|------|------------|
| ConnectionStatusIndicator | `status` | `aria-label="Connected"` (dynamic) |
| ConnectionErrorModal | `dialog` | `aria-modal="true"`, `aria-labelledby="error-title"` |
| WebSocketErrorToast | `alert` | `aria-live="polite"` |
| RevertToast | `alert` | `aria-live="assertive"` |
| ToastContainer | `region` | `aria-live="polite"`, `aria-label="Notifications"` |

### Screen Reader

- **Headings**: Logical hierarchy (h1 → h2 → h3)
- **Labels**: All interactive elements have accessible names
- **Alt text**: Decorative images use `alt=""`, informative images use descriptive text
- **Live regions**: Toast notifications announced via `aria-live`
- **Status updates**: Connection status changes announced via `role="status"`

### Color Contrast

| Element | Foreground | Background | Ratio | WCAG |
|---------|------------|------------|-------|------|
| Connected dot | #22c55e | #1a1a1a | 4.5:1 | AA |
| Disconnected dot | #ef4444 | #1a1a1a | 4.6:1 | AA |
| Error modal text | #ffffff | #1a1a1a | 15.4:1 | AAA |
| Toast text | #ffffff | #333333 | 12.6:1 | AAA |

## WebSocket Message Types

### Client → Server

| Message | Format | When |
|---------|--------|------|
| `authenticate` | `{ type: "authenticate", token: "<jwt>" }` | Connection open |
| `subscribe` | `{ type: "subscribe", channel: "issue:<id>" }` | View issue details |
| `unsubscribe` | `{ type: "unsubscribe", channel: "issue:<id>" }` | Leave issue view |

### Server → Client

| Message | Format | When |
|---------|--------|------|
| `authenticated` | `{ type: "authenticated", userId, connectionId }` | After auth success |
| `subscribed` | `{ type: "subscribed", channel }` | After subscription |
| `unsubscribed` | `{ type: "unsubscribed", channel }` | After unsubscription |
| `event` | `{ type: "event", channel, event, data, timestamp, userId }` | Domain event |
| `error` | `{ type: "error", code, message?, retryAfter? }` | Error occurred |

### Event Types

| Event | Channel | Data | Store Update |
|-------|---------|------|--------------|
| `issue.updated` | `team:<id>` | `{ issueId, patch }` | `issueStore.updateIssue()` |
| `issue.created` | `team:<id>` | `{ issue }` | `issueStore.addIssue()` |
| `issue.deleted` | `team:<id>` | `{ issueId }` | `issueStore.removeIssue()` |
| `comment.created` | `issue:<id>` | `{ comment }` | `commentStore.addComment()` |
| `label.created` | `team:<id>` | `{ label }` | `labelStore.addLabel()` |
| `user.online` | `team:<id>` | `{ userId }` | `userStore.setOnline()` |
| `session.revoked` | `user:<id>` | `{ reason }` | `authStore.logout()` |

## Error Handling Matrix

| Error Code | UI Component | Action | Reconnect |
|------------|--------------|--------|-----------|
| `auth_failed` | ConnectionErrorModal | Clear tokens, redirect to `/login` | No |
| `invalid_token` | ConnectionErrorModal | Close connection, show error | No |
| `forbidden` | ConnectionErrorModal | Show "Access denied" | No |
| `rate_limited` | WebSocketErrorToast | Show countdown, pause reconnect | After retryAfter |
| `invalid_channel` | WebSocketErrorToast | Show error, ignore subscription | Yes |
| `session.revoked` | ConnectionErrorModal + Toast | Clear tokens, redirect to `/login` | No |

## Files Affected by This Change

| File | Change Description |
|------|-------------------|
| `src/lib/ws/client.ts` | Update message format, add exponential backoff |
| `src/lib/ws/types.ts` | New WSEvent interface, error code enum |
| `src/lib/ws/handlers.ts` | New event types, error routing |
| `src/lib/ws/schema.ts` | Zod schemas for all messages |
| `src/components/websocket/ConnectionStatusIndicator.tsx` | New states (connecting, reconnecting) |
| `src/components/websocket/ConnectionErrorModal.tsx` | New error codes, focus trap |
| `src/components/websocket/WebSocketErrorToast.tsx` | New error codes, auto-dismiss |
| `src/stores/websocketStore.ts` | New connection states, retry logic |
| `src/stores/issueStore.ts` | Real-time issue updates |
| `src/stores/notificationStore.ts` | Real-time notifications |
| `src/app/AppLayout.tsx` | Integrate WebSocket provider |
| `src/types/websocket.ts` | Shared WebSocket types |
