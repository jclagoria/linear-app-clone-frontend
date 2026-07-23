# Issues Filtering — Frontend Specification

## Behaviour

**Feature:** Issues List Filtering

The frontend SHALL align its issue-list query parameters with the OpenAPI spec. The `listIssues` API call SHALL send `statusId` (UUID) instead of `status` (string name). The `labelIds` filter SHALL be wired to the API. The `search` and `priority` parameters SHALL be removed from the API call as they are not in the spec.

### Requirement: StatusFilterUsesId

#### Scenario: Status filter sends UUID

- **GIVEN** the user has selected a status filter on the issues page
- **WHEN** `fetchIssues()` is called
- **THEN** the query param SHALL be `statusId` (the UUID of the selected status)
- **AND** the query param SHALL NOT be `status` (the string name)

### Requirement: LabelIdsWired

#### Scenario: Label filter sends comma-separated UUIDs

- **GIVEN** the user has selected one or more labels in IssueFilters
- **WHEN** `fetchIssues()` is called
- **THEN** the query param SHALL be `labelIds` with comma-separated UUID values
- **AND** the param SHALL be omitted when no labels are selected

### Requirement: SpecOnlyParams

#### Scenario: Non-spec params are excluded

- **GIVEN** the issues store has filter state including search or priority
- **WHEN** `fetchIssues()` is called
- **THEN** the `search` parameter SHALL NOT be sent
- **AND** the `priority` parameter SHALL NOT be sent

## User Flow

1. User navigates to issues list
2. IssueFilters renders with status dropdown, assignee picker, project selector, cycle selector, label selector
3. User selects a status by name from the dropdown
4. The store maps the selection to a status UUID in `filters.statusId`
5. User selects one or more labels
6. The store sets `filters.labelIds` as an array of label UUIDs
7. `fetchIssues()` constructs query params from the filter state
8. The API call includes `statusId=uuid` and `labelIds=uuid1,uuid2`
9. The API returns correctly filtered results

## Components

### IssueFilters (existing — amends)

- **Purpose**: Filter bar for issue list
- **Amendments**: Status filter emits UUID (`statusId`) instead of name string; label filter emits comma-separated UUIDs (`labelIds`)
- **States**: default, active filters
- **Events**: filter change → updates store with `statusId` and `labelIds`

### IssuesStore (existing — amends)

- **Purpose**: Manages issue state, CRUD, pagination, and filters
- **Amendments**: `filters.status` → `filters.statusId`; `filters.labelIds` added; `search` and `priority` removed from fetch query construction

## Routing

No routing changes.

## Validation Rules

No validation rule changes. Params are constructed from store state and API client handles serialization.

## Accessibility

No accessibility changes. All filter controls retain their existing ARIA labels and keyboard navigation.
