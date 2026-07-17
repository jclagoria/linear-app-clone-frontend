# Frontend Modules - Technology Agnostic Specification

> Each module is described by its **responsibility**, **behavior**, and **atomic parts** without referencing specific technologies.

---

## Module Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND SYSTEM                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │     Auth    │  │   Routing   │  │    State    │           │
│  │   Module    │  │   Module    │  │   Module    │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │    API      │  │    UI       │  │  Realtime   │           │
│  │   Module    │  │   Module    │  │   Module    │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │  Keyboard   │  │   Form      │  │   Layout    │           │
│  │   Module    │  │   Module    │  │   Module    │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │    Work     │  │             │  │             │           │
│  │   Module    │  │             │  │             │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---
---

# 1. Auth Module

## Purpose
Handle user authentication state, login/logout flows, and token management.

## Responsibility
- Store authentication tokens
- Provide authentication state to other modules
- Handle login and logout flows
- Manage token refresh

---

## Atomic Parts

### 1.1 Auth State

**Behavior:** Maintain current authentication status.

| Aspect | Description |
|--------|-------------|
| State | `isAuthenticated`, `user`, `isLoading` |
| Queries | Is user logged in? Who is the current user? |
| Mutations | Set authenticated, Clear authenticated |
| Persistence | Tokens stored securely (memory/cookie) |

**State Shape:**
```
AuthState {
  isAuthenticated: boolean
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
}
```

**Rules:**
- State is cleared on logout
- State is hydrated from storage on app start
- Loading state prevents duplicate requests

---

### 1.2 Login Flow

**Behavior:** Authenticate user and store credentials.

| Aspect | Description |
|--------|-------------|
| Trigger | User submits login form |
| Steps | 1. Send credentials to API |
|         | 2. Receive tokens and user data |
|         | 3. Store tokens securely |
|         | 4. Update auth state |
|         | 5. Redirect to dashboard |
| Errors | Show error message, keep form data |
| Loading | Show loading indicator during request |

**Rules:**
- Form is disabled during submission
- Error messages are cleared on new attempt
- Redirect URL can be specified (return to page)

---

### 1.3 Logout Flow

**Behavior:** Clear credentials and redirect to login.

| Aspect | Description |
|--------|-------------|
| Trigger | User clicks logout or token expires |
| Steps | 1. Call logout API (optional) |
|         | 2. Clear tokens from storage |
|         | 3. Clear auth state |
|         | 4. Clear any cached data |
|         | 5. Redirect to login page |
| Errors | Force logout even if API call fails |

**Rules:**
- Logout is always possible (even offline)
- All user data is cleared
- WebSocket connection is closed

---

### 1.4 Token Refresh

**Behavior:** Silently refresh expired access tokens.

| Aspect | Description |
|--------|-------------|
| Trigger | API returns 401 or token near expiry |
| Steps | 1. Check if refresh token exists |
|         | 2. Call refresh API |
|         | 3. Update stored tokens |
|         | 4. Retry original request |
| Errors | If refresh fails, trigger logout |
| Loading | Queue requests during refresh |

**Rules:**
- Only one refresh request at a time (queue others)
- Proactive refresh before token expires
- Failed refresh triggers automatic logout

---

### 1.5 Auth Guard

**Behavior:** Protect routes that require authentication.

| Aspect | Description |
|--------|-------------|
| Input | Current route, auth state |
| Logic | If route requires auth and not authenticated → redirect to login |
| Output | Allow access or redirect |
| Exceptions | Public routes bypass guard |

**Rules:**
- Guard checks auth state, not API calls
- Unauthenticated users see login page
- Original URL is saved for redirect after login

---
---

# 2. Routing Module

## Purpose
Manage navigation between different views and pages.

## Responsibility
- Define application routes
- Handle navigation
- Manage route parameters
- Support deep linking

---

## Atomic Parts

### 2.1 Route Definitions

**Behavior:** Map URLs to page components.

| Route | Component | Auth Required |
|-------|-----------|---------------|
| `/login` | LoginPage | No |
| `/register` | RegisterPage | No |
| `/` | DashboardPage | Yes |
| `/issues` | IssuesPage | Yes |
| `/issues/:id` | IssueDetailPage | Yes |
| `/projects` | ProjectsPage | Yes |
| `/projects/:id` | ProjectDetailPage | Yes |
| `/cycles` | CyclesPage | Yes |
| `/settings` | SettingsPage | Yes |

