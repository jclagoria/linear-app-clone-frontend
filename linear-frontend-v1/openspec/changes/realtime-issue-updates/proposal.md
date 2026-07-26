# Real-time Issue Updates

## Problem Statement

Currently, the frontend only reflects data changes when the user manually refreshes or navigates. When multiple users collaborate on the same team, issue edits, status changes, assignments, and new comments are invisible until the next page load. This creates a stale UI, forces unnecessary refreshes, and breaks the collaborative experience expected in a project management tool.

## Motivation

Real-time synchronization is essential for team collaboration. Users need to see:
- Issue status changes and reassignments as they happen
- New comments on issues they are viewing
- Project and cycle lifecycle updates (creation, activation, completion)
- Notifications delivered instantly

Without this, the application feels like a single-user tool rather than a collaborative workspace. Implementing real-time updates closes the gap between the backend's WebSocket capabilities (already documented in the API contract) and the frontend's rendering layer.

## Scope

- **In scope**:
  - Processing 13 event types via WebSocket: `issue.created`, `issue.updated`, `issue.statusChanged`, `issue.assigned`, `issue.unassigned`, `issue.deleted`, `comment.created`, `comment.updated`, `project.created`, `project.updated`, `cycle.created`, `cycle.updated`, `cycle.activated`, `cycle.completed`, `notification.created`
  - Event deduplication and ordered processing
  - State mutations in Issues Store, Projects Store, and Cycles Store driven by incoming events
  - Silently ignoring events not relevant to the current view
  - Integration with the existing Realtime Module connection management (Section 7.1)
  - Integration with Optimistic Updates pattern (Section 7.4) for user-initiated actions that also emit events

- **Out of scope**:
  - WebSocket connection management, reconnection logic, or heartbeat (already defined in Realtime Module 7.1)
  - UI component rendering changes beyond state updates
  - Notification UI/toast display (separate feature)
  - Backend event emission or WebSocket server changes
  - Optimistic update rollback logic (already defined in Section 7.4)

## Impact

- **Realtime Module**: The event processing layer (Section 7.3) must route each event type to the correct Store mutation
- **Work Module**: Issues Store and Comments within Issues Store receive real-time mutations
- **State Module**: Issues Store, Projects Store, and Cycles Store will be updated by event handlers in addition to API responses
- **All list/detail views**: Issue lists, issue detail panels, project lists, and cycle views will reflect live changes without manual refresh
- **Teams/consumers**: Any developer working on the Work Module, Project Module, or Cycle Module must understand the event contract and how events map to state changes
