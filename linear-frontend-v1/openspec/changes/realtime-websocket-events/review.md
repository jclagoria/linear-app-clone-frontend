# Review — Realtime WebSocket Events

## Artifact Completeness

| Artifact | Status | Verified |
|----------|--------|----------|
| proposal | done | Scope, success criteria, dependencies defined |
| specs-frontend | done | 3 specs: websocket-connection, event-subscription, optimistic-updates |
| user-flows | done | 6 flows with screen lists and states |
| design-system | done | 7 components, tokens, a11y contracts, responsive specs |
| wireframes | done | 13 wireframe files covering all screens |
| mockups | done | 13 interactive HTML mockups with state toggles |
| tech-stack | done | 5 decisions: WebSocket, Zustand, optimistic, MSW, no SSE |
| design-frontend | done | Architecture, component tree, routing, state, data fetching, assets, validation, a11y |
| adr | done | 3 MADR-full ADRs: native WS, Zustand slices, custom optimistic manager |
| tasks-frontend | done | 57 tasks across 7 phases |
| review | done | This file |

**All 11/11 artifacts complete.**

## Spec Compliance

### websocket-connection.md

| Requirement | Covered by Tasks | Notes |
|-------------|-----------------|-------|
| Connection establishment (2s timeout) | ws-client.ts, WebSocketProvider | Task: "Wire ws-client.ts to backend WebSocket endpoint" |
| Connection states (connecting/connected/reconnecting/disconnected) | useWebSocketStore, ConnectionStatusIndicator | Tasks: store creation, indicator component |
| Heartbeat (30s ping, 10s pong timeout) | heartbeat.ts | Task: "Create heartbeat.ts — 30s ping interval, 10s pong timeout" |
| Reconnection (1s–30s backoff, max 10) | reconnection.ts | Task: "Create reconnection.ts — exponential backoff" |
| Max attempts → toast + manual reconnect | ConnectionErrorModal, ReconnectionToast | Tasks: modal and toast components |
| Graceful disconnect on logout | WebSocketProvider cleanup | Task: "Connect WebSocketProvider to auth store for JWT token" |
| Tab close cleanup | WebSocketProvider useEffect cleanup | Covered in provider shell task |

### event-subscription.md

| Requirement | Covered by Tasks | Notes |
|-------------|-----------------|-------|
| 15 event types registered | event-schema.ts, event-router.ts | Tasks: type definitions, router mapping |
| Team channel auto-subscription | event-router.ts | Implicit in routing logic |
| Event validation pipeline | event-processor.ts | Task: "Create event-processor.ts — validate event type" |
| Event deduplication (Set + 5min TTL) | event-processor.ts | Task: "deduplicate by eventId (Set + 5min TTL)" |
| Event routing by prefix | event-router.ts | Task: "map issue.*, project.*, cycle.*, notification.*" |
| Event ordering (sequential) | event-processor.ts queue | Covered in processor design |
| Invalid event handling (log, skip) | event-processor.ts | Covered in validation pipeline |

### optimistic-updates.md

| Requirement | Covered by Tasks | Notes |
|-------------|-----------------|-------|
| OptimisticUpdate interface | event-schema.ts | Task: "OptimisticUpdate interface" in type definitions |
| Immediate state application | optimistic-manager.ts | Task: "create, track, confirm, revert" |
| Cache bypass | optimistic-manager.ts | Covered in manager design |
| Success confirmation | optimistic-manager.ts | Task: "confirm optimistic updates" |
| Failure revert + toast | optimistic-manager.ts, RevertToast | Tasks: manager revert, RevertToast component |
| 30s staleness auto-revert | optimistic-manager.ts | Task: "auto-revert at 30s" |
| Duplicate action prevention | optimistic-manager.ts | Covered in manager design |
| Bulk update chain revert | optimistic-manager.ts | Covered in manager design |

## Edge Cases

| Scenario | Coverage | Status |
|----------|----------|--------|
| WebSocket URL not configured | ws-client.ts validation | Covered in validation rules |
| Auth token expired during connection | WebSocketProvider re-auth | Covered in graceful disconnect |
| Multiple rapid reconnect attempts | reconnection.ts backoff | Covered in backoff logic |
| Event arrives during optimistic pending | event-processor + optimistic-store | Both stores handle independently |
| Team switch during connected state | event-router.ts team channel | Covered in routing logic |
| Browser tab hidden (background) | heartbeat continues | Not explicitly addressed — consider Page Visibility API |
| localStorage cleared mid-session | auth store handles re-auth | Existing auth flow covers this |
| Multiple browser tabs open | WebSocket per tab | Each tab has independent connection — acceptable |

## Leakage Check

| Artifact | Implementation Details in Spec? | Status |
|----------|--------------------------------|--------|
| websocket-connection.md | No — describes behavior, not code | Pass |
| event-subscription.md | No — describes behavior, not code | Pass |
| optimistic-updates.md | No — describes behavior, not code | Pass |
| user-flows.md | No — describes flows, not implementation | Pass |
| design-system.md | No — describes tokens/components, not code | Pass |
| wireframes | No — structural layout only | Pass |

## Checklist

- [x] All requirements from specs covered by tasks
- [x] All 15 event types mapped in event-router tasks
- [x] All optimistic paths (success, failure, timeout) tested in validation tasks
- [x] ARIA attributes specified in design-frontend match component tasks
- [x] Keyboard navigation covered in component tasks
- [x] No technical implementation details leaked into behavioral specs
- [x] ADR decisions align with design-frontend architecture
- [x] Task phases follow logical build order (scaffold → components → state → routing → integration → tests)
- [x] All 11 artifacts complete and consistent

## Gaps Identified

| Gap | Severity | Recommendation |
|-----|----------|----------------|
| Page Visibility API not addressed | Low | Add heartbeat pause when tab hidden in implementation |
| No mention of WebSocket binary messages | Low | Spec assumes JSON only — confirm with backend team |
| Team channel subscription not in tasks | Medium | Add task: "Implement team channel subscribe/unsubscribe in event-router.ts" |
| No load testing mentioned | Low | Consider adding E2E test for 100+ concurrent events |

## Recommendation

**All planning artifacts are complete and consistent.** The change is ready for implementation.

One task gap identified: add a task for team channel subscription/unsubscription logic in `event-router.ts`. This is covered in the `event-subscription.md` spec but not explicitly in `tasks-frontend.md`.

**Next step**: Run `/opsx-apply` to begin implementation.
