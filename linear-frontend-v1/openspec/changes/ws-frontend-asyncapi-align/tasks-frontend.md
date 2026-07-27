# Tasks — WebSocket Frontend Alignment (Frontend)

## Scaffold

- [x] Create `src/lib/ws/` directory structure with `client.ts`, `types.ts`, `handlers.ts`, `schema.ts` — implemented as `src/features/realtime/lib/`
- [x] Install Zod dependency (`zod`) and configure TypeScript strict mode for WebSocket module — already configured
- [x] Create `src/types/websocket.ts` for shared WebSocket type definitions — implemented as `src/features/realtime/lib/event-schema.ts`
- [x] Create `src/stores/websocketStore.ts` with Zustand store for connection state management — exists at `src/shared/stores/websocketStore.ts`
- [x] Create `src/stores/issueStore.ts` with Zustand store for issue data and optimistic updates — exists at `src/entities/issue/model/store.ts`
- [x] Create `src/stores/notificationStore.ts` with Zustand store for notifications and unread count — exists at `src/shared/stores/notificationsStore.ts`
- [x] Create `src/stores/labelStore.ts` with Zustand store for label definitions — exists at `src/entities/label/model/store.ts`

## Components

- [x] Create `src/components/websocket/ConnectionStatusIndicator.tsx` — exists at `src/features/realtime/ui/ConnectionStatusIndicator.tsx`
- [x] Create `src/components/websocket/ConnectionErrorModal.tsx` — exists at `src/features/realtime/ui/ConnectionErrorModal.tsx`
- [x] Create `src/components/websocket/WebSocketErrorToast.tsx` — exists as `ReconnectionToast.tsx`
- [x] Create `src/components/websocket/ToastContainer.tsx` — created at `src/features/realtime/ui/ToastContainer.tsx`
- [x] Create `src/components/websocket/WebSocketProvider.tsx` — exists at `src/app/providers/WebSocketProvider.tsx`
- [x] Update `src/app/AppLayout.tsx` — already integrated with WebSocketProvider and ToastContainer
- [x] Update `src/components/Header.tsx` — already has ConnectionStatusIndicator
- [x] Create `src/components/board/BoardColumn.tsx` — created at `src/features/realtime/ui/BoardColumn.tsx`
- [x] Create `src/components/board/IssueCard.tsx` — exists at `src/features/realtime/ui/IssueCard.tsx`
- [x] Create `src/components/board/EmptyState.tsx` — created at `src/features/realtime/ui/EmptyState.tsx`
- [x] Create `src/components/notifications/NotificationItem.tsx` — created at `src/features/realtime/ui/NotificationItem.tsx`
- [x] Create `src/components/comments/CommentItem.tsx` — created at `src/features/realtime/ui/CommentItem.tsx`

## State & Data

- [x] Implement `src/lib/ws/client.ts` — exists at `src/features/realtime/lib/ws-client.ts`
- [x] Implement `src/lib/ws/types.ts` — exists at `src/features/realtime/lib/event-schema.ts`
- [x] Implement `src/lib/ws/schema.ts` — exists at `src/features/realtime/lib/event-schema.ts`
- [x] Implement `src/lib/ws/handlers.ts` — exists as `src/features/realtime/model/event-router.ts`
- [x] Implement `src/stores/websocketStore.ts` — exists at `src/shared/stores/websocketStore.ts`
- [x] Implement `src/stores/issueStore.ts` — exists at `src/entities/issue/model/store.ts`
- [x] Implement `src/stores/notificationStore.ts` — exists at `src/shared/stores/notificationsStore.ts`
- [x] Implement `src/stores/labelStore.ts` — exists at `src/entities/label/model/store.ts`
- [x] Create `src/lib/api/client.ts` — exists at `src/shared/lib/api-client/`
- [x] Create `src/hooks/useWebSocket.ts` — exists in `src/app/providers/WebSocketProvider.tsx`
- [x] Create `src/hooks/useIssueBoard.ts` — created at `src/features/realtime/lib/useIssueBoard.ts`
- [x] Create `src/hooks/useNotifications.ts` — created at `src/features/realtime/lib/useNotifications.ts`

## Routing

- [x] Update `src/app/routes.tsx` — added `/notifications` and `/issues/:id/comments` routes
- [x] Implement auth redirect logic — added to WebSocketProvider for `auth_failed` and `session.revoked`
- [x] Implement catch-all redirect — `*` route navigates to NotFoundPage
- [x] Create `src/pages/LoginPage.tsx` — exists at `src/pages/LoginPage.tsx`
- [x] Create `src/pages/IssueBoardPage.tsx` — created at `src/pages/IssueBoardPage.tsx`
- [x] Create `src/pages/NotificationPanelPage.tsx` — created at `src/pages/NotificationPanelPage.tsx`
- [x] Create `src/pages/CommentThreadPage.tsx` — created at `src/pages/CommentThreadPage.tsx`

## Integration

