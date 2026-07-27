# Review — WebSocket Frontend Alignment

## Spec Compliance

| Requirement | Scenario | Status | Notes |
|-------------|----------|--------|-------|
| AuthenticationMessage | ClientSendsAuthenticateOnConnect | ✅ Covered | Task: Implement `src/lib/ws/client.ts` — connection lifecycle |
| AuthenticationMessage | ServerRespondsWithAuthenticated | ✅ Covered | Task: Implement `src/lib/ws/types.ts` — discriminated union types |
| AuthenticationMessage | ServerRejectsInvalidToken | ✅ Covered | Task: Implement `src/lib/ws/handlers.ts` — error classification |
| AuthenticationMessage | AuthFailedError | ✅ Covered | Task: Implement auth redirect logic — redirect to `/login` |
| AutoSubscription | ServerAutoSubscribesAfterAuth | ✅ Covered | Task: Implement `src/lib/ws/client.ts` — connection lifecycle |
| AutoSubscription | ClientReceivesSubscribedConfirmation | ✅ Covered | Task: Implement `src/lib/ws/types.ts` — discriminated union types |
| ManualSubscription | ClientSubscribesToChannel | ✅ Covered | Task: Implement `src/lib/ws/client.ts` — message serialization |
| ManualSubscription | ClientUnsubscribesFromChannel | ✅ Covered | Task: Implement `src/lib/ws/client.ts` — message serialization |
| ManualSubscription | InvalidChannelSubscription | ✅ Covered | Task: Implement `src/lib/ws/handlers.ts` — error classification |
| EventParsing | ClientReceivesEvent | ✅ Covered | Task: Implement `src/lib/ws/schema.ts` — Zod schemas |
| EventParsing | EventRouting | ✅ Covered | Task: Implement WebSocket event routing — issue.updated events |
| NewEventTypes | LabelEvent | ✅ Covered | Task: Implement WebSocket event routing — label.created events |
| NewEventTypes | SessionRevokedEvent | ✅ Covered | Task: Implement WebSocket event routing — session.revoked events |
| NewEventTypes | UserOnlineEvent | ✅ Covered | Task: Implement WebSocket event routing — user.online events |
| ErrorCodes | RateLimitedError | ✅ Covered | Task: Implement `src/lib/ws/handlers.ts` — error classification |
| ErrorCodes | ForbiddenError | ✅ Covered | Task: Implement `src/lib/ws/handlers.ts` — error classification |
| ErrorCodes | InvalidChannelError | ✅ Covered | Task: Implement `src/lib/ws/handlers.ts` — error classification |
| ConnectionStatusIndicator | ConnectedStatus | ✅ Covered | Task: Create `ConnectionStatusIndicator.tsx` — status display |
| ConnectionStatusIndicator | DisconnectedStatus | ✅ Covered | Task: Create `ConnectionStatusIndicator.tsx` — status display |
| ConnectionStatusIndicator | ReconnectingStatus | ✅ Covered | Task: Create `ConnectionStatusIndicator.tsx` — status display |
| ErrorModalDisplay | AuthFailedModal | ✅ Covered | Task: Create `ConnectionErrorModal.tsx` — focus trap, escape handling |
| ErrorModalDisplay | SessionRevokedModal | ✅ Covered | Task: Create `ConnectionErrorModal.tsx` — focus trap, escape handling |

**Result**: All 22 spec scenarios are covered by implementation tasks.

## Edge Cases

| Edge Case | Status | Task Reference |
|-----------|--------|----------------|
| WebSocket connection drops during authentication | ✅ Covered | Task: Implement exponential backoff reconnection |
| Server sends malformed JSON message | ✅ Covered | Task: Implement Zod schemas for runtime validation |
| Multiple rapid WebSocket reconnections | ✅ Covered | Task: Implement exponential backoff with jitter |
| User navigates away during WebSocket reconnection | ✅ Covered | Task: Implement `src/lib/ws/client.ts` — connection lifecycle |
| Optimistic update conflicts with server state | ✅ Covered | Task: Implement optimistic update pattern with rollback |
| User receives session.revoked while viewing issue board | ✅ Covered | Task: Implement WebSocket event routing — session.revoked events |
| Rate limit exceeded during rapid event processing | ✅ Covered | Task: Implement `src/lib/ws/handlers.ts` — error classification |
| WebSocket message arrives before store is initialized | ✅ Covered | Task: Implement Zustand stores with initial state |
| User closes browser tab during WebSocket connection | ✅ Covered | Task: Implement `src/lib/ws/client.ts` — connection lifecycle |
| Multiple browser tabs open with same user | ✅ Covered | Task: Implement connection state management per tab |

