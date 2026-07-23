# Issues Module — Pagination Response Shape — Frontend Specification

## Behaviour

**Feature:** Issue List Pagination

The frontend Issues Store SHALL consume pagination metadata from the API under the key `pagination` with fields `nextCursor` and `hasMore`, matching the backend contract. All references to the previous `meta` / `cursor` shape SHALL be updated.

### Requirement: FetchIssuesResponseShape

#### Scenario: Response type uses pagination.nextCursor

- **GIVEN** the backend responds to `GET /issues` with `{ data: Issue[], pagination: { nextCursor: string | null, hasMore: boolean } }`
- **WHEN** `fetchIssues()` resolves
- **THEN** the response type SHALL declare `pagination` (not `meta`) as the pagination key
- **AND** `pagination.nextCursor` SHALL be used in place of the previous `cursor` field

#### Scenario: Cache type annotation matches new shape

- **GIVEN** the cache layer stores paginated issue responses
- **WHEN** `loadIssues()` reads from or writes to the cache
- **THEN** the cached type annotation SHALL use `pagination: { nextCursor: string | null, hasMore: boolean }`

### Requirement: StoreConsumesCorrectShape

#### Scenario: loadIssues destructures pagination

- **GIVEN** `loadIssues()` is called
- **WHEN** the API response is received
- **THEN** `pagination` SHALL be destructured from the response
- **AND** `nextCursor` SHALL store the cursor value in state
- **AND** `hasMore` SHALL drive the "Load more" button visibility

#### Scenario: loadNextPage destructures pagination

- **GIVEN** `loadNextPage()` is called with a non-null cursor
- **WHEN** the API response is received
- **THEN** `pagination` SHALL be destructured from the response
- **AND** `nextCursor` SHALL replace `cursor` in the pagination state
- **AND** `hasMore` SHALL determine whether more pages are available

### Requirement: PaginationCursorType

#### Scenario: PaginationCursor uses nextCursor

- **GIVEN** the `PaginationCursor` interface in `types.ts`
- **WHEN** the interface is defined
- **THEN** it SHALL use `nextCursor: string | null` instead of `cursor: string | null`

## User Flow

1. User lands on the issues page
2. `loadIssues()` dispatches `GET /issues` through `apiClient`
3. API returns `{ data: [...], pagination: { nextCursor: "abc", hasMore: true } }`
4. Store sets `cursor = "abc"` and `hasMore = true`
5. User scrolls to the bottom → "Load more" button appears
6. User clicks → `loadNextPage()` sends `GET /issues?cursor=abc`
7. API returns next page with `pagination`
8. New issues are appended and cursor/hasMore are updated

## Components

### IssuesStore

- **Purpose**: Manages issue state, CRUD operations, pagination, and filters
- **Props**: None
- **State**: `issues[]`, `selectedIssueId`, `filters`, `cursor: string | null`, `hasMore: boolean`, `isLoading`, `error`
- **Actions**: `loadIssues()`, `loadNextPage()`
- **Delta**: Rename destructured field from `meta` to `pagination`; rename `cursor` to `nextCursor` in response destructuring

### FetchIssuesResponse

- **Purpose**: API response type for the issues list endpoint
- **Delta**: Replace `meta: { cursor: string | null; hasMore: boolean }` with `pagination: { nextCursor: string | null; hasMore: boolean }`

## Validation Rules

| Scope | Rule | Error |
|-------|------|-------|
| Response shape | `pagination` SHALL be present | N/A — runtime type contract |

## Accessibility

No change — pagination is a data-layer fix with no UI modifications.