---

### 2.2 Navigation

**Behavior:** Programmatic navigation between routes.

| Aspect | Description |
|--------|-------------|
| Operations | Navigate to URL, Go back, Go forward |
| Input | Target URL or route name |
| Side Effects | URL changes, history updated |
| Output | None |

**Navigation Patterns:**
- Link clicks (standard navigation)
- Programmatic navigation (after actions)
- Redirect after login/logout
- Back/forward browser navigation

---

### 2.3 Route Parameters

**Behavior:** Extract and use dynamic route segments.

| Aspect | Description |
|--------|-------------|
| Input | URL with parameters (e.g., `/issues/:id`) |
| Extraction | Parse parameters from URL |
| Usage | Pass to page components |
| Validation | Validate parameter format (UUID) |

**Parameter Types:**
- Path parameters: `/issues/:id`
- Query parameters: `/issues?status=todo`
- Hash parameters: `/issues#comment-123`

---

### 2.4 Route Guards

**Behavior:** Control access to routes based on conditions.

| Aspect | Description |
|--------|-------------|
| Guard Types | Auth guard, Role guard, Feature guard |
| Input | Target route, current state |
| Logic | Check conditions before allowing access |
| Output | Allow, redirect, or block |

**Guard Rules:**
- Auth guard: Redirect to login if not authenticated
- Role guard: Redirect to dashboard if insufficient permissions
- Feature guard: Show 404 if feature not enabled

---
---

# 3. Work Module

## Purpose
Manage work items: issues, comments, labels, and watchers.

## Responsibility
- Display and filter issues
- Create/edit issues
- Manage comments on issues
- Handle issue status changes
- Track issue assignments and labels

---

## Atomic Parts

### 3.1 Issue Management

**Behavior:** Display and manage issue lists and details.

| Aspect | Description |
|--------|-------------|
| Components | IssueList, IssueCard, IssueForm, CommentForm, CommentList |
| State | Issues Store (list, filters, selected issue) |
| Selectors | `selectIssuesByStatus` for list views |
| Mutations | Set issues, Update issue, Remove issue |

**Rules:**
- IssueList shows filtered issues with status indicators
- IssueCard shows compact issue display
- IssueForm handles create/edit with validation
- CommentForm handles comment submission
- CommentList displays comments in chronological order

---

### 3.2 Issue Status Changes

**Behavior:** Transition issues through workflow states.

| Aspect | Description |
|--------|-------------|
| Trigger | User action (keyboard shortcut `S`, button click) |
| Immediate | Optimistic update (status changes immediately) |
| Background | PATCH /issues/:id/status |
| On Success | Confirm optimistic state |
| On Failure | Revert to previous status, show error toast |

**Rules:**
- Status changes follow workflow rules (backend validates)
- `completedAt` is set/cleared automatically
- Optimistic updates use OptimisticUpdate interface

---

# 4. State Module

## Purpose
Manage application-wide state and data caching.

## Responsibility
- Store and retrieve application state
- Cache API responses
- Handle state updates from various sources
- Provide state to UI components

---

## Atomic Parts

### 4.1 Store Architecture

**Behavior:** Organize state into logical domains.

| Store | Responsibility |
|-------|----------------|
| Auth Store | Authentication state, tokens, user |
| Issues Store | Issue list, filters, selected issue |
| Projects Store | Project list, selected project |
| Cycles Store | Cycle list, active cycle |
| UI Store | Modals, sidebar, theme, loading states, keyboard context |
| WebSocket Store | Connection state, real-time events, notifications |

---

### 4.2 State Shapes

**Behavior:** Define the shape of each store.

