# Tasks — WebSocket Frontend Alignment (Frontend)

## Scaffold

- [ ] Create `src/lib/ws/` directory structure with `client.ts`, `types.ts`, `handlers.ts`, `schema.ts`
- [ ] Install Zod dependency (`zod`) and configure TypeScript strict mode for WebSocket module
- [ ] Create `src/types/websocket.ts` for shared WebSocket type definitions
- [ ] Create `src/stores/websocketStore.ts` with Zustand store for connection state management
- [ ] Create `src/stores/issueStore.ts` with Zustand store for issue data and optimistic updates
- [ ] Create `src/stores/notificationStore.ts` with Zustand store for notifications and unread count
- [ ] Create `src/stores/labelStore.ts` with Zustand store for label definitions

## Components

- [ ] Create `src/components/websocket/ConnectionStatusIndicator.tsx` — displays WebSocket status as colored dot with pulse animation
- [ ] Create `src/components/websocket/ConnectionErrorModal.tsx` — critical error overlay with focus trap and backdrop blur
- [ ] Create `src/components/websocket/WebSocketErrorToast.tsx` — transient error notification with auto-dismiss countdown
- [ ] Create `src/components/websocket/ToastContainer.tsx` — renders active toasts with `aria-live` region
- [ ] Create `src/components/websocket/WebSocketProvider.tsx` — context provider wrapping isolated WebSocket client
- [ ] Update `src/app/AppLayout.tsx` — integrate WebSocketProvider and ToastContainer
- [ ] Update `src/components/Header.tsx` — add ConnectionStatusIndicator to header navigation
- [ ] Create `src/components/board/BoardColumn.tsx` — kanban column with real-time issue updates
- [ ] Create `src/components/board/IssueCard.tsx` — issue card with optimistic move support
- [ ] Create `src/components/board/EmptyState.tsx` — empty state illustration when no issues exist
- [ ] Create `src/components/notifications/NotificationItem.tsx` — notification list item with unread indicator
- [ ] Create `src/components/comments/CommentItem.tsx` — comment list item with real-time additions

## State & Data

- [ ] Implement `src/lib/ws/client.ts` — WebSocket client with connection lifecycle, message serialization, and exponential backoff reconnection
- [ ] Implement `src/lib/ws/types.ts` — discriminated union types for all WebSocket messages (authenticate, subscribe, event, error)
- [ ] Implement `src/lib/ws/schema.ts` — Zod schemas for runtime validation of all incoming/outgoing messages
- [ ] Implement `src/lib/ws/handlers.ts` — centralized error handler with UI dispatch (critical → modal, transient → toast)
- [ ] Implement `src/stores/websocketStore.ts` — connection status, error state, retry count, connect/disconnect actions
- [ ] Implement `src/stores/issueStore.ts` — issue CRUD with optimistic updates and rollback on WS error
- [ ] Implement `src/stores/notificationStore.ts` — notifications list with unread count tracking
- [ ] Implement `src/stores/labelStore.ts` — label definitions with real-time label.created events
- [ ] Create `src/lib/api/client.ts` — REST API client with auth interceptor (Bearer JWT) and error handling
- [ ] Create `src/hooks/useWebSocket.ts` — React hook for accessing WebSocket context and connection status
- [ ] Create `src/hooks/useIssueBoard.ts` — React hook for issue board data with real-time updates
- [ ] Create `src/hooks/useNotifications.ts` — React hook for notifications with unread count

## Routing

- [ ] Update `src/app/routes.tsx` — add `/notifications` route and `/issues/:id/comments` route
- [ ] Implement auth redirect logic — redirect to `/login` on WebSocket `auth_failed` or `session.revoked` errors
- [ ] Implement catch-all redirect — `*` route navigates to `/`
- [ ] Create `src/pages/LoginPage.tsx` — public login page with JWT token input
- [ ] Create `src/pages/IssueBoardPage.tsx` — protected board view with real-time issue updates
- [ ] Create `src/pages/NotificationPanelPage.tsx` — protected notification list with unread indicators
- [ ] Create `src/pages/CommentThreadPage.tsx` — protected comment thread with real-time additions

## Integration

- [ ] Connect `src/lib/ws/client.ts` to WebSocket Gateway endpoint (`VITE_WS_URL`)
- [ ] Replace mock data in `src/stores/issueStore.ts` with REST API calls to backend
- [ ] Replace mock data in `src/stores/notificationStore.ts` with REST API calls to backend
- [ ] Replace mock data in `src/stores/labelStore.ts` with REST API calls to backend
- [ ] Implement WebSocket event routing — `issue.updated`, `issue.created`, `issue.deleted` events update issueStore
- [ ] Implement WebSocket event routing — `comment.created` events update commentStore
- [ ] Implement WebSocket event routing — `label.created` events update labelStore
- [ ] Implement WebSocket event routing — `user.online` events update userStore
- [ ] Implement WebSocket event routing — `session.revoked` events trigger authStore.logout()
- [ ] Implement optimistic update pattern — save previous state, apply new state, rollback on server rejection
- [ ] Implement revert toast notification — show user when optimistic update is reverted
- [ ] Implement reconnection toast notification — show user when WebSocket is reconnecting
- [ ] Configure environment variables — `VITE_API_URL` and `VITE_WS_URL` in `.env.local`

## Validation

- [ ] Unit tests for `src/lib/ws/schema.ts` — Zod schemas validate all message types correctly
- [ ] Unit tests for `src/lib/ws/client.ts` — connection lifecycle, exponential backoff, message serialization
- [ ] Unit tests for `src/lib/ws/handlers.ts` — error classification and UI dispatch logic
- [ ] Unit tests for `src/stores/websocketStore.ts` — connection state transitions, error handling
- [ ] Unit tests for `src/stores/issueStore.ts` — CRUD operations, optimistic updates, rollback
- [ ] Unit tests for `src/stores/notificationStore.ts` — notification list, unread count
- [ ] Unit tests for `src/components/websocket/ConnectionStatusIndicator.tsx` — status display, ARIA attributes
- [ ] Unit tests for `src/components/websocket/ConnectionErrorModal.tsx` — focus trap, escape handling
- [ ] Unit tests for `src/components/websocket/WebSocketErrorToast.tsx` — auto-dismiss, error display
- [ ] Integration tests for WebSocket connection flow — authenticate, subscribe, receive events
- [ ] Integration tests for issue board — real-time updates, optimistic moves, rollback on error
- [ ] Integration tests for notification panel — real-time notifications, unread tracking
- [ ] E2E tests for WebSocket reconnection — simulate disconnect, verify auto-reconnect and toast
- [ ] E2E tests for critical error handling — simulate auth_failed, verify modal and redirect
- [ ] E2E tests for optimistic updates — simulate concurrent edits, verify revert toast

## Review

- [ ] Self-review: verify all components follow accessibility guidelines (ARIA, keyboard nav, color contrast)
- [ ] Self-review: verify all WebSocket messages are validated with Zod schemas at boundary
- [ ] Self-review: verify all optimistic updates have rollback logic on server rejection
- [ ] Self-review: verify all error codes are handled in the error handling matrix
- [ ] PR checklist: TypeScript strict mode passes, no `any` types
- [ ] PR checklist: ESLint and Prettier pass with no warnings
- [ ] PR checklist: All unit tests pass with >80% coverage
- [ ] PR checklist: All integration tests pass
- [ ] PR checklist: E2E tests pass in Chrome, Firefox, and Safari
- [ ] PR checklist: Accessibility audit passes (Lighthouse score >90)
- [ ] PR checklist: Performance audit passes (LCP <2.5s, FID <100ms, CLS <0.1)
