# List Projects — Frontend Specification

## Behaviour

**Feature:** Project List View

The project list view SHALL fetch and display a paginated list of projects for the selected team, supporting status filtering and cursor-based pagination.

### Requirement: Fetch projects on mount

#### Scenario: Projects page loads with loading state

- **GIVEN** the user navigates to the projects page
- **WHEN** the page component mounts
- **THEN** a loading spinner MUST be displayed
- **AND** the API call for listing projects MUST be triggered

#### Scenario: Projects page displays project list after fetch

- **GIVEN** the projects page is mounted and the API returns projects
- **WHEN** the fetch completes successfully
- **THEN** the loading spinner MUST be removed
- **AND** the list of projects MUST be rendered in the UI

### Requirement: Filter projects by status

#### Scenario: User filters projects by status

- **GIVEN** the projects list is displayed
- **WHEN** the user selects a status filter (e.g., "In Progress")
- **THEN** the list MUST re-fetch showing only projects with that status
- **AND** the loading state MUST be shown during the refetch

### Requirement: Paginate projects with cursor-based loading

#### Scenario: User scrolls to load more projects

- **GIVEN** the projects list is displayed and `hasMore` is true
- **WHEN** the user scrolls to the bottom of the list
- **THEN** the next page of projects MUST be fetched using the cursor
- **AND** new projects MUST be appended to the existing list

#### Scenario: No more projects to load

- **GIVEN** the projects list is displayed and `hasMore` is false
- **WHEN** the user scrolls to the bottom
- **THEN** no additional fetch MUST be triggered
- **AND** a "No more projects" indicator MUST be shown

### Requirement: Handle validation error

#### Scenario: Invalid teamId shows error

- **GIVEN** the user navigates to the projects page with an invalid teamId
- **WHEN** the fetch request returns a 400 error
- **THEN** an error message MUST be displayed to the user
- **AND** the loading state MUST be cleared

### Requirement: Handle unauthorized access

#### Scenario: Unauthenticated user attempts to view projects

- **GIVEN** the user is not authenticated
- **WHEN** the projects page is mounted and a fetch is triggered
- **THEN** a 401 error MUST be caught
- **AND** the user MUST be redirected to the login page

## User Flow

1. User navigates to the projects page
2. Loading spinner is displayed
3. `listProjects` API call is made with the selected teamId and optional filters
4. Projects are rendered in a scrollable list
5. User can apply a status filter to narrow results
6. User scrolls to the bottom to load more projects via cursor pagination
7. If no more projects exist, an end-of-list indicator is shown
8. If an error occurs, an error message is displayed with appropriate recovery options

## Components

### ProjectList

- **Purpose**: Renders a scrollable list of projects with loading, empty, error, and success states
- **Props**: `teamId` (required), `status` (optional), `limit` (optional)
- **States**: loading, empty, error, success
- **Events**: `onScrollBottom` (triggers pagination), `onFilterChange` (triggers refetch)

### ProjectCard

- **Purpose**: Displays a single project in the list
- **Props**: `project` (project data), `onClick` (navigation handler)
- **States**: default, hover
- **Events**: `click` (navigates to project detail)

### StatusFilter

- **Purpose**: Allows the user to filter projects by status
- **Props**: `value` (current filter), `onChange` (filter change handler)
- **States**: default, active
- **Events**: `change` (emits selected status value)

## Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| /projects | ProjectList | Main project listing page with filters and pagination |
| /projects/:projectId | ProjectDetail | Individual project detail view |

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| teamId | Required, must be a valid UUID | "A valid team ID is required to load projects." |
| status | Must be one of: planned, in_progress, completed, canceled | "Invalid status filter selected." |
| limit | Must be between 1 and 100 | "Limit must be between 1 and 100." |

## Accessibility

- The project list MUST use semantic HTML (`<ul>` / `<li>`) for list items
- Keyboard navigation MUST support Tab through project cards and filter controls
- The loading spinner MUST have an appropriate ARIA live region (`aria-live="polite"`) for screen readers
- Filter controls MUST have associated `<label>` elements
- Focus MUST be managed appropriately when navigating between project list and detail view