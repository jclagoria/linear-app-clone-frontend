# Work Module — Frontend Specification

## Behaviour

**Feature:** Issue Management

The Work Module SHALL manage the full lifecycle of issues: listing, creating, viewing, editing, filtering, and deleting. It SHALL provide a Zustand-based Issues Store as the single source of truth for issue state, and a set of UI components for display and interaction.

### Requirement: IssuesStore

The Issues Store SHALL hold the canonical issue list, selected issue, filter parameters, pagination cursor, and loading state.

#### Scenario: Store initialises with empty state

- **GIVEN** the application has loaded
- **WHEN** the Issues Store is initialised
- **THEN** `issues` SHALL be an empty array
- **AND** `selectedIssueId` SHALL be `null`
- **AND** `filters.status` SHALL be `null`
- **AND** `isLoading` SHALL be `false`

#### Scenario: Issues are fetched from the API

- **GIVEN** the Issues Store is initialised
- **WHEN** `fetchIssues()` is called with filter parameters
- **THEN** `isLoading` SHALL be `true` during the request
- **AND** on success, `issues` SHALL be set to the API response array
- **AND** `isLoading` SHALL be `false`
- **AND** on error, `error` SHALL be set and `isLoading` SHALL be `false`

#### Scenario: A new issue is created

- **GIVEN** the user has submitted a valid IssueForm
- **WHEN** `createIssue(data)` is called
- **THEN** the new issue SHALL be prepended to `issues`
- **AND** the issue SHALL have an auto-generated identifier (ENG-XXX format)
- **AND** the issue SHALL have default status `"Todo"`
- **AND** the issue SHALL have default priority `"No Priority"`

#### Scenario: An existing issue is updated

- **GIVEN** the Issues Store holds at least one issue
- **WHEN** `updateIssue(id, partial)` is called
- **THEN** the matching issue SHALL be updated immutably in `issues`
- **AND** the store SHALL NOT modify other issues

#### Scenario: An issue is deleted

- **GIVEN** the Issues Store holds at least one issue
- **WHEN** `deleteIssue(id)` is called
- **THEN** the issue SHALL be removed from `issues`
- **AND** if `selectedIssueId` matches the deleted issue, it SHALL be set to `null`

### Requirement: IssueList

The IssueList component SHALL display a filtered, scrollable list of issues.

#### Scenario: IssueList renders fetched issues

- **GIVEN** the Issues Store has loaded issues
- **WHEN** IssueList is rendered
- **THEN** each issue SHALL be displayed as an IssueCard
- **AND** the list SHALL respect the current filter configuration

#### Scenario: IssueList shows empty state

- **GIVEN** the Issues Store has zero issues matching the current filters
- **WHEN** IssueList is rendered
- **THEN** an empty state message SHALL be displayed: "No issues yet"
- **AND** a "Create issue" button SHALL be visible

#### Scenario: IssueList shows loading state

- **GIVEN** `isLoading` is `true` in the Issues Store
- **WHEN** IssueList is rendered
- **THEN** skeleton placeholders SHALL be displayed instead of issue cards

### Requirement: IssueCard

The IssueCard component SHALL display a compact summary of a single issue.

#### Scenario: IssueCard shows issue summary

- **GIVEN** an issue object with identifier, title, status, priority, and assignee
- **WHEN** IssueCard is rendered with that issue
- **THEN** the issue identifier (e.g., ENG-123) SHALL be displayed
- **AND** the issue title SHALL be displayed
- **AND** a status badge SHALL be shown
- **AND** a priority indicator SHALL be shown
- **AND** the assignee avatar SHALL be shown if assigned

#### Scenario: IssueCard is clickable

- **GIVEN** an IssueCard is rendered
- **WHEN** the user clicks on the card
- **THEN** the application SHALL navigate to the issue detail view
- **AND** `selectedIssueId` SHALL be set in the Issues Store

### Requirement: IssueDetail

The IssueDetail component SHALL display the full details of a selected issue.

#### Scenario: IssueDetail shows full issue information

- **GIVEN** an issue is selected via `selectedIssueId`
- **WHEN** IssueDetail is rendered
- **THEN** the issue title, description, status, priority, assignee, labels, and metadata SHALL be displayed
- **AND** the comment list SHALL be rendered below the issue details

#### Scenario: IssueDetail shows comments

- **GIVEN** the issue has comments
- **WHEN** IssueDetail is rendered
- **THEN** comments SHALL be displayed in chronological order
- **AND** each comment SHALL show the author avatar, name, timestamp, and body

#### Scenario: IssueDetail shows labels

- **GIVEN** the issue has labels
- **WHEN** IssueDetail is rendered
- **THEN** labels SHALL be displayed as badges above the comment section

### Requirement: IssueFilters

The IssueFilters component SHALL allow users to narrow the issue list.

#### Scenario: Filter by status

- **GIVEN** the user is on the issues page
- **WHEN** the user selects a status value in IssueFilters
- **THEN** the Issues Store `filters.status` SHALL be updated
- **AND** IssueList SHALL re-render with only issues matching that status

#### Scenario: Filter by assignee

- **GIVEN** the user is on the issues page
- **WHEN** the user selects an assignee in IssueFilters
- **THEN** the Issues Store `filters.assigneeId` SHALL be updated
- **AND** IssueList SHALL re-render with only issues assigned to that user

