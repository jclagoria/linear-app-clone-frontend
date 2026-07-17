# Cache Layer — Frontend Specification

## Behaviour

**Feature:** Client-Side Cache

The application SHALL cache API responses to reduce redundant network requests. The cache MUST support TTL-based expiry, manual invalidation, and automatic invalidation on mutations.

### Requirement: CacheWrites

#### Scenario: Cache API response on read

- **GIVEN** an API GET request
- **WHEN** the response is received
- **THEN** the response SHALL be stored in the cache with a timestamp
- **AND** the cache entry SHALL have a configurable TTL

#### Scenario: Return cached response before TTL expires

- **GIVEN** a cached response within TTL
- **WHEN** the same request is made
- **THEN** the cached value SHALL be returned immediately
- **AND** no network request SHALL be made

#### Scenario: Stale cache returns fresh data

- **GIVEN** a cached response past TTL
- **WHEN** the same request is made
- **THEN** the stale value MAY be returned immediately
- **AND** a background refresh SHALL fetch fresh data
- **AND** subscribers SHALL be updated when fresh data arrives

#### Scenario: No cache entry returns fresh data

- **GIVEN** no cached response for a request
- **WHEN** a request is made
- **THEN** the data SHALL be fetched from the network

### Requirement: CacheInvalidation

#### Scenario: Mutation invalidates related cache

- **GIVEN** cached list of entities
- **WHEN** a create/update/delete mutation succeeds
- **THEN** the cache key for that entity list SHALL be invalidated
- **AND** the next read SHALL fetch from the network

#### Scenario: Invalidate specific cache key

- **GIVEN** a cached entry
- **WHEN** an explicit invalidation is triggered for that key
- **THEN** the entry SHALL be removed from the cache

#### Scenario: Clear all cache on logout

- **GIVEN** populated cache
- **WHEN** logout occurs
- **THEN** all cache entries SHALL be cleared

### Requirement: CacheSize

#### Scenario: Cache respects size limits

- **GIVEN** a cache with a configured maximum size
- **WHEN** adding an entry exceeds the limit
- **THEN** the least recently used entry SHALL be evicted

## User Flow

1. Component requests data via selector
2. Selector checks cache for matching key
3. If cached and fresh → return cached value
4. If cached but stale → return cached, refresh in background, update on fresh data
5. If not cached → fetch from API, cache response
6. On mutation → invalidate related cache keys, refetch if needed

## Components

### CacheProvider

- **Purpose**: Manages cache entries with TTL and invalidation
- **Props**: defaultTTL, maxSize
- **States**: ready
- **Events**: onRefresh, onInvalidate, onEvict

## Routing

No routing concern.

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| TTL | MUST be a positive number | "TTL must be greater than 0" |
| maxSize | MUST be a positive integer | "Max cache size must be greater than 0" |

## Accessibility

Cache layer has no direct accessibility impact.
