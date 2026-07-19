# API Client & Error Handling Module

## Problem Statement

The frontend currently has no centralized HTTP client for communicating with the backend API. Each module would need to build its own fetch logic, leading to duplicated auth token injection, inconsistent error handling, and no unified approach to rate limiting or token refresh.

## Motivation

A shared API client is the foundational communication layer — every feature module (Auth, Work, Project, Cycle, etc.) depends on it. Without it, auth token management, error handling, and request/response lifecycle would be fragmented and error-prone. This module delivers:
- Consistent, reusable HTTP communication for all feature modules
- Automatic auth token injection and transparent token refresh on 401
- A typed 8-category error taxonomy aligned with backend error codes
- Rate limit header parsing and user-facing toast notification on 429
- Request/response interceptors for cross-cutting concerns (auth, loading, cache, rate limits)

## Scope

- **In scope**: ApiClient with auth token injection from AuthStore; request/response interceptor pipeline; 8-type error taxonomy (NotFound, Validation, Conflict, Unauthorized, Forbidden, BusinessRule, RateLimit, Internal); ErrorHandler interface with typed callbacks; rate limit header parsing (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`);
  rate limit state tracking per endpoint; rate limit toast notification on 429; automatic token refresh on 401 response
- **Out of scope**: Request deduplication (separate concern); data transformation/response normalization; WebSocket/realtime communication; caching layer; retry logic beyond token refresh

## Impact

- **lib/**: New `ApiClient` class, interceptor types, error classes (8-type taxonomy), `ErrorHandler` interface, rate limit state store
- **features/auth/**: Consumed by AuthStore for login/logout/refresh calls; token injection reads from AuthStore
- **All feature modules**: Will use ApiClient instead of raw fetch; benefit from automatic auth, error handling, and rate limit tracking
- **No breaking changes**: New module — existing code not affected until modules migrate to ApiClient
