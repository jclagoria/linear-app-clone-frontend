# API Client — Frontend Specification

## Behaviour

**Feature:** ApiClient — Centralized HTTP Client

The ApiClient SHALL be the single entry point for all HTTP communication with the backend. It MUST inject the Bearer token from AuthStore on every request, MUST parse error responses into a typed error taxonomy, and MUST expose an interceptor pipeline for cross-cutting concerns.

### Requirement: AuthTokenInjection

#### Scenario: Request includes Bearer token when authenticated

- **GIVEN** the user is authenticated and AuthStore holds a valid `accessToken`
- **WHEN** any API request is sent through ApiClient
- **THEN** the request MUST include an `Authorization: Bearer <accessToken>` header

#### Scenario: Request omits Authorization header when not authenticated

- **GIVEN** the user is not authenticated and AuthStore has no `accessToken`
- **WHEN** a public API request is sent through ApiClient
- **THEN** the request MUST NOT include an `Authorization` header

### Requirement: TokenRefreshOn401

#### Scenario: Auto-refresh tokens and retry on 401

- **GIVEN** the user is authenticated and the access token is expired
- **WHEN** any API request returns a 401 response
- **THEN** ApiClient MUST call `POST /auth/refresh` to obtain a new access token
- **AND** the original request MUST be retried with the new token
- **AND** the caller receives the successful response transparently

#### Scenario: Multiple concurrent 401s trigger single refresh

- **GIVEN** three requests are in-flight and all receive 401
- **WHEN** the first 401 triggers a token refresh
- **THEN** the subsequent two requests MUST queue and reuse the same refresh result
- **AND** only one refresh request SHALL be in-flight at any time

#### Scenario: Redirect to login on failed refresh

- **GIVEN** the user is authenticated and the refresh token is expired
- **WHEN** ApiClient attempts to refresh the access token and receives a 401
- **THEN** the user MUST be logged out
- **AND** redirected to the login page
- **AND** all queued requests SHALL fail with Unauthorized error

### Requirement: ErrorTaxonomy

#### Scenario: 400 maps to ValidationError

- **GIVEN** ApiClient receives a 400 response with body `{ "error": { "code": "VALIDATION_ERROR", "message": "Invalid input", "details": [{ "field": "title", "message": "Title is required" }] } }`
- **WHEN** the response is processed by ApiClient
- **THEN** a `ValidationError` MUST be thrown with `code`, `message`, and `details` properties

#### Scenario: 401 maps to Unauthorized

- **GIVEN** ApiClient receives a 401 response with body `{ "error": { "code": "UNAUTHORIZED", "message": "Invalid or expired token" } }`
- **WHEN** the response is processed by ApiClient
- **THEN** an `UnauthorizedError` MUST be thrown
- **AND** the token refresh flow SHALL be initiated before the error reaches the caller

#### Scenario: 403 maps to Forbidden

- **GIVEN** ApiClient receives a 403 response
- **WHEN** the response is processed by ApiClient
- **THEN** a `ForbiddenError` MUST be thrown

#### Scenario: 404 maps to NotFound

- **GIVEN** ApiClient receives a 404 response
- **WHEN** the response is processed by ApiClient
- **THEN** a `NotFoundError` MUST be thrown

#### Scenario: 409 maps to Conflict

- **GIVEN** ApiClient receives a 409 response
- **WHEN** the response is processed by ApiClient
- **THEN** a `ConflictError` MUST be thrown with the server message

#### Scenario: 422 maps to BusinessRule

- **GIVEN** ApiClient receives a 422 response
- **WHEN** the response is processed by ApiClient
- **THEN** a `BusinessRuleError` MUST be thrown with the server message

#### Scenario: 429 maps to RateLimit

- **GIVEN** ApiClient receives a 429 response
- **WHEN** the response is processed by ApiClient
- **THEN** a `RateLimitError` MUST be thrown
- **AND** the rate limit state SHALL be updated with `Retry-After` header value

#### Scenario: 500 maps to Internal

- **GIVEN** ApiClient receives a 5xx response
- **WHEN** the response is processed by ApiClient
- **THEN** an `InternalError` MUST be thrown

### Requirement: ErrorHandlerInterface

#### Scenario: ErrorHandler receives typed callbacks

- **GIVEN** a consumer registers an `ErrorHandler` with typed callbacks
- **WHEN** a `NotFoundError` is thrown by ApiClient
- **THEN** the `onNotFound` callback MUST be invoked
- **AND** no other callback SHALL be invoked

#### Scenario: Unknown errors trigger fallback

- **GIVEN** a consumer registers an `ErrorHandler` with an `onUnknown` callback
- **WHEN** an unrecognized error type is thrown
- **THEN** the `onUnknown` callback MUST be invoked with the error

### Requirement: RateLimitTracking

#### Scenario: Parse rate limit headers from every response

