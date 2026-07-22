# Issue Watchers

## Problem Statement

Users currently have no way to subscribe to issues they care about. Linear's issue detail view lacks a watch/unwatch toggle, so users cannot receive updates on issues they follow. The backend API already defines watcher endpoints (`GET /api/v1/issues/{id}/watchers`, `POST /api/v1/issues/{id}/watchers`, `DELETE /api/v1/issues/{id}/watchers/{userId}`), but the frontend has no integration with them.

## Motivation

This change brings the frontend to parity with Linear's issue watching feature. Users need to:
- See who is watching an issue
- Subscribe themselves to an issue to track its progress
- Unsubscribe from issues they no longer need to follow

Delivering watchers improves collaboration by making issue ownership and awareness explicit — team members can self-subscribe without relying on being explicitly assigned.

## Scope

- **In scope**:
  - Watcher API functions (`listWatchers`, `addWatcher`, `removeWatcher`) in the existing API client layer
  - Watcher type definitions matching the OpenAPI `Watcher` schema (`id`, `issueId`, `userId`, `createdAt`)
  - Watcher state and actions in the issues store (loading watchers, adding/removing watchers, optimistic updates)
  - Watch toggle UI in the issue detail view (subscribe/unsubscribe button with visual state)
  - List of current watchers displayed in the issue detail view
  - Error handling for conflict (already watching → 409) and business rule violations (422)

- **Out of scope**:
  - Watcher notifications / real-time updates via WebSocket
  - Watcher avatar display in issue list cards
  - Email or push notification integration
  - Admin-level watcher management (removing other users)
  - Watcher count badges on issue list items

## Impact

- **Affected areas**: Issue detail page, issue API client module, issues Zustand store, issue type definitions
- **Consumers**: The issue detail view gains a new watch toggle and watcher list section
- **Backend contract**: Consumes the existing watcher endpoints defined in `docs/api/openapi.yaml`; no backend changes needed
