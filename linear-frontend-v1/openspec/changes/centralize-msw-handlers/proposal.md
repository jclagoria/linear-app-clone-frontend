# Centralize MSW Handlers

## Problem Statement

MSW request handlers are duplicated across three locations in the codebase:

- `src/__tests__/mocks/handlers.ts` — shared mock handlers using `/api/v1`
- `src/__tests__/loginFlow.test.ts` — inline handlers duplicating auth endpoints
- `src/__tests__/integration.test.ts` — inline handlers duplicating auth + issues endpoints

This causes duplication (adding a new endpoint requires updating handlers in multiple files), divergence (handler logic differs across test files), and prevents reuse in Playwright or Storybook.

## Motivation

Centralizing handlers creates a single source of truth for API mocks, reduces maintenance burden, enables per-test overrides via `server.use()`, and unlocks reuse across all MSW runtimes: vitest (Node), Playwright (browser), Storybook stories, and dev-mode app without a real backend.

## Scope

- **In scope**: Shared handlers for auth (login, refresh, logout) and issues (GET with filtering). A `server.ts` exporting `setupServer(...defaultHandlers)` for vitest. A `browser.ts` exporting `setupWorker` for browser usage (dev mode, Playwright, Storybook). Migration of all test files to import from the central module. Removal of inline handler definitions.
- **Out of scope**: Handlers for other domains not yet tested. Storybook integration setup. Playwright integration setup beyond making `browser.ts` available.

## Impact

- `src/__tests__/loginFlow.test.ts` — remove inline handlers, import from `src/mocks/server.ts`, keep per-test overrides via `server.use()`
- `src/__tests__/integration.test.ts` — same migration pattern
- `src/__tests__/mocks/handlers.ts` — becomes the source of truth, moved to `src/mocks/handlers.ts`
- `src/mocks/` — new directory with `handlers.ts`, `server.ts`, `browser.ts`
- **vitest (Node)**: imports `src/mocks/server.ts`
- **Dev mode / Storybook / Playwright (browser)**: imports `src/mocks/browser.ts`
