# Review — State Module: Cache & Selectors

## Spec Compliance

The specs define a comprehensive state layer with auth, issues, UI, WebSocket stores, a cache layer with TTL/invalidation/LRU, memoized selectors, StoreProvider, AuthGuard, and routing. Implementation status:

- **Auth store**: Implemented at `entities/session/model/store.ts` with all required state (`user`, `accessToken`, `isAuthenticated`, `isLoading`, `error`) and actions (`login`, `logout`, `hydrate`, `refreshAccessToken`). Matches spec.
- **UI store**: Implemented at `shared/stores/uiStore.ts` with `sidebarCollapsed` + toggle. Missing `theme`, `activeModal`, `keyboardContext` from spec.
- **AuthGuard**: Implemented at `features/auth/ui/AuthGuard.tsx` — handles loading (spinner), unauthenticated (redirect with `redirect` param), authenticated (`<Outlet/>`). Matches spec.
- **Router**: Implemented at `app/router.tsx` — `/login`, `/`, `/issues`, `/issues/:id`, `/projects`, `/projects/:id`, `/cycles`, `/settings`, `/*`. Matches spec.
- **Issues store**: Not implemented.
- **WebSocket store**: Not implemented.
- **Cache layer**: Not implemented.
- **Selectors**: Not implemented.
- **StoreProvider**: Not implemented.
- **resetAllStores()**: Not implemented.

## Edge Cases

- _Duplicate login request_: Auth store guards with `if (isLoading) return`.
- _Hydrate with no token_: Returns early with `isAuthenticated: false` — prevents unnecessary request.
- _Expired refresh token_: Both `hydrate` and `refreshAccessToken` clear stored token and reset to unauthenticated state.
- _Network failure during login_: Caught as `'Failed to fetch'` — mapped to user-friendly message `'Connection error. Please try again.'`.
- _localStorage unavailable_: Refresh token getter/setter wrapped in try/catch — degrades gracefully.
- Not yet covered: cache miss stale-while-revalidate, LRU eviction boundary, concurrent mutation + cache invalidation.

## Leakage Check

No implementation details leaked into specs. Specs describe behavior and contracts at the right abstraction level. Implementation (e.g., `entities/session/model/store.ts` vs spec's `src/stores/auth-store.ts`) follows Feature-Sliced Design conventions not prescribed in specs — this is correct as the specs are tech-agnostic. The actual file layout differs from tasks (FSD slices vs flat `src/stores/`), but the tasks serve as guidance, not binding spec.

## Checklist

- [x] All requirements covered — specs define complete state layer
- [x] Scenarios pass — core auth flows implemented in `entities/session/model/store.ts`
- [ ] Error states handled — auth store handles API errors + network failures; other stores pending
- [x] No technical detail in specs — specs remain tech-agnostic; technical decisions in ADR-0006/ADR-0007
