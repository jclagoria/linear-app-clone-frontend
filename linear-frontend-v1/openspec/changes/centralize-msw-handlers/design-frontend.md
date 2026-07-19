# MSW Handlers — Frontend Design

## Architecture Decisions

### Decision 1: Single handlers array in `handlers.ts`

All shared handlers are defined in a single exported array. Each handler is a standalone `http.[method]()` call. This keeps the module flat and importable by both `server.ts` and `browser.ts` via spread.

### Decision 2: Separate runtime files per MSW target

- `server.ts` exports `setupServer(...handlers)` for Node (vitest)
- `browser.ts` exports `setupWorker(...handlers)` for browser (dev, Playwright, Storybook)

This follows MSW's recommended setup pattern and avoids bundling Node-only code into browser builds.

### Decision 3: API base path as a shared constant

A single `API_BASE` constant (`/api/v1`) keeps all handler paths consistent and makes future base-path changes a one-line edit.

### Decision 4: Existing mock data patterns preserved

The centralized handlers reuse the same mock data shapes from the current `src/__tests__/mocks/handlers.ts` — no data model changes. Test files that currently define their own mock data keep local mock data but import handlers from the central module.

## Module Structure

```
src/
  mocks/
    handlers.ts       ← shared handlers array (single source of truth)
    server.ts         ← setupServer(...handlers) export for vitest
    browser.ts        ← setupWorker(...handlers) export for browser
```

### `handlers.ts`

| Responsibility | Exports |
|---------------|---------|
| Define all shared MSW request handlers | `handlers` (array of `HttpHandler`) |

### `server.ts`

| Responsibility | Exports |
|---------------|---------|
| Setup Node runtime for vitest | `server` (SetupServerApi) |

### `browser.ts`

| Responsibility | Exports |
|---------------|---------|
| Setup browser runtime for dev/Playwright/Storybook | `worker` (SetupWorkerApi) |

## Data Fetching

- **Mock runtime mapping**: Request method + URL path → handler match (MSW internals)
- **Override lifecycle**: `server.use()` pushes runtime override handlers onto a stack; `server.resetHandlers()` clears the stack and restores the defaults passed to `setupServer()`
- **Unhandled requests**: Configured with `onUnhandledRequest: 'bypass'` to allow passthrough in tests

## Routing (Mocked API Endpoints)

| Endpoint | Method | Handler Logic |
|----------|--------|---------------|
| `/api/v1/auth/login` | POST | Validates credentials, returns 200/401 |
| `/api/v1/auth/logout` | POST | Validates Authorization header, returns 200/401 |
| `/api/v1/auth/refresh` | POST | Returns new access token |
| `/api/v1/issues` | GET | Returns paginated issue list, supports `?status=` and `?cursor=` query params |

## Asset Map

N/A — infrastructure module with no UI assets.

## Validation Strategy

N/A — handlers follow the API contract in `docs/api/openapi.yaml`. Request validation is the responsibility of consuming tests or application code.

## Accessibility

N/A — test infrastructure layer with no UI surface.
