# MSW Handlers — Frontend Specification

## Behaviour

**Feature:** Centralized MSW Request Handlers

The mock infrastructure SHALL provide a single source of truth for API request handlers shared across all MSW runtimes (Node for vitest, browser for dev/Playwright/Storybook). Consumers MUST import from the central module and SHOULD use `server.use()` for per-test overrides instead of defining handlers inline.

### Requirement: AuthHandlers

#### Scenario: Login with valid credentials returns access token

- **GIVEN** the mock server is listening
- **WHEN** a POST request is sent to `/api/v1/auth/login` with `email: "valid@example.com"` and `password: "password123"`
- **THEN** the response SHALL have status 200
- **AND** the response body SHALL contain `data.accessToken` and `data.user`

#### Scenario: Login with invalid credentials returns 401

- **GIVEN** the mock server is listening
- **WHEN** a POST request is sent to `/api/v1/auth/login` with wrong credentials
- **THEN** the response SHALL have status 401
- **AND** the response body SHALL contain an error message

#### Scenario: Logout returns success

- **GIVEN** the mock server is listening
- **WHEN** a POST request is sent to `/api/v1/auth/logout` with a valid `Authorization` header
- **THEN** the response SHALL have status 200 with `data.success: true`

#### Scenario: Logout without token returns 401

- **GIVEN** the mock server is listening
- **WHEN** a POST request is sent to `/api/v1/auth/logout` without an `Authorization` header
- **THEN** the response SHALL have status 401

#### Scenario: Token refresh returns new access token

- **GIVEN** the mock server is listening
- **WHEN** a POST request is sent to `/api/v1/auth/refresh`
- **THEN** the response SHALL have status 200 with `data.accessToken` set to a non-empty value

### Requirement: IssuesHandlers

#### Scenario: GET issues returns paginated list

- **GIVEN** the mock server is listening
- **WHEN** a GET request is sent to `/api/v1/issues`
- **THEN** the response SHALL have status 200
- **AND** the response body SHALL contain `data` (array of issues) and `meta` (with `cursor` and `hasMore`)

#### Scenario: GET issues filters by status

- **GIVEN** the mock server is listening
- **WHEN** a GET request is sent to `/api/v1/issues?status=todo`
- **THEN** the response SHALL only include issues whose status matches the filter

#### Scenario: GET issues handles cursor-based pagination

- **GIVEN** the mock server is listening
- **WHEN** a GET request is sent to `/api/v1/issues?cursor=page2`
- **THEN** the response SHALL return the next page of results

### Requirement: TestOverride

#### Scenario: Per-test override replaces a handler

- **GIVEN** the vitest server is set up with default handlers
- **WHEN** a test calls `server.use(overrideHandler)` for a specific endpoint
- **THEN** requests to that endpoint SHALL use the override instead of the default handler

#### Scenario: resetHandlers restores defaults after override

- **GIVEN** a test has called `server.use(overrideHandler)`
- **WHEN** the test calls `server.resetHandlers()`
- **THEN** subsequent requests SHALL use the original default handlers

### Requirement: BrowserRuntime

#### Scenario: Browser worker serves handlers in dev mode

- **GIVEN** the app runs in the browser and `setupWorker` has been called
- **WHEN** a fetch request matches a handler path
- **THEN** the request SHALL be intercepted and the mock response returned

## User Flow

1. Developer adds or modifies a handler in `src/mocks/handlers.ts`
2. The change is automatically available to all consumers:
   - **vitest tests**: import `src/mocks/server` → `setupServer(...handlers)`
   - **Playwright tests**: import `src/mocks/browser` → `setupWorker(...handlers)`
   - **Dev mode / Storybook**: same browser import
3. For test-specific behavior, call `server.use(customHandler)` in the test body
4. Call `server.resetHandlers()` to restore defaults after a test

## Components

### `handlers.ts`

- **Purpose**: Single source of truth for all MSW request handlers
- **Exports**: `handlers` (array of `HttpHandler`)
- **States**: N/A — static module
- **Events**: N/A

### `server.ts`

- **Purpose**: Node runtime setup for vitest (msw/node)
- **Exports**: `server` (SetupServer API) — exposes `listen`, `close`, `use`, `resetHandlers`
- **States**: listening / closed
- **Events**: N/A

### `browser.ts`

- **Purpose**: Browser runtime setup for dev mode, Playwright, Storybook (msw/browser)
- **Exports**: `worker` (SetupWorker API) — exposes `start`, `stop`, `use`, `resetHandlers`
- **States**: started / stopped
- **Events**: N/A

## Routing

| Endpoint | Method | Handler | Purpose |
|----------|--------|---------|---------|
| `/api/v1/auth/login` | POST | `handlers.ts` | Authenticate user |
| `/api/v1/auth/logout` | POST | `handlers.ts` | Invalidate session |
| `/api/v1/auth/refresh` | POST | `handlers.ts` | Refresh access token |
| `/api/v1/issues` | GET | `handlers.ts` | List issues (with filtering) |

## Validation Rules

N/A — handlers follow the API contract defined in `docs/api/openapi.yaml`. Request validation is the responsibility of the consuming test or application logic.

## Accessibility

N/A — this is a test infrastructure layer with no UI surface.