**Result**: All 10 edge cases are covered by implementation tasks.

## Leakage Check

| Spec Section | Implementation Detail | Status | Notes |
|--------------|----------------------|--------|-------|
| Behaviour | WebSocket message format | ✅ No leakage | Specs describe protocol, not implementation |
| Components | React component props | ✅ No leakage | Specs describe UI behavior, not React internals |
| Routing | Route definitions | ✅ No leakage | Specs describe navigation, not React Router config |
| Validation Rules | Zod schema syntax | ✅ No leakage | Specs describe rules, not Zod implementation |
| Accessibility | ARIA attributes | ✅ No leakage | Specs describe behavior, not HTML attributes |

**Result**: No implementation details leaked into specifications.

## Checklist

- [x] All requirements covered — 22/22 spec scenarios mapped to tasks
- [x] Scenarios pass — all scenarios have corresponding implementation tasks
- [x] Error states handled — all error codes (auth_failed, invalid_token, forbidden, rate_limited, invalid_channel, session.revoked) have tasks
- [x] No technical detail in specs — specifications describe behavior, not implementation
- [x] All tasks have clear acceptance criteria — each task specifies file path and behavior
- [x] All edge cases covered — 10 edge cases identified and mapped to tasks
- [x] Accessibility requirements met — ARIA attributes, keyboard nav, color contrast in tasks
- [x] Performance requirements defined — LCP <2.5s, FID <100ms, CLS <0.1 in review tasks

## Gaps Identified

| Gap | Severity | Mitigation |
|-----|----------|------------|
| No explicit task for WebSocket heartbeat monitoring | Low | Heartbeat is part of connection lifecycle in `client.ts` |
| No task for WebSocket message ordering guarantees | Low | WebSocket protocol guarantees ordering; no special handling needed |
| No task for WebSocket compression configuration | Low | Compression is server-side configuration; client uses default |
| No task for WebSocket binary message support | Low | Spec only defines JSON text messages; binary not required |

**Result**: All gaps are minor and do not affect spec compliance.

## Blockers

| Blocker | Status | Resolution |
|---------|--------|------------|
| None identified | ✅ Clear | All tasks are unblocked and ready for implementation |

## Deviations from Design

| Design Decision | Implementation | Status | Notes |
|-----------------|----------------|--------|-------|
| WebSocket isolated module (`src/lib/ws/`) | Tasks create directory structure | ✅ Aligned | Design and tasks match |
| Zustand direct mutation from WS handlers | Tasks implement stores | ✅ Aligned | Design and tasks match |
| Centralized error handling with UI dispatch | Tasks implement handlers | ✅ Aligned | Design and tasks match |
| Zod schema validation at boundary | Tasks implement schemas | ✅ Aligned | Design and tasks match |
| Exponential backoff reconnection | Tasks implement reconnection | ✅ Aligned | Design and tasks match |
| Component communication via Zustand | Tasks implement stores and hooks | ✅ Aligned | Design and tasks match |

**Result**: All design decisions are aligned with implementation tasks.

## Summary

| Metric | Value |
|--------|-------|
| Spec scenarios covered | 22/22 (100%) |
| Edge cases covered | 10/10 (100%) |
| Design decisions aligned | 6/6 (100%) |
| Gaps identified | 4 (all minor) |
| Blockers | 0 |
| Leakage violations | 0 |

**Overall Status**: ✅ Ready for implementation

All specifications are covered by implementation tasks, all design decisions are aligned, and no blocking issues were identified. The change is ready to proceed to implementation phase with `/opsx-apply`.
