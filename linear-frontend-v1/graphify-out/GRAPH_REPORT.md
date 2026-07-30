# Graph Report - .  (2026-07-30)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 927 nodes · 1456 edges · 102 communities (68 shown, 34 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.67)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4f4985ab`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Real-Time UI Components
- WebSocket Event Pipeline
- API Client & Error Handling
- Shared UI Library
- Keyboard Shortcut System
- Form System
- Event Schema Types
- Label Entity
- Sidebar Navigation
- Issue API & Types
- Store Selectors
- Issue Detail View
- Form Schemas
- Project Creation
- Header Widget
- Session & Auth Store
- Watcher Entity
- ApiClient Core
- Issue Form & Validation
- Mock WSEndpoint (Comment Thread)
- Mock WSEndpoint (Cross-Tab)
- Mock WSEndpoint (Notification Count)
- Mock WSEndpoint (Status Badge)
- Comment Entity
- Issue Store & Filters
- MockWebSocket (Auth Error)
- MockWebSocket (WS Client)
- Keyboard Provider
- Issue List & Cards
- Optimistic Updates Provider
- MockWebSocket (Reconnection)
- Real-Time Toast Notifications
- Mock Service Worker Setup
- App Shell
- WebSocket Provider
- Login Form Hook
- Watcher UI
- Auth API
- Projects API
- Cache Store
- WebSocket Store
- Register Form Hook
- Keyboard Shortcuts API
- Keyboard Shortcut Toast
- Notification Item UI
- Edit Issue Page
- Notifications Store
- Toast Store
- UI Store
- Error Banner UI
- Register Form UI
- Delete Confirm Modal
- Comment Item UI
- Watchers Store
- Create Issue Page
- Modal Store
- Rate Limit Store
- Breadcrumb UI
- Confirm Delete Dialog
- Label Validation
- Team Store
- Login Form UI
- Shortcut Actions
- Keyboard Shortcut Wrapper
- Notifications Hook
- Empty State UI
- Theme Selector
- Comment Thread Page
- Issue Board Page
- Projects Page
- Register Page
- Theme Hook
- Rate Limit Toast
- Vite Env Types
- Router
- Create Project API Test
- Projects Page Test
- Test Setup