```
AuthState {
  isAuthenticated: boolean
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
}

IssuesState {
  issues: Issue[]                    // Issue objects with nested comments[] and labels[]
  selectedIssueId: string | null
  filters: {
    status: string | null
    assigneeId: string | null
    projectId: string | null
    cycleId: string | null
    labelIds: string[]
  }
  isLoading: boolean
  pagination: {
    cursor: string | null
    hasMore: boolean
  }
}

ProjectsState {
  projects: Project[]
  selectedProjectId: string | null
  isLoading: boolean
}

CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
  isLoading: boolean
}

UIState {
  sidebarCollapsed: boolean
  theme: 'light' | 'dark' | 'system'
  activeModal: string | null
  loadingStates: Record<string, boolean>
  keyboardContext: {
    current: 'global' | 'list' | 'detail'
    selectedIssueId: string | null
  }
}

WebSocketState {
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'reconnecting'
  lastEvent: RealtimeEvent | null
  reconnectAttempts: number
  notifications: Notification[]
}
```

---

### 4.3 Component Dependencies

**Behavior:** Map components to stores and selectors.

| Component | Store | Selector |
|-----------|-------|----------|
| **Data Display** | | |
| `IssueList` | Issues | `selectIssuesByStatus` |
| `IssueCard` | Issues | — (receives issue via props) |
| `ProjectCard` | Projects | `selectProjectProgress` |
| `CycleCard` | Cycles | `selectActiveCycle` |
| `CommentList` | Issues | — (receives comments via props) |
| `UserAvatar` | Auth | — (receives user via props) |
| **Layout** | | |
| `Sidebar` | UI, Auth | — (UI: sidebar collapsed; Auth: current user) |
| `Header` | Auth, WebSocket | `selectUnreadCount` |
| **Forms** | | |
| `IssueForm` | Issues, Projects, Auth | — (receives data via props, dispatches mutations) |
| `CommentForm` | Issues | — (dispatches mutations only) |
| `LoginForm` | Auth | — (dispatches mutations only) |
| `RegisterForm` | Auth | — (dispatches mutations only) |
| **Primitives** | — | — (receive all data via props) |

**Rules:**
- Components that only dispatch mutations (forms) don't need selectors
- Components that display data need selectors
- Primitives are stateless — all data via props

---

### 4.4 State Mutations

**Behavior:** Define how state can be changed.

| Mutation Type | Description |
|---------------|-------------|
| Set | Replace a value |
| Update | Merge partial updates |
| Append | Add to a list |
| Remove | Remove from a list |
| Reset | Return to initial state |

**Mutation Rules:**
- Mutations are the only way to change state
- Mutations are synchronous (immediate state change)
- Side effects are handled separately (effects/actions)

---

### 4.5 Selectors

**Behavior:** Derive computed values from state.

| Selector | Input State | Output |
|----------|-------------|--------|
| `selectIssuesByStatus` | issues, filter | Filtered issues grouped by status |
| `selectProjectProgress` | issues, projectId | Completion percentage |
| `selectActiveCycle` | cycles | Currently active cycle |
| `selectUnreadCount` | notifications | Number of unread notifications |

**Rules:**
- Selectors are pure functions (no side effects)
- Selectors cache results when inputs unchanged
- Selectors can combine multiple state slices

---

### 4.6 State Persistence

**Behavior:** Persist critical state across sessions.

| Persisted Data | Storage | Lifetime |
|----------------|---------|----------|
| Auth tokens | Secure storage | Until logout |
| Theme preference | Local storage | Permanent |
| Sidebar collapsed | Local storage | Permanent |
| Last viewed issue | Local storage | 7 days |

**Rules:**
- Sensitive data uses secure storage
- Non-sensitive data uses local storage
- Persisted state is hydrated on app start

---

### 4.7 Cache Management

**Behavior:** Cache API responses for performance.

| Aspect | Description |
|--------|-------------|
| Strategy | Cache-first for reads, invalidate on writes |
| TTL | Time-to-live for cached data |
| Invalidation | Manual and automatic invalidation |
| Size Limits | Maximum cache size per domain |

**Cache Rules:**
- GET responses are cached automatically
- Mutations invalidate related cache entries
- Stale data is refreshed in background
- Cache is cleared on logout

---
---

# 5. API Module

## Purpose
Handle all communication with the backend server.

## Responsibility
- Send HTTP requests
- Handle responses and errors
- Manage request lifecycle
- Transform data formats

---

## Atomic Parts

### 5.1 HTTP Client

**Behavior:** Send and receive HTTP requests.

