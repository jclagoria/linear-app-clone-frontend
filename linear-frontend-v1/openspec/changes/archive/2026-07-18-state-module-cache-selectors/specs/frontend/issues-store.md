# Issues Store — Frontend Specification

## Behaviour

**Feature:** Issues State Management

The Issues Store SHALL own the issues collection, selected issue, and filter state. It MUST support CRUD operations on issues, filter management, and pagination.

### Requirement: IssuesCollection

#### Scenario: Load issues

- **GIVEN** an empty issues store
- **WHEN** the load action is dispatched
- **THEN** the store SHALL set `isLoading` to true
- **AND** after loading, issues SHALL be populated
- **AND** `isLoading` SHALL be set to false

#### Scenario: Select an issue

- **GIVEN** a populated issues store
- **WHEN** an issue ID is selected
- **THEN** `selectedIssueId` SHALL be set to that ID

#### Scenario: Deselect issue

- **GIVEN** a selected issue
- **WHEN** the deselect action is dispatched
- **THEN** `selectedIssueId` SHALL be set to null

### Requirement: IssuesFilters

#### Scenario: Filter by status

- **GIVEN** a populated issues store
- **WHEN** a status filter is applied
- **THEN** the filter SHALL be stored in `filters.status`
- **AND** visible issues SHALL be filtered accordingly

#### Scenario: Filter by assignee

- **GIVEN** a populated issues store
- **WHEN** an assignee filter is applied
- **THEN** the filter SHALL be stored in `filters.assigneeId`

#### Scenario: Clear all filters

- **GIVEN** active filters on the store
- **WHEN** the clear filters action is dispatched
- **THEN** all filter values SHALL be reset to null or empty

### Requirement: IssuesPagination

#### Scenario: Load next page

- **GIVEN** a paginated issue list with `hasMore: true`
- **WHEN** the load next page action is dispatched
- **THEN** the cursor SHALL advance
- **AND** more issues SHALL be appended to the collection

#### Scenario: No more pages

- **GIVEN** a paginated issue list with `hasMore: false`
- **WHEN** the load next page action is dispatched
- **THEN** no further requests SHALL be made

## User Flow

1. User navigates to issue list view
2. Store loads issues from API (via cache layer)
3. User selects filter criteria → store updates filters → selectors recompute filtered list
4. User clicks an issue → `selectedIssueId` updated → detail view renders
5. User scrolls to bottom → next page loads
6. User creates/updates/deletes issue → store mutates → cache invalidated

## Components

### IssuesStore

- **Purpose**: Manages issues collection, selection, and filters
- **Props**: initialState (optional for testing)
- **States**: loading, populated, empty, error
- **Events**: onIssuesLoaded, onIssueSelected, onFilterChanged

## Routing

The Issues Store is consumed by views at `/issues`, `/issues/:id`, `/board`, `/projects/:id`.

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| issue.id | MUST be a non-empty string | "Issue ID is required" |
| filters.status | MUST be a valid status value | "Invalid status filter" |

## Accessibility

Store state drives UI rendering. Loading state SHOULD trigger loading indicators with `aria-busy`. Empty state SHOULD display a meaningful message for screen readers.