## God Nodes (most connected - your core abstractions)
1. `ApiError` - 25 edges
2. `processEvent()` - 20 edges
3. `routeEvent()` - 17 edges
4. `Issue` - 16 edges
5. `setupEventRouter()` - 16 edges
6. `useOptimisticStore` - 15 edges
7. `ApiClient` - 14 edges
8. `Label` - 12 edges
9. `createWSClient()` - 12 edges
10. `clearDedupStore()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `FetchIssuesResponse` --references--> `Issue`  [EXTRACTED]
  entities/issue/api/index.ts → entities/issue/model/types.ts
- `Issue` --references--> `IssueCardProps`  [EXTRACTED]
  entities/issue/model/types.ts → entities/issue/ui/IssueCard.tsx
- `Issue` --references--> `IssueListProps`  [EXTRACTED]
  entities/issue/model/types.ts → entities/issue/ui/IssueList.tsx
- `IssuesState` --references--> `Comment`  [EXTRACTED]
  entities/issue/model/store.ts → entities/issue/model/types.ts
- `IssuesState` --references--> `Issue`  [EXTRACTED]
  entities/issue/model/store.ts → entities/issue/model/types.ts

## Import Cycles
- None detected.

## Communities (102 total, 34 thin omitted)

### Community 0 - "Real-Time UI Components"
Cohesion: 0.06
Nodes (47): CyclesState, useCyclesStore, Cycle, Project, OptimisticUpdate, applyOptimistic(), ApplyOptimisticOptions, checkStaleUpdates() (+39 more)

### Community 1 - "WebSocket Event Pipeline"
Cohesion: 0.07
Nodes (43): WSEvent, WSEventType, createWSClient(), WSClientConfig, cleanupEntityDedupStore(), cleanupSeenEvents(), clearDedupStore(), clearEntityDedupStore() (+35 more)

### Community 2 - "API Client & Error Handling"
Cohesion: 0.09
Nodes (35): ApiClientConfig, RequestInterceptor, RequestMethod, RequestOptions, ResponseInterceptor, dispatchTable, dispatchToHandler(), ErrorHandler (+27 more)

### Community 3 - "Shared UI Library"
Cohesion: 0.06
Nodes (32): Button, ButtonProps, ButtonSize, ButtonVariant, sizeStyles, variantStyles, Card(), CardProps (+24 more)

### Community 4 - "Keyboard Shortcut System"
Cohesion: 0.08
Nodes (22): getCurrentSequence(), handleKeyInSequence(), isInSequence(), resetSequence(), SequenceState, state, Shortcut, ShortcutContext (+14 more)

### Community 5 - "Form System"
Cohesion: 0.08
Nodes (27): useDebounce(), useFormFormik(), UseFormFormikOptions, UseFormFormikReturn, AsyncFormData, asyncValidationSchema, AsyncValidationTestForm(), DoubleSubmitTestForm() (+19 more)

### Community 6 - "Event Schema Types"
Cohesion: 0.09
Nodes (25): CommentEventPayload, CommentEventType, CycleEventPayload, CycleEventType, IssueEventPayload, IssueEventType, isValidEventType(), LabelEventPayload (+17 more)

### Community 7 - "Label Entity"
Cohesion: 0.13
Nodes (12): IssueLabelsState, LabelDefinitionsState, useIssueLabelsStore, useLabelDefinitionsStore, Label, LabelBadge(), LabelBadgeProps, LabelListProps (+4 more)

### Community 8 - "Sidebar Navigation"
Cohesion: 0.14
Nodes (16): useActiveRoute(), HamburgerButton, HamburgerButtonProps, MobileSidebarOverlay(), MobileSidebarOverlayProps, navItems, teams, NavLink (+8 more)

### Community 9 - "Issue API & Types"
Cohesion: 0.13
Nodes (5): FetchIssuesParams, FetchIssuesResponse, CreateIssueData, PaginationCursor, UpdateIssueData

### Community 10 - "Store Selectors"
Cohesion: 0.16
Nodes (14): ActiveFilters, Cycle, ProjectProgress, selectActiveCycle, selectFilteredIssues, selectIssuesByStatus, selectProjectProgress, selectUnreadCount (+6 more)

### Community 11 - "Issue Detail View"
Cohesion: 0.18
Nodes (9): CommentList(), IssueDetailProps, priorityLabels, IssueStatusBadge(), IssueStatusBadgeProps, STATUS_OPTIONS, statusColorMap, SkeletonLoader() (+1 more)

### Community 12 - "Form Schemas"
Cohesion: 0.22
Nodes (8): CreateIssueFormData, createIssueSchema, EditIssueFormData, editIssueSchema, ProfileFormData, profileSchema, ProjectSettingsFormData, projectSettingsSchema

### Community 13 - "Project Creation"
Cohesion: 0.24
Nodes (7): CreateProjectFormSchema, createProjectSchema, mockProject, CreateProjectDialog(), CreateProjectDialogProps, ProjectForm(), ProjectFormProps

### Community 14 - "Header Widget"
Cohesion: 0.23
Nodes (9): Header(), HeaderProps, NotificationBell(), NotificationBellProps, SearchTrigger(), SearchTriggerProps, themeConfig, themeCycle (+1 more)

### Community 15 - "Session & Auth Store"
Cohesion: 0.21
Nodes (10): AuthState, initialAuthState, useAuthStore, AuthError, LoginFormData, LoginResponse, LogoutResponse, RefreshResponse (+2 more)

### Community 16 - "Watcher Entity"
Cohesion: 0.24
Nodes (4): Watcher, WatcherItem(), WatcherItemProps, WatcherListProps

### Community 18 - "Issue Form & Validation"
Cohesion: 0.30
Nodes (8): Issue, issueFormFieldLabels, IssueFormSchema, IssueForm(), IssueFormProps, priorityOptions, statusOptions, IssueFormModalProps

### Community 23 - "Comment Entity"
Cohesion: 0.33
Nodes (8): Comment, CommentCard(), CommentCardProps, formatTimestamp(), initials(), CommentListProps, mockComment, otherComment

### Community 24 - "Issue Store & Filters"
Cohesion: 0.24
Nodes (7): initialFilters, initialIssuesState, IssuesState, useIssuesStore, IssueFilters, IssueFiltersProps, statusOptions

### Community 27 - "Keyboard Provider"
Cohesion: 0.32
Nodes (6): getRouteContext(), isInputElement(), KeyboardContext, KeyboardContextValue, KeyboardProvider(), KeyboardProviderProps

### Community 28 - "Issue List & Cards"
Cohesion: 0.29
Nodes (5): IssueCard(), IssueCardProps, priorityLabels, statusColors, IssueListProps

### Community 29 - "Optimistic Updates Provider"
Cohesion: 0.29
Nodes (4): OptimisticContext, OptimisticContextValue, OptimisticProviderProps, TODO: Implement optimistic update context (Phase 3)

### Community 31 - "Real-Time Toast Notifications"
Cohesion: 0.29
Nodes (4): POSITION_STYLES, Toast, TOAST_STYLES, ToastContainerProps

### Community 32 - "Mock Service Worker Setup"
Cohesion: 0.38
Nodes (4): worker, handlers, mockIssues, server

### Community 33 - "App Shell"
Cohesion: 0.47
Nodes (3): App(), StoreProvider(), StoreProviderProps

### Community 34 - "WebSocket Provider"
Cohesion: 0.33
Nodes (3): WebSocketContext, WebSocketContextValue, WebSocketProviderProps

### Community 35 - "Login Form Hook"
Cohesion: 0.47
Nodes (4): useAuth(), LoginFormData, loginSchema, useLoginForm()

### Community 36 - "Watcher UI"
Cohesion: 0.40
Nodes (3): WatchButton(), WatchButtonProps, WatcherSectionProps

### Community 37 - "Auth API"
Cohesion: 0.33
Nodes (3): RegisterError, RegisterPayload, RegisterResponse

### Community 38 - "Projects API"
Cohesion: 0.33
Nodes (3): CreateProjectPayload, PaginatedResponse, ProjectListParams

### Community 39 - "Cache Store"
Cohesion: 0.33
Nodes (4): CacheEntry, CacheState, DEFAULT_TTLS, useCacheStore

### Community 40 - "WebSocket Store"
Cohesion: 0.33
Nodes (5): ConnectionStatus, initialWebSocketState, Notification, useWebSocketStore, WebSocketState

### Community 41 - "Register Form Hook"
Cohesion: 0.50
Nodes (3): RegisterFormData, registerSchema, useRegisterForm()

### Community 43 - "Keyboard Shortcut Toast"
Cohesion: 0.50
Nodes (3): SHORTCUT_TOAST_MESSAGES, ToastContainer(), ToastContainerProps

### Community 44 - "Notification Item UI"
Cohesion: 0.40
Nodes (3): NotificationItemData, NotificationItemProps, TYPE_ICONS

### Community 45 - "Edit Issue Page"
Cohesion: 0.40
Nodes (3): priorityOptions, projectOptions, statusOptions

### Community 46 - "Notifications Store"
Cohesion: 0.40
Nodes (4): initialNotificationsState, NotificationItem, NotificationsState, useNotificationsStore

### Community 47 - "Toast Store"
Cohesion: 0.40
Nodes (4): Toast, ToastState, ToastVariant, useToastStore

### Community 48 - "UI Store"
Cohesion: 0.40
Nodes (4): KeyboardContext, Theme, UIState, useUIStore

### Community 49 - "Error Banner UI"
Cohesion: 0.40
Nodes (3): ErrorBannerProps, ErrorBannerType, typeStyles

### Community 54 - "Watchers Store"
Cohesion: 0.50
Nodes (3): initialWatchersState, useWatchersStore, WatchersState

### Community 57 - "Modal Store"
Cohesion: 0.50
Nodes (3): ModalStackItem, ModalState, useModalStore

### Community 58 - "Rate Limit Store"
Cohesion: 0.50
Nodes (3): EndpointRateLimit, RateLimitState, useRateLimitStore

## Knowledge Gaps
- **253 isolated node(s):** `StoreProviderProps`, `KeyboardContextValue`, `KeyboardContext`, `KeyboardProviderProps`, `OptimisticContextValue` (+248 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `MockWebSocket` connect `MockWebSocket (Auth Error)` to `WebSocket Event Pipeline`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Why does `MockWebSocket` connect `MockWebSocket (WS Client)` to `WebSocket Event Pipeline`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `StoreProviderProps`, `KeyboardContextValue`, `KeyboardContext` to the rest of the system?**
  _253 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Real-Time UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.056140350877192984 - nodes in this community are weakly interconnected._
- **Should `WebSocket Event Pipeline` be split into smaller, more focused modules?**
  _Cohesion score 0.07433489827856025 - nodes in this community are weakly interconnected._
- **Should `API Client & Error Handling` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Shared UI Library` be split into smaller, more focused modules?**
  _Cohesion score 0.060129509713228495 - nodes in this community are weakly interconnected._