| Aspect | Description |
|--------|-------------|
| Methods | GET, POST, PATCH, DELETE |
| Headers | Authorization, Content-Type, Accept |
| Timeouts | Configurable per request |
| Retries | Automatic retry on network errors |

**Request Lifecycle:**
1. Add authentication headers
2. Add request ID for tracing
3. Send request
4. Handle response
5. Handle errors

---

### 5.2 Request/Response Interceptors

**Behavior:** Modify requests and responses automatically.

| Interceptor | Purpose |
|-------------|---------|
| Auth Interceptor | Add Bearer token to requests |
| Error Interceptor | Handle 401, 403, 500 errors |
| Loading Interceptor | Track pending requests |
| Cache Interceptor | Serve from cache when available |
| Rate Limit Interceptor | Parse rate limit headers |

**Rules:**
- Interceptors run in order
- Error interceptor can retry requests
- Loading interceptor manages global loading state
- Rate limit interceptor tracks state per endpoint

---

### 5.3 Error Handling

**Behavior:** Handle API errors consistently.

| Error Code | HTTP Status | Frontend Handling |
|------------|-------------|-------------------|
| `VALIDATION_ERROR` | 400 | Show field-level errors from `details[]` |
| `UNAUTHORIZED` | 401 | Refresh token, or redirect to login |
| `FORBIDDEN` | 403 | Show permission error |
| `NOT_FOUND` | 404 | Show not found message |
| `CONFLICT` | 409 | Show conflict message with server text |
| `BUSINESS_RULE_ERROR` | 422 | Show business rule error with server text |
| `RATE_LIMITED` | 429 | Show rate limit message, disable actions until reset |
| `SERVER_ERROR` | 500 | Show generic error, retry option |
| Network | — | Show offline message, retry option |

**Error Shape:**
```
APIError {
  code: string
  message: string
  details: Array<{ field: string, message: string }>
}
```

**ErrorHandler Interface:**
```typescript
interface ErrorHandler {
  onNetworkError: () => void;
  onUnauthorized: () => void;
  onForbidden: () => void;
  onValidationError: (details: FieldError[]) => void;
  onNotFound: () => void;
  onConflict: (message: string) => void;
  onBusinessRuleError: (message: string) => void;
  onRateLimited: (retryAfter: number) => void;
  onServerError: () => void;
  onUnknown: (error: any) => void;
}
```

---

### 5.4 Rate Limiting

**Behavior:** Handle rate limiting from backend responses.

**Rate Limit State:**
```
RateLimitState {
  endpoint: string
  limit: number
  remaining: number
  resetAt: number
  retryAfter: number | null
}
```

**Behavior:**
- Parse `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` headers from every response
- Track rate limit state per endpoint
- On 429: parse `Retry-After` header, show toast, disable affected actions
- Auto-enable when window resets

