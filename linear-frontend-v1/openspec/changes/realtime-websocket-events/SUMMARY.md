# Project Summary — Realtime WebSocket Events

## Goal
- Add a realtime WebSocket event system to the Linear App Clone frontend, supporting live issue, project, and cycle updates with optimistic UI and automatic reconnection.

## Constraints
- Must follow Feature-Sliced Design (existing architecture pattern)
- Existing stack: React 19, Vite 8, Zustand 5, Tailwind 4, React Router 7
- WebSocket connection via native browser API (no socket.io)
- 30s staleness threshold for optimistic updates
- Exponential backoff reconnection: 1s–30s, max 10 attempts
- Heartbeat: 30s ping, 10s pong timeout
- Auth: JWT token sent in first WebSocket message
- 15 event types routed to 4 domain stores

## Architecture Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Real-time transport | Native `WebSocket` API | No protocol overhead; backend owns the server |
| State management | Zustand slices | Existing pattern; no new dependencies |
| Optimistic tracking | Dedicated Zustand slice | Centralized pending state; 30s staleness check |
| Event routing | Prefix matching (`issue.*`) | Simple; maps 15 events to 4 stores |
| Deduplication | Set-based with 5min TTL | Prevents retry-induced duplicates |
| Heartbeat | Custom ping/pong frames | 30s interval, 10s timeout per spec |
| Reconnection | Exponential backoff (1s–30s, 10 max) | Per spec; prevents server spam |
| Auth handshake | JWT in first message | Simple; no custom protocol headers |

## Project Structure
```
openspec/changes/realtime-websocket-events/
├── proposal.md
├── specs/frontend/
│   ├── websocket-connection.md
│   ├── event-subscription.md
│   └── optimistic-updates.md
├── user-flows.md
├── design-system.md
├── specs/wireframes/
│   ├── header-connection-status.wireframes
│   ├── issue-list.wireframes
│   ├── issue-detail.wireframes
│   ├── project-list.wireframes
│   ├── cycle-list.wireframes
│   ├── notification-panel.wireframes
│   ├── reconnection-toast.wireframes
│   ├── connection-error-modal.wireframes
│   ├── revert-toast.wireframes
│   ├── issue-card.wireframes
│   ├── project-card.wireframes
│   └── issue-assignee-selector.wireframes
├── mockups/
│   ├── index.html
│   ├── header.html
│   ├── issue-list.html
│   ├── issue-detail.html
│   ├── project-list.html
│   ├── cycle-list.html
│   ├── notification-panel.html
│   ├── reconnection-toast.html
│   ├── connection-error-modal.html
│   ├── revert-toast.html
│   ├── issue-card.html
│   ├── project-card.html
│   └── issue-assignee-selector.html
├── tech-stack.md
├── docs/
│   ├── stack-frontend.md
│   ├── architecture-frontend.md
│   └── deployment.md
├── design-frontend.md
├── adr.md
├── tasks-frontend.md
├── verifications.md
├── README.md
```

## Files to Create (Remaining)
- tasks-frontend.md (implementation tasks)
- review.md (final review — blocked by tasks-frontend)

## Next Steps
- Run `/opsx-continue` to create tasks-frontend.md
- Then `/opsx-apply` to implement the feature
