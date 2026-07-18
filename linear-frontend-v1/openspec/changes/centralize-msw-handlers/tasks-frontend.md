# Tasks — Centralize MSW Handlers (Frontend)

## Scaffold

- [ ] Create `src/mocks/` directory with `handlers.ts`, `server.ts`, `browser.ts`
- [ ] Move `src/__tests__/mocks/handlers.ts` content to `src/mocks/handlers.ts`
- [ ] Export `handlers` array from `src/mocks/handlers.ts`
- [ ] Create `src/mocks/server.ts` — export `setupServer(...handlers)`
- [ ] Create `src/mocks/browser.ts` — export `setupWorker(...handlers)`
- [ ] Delete `src/__tests__/mocks/handlers.ts`

## State & Data

- [ ] Add `GET /api/v1/issues` handler with cursor-based pagination and status filtering

## Integration

- [ ] Update `src/__tests__/loginFlow.test.ts` — import `server` from `src/mocks/server`, remove inline handlers, keep per-test overrides via `server.use()`
- [ ] Update `src/__tests__/integration.test.ts` — import `server` from `src/mocks/server`, remove inline handlers, keep per-test overrides via `server.use()`

## Validation

- [ ] Run `pnpm test` — verify all existing tests pass with centralized handlers
- [ ] Run `pnpm typecheck` — verify no type errors from new module structure
- [ ] Verify per-test overrides still work (`server.use()` / `server.resetHandlers()`)

## Review

- [ ] Verify no inline handler definitions remain in test files
- [ ] Verify `src/browser.ts` can be imported by Playwright/Storybook consumers
- [ ] Self-review: confirm all handlers use consistent `API_BASE` constant
