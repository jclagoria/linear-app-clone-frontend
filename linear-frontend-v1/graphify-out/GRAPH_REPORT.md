# Graph Report - /home/jlagoria/mnt/second/dev/proyects/personal-site/linear-app-clone-frontend/linear-frontend-v1/src  (2026-07-29)

## Corpus Check
- 260 files · ~58,167 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 926 nodes · 1451 edges · 102 communities (68 shown, 34 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Realtime Test Suite
- Comment Thread Tests
- API Client Core
- Button Component
- Keyboard Shortcut Matching
- Form Validation Tests
- Event Schema System
- Label API
- Sidebar Navigation
- Issue API
- Store Selectors
- Issue Detail Component
- Issue Form Schemas
- App Header
- Auth Session Store
- Watcher Feature API
- Create Project Feature
- API Client Methods
- Issue Form Component
- WebSocket Mock Server
- WebSocket Mock Server
- WebSocket Mock Server
- WebSocket Mock Server
- Comment Component
- Issue Store
- Mock WebSocket
- Mock WebSocket
- Keyboard Provider
- Issue Card Component
- Optimistic Update Provider
- Mock WebSocket
- Realtime Toast
- MSW Browser Handlers
- App Shell
- WebSocket Provider
- Auth & Login Hooks
- Watch Button
- Auth API
- Projects API
- Cache Store
- WebSocket Store
- Register Form
- Shortcuts API
- Keyboard Toast
- Notification Item
- Edit Issue Page
- Notifications Store
- Toast Store
- UI Store
- Error Banner
- Register Form Component
- Delete Confirm Modal
- Comment Item
- Watchers Store
- Create Issue Page
- Modal Store
- Rate Limit Store
- Breadcrumb Component
- Confirm Delete Dialog
- Label Validation
- Team Store
- Login Form
- Shortcut Actions
- Keyboard Wrapper
- Notifications Hook
- Empty State Component
- Theme Selector
- Comment Thread Page
- Issue Board Page
- Projects Page
- Register Page
- Theme Hook
- Rate Limit Toast
- Env Type Definitions
- Router Configuration
- Create Project API Test
- Projects Page Test
- Test Setup Utilities

## God Nodes (most connected - your core abstractions)
1. `ApiError` - 24 edges
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
- `IssueCardProps` --references--> `Issue`  [EXTRACTED]
  entities/issue/ui/IssueCard.tsx → entities/issue/model/types.ts
- `IssueListProps` --references--> `Issue`  [EXTRACTED]
  entities/issue/ui/IssueList.tsx → entities/issue/model/types.ts
- `IssuesState` --references--> `Comment`  [EXTRACTED]
  entities/issue/model/store.ts → entities/issue/model/types.ts
- `IssuesState` --references--> `Issue`  [EXTRACTED]
  entities/issue/model/store.ts → entities/issue/model/types.ts

## Import Cycles
- None detected.

## Communities (102 total, 34 thin omitted)

### Community 0 - "Realtime Test Suite"
Cohesion: 0.06
Nodes (46): CyclesState, useCyclesStore, Cycle, Project, OptimisticUpdate, applyOptimistic(), ApplyOptimisticOptions, checkStaleUpdates() (+38 more)

### Community 1 - "Comment Thread Tests"
Cohesion: 0.07
Nodes (44): WSEvent, WSEventType, useProjectsStore, createWSClient(), WSClientConfig, cleanupEntityDedupStore(), cleanupSeenEvents(), clearDedupStore() (+36 more)

### Community 2 - "API Client Core"
Cohesion: 0.09
Nodes (35): ApiClientConfig, RequestInterceptor, RequestMethod, RequestOptions, ResponseInterceptor, dispatchTable, dispatchToHandler(), ErrorHandler (+27 more)

### Community 3 - "Button Component"
Cohesion: 0.06
Nodes (32): Button, ButtonProps, ButtonSize, ButtonVariant, sizeStyles, variantStyles, Card(), CardProps (+24 more)

### Community 4 - "Keyboard Shortcut Matching"
Cohesion: 0.08
Nodes (22): getCurrentSequence(), handleKeyInSequence(), isInSequence(), resetSequence(), SequenceState, state, Shortcut, ShortcutContext (+14 more)

### Community 5 - "Form Validation Tests"
Cohesion: 0.08
Nodes (27): useDebounce(), useFormFormik(), UseFormFormikOptions, UseFormFormikReturn, AsyncFormData, asyncValidationSchema, AsyncValidationTestForm(), DoubleSubmitTestForm() (+19 more)

### Community 6 - "Event Schema System"
Cohesion: 0.09
Nodes (25): CommentEventPayload, CommentEventType, CycleEventPayload, CycleEventType, IssueEventPayload, IssueEventType, isValidEventType(), LabelEventPayload (+17 more)

### Community 7 - "Label API"
Cohesion: 0.13
Nodes (12): IssueLabelsState, LabelDefinitionsState, useIssueLabelsStore, useLabelDefinitionsStore, Label, LabelBadge(), LabelBadgeProps, LabelListProps (+4 more)

### Community 8 - "Sidebar Navigation"
Cohesion: 0.14
Nodes (16): useActiveRoute(), HamburgerButton, HamburgerButtonProps, MobileSidebarOverlay(), MobileSidebarOverlayProps, navItems, teams, NavLink (+8 more)

### Community 9 - "Issue API"
Cohesion: 0.13
Nodes (5): FetchIssuesParams, FetchIssuesResponse, CreateIssueData, PaginationCursor, UpdateIssueData

### Community 10 - "Store Selectors"
Cohesion: 0.16
Nodes (14): ActiveFilters, Cycle, ProjectProgress, selectActiveCycle, selectFilteredIssues, selectIssuesByStatus, selectProjectProgress, selectUnreadCount (+6 more)

### Community 11 - "Issue Detail Component"
Cohesion: 0.18
Nodes (9): CommentList(), IssueDetailProps, priorityLabels, IssueStatusBadge(), IssueStatusBadgeProps, STATUS_OPTIONS, statusColorMap, SkeletonLoader() (+1 more)

### Community 12 - "Issue Form Schemas"
Cohesion: 0.22
Nodes (8): CreateIssueFormData, createIssueSchema, EditIssueFormData, editIssueSchema, ProfileFormData, profileSchema, ProjectSettingsFormData, projectSettingsSchema

### Community 13 - "App Header"
Cohesion: 0.23
Nodes (9): Header(), HeaderProps, NotificationBell(), NotificationBellProps, SearchTrigger(), SearchTriggerProps, themeConfig, themeCycle (+1 more)

### Community 14 - "Auth Session Store"
Cohesion: 0.21
Nodes (10): AuthState, initialAuthState, useAuthStore, AuthError, LoginFormData, LoginResponse, LogoutResponse, RefreshResponse (+2 more)

### Community 15 - "Watcher Feature API"
Cohesion: 0.24
Nodes (4): Watcher, WatcherItem(), WatcherItemProps, WatcherListProps

### Community 16 - "Create Project Feature"
Cohesion: 0.26
Nodes (7): CreateProjectFormSchema, createProjectSchema, mockProject, CreateProjectDialog(), CreateProjectDialogProps, ProjectForm(), ProjectFormProps

### Community 18 - "Issue Form Component"
Cohesion: 0.30
Nodes (8): Issue, issueFormFieldLabels, IssueFormSchema, IssueForm(), IssueFormProps, priorityOptions, statusOptions, IssueFormModalProps

### Community 23 - "Comment Component"
Cohesion: 0.33
Nodes (8): Comment, CommentCard(), CommentCardProps, formatTimestamp(), initials(), CommentListProps, mockComment, otherComment

### Community 24 - "Issue Store"
Cohesion: 0.24
Nodes (7): initialFilters, initialIssuesState, IssuesState, useIssuesStore, IssueFilters, IssueFiltersProps, statusOptions

### Community 27 - "Keyboard Provider"
Cohesion: 0.32
Nodes (6): getRouteContext(), isInputElement(), KeyboardContext, KeyboardContextValue, KeyboardProvider(), KeyboardProviderProps

### Community 28 - "Issue Card Component"
Cohesion: 0.29
Nodes (5): IssueCard(), IssueCardProps, priorityLabels, statusColors, IssueListProps

### Community 29 - "Optimistic Update Provider"
Cohesion: 0.29
Nodes (4): OptimisticContext, OptimisticContextValue, OptimisticProviderProps, TODO: Implement optimistic update context (Phase 3)

### Community 31 - "Realtime Toast"
Cohesion: 0.29
Nodes (4): POSITION_STYLES, Toast, TOAST_STYLES, ToastContainerProps

### Community 32 - "MSW Browser Handlers"
Cohesion: 0.38
Nodes (4): worker, handlers, mockIssues, server

### Community 33 - "App Shell"
Cohesion: 0.47
Nodes (3): App(), StoreProvider(), StoreProviderProps

### Community 34 - "WebSocket Provider"
Cohesion: 0.33
Nodes (3): WebSocketContext, WebSocketContextValue, WebSocketProviderProps

### Community 35 - "Auth & Login Hooks"
Cohesion: 0.47
Nodes (4): useAuth(), LoginFormData, loginSchema, useLoginForm()

### Community 36 - "Watch Button"
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

### Community 41 - "Register Form"
Cohesion: 0.50
Nodes (3): RegisterFormData, registerSchema, useRegisterForm()

### Community 43 - "Keyboard Toast"
Cohesion: 0.50
Nodes (3): SHORTCUT_TOAST_MESSAGES, ToastContainer(), ToastContainerProps

### Community 44 - "Notification Item"
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

### Community 49 - "Error Banner"
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

- **Why does `MockWebSocket` connect `Mock WebSocket` to `Comment Thread Tests`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Why does `MockWebSocket` connect `Mock WebSocket` to `Comment Thread Tests`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `StoreProviderProps`, `KeyboardContextValue`, `KeyboardContext` to the rest of the system?**
  _253 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Realtime Test Suite` be split into smaller, more focused modules?**
  _Cohesion score 0.05701592002961866 - nodes in this community are weakly interconnected._
- **Should `Comment Thread Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.07219548315438726 - nodes in this community are weakly interconnected._
- **Should `API Client Core` be split into smaller, more focused modules?**
  _Cohesion score 0.08951048951048951 - nodes in this community are weakly interconnected._
- **Should `Button Component` be split into smaller, more focused modules?**
  _Cohesion score 0.060129509713228495 - nodes in this community are weakly interconnected._