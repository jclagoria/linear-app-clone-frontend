# Review — Centralize MSW Handlers

## Spec Compliance

All requirements from `specs/frontend/msw-handlers.md` are covered by the task list:
- Auth handlers (login, logout, refresh) — scaffold task includes migration of existing handlers
- Issues handlers (GET with filtering and pagination) — dedicated task in State & Data
- Test override lifecycle (`server.use()` / `server.resetHandlers()`) — validation task
- Browser runtime (`setupWorker`) — scaffold includes `browser.ts`
- Both vitest and browser runtimes supported via separate runtime files

## Edge Cases

- **Handler divergence**: Existing inline handlers in `integration.test.ts` have slightly different response shapes than those in `loginFlow.test.ts` and `src/__tests__/mocks/handlers.ts`. The centralized handler must reconcile these differences. The chosen approach uses the `src/__tests__/mocks/handlers.ts` version as the source of truth since it's already a partial centralization attempt.
- **Per-test override isolation**: Tests that use `server.use()` must call `server.resetHandlers()` in `afterEach` to prevent cross-test pollution. Both test files already follow this pattern.
- **Issues handler was only in `integration.test.ts`**: This handler must be added to the centralized module since it has no equivalent in the existing `src/__tests__/mocks/handlers.ts`.

## Leakage Check

No implementation details leaked into specs. All artifacts describe behaviour and structure without referencing specific code internals.

## Checklist

- [x] All requirements covered by tasks
- [x] Auth scenarios: login (valid/invalid), logout (authed/unauth), refresh
- [x] Issues scenarios: list, filter by status, cursor pagination
- [x] Test override scenarios: `server.use()`, `server.resetHandlers()`
- [x] Browser runtime scenario: `setupWorker` intercept
- [ ] Error states handled — handlers return appropriate HTTP status codes
- [x] No technical detail in specs or design leaked into user-facing docs