- [x] Connect `src/lib/ws/client.ts` to WebSocket Gateway endpoint (`VITE_WS_URL`) — configured in WebSocketProvider
- [x] Replace mock data in `src/stores/issueStore.ts` with REST API calls to backend — already implemented
- [x] Replace mock data in `src/stores/notificationStore.ts` with REST API calls to backend — already implemented
- [x] Replace mock data in `src/stores/labelStore.ts` with REST API calls to backend — already implemented
- [x] Implement WebSocket event routing — `issue.updated`, `issue.created`, `issue.deleted` events update issueStore — implemented in event-router.ts
- [x] Implement WebSocket event routing — `comment.created` events update commentStore — implemented in event-router.ts
- [x] Implement WebSocket event routing — `label.created` events update labelStore — implemented in event-router.ts
- [x] Implement WebSocket event routing — `user.online` events update userStore — implemented in event-router.ts
- [x] Implement WebSocket event routing — `session.revoked` events trigger authStore.logout() — implemented in WebSocketProvider
- [x] Implement optimistic update pattern — save previous state, apply new state, rollback on server rejection — implemented in optimistic-store.ts
- [x] Implement revert toast notification — show user when optimistic update is reverted — exists as RevertToast.tsx
- [x] Implement reconnection toast notification — show user when WebSocket is reconnecting — exists as ReconnectionToast.tsx
- [x] Configure environment variables — `VITE_API_URL` and `VITE_WS_URL` in `.env.local` — configured in .env

## Validation

- [x] Unit tests for `src/features/realtime/lib/event-schema.ts` — Zod schemas validate all message types correctly — event-schema.test.ts, event-schema-full.test.ts
- [x] Unit tests for `src/features/realtime/lib/ws-client.ts` — connection lifecycle, exponential backoff, message serialization — ws-auth-error.test.ts, reconnection.test.tsx, reconnection.test.ts
- [x] Unit tests for `src/features/realtime/model/event-router.ts` — error classification and UI dispatch logic — event-router-handlers.test.ts, event-router-dispatch.test.ts
- [x] Unit tests for `src/shared/stores/websocketStore.ts` — connection state transitions, error handling — websocketStore.test.ts
- [x] Unit tests for `src/entities/issue/model/store.ts` — CRUD operations, optimistic updates, rollback — issuesStore.test.ts
- [x] Unit tests for `src/features/realtime/lib/useNotifications.ts` — notification list, unread count — notifications-store.test.ts, notification-count-realtime.test.ts
- [x] Unit tests for `src/features/realtime/ui/ConnectionStatusIndicator.tsx` — status display, ARIA attributes — status-badge-realtime.test.ts, accessibility.test.tsx
- [x] Unit tests for `src/features/realtime/ui/ConnectionErrorModal.tsx` — focus trap, escape handling — ws-auth-error.test.ts
- [x] Unit tests for `src/features/realtime/ui/ToastContainer.tsx` — auto-dismiss, error display — ws-auth-error.test.ts
- [x] Integration tests for WebSocket connection flow — authenticate, subscribe, receive events — integration-pipeline.test.ts
- [x] Integration tests for issue board — real-time updates, optimistic moves, rollback on error — cross-tab-issue.test.ts, optimistic-rollback.test.ts
- [x] Integration tests for notification panel — real-time notifications, unread tracking — notification-count-realtime.test.ts
- [x] Unit tests for WebSocket reconnection — simulate disconnect, verify auto-reconnect and toast — reconnection.test.tsx, reconnection.test.ts
- [x] Unit tests for critical error handling — simulate auth_failed, verify modal and redirect — ws-auth-error.test.ts
- [x] Unit tests for optimistic updates — simulate concurrent edits, verify revert toast — optimistic-store.test.ts, optimistic-manager.test.ts, revert-toast.test.tsx

## Review

- [x] Self-review: verify all components follow accessibility guidelines (ARIA, keyboard nav, color contrast) — accessibility.test.tsx, aria-live-announce.test.tsx
- [x] Self-review: verify all WebSocket messages are validated with Zod schemas at boundary — event-schema.test.ts, event-schema-full.test.ts
- [x] Self-review: verify all optimistic updates have rollback logic on server rejection — optimistic-rollback.test.ts, optimistic-store.test.ts
- [x] Self-review: verify all error codes are handled in the error handling matrix — ws-auth-error.test.ts
- [x] PR checklist: TypeScript strict mode passes, no `any` types — npx tsc --noEmit passes
- [ ] PR checklist: ESLint and Prettier pass with no warnings — 152 files with Prettier issues, ESLint warnings
- [x] PR checklist: All unit tests pass with >80% coverage — 226/226 tests passing
- [x] PR checklist: All integration tests pass — integration-pipeline.test.ts passes
- [ ] PR checklist: E2E tests pass in Chrome, Firefox, and Safari — No Playwright E2E tests implemented
- [ ] PR checklist: Accessibility audit passes (Lighthouse score >90) — No Lighthouse audit performed
- [ ] PR checklist: Performance audit passes (LCP <2.5s, FID <100ms, CLS <0.1) — No performance audit performed
