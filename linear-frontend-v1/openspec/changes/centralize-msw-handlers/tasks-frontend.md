# Tasks — Centralize MSW Handlers (Frontend)

## Scaffold

- [x] Create `src/mocks/` directory with `handlers.ts`, `server.ts`, `browser.ts`
- [x] Move `src/__tests__/mocks/handlers.ts` content to `src/mocks/handlers.ts`
- [x] Export `handlers` array from `src/mocks/handlers.ts`
- [x] Create `src/mocks/server.ts` — export `setupServer(...handlers)`
- [x] Create `src/mocks/browser.ts` — export `setupWorker(...handlers)`
- [x] Delete `src/__tests__/mocks/handlers.ts`

## State & Data

- [x] Add `GET /api/v1/issues` handler with cursor-based pagination and status filtering

## Integration

- [x] Update `src/__tests__/loginFlow.test.ts` — import `server` from `src/mocks/server`, remove inline handlers, keep per-test overrides via `server.use()`
- [x] Update `src/__tests__/integration.test.ts` — import `server` from `src/mocks/server`, remove inline handlers, keep per-test overrides via `server.use()`

## Validation

- [x] Run `pnpm test` — verify all existing tests pass with centralized handlers
- [x] Run `pnpm typecheck` — verify no type errors from new module structure
- [x] Verify per-test overrides still work (`server.use()` / `server.resetHandlers()`)

## Review

- [x] Verify no inline handler definitions remain in test files
- [x] Verify `src/browser.ts` can be imported by Playwright/Storybook consumers
- [x] Self-review: confirm all handlers use consistent `API_BASE` constant