#### Scenario: Filter by project

- **GIVEN** the user is on the issues page
- **WHEN** the user selects a project in IssueFilters
- **THEN** the Issues Store `filters.projectId` SHALL be updated
- **AND** IssueList SHALL re-render with only issues in that project

#### Scenario: Filter by cycle

- **GIVEN** the user is on the issues page
- **WHEN** the user selects a cycle in IssueFilters
- **THEN** the Issues Store `filters.cycleId` SHALL be updated
- **AND** IssueList SHALL re-render with only issues in that cycle

#### Scenario: Filter by labels

- **GIVEN** the user is on the issues page
- **WHEN** the user selects one or more labels in IssueFilters
- **THEN** the Issues Store `filters.labelIds` SHALL be updated
- **AND** IssueList SHALL re-render with only issues matching all selected labels

#### Scenario: Clear all filters

- **GIVEN** one or more filters are active
- **WHEN** the user clicks "Clear filters"
- **THEN** all filter values SHALL be reset to `null` or empty array
- **AND** IssueList SHALL show all issues

### Requirement: IssueForm

The IssueForm component SHALL handle issue creation and editing.

#### Scenario: Create issue form validation

- **GIVEN** the IssueForm is open in create mode
- **WHEN** the user submits without a title
- **THEN** an inline error SHALL be shown: "Title is required"
- **AND** the form SHALL NOT submit

#### Scenario: Create issue with valid data

- **GIVEN** the IssueForm is open in create mode
- **WHEN** the user fills required fields and submits
- **THEN** `createIssue(data)` SHALL be called on the Issues Store
- **AND** the form SHALL close
- **AND** a success toast SHALL be displayed

#### Scenario: Edit issue pre-fills form

- **GIVEN** the IssueForm is open in edit mode for an existing issue
- **WHEN** the form is rendered
- **THEN** the title, description, status, priority, assignee, and labels SHALL be pre-filled with the issue's current values

#### Scenario: Edit issue saves changes

- **GIVEN** the IssueForm is open in edit mode
- **WHEN** the user modifies fields and submits
- **THEN** `updateIssue(id, partial)` SHALL be called on the Issues Store
- **AND** the form SHALL close
- **AND** a success toast SHALL be displayed

## User Flow

1. User navigates to `/issues`
2. IssueList mounts, IssuesStore dispatches `fetchIssues()`
3. While loading, skeleton placeholders are shown
4. Issues render as IssueCards in a scrollable list
5. User applies filters via IssueFilters → list updates reactively
6. User clicks an IssueCard → navigates to `/issues/:id`
7. IssueDetail renders full issue data with comments and labels
8. User clicks "Edit" → IssueForm opens in edit mode with pre-filled data
9. User submits changes → store updates, UI reflects changes
10. User clicks "New Issue" → IssueForm opens in create mode
11. User fills form and submits → new issue appears in list

## Components

### IssuesStore

- **Purpose**: Manages issue state, CRUD operations, pagination, and filters
- **State**: `issues[]`, `selectedIssueId`, `filters`, `isLoading`, `error`, `pagination`
- **Actions**: `fetchIssues()`, `createIssue()`, `updateIssue()`, `deleteIssue()`
- **Selectors**: `selectIssuesByStatus`

### IssueList

- **Purpose**: Renders a filtered, paginated list of issues
- **Props**: none (reads from IssuesStore)
- **States**: loading (skeleton), empty (no issues message), populated (issue cards), error (retry option)
- **Events**: `onIssueClick` → navigates to detail

### IssueCard

- **Purpose**: Compact single-issue display
- **Props**: `issue: Issue`
- **States**: default
- **Events**: `onClick` → set selected + navigate

### IssueDetail

- **Purpose**: Full issue view with metadata, description, comments, labels
- **Props**: none (reads from IssuesStore via `selectedIssueId`)
- **States**: loading, populated, not found
- **Events**: `onEdit` → open IssueForm, `onDelete` → confirm + delete

### IssueFilters

- **Purpose**: Filter bar for issue list
- **Props**: none (reads/writes IssuesStore filters)
- **States**: default, active filters
- **Events**: filter change → updates store

### IssueForm

- **Purpose**: Create and edit issues
- **Props**: `mode: 'create' | 'edit'`, `issueId?: string`
- **States**: create, edit, submitting, validation error
- **Events**: `onSubmit` → dispatch store action, `onCancel` → close

## Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| `/issues` | IssuesPage | Issue list with filters |
| `/issues/:id` | IssueDetailPage | Full issue detail view |

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| title | Required, max 255 chars | "Title is required" / "Title must be 255 characters or fewer" |
| description | Max 50000 chars | "Description must be 50000 characters or fewer" |

## Accessibility

- IssueList SHALL support keyboard navigation with arrow keys (J/K)
- IssueCard SHALL have `role="button"` and be focusable
- IssueFilters SHALL use ARIA labels for each filter control
- IssueDetail SHALL have proper heading hierarchy (h1 for title, h2 for sections)
- IssueForm SHALL trap focus when displayed as a modal
- All form fields SHALL have associated `<label>` elements
- Error messages SHALL be linked to their fields via `aria-describedby`
- Loading states SHALL use `aria-busy="true"`