**Rules:**
- Rate limits are per-endpoint (hitting login limit doesn't affect issue creation)
- Client tracks state but doesn't enforce — backend is source of truth
- No auto-retry — user sees toast and can manually retry after wait

---

### 5.5 Data Transformation

**Behavior:** Transform data between API and UI formats.

| Transformation | API Format | UI Format |
|----------------|------------|-----------|
| Dates | ISO string | Relative time ("2 hours ago") |
| Enums | Lowercase string | Display label ("In Progress") |
| IDs | UUID | Short display (optional) |
| Pagination | Cursor-based | Infinite scroll ready |

---

### 5.6 Request Deduplication

**Behavior:** Prevent duplicate in-flight requests.

| Aspect | Description |
|--------|-------------|
| Detection | Same method + URL + params |
| Handling | Return existing promise |
| Use Case | Rapid re-renders, double clicks |
| Bypass | Force option to skip dedup |

---
---

# 6. UI Module

## Purpose
Provide reusable UI components and design system.

## Responsibility
- Display data in consistent formats
- Handle user interactions
- Provide feedback (loading, success, error)
- Maintain visual consistency

---

## Atomic Parts

### 6.1 Design System Components

**Behavior:** Basic building blocks for UI.

| Component | Purpose |
|-----------|---------|
| Button | Click actions with variants (primary, secondary, danger) |
| Input | Text input with validation |
| Select | Dropdown selection |
| Checkbox | Boolean toggle |
| Badge | Status/priority indicator |
| Avatar | User avatar display |
| Modal | Overlay dialog |
| Tooltip | Contextual help |
| Toast | Temporary notifications |

**Component Rules:**
- All components accept `className` for customization
- All components support `disabled` state
- All form components support `error` state
- Components are accessible (ARIA attributes)

---

### 6.2 Layout Components

**Behavior:** Structure the page layout.

| Component | Purpose |
|-----------|---------|
| Sidebar | Main navigation |
| Header | Top bar with user menu |
| MainContent | Content area |
| PageContainer | Page wrapper with padding |

**Layout Rules:**
- Sidebar is collapsible
- Layout is responsive (mobile-friendly)
- Sidebar state is persisted

---

### 6.3 Data Display Components

**Behavior:** Display structured data.

| Component | Purpose |
|-----------|---------|
| IssueList | List of issues with filters |
| IssueCard | Compact issue display |
| ProjectCard | Project summary |
| CycleCard | Cycle summary |
| CommentList | List of comments |
| UserAvatar | User info display |

---

### 6.4 Form Components

**Behavior:** Handle user input and submission. Composed forms use Form Module field wrappers (TextField, SelectField, etc.).

| Component | Purpose |
|-----------|---------|
| IssueForm | Create/edit issue |
| CommentForm | Add comment |
| LoginForm | User login |
| RegisterForm | User registration |

**Form Rules:**
- Forms validate on submit
- Forms show inline errors
- Forms disable during submission
- Forms support keyboard navigation

**Composition:** Forms are composed in UI Module using Form Module field wrappers. Form Module handles state (FormState, validation, submission). UI Module handles layout and presentation.

---

### 6.5 Loading States

**Behavior:** Indicate loading progress.

| State | Display |
|-------|---------|
| Initial Load | Skeleton screens |
| Action Loading | Spinner on button |
| Page Loading | Full page spinner |
| Inline Loading | Small spinner in context |

---

### 6.6 Empty States

**Behavior:** Display when no data is available.

| State | Display |
|-------|---------|
| No Issues | "No issues yet" with create button |
| No Projects | "No projects" with create button |
| No Results | "No results found" with clear filters |

---
---

# 7. Realtime Module

## Purpose
Handle WebSocket connection and real-time data synchronization.

## Responsibility
- Establish and maintain WebSocket connection
- Receive real-time events
- Update local state from events
- Handle connection lifecycle

---

## Atomic Parts

### 7.1 Connection Management

**Behavior:** Connect to WebSocket server.

| Aspect | Description |
|--------|-------------|
| Connection | Establish WebSocket connection |
| Authentication | Send token with connection |
| Reconnection | Auto-reconnect on disconnect |
| Heartbeat | Maintain connection with pings |

**Connection States:**
```
Disconnected → Connecting → Connected → Reconnecting
```

**Rules:**
- Connection is established after authentication
- Exponential backoff for reconnection
- Maximum reconnection attempts: 10

---

### 7.2 Event Subscription

**Behavior:** Subscribe to specific event types.

| Event Type | Source | Action |
|------------|--------|--------|
| `issue.created` | Work Module | Add issue to list |
| `issue.updated` | Work Module | Update issue in list |
| `issue.statusChanged` | Work Module | Update issue status |
| `issue.assigned` | Work Module | Update issue assignee |
| `issue.unassigned` | Work Module | Clear assignee |
| `issue.deleted` | Work Module | Remove from list |
| `comment.created` | Work Module | Add comment to issue |
| `comment.updated` | Work Module | Update comment |
| `project.created` | Project Module | Add project to list |
| `project.updated` | Project Module | Update project |
| `cycle.created` | Cycle Module | Add cycle to list |
| `cycle.updated` | Cycle Module | Update cycle |
| `cycle.activated` | Cycle Module | Set as active cycle |
| `cycle.completed` | Cycle Module | Mark as completed |
| `notification.created` | Notification Module | Show notification |

**Rules:**
- Frontend handles any event backend emits
- Events not relevant to current view are silently ignored (no error)
- Each event maps to a state mutation via the appropriate Store

---

### 7.3 Event Processing

**Behavior:** Process incoming real-time events.

| Aspect | Description |
|--------|-------------|
| Input | Event type, payload |
| Processing | Validate event, update state |
| Side Effects | Update UI, show notifications |
| Deduplication | Ignore events already applied |

**Processing Rules:**
- Events are processed in order
- Duplicate events are ignored
- Events are processed asynchronously
- Failed events are logged but don't block others

---

### 7.4 Optimistic Updates

**Behavior:** Update UI immediately before server confirms.

| Aspect | Description |
|--------|-------------|
| Trigger | User action (status change, assignment) |
| Immediate | Update local state |
| Background | Send API request |
| On Success | Keep optimistic state, invalidate cache |
| On Failure | Revert optimistic state, show error toast |

**OptimisticUpdate Interface:**
```typescript
interface OptimisticUpdate {
  action: "update" | "add" | "remove";
  target: string;           // e.g., "issues", "issues:uuid"
  data: any;                // New data
  
  revert: {
    action: "update" | "add" | "remove";
    target: string;
    data: any;              // Previous data
  };
  
  request: {
    method: "POST" | "PATCH" | "DELETE";
    url: string;
    body?: any;
  };
}
```

**Optimistic Rules:**
- Only for low-risk operations
- Always show revert option on failure
- Disable duplicate actions during pending
- Optimistic updates bypass cache — update state directly
- Cache invalidation happens on API success only

---
---

# 8. Keyboard Module

## Purpose
Handle keyboard shortcuts for power users.

## Responsibility
- Register keyboard shortcuts
- Execute actions on key combinations
- Show keyboard hints
- Handle shortcut conflicts

---

## Atomic Parts

### 8.1 Shortcut Registry

**Behavior:** Define available keyboard shortcuts.

| Shortcut | Action | Context |
|----------|--------|---------|
| `C` | Create new issue | Global |
| `G then I` | Go to Issues | Global |
| `G then P` | Go to Projects | Global |
| `G then C` | Go to Cycles | Global |
| `/` | Focus search | Global |
| `Esc` | Close modal / deselect | Global |
| `J` | Move down in list | List view |
| `K` | Move up in list | List view |
| `Enter` | Open selected item | List view |
| `S` | Cycle status | Issue selected |
| `A` | Assign issue | Issue selected |
| `L` | Add label | Issue selected |
| `E` | Edit title | Issue selected |
| `Delete` | Delete (with confirm) | Issue selected |

---

### 8.2 Shortcut Execution

**Behavior:** Execute actions when shortcuts are triggered.

| Aspect | Description |
|--------|-------------|
| Detection | Key press event captured |
| Matching | Match against registered shortcuts |
| Execution | Execute associated action |
| Conflict | Handle conflicting shortcuts |

**Execution Rules:**
- Shortcuts don't fire during text input
- Shortcuts respect current context (page, selection)
- Conflicts are resolved by specificity
- Disabled shortcuts in certain states (e.g., during modal)

---

### 8.3 Context Management

**Behavior:** Determine which shortcuts are active based on current context.

**Context Source:** UI Store (`keyboardContext` field)

```
keyboardContext: {
  current: 'global' | 'list' | 'detail'
  selectedIssueId: string | null
}
```

**Context Rules:**

| Context | Trigger | Active when |
|---------|---------|-------------|
| `global` | Always | Any page |
| `list` | Route change to list view | Viewing issues/projects/cycles list |
| `detail` | Route change to detail view | Viewing single issue/project/cycle |

**Context Switching:**
- Route-driven: context updates automatically on navigation
- Selection-driven: `selectedIssueId` updates on issue click/keyboard select

**Conflict Resolution:**
- Specificity wins: `detail` > `list` > `global`
- When issue is selected in list view: both `list` and `detail` are active
- Issue-specific shortcuts (`S`, `A`, `L`, `E`, `Delete`) require `detail` context
- List shortcuts (`J`, `K`, `Enter`) require `list` context
- Global shortcuts (`C`, `G then I`, `/`, `Esc`) always work

---

### 8.4 Shortcut Help

**Behavior:** Display available shortcuts to user.

| Aspect | Description |
|--------|-------------|
| Trigger | `?` key or help button |
| Display | Modal with all shortcuts |
| Filtering | Filter by category |
| Customization | Show personalized shortcuts |

---

### 8.5 Shortcut Customization

**Behavior:** Allow users to customize shortcuts.

| Aspect | Description |
|--------|-------------|
| Storage | Save custom shortcuts per user |
| UI | Settings page for shortcut customization |
| Validation | Prevent conflicting shortcuts |
| Reset | Option to reset to defaults |

---
---

# 9. Form Module

## Purpose
Handle form state, validation, and submission.

## Responsibility
- Manage form field values
- Validate form data
- Handle form submission
- Display errors

---

## Atomic Parts

### 9.1 Form State

**Behavior:** Track form field values and state.

| Aspect | Description |
|--------|-------------|
| State | Field values, touched fields, dirty fields |
| Operations | Set value, Reset, Clear |
| Persistence | Optional auto-save |

**Form State Shape:**
```
FormState {
  values: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValid: boolean
}
```

**Rules:**
- Form Module owns form state, validation, and submission logic
- UI Module uses Form Module field wrappers (TextField, SelectField, etc.)
- Field wrappers = UI primitive (Input) + label + error + hint

---

### 9.2 Validation

**Behavior:** Validate form data against rules.

| Validation Type | Description |
|-----------------|-------------|
| Required | Field must have value |
| Min Length | Minimum character count |
| Max Length | Maximum character count |
| Pattern | Regex pattern match |
| Custom | Function-based validation |
| Async | Server-side validation |

**Validation Timing:**
- On blur: Validate individual field
- On submit: Validate all fields
- Real-time: Validate as user types (optional)

---

### 9.3 Form Submission

**Behavior:** Submit form data to API.

| Aspect | Description |
|--------|-------------|
| Trigger | Submit button click or Enter key |
| Steps | 1. Validate all fields |
|         | 2. Show loading state |
|         | 3. Send API request |
|         | 4. Handle success/error |
|         | 5. Reset or keep form |
| Success | Show success message, redirect |
| Error | Show errors, keep form data |

**Submission Rules:**
- Disable form during submission
- Prevent double submission
- Show clear error messages
- Preserve user input on error

---

### 9.4 Field Components

**Behavior:** Specialized form field components. Each wraps a UI primitive with label, error, and hint.

| Component | Wraps | Features |
|-----------|-------|----------|
| TextField | Input | Text input with label, error, hint |
| SelectField | Select | Dropdown with options, search |
| DateField | Input | Date picker with format |
| CheckboxField | Checkbox | Boolean with label |
| TextareaField | — | Multi-line text |
| RichTextField | — | Markdown editor (optional) |

**Composition:** `TextField` = `Input` (UI Module) + label + error + hint

---
---

# 10. Layout Module

## Purpose
Manage the application layout structure and responsive behavior.

## Responsibility
- Provide consistent page structure
- Handle responsive breakpoints
- Manage sidebar state
- Support theme switching

---

## Atomic Parts

### 10.1 Page Layout

**Behavior:** Structure the main page layout.

| Aspect | Description |
|--------|-------------|
| Structure | Sidebar + Header + Main Content |
| Responsive | Collapsible sidebar on mobile |
| Full Height | Fill viewport height |
| Overflow | Scroll main content |

**Layout Structure:**
```
┌─────────────────────────────────────────┐
│                 Header                  │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │        Main Content          │
│          │                              │
│          │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

---

### 10.2 Sidebar

**Behavior:** Main navigation sidebar.

| Aspect | Description |
|--------|-------------|
| Navigation | Team selector, nav links |
| Sections | Main nav, shortcuts, user |
| Collapse | Toggle collapsed state |
| Mobile | Overlay on small screens |

**Sidebar Sections:**
- Team selector dropdown
- Navigation links (Issues, Projects, Cycles)
- Quick filters
- User menu at bottom

---

### 10.3 Header

**Behavior:** Top bar with global actions.

| Aspect | Description |
|--------|-------------|
| Content | Search, notifications, user menu |
| Height | Fixed height (48-56px) |
| Position | Sticky at top |

**Header Elements:**
- Command palette trigger (search)
- Notification bell with count
- User avatar and dropdown

---

### 10.4 Responsive Behavior

**Behavior:** Adapt layout to screen size.

| Breakpoint | Sidebar | Layout |
|------------|---------|--------|
| Desktop (>1024px) | Always visible | Side by side |
| Tablet (768-1024px) | Collapsible | Side by side |
| Mobile (<768px) | Overlay | Full width |

**Responsive Rules:**
- Sidebar state persists across breakpoints
- Mobile sidebar is overlay with backdrop
- Content takes full width on mobile

---

### 10.5 Theme

**Behavior:** Support light and dark themes.

| Aspect | Description |
|--------|-------------|
| Themes | Light, Dark, System |
| Storage | Persist preference |
| Switching | Instant theme change |
| System | Respect OS preference |

**Theme Variables:**
```
--bg-primary
--bg-secondary
--text-primary
--text-secondary
--border-color
--accent-color
--error-color
--success-color
```

---
---

# Module Interaction Map

```
┌─────────────────────────────────────────────────────────────────┐
│                        ROUTING MODULE                           │
│  Determines which page to render based on URL                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ renders
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                        LAYOUT MODULE                            │
│  Provides page structure (sidebar, header, content)             │
└──────────────────────────┬──────────────────────────────────────┘
                           │ contains
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                         UI MODULE                               │
│  Renders generic components (buttons, inputs, modals)           │
└───────┬──────────────────┬──────────────────┬───────────────────┘
        │                  │                  │
        │ reads            │ calls            │ listens
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  STATE MODULE │  │   API MODULE  │  │  REALTIME     │
│               │  │               │  │  MODULE       │
│ Provides      │  │ Sends         │  │ Receives      │
│ data to UI    │  │ requests      │  │ live updates  │
└───────────────┘  └───────────────┘  └───────────────┘
        ▲                  │                  │
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │ updates
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                       AUTH MODULE                               │
│  Manages authentication state, used by all modules              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     KEYBOARD MODULE                             │
│  Handles shortcuts, works across all pages (independent)        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       WORK MODULE                               │
│  Owns Issues Store + issue-related UI components                │
│  Uses UI primitives, State Module for data, API for requests    │
└─────────────────────────────────────────────────────────────────┘
```

---
---

# Data Flow Examples

## Example 1: Loading Issues Page

```
1. User navigates to /issues
2. Routing Module: Matches route to IssuesPage
3. Layout Module: Renders sidebar + header + content area
4. IssuesPage:
   a. State Module: Check if issues are cached
   b. If cached → render immediately
   c. If not cached → API Module: GET /issues
   d. API Module: Sends request with auth token
   e. API Module: Receives response
   f. State Module: Cache response
   g. UI Module: Render issue list
5. Realtime Module:
   a. Subscribes to issue events for this team
   b. Updates state when events arrive
   c. UI re-renders with live updates
```

## Example 2: Creating an Issue

```
1. User presses 'C' (Keyboard Module)
2. Keyboard Module: Triggers "create issue" action
3. UI Module: Opens IssueForm modal
4. User fills form (Form Module)
   a. Form Module: Validates fields on blur
   b. Form Module: Shows inline errors
5. User submits form
6. Form Module:
   a. Validates all fields
   b. Shows loading state
   c. Calls API Module: POST /issues
7. API Module:
   a. Sends request
   b. Receives 201 response
8. Form Module:
   a. Shows success toast
   b. Closes modal
9. State Module:
   a. Adds new issue to cache
10. UI Module:
    a. Re-renders issue list with new issue
11. Realtime Module:
    a. Broadcasts issue.created to team
    b. Other users see update in real-time
```

## Example 3: Changing Issue Status

```
1. User selects issue in list
2. Keyboard Module: Listens for 'S' key
3. User presses 'S'
4. Keyboard Module: Cycles to next status
5. State Module:
   a. Optimistically updates issue status
   b. UI re-renders immediately
6. API Module:
   a. Sends PATCH /issues/{id}/status
   b. Waits for response
7. On success:
   a. State Module: Confirms optimistic update
8. On failure:
   a. State Module: Reverts to previous status
   b. UI Module: Shows error toast
9. Realtime Module:
   a. Broadcasts status change to issue watchers
   b. Other users see update
```