- **GIVEN** ApiClient receives any API response
- **WHEN** the response includes `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers
- **THEN** the rate limit state for that endpoint MUST be updated with the parsed values

#### Scenario: Track rate limit state per endpoint

- **GIVEN** requests are made to `/api/v1/issues` and `/api/v1/projects`
- **WHEN** rate limit headers are returned in responses
- **THEN** each endpoint SHALL maintain its own independent rate limit state

#### Scenario: Show toast on 429

- **GIVEN** the user receives a 429 response for an endpoint
- **WHEN** a `RateLimitError` is thrown
- **THEN** a toast notification MUST be displayed with the message "Rate limit reached. Please wait and try again."
- **AND** the toast SHALL include the retry duration from `Retry-After` header

### Requirement: InterceptorPipeline

#### Scenario: Interceptors run in registered order

- **GIVEN** an AuthInterceptor and a LoadingInterceptor are registered on ApiClient
- **WHEN** a request is sent
- **THEN** the AuthInterceptor MUST run before the LoadingInterceptor

#### Scenario: Interceptor can modify request

- **GIVEN** an interceptor that adds a `X-Request-Id` header is registered
- **WHEN** a request is sent through ApiClient
- **THEN** the request MUST include the `X-Request-Id` header added by the interceptor

## User Flow

### Token Refresh Flow

1. User performs an action that triggers an API call (e.g., loading issues)
2. ApiClient reads `accessToken` from AuthStore
3. ApiClient attaches `Authorization: Bearer <token>` header
4. Request is sent to backend
5. Backend returns 401 (token expired)
6. ApiClient interceptor catches 401
7. ApiClient calls `POST /auth/refresh` to get new tokens
8. Original request is retried with new access token
9. Caller receives the successful response

### Error Handling Flow

1. ApiClient receives a response with HTTP 4xx/5xx status
2. ApiClient parses the response body for `error.code` and `error.message`
3. ApiClient maps the error code to the corresponding typed error class
4. The typed error is propagated to the caller
5. The caller's registered `ErrorHandler` invokes the matching typed callback

### Rate Limit Flow

1. ApiClient receives a response from any endpoint
2. ApiClient parses `X-RateLimit-*` response headers
3. ApiClient updates in-memory rate limit state per endpoint
4. If response is 429, ApiClient:
   a. Parses `Retry-After` header
   b. Throws a `RateLimitError`
   c. Triggers a toast notification with retry duration
   d. Disables actions for that endpoint until window resets

## Components

### ApiClient

- **Purpose**: Central HTTP client for all backend communication
- **Methods**: `get<T>(url, options?)`, `post<T>(url, body?, options?)`, `patch<T>(url, body?, options?)`, `delete<T>(url, options?)`
- **States**: idle, loading, error
- **Events**: `onRequest`, `onResponse`, `onError`
- **Interceptors**: AuthInterceptor, ErrorInterceptor, LoadingInterceptor, RateLimitInterceptor

### ApiError (base)

- **Purpose**: Base class for typed error taxonomy
- **Properties**: `code: string`, `message: string`, `status: number`, `details?: FieldError[]`

### ErrorHandler

- **Purpose**: Interface for typed error callbacks
- **Callbacks**: `onNetworkError`, `onUnauthorized`, `onForbidden`, `onValidationError`, `onNotFound`, `onConflict`, `onBusinessRuleError`, `onRateLimited`, `onServerError`, `onUnknown`

### RateLimitStore

- **Purpose**: Track rate limit state per endpoint
- **State**: `Map<endpoint, { limit, remaining, resetAt, retryAfter? }>`
- **Events**: `onThresholdReached`, `onReset`

## Validation Rules

| Error Code | HTTP Status | Thrown Error | ErrorHandler Callback |
|------------|-------------|--------------|----------------------|
| `VALIDATION_ERROR` | 400 | `ValidationError` | `onValidationError(details)` |
| `UNAUTHORIZED` | 401 | `UnauthorizedError` | `onUnauthorized()` |
| `FORBIDDEN` | 403 | `ForbiddenError` | `onForbidden()` |
| `NOT_FOUND` | 404 | `NotFoundError` | `onNotFound()` |
| `CONFLICT` | 409 | `ConflictError` | `onConflict(message)` |
| `BUSINESS_RULE_ERROR` | 422 | `BusinessRuleError` | `onBusinessRuleError(message)` |
| `RATE_LIMITED` | 429 | `RateLimitError` | `onRateLimited(retryAfter)` |
| `SERVER_ERROR` | 500 | `InternalError` | `onServerError()` |
| Network error | — | `ApiError` | `onNetworkError()` |

## Routing

N/A — The API Client is a library module with no routes of its own. It is consumed by all route-level components.

## Accessibility

N/A — The API Client has no direct UI. Accessibility concerns (e.g., toast announcements for rate limits) are handled by the consuming UI components.
