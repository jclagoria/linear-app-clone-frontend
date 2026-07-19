---
status: accepted
date: 2026-07-19
decision-makers: Developer
---

# ADR-0008: API Error Taxonomy via Class Hierarchy

## Context and Problem Statement

The application communicates with the backend via REST. Every API response can return client errors (4xx) or server errors (5xx), and individual HTTP statuses carry distinct semantics (validation, not-found, conflict, rate-limit, etc.). Consumers — error banners, toasts, retry logic — need to distinguish error types at runtime and react differently.

Options included a discriminated union of error types, a class hierarchy, an error-code enum with a single error type, or a callback-based error handler with no structured types at all.

## Decision Drivers

- Discernibility — consumers must distinguish error categories (validation vs. not-found vs. rate-limit) at runtime
- Extensibility — adding a new HTTP status mapping must not require modifying existing consumers
- TypeScript integration — `instanceof` checks must narrow types, and error properties must be typed
- Bundle cost — the error layer should add minimal bytes and zero runtime dependencies

## Considered Options

- **Class hierarchy (ApiError base + typed subclasses)** — each error is an instance of a class that extends `ApiError` with typed properties
- **Discriminated union** — `type ApiError = { kind: 'validation'; details: FieldError[] } | { kind: 'not-found' } | ...`
- **Error-code enum with single type** — `{ code: ErrorCode; message: string; details?: unknown }` — all errors share the same type
- **Callback object (ErrorHandler)** — consumers register callbacks per error kind; no structured error type is exposed

## Decision Outcome

Chosen option: "Class hierarchy (ApiError base + typed subclasses)", because it gives consumers both `instanceof`-based type narrowing and fine-grained property typing without a central error-code enum that must be updated for every new mapping.

### Consequences

- Good, because `catch (e) { if (e instanceof ValidationError) { e.details /* typed */ } }` works without type assertions.
- Good, because adding a new error subclass (e.g., `PaymentRequiredError` for 402) requires no changes to existing error handlers — they simply ignore the unknown type via the fallback `onUnknown` callback.
- Good, because each subclass can carry status-specific properties (e.g., `RateLimitError.retryAfter`).
- Bad, because class instances do not serialize/deserialize transparently across network boundaries (not a concern for this frontend-only error taxonomy).
- Bad, because the class hierarchy is more boilerplate than a single discriminated union type.

### Confirmation

- The `ApiError` base class lives at `src/lib/api-client/errors/ApiError.ts`.
- Every HTTP status code listed in the API specification maps to exactly one subclass.
- Every subclass is exported and follows the `extends ApiError` pattern.
- The error interceptor (`src/lib/api-client/interceptors/error.ts`) instantiates the correct subclass from the HTTP response.

## Pros and Cons of the Options

### Class hierarchy (ApiError base + typed subclasses)

- Good, because `instanceof` is a built-in JavaScript operator — no type guard functions needed.
- Good, because each subclass can declare additional typed properties (e.g., `ValidationError.details: FieldError[]`).
- Good, because the error interceptor is a simple switch/map from HTTP status to constructor.
- Good, because TypeScript's `--noImplicitOverride` catches property collisions.
- Neutral, because class instances are objects — they work with `JSON.stringify` only for own enumerable properties.
- Bad, because the file-per-class pattern adds more files than a union type in one file.

### Discriminated union

- Good, because it is a single type definition — no separate files per error kind.
- Good, because TypeScript narrows the union with `switch (error.kind)` — no `instanceof` needed.
- Bad, because adding a new kind requires editing the union type definition, which triggers recompilation of all consumers.
- Bad, because custom properties per kind require conditional types or optional fields with runtime checks.

### Error-code enum with single type

- Good, because it is the simplest model — one type, one enum, one file.
- Bad, because all consumers must switch on `error.code` with a string comparison — no structural type narrowing.
- Bad, because properties like `details` (only for validation errors) must be optional on all errors, losing type safety.

### Callback object (ErrorHandler)

- Good, because consumers never see error types — they just register a callback.
- Bad, because the callback registration creates a global subscriber list with lifecycle management.
- Bad, because non-registered consumers cannot inspect the error; they only get the fallback callback.

## More Information

The full error taxonomy defined in the spec (`specs/frontend/api-client.md`):

| Error Class | HTTP Status | Extra Properties |
|---|---|---|
| `ValidationError` | 400 | `details: FieldError[]` |
| `UnauthorizedError` | 401 | (none — triggers token refresh) |
| `ForbiddenError` | 403 | (none) |
| `NotFoundError` | 404 | (none) |
| `ConflictError` | 409 | (none) |
| `BusinessRuleError` | 422 | (none) |
| `RateLimitError` | 429 | `retryAfter: number` |
| `InternalError` | 500 | (none) |
| `ApiError` (base) | network error | (fallback) |
