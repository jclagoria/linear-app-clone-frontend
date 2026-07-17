# Routing Module — Frontend Specification

## Behaviour

**Feature:** URL Routing & Navigation

The routing module SHALL map URL paths to page components, extract dynamic segments and query parameters, provide programmatic navigation, support browser history, highlight the active route in the sidebar, and display a 404 page for unmatched routes.

### Requirement: RouteMatching

#### Scenario: Navigate to existing route

- **GIVEN** the user is on any page
- **WHEN** the user navigates to `/issues`
- **THEN** the IssuesPage component is rendered
- **AND** the URL in the address bar shows `/issues`

#### Scenario: Navigate to root route

- **GIVEN** the user is not authenticated
- **WHEN** the user navigates to `/`
- **THEN** the LoginPage component is rendered

- **GIVEN** the user is authenticated
- **WHEN** the user navigates to `/`
- **THEN** the DashboardPage component is rendered

#### Scenario: Navigate to non-existent route

- **GIVEN** the user navigates to any URL
- **WHEN** the URL does not match any registered route
- **THEN** a 404 page is displayed
- **AND** the 404 page shows a "Page not found" message
- **AND** a "Go to Dashboard" link is displayed

### Requirement: RouteParameters

#### Scenario: Extract path parameter

- **GIVEN** the route `/issues/:id` is registered
- **WHEN** the user navigates to `/issues/abc-123`
- **THEN** the IssueDetailPage component receives `id` with value `"abc-123"`
- **AND** the page displays the issue corresponding to that identifier

#### Scenario: Extract multiple path parameters

- **GIVEN** the route `/projects/:projectId/issues/:issueId` is registered
- **WHEN** the user navigates to `/projects/p1/issues/i2`
- **THEN** the page component receives `projectId` with value `"p1"` and `issueId` with value `"i2"`

### Requirement: QueryParameters

#### Scenario: Persist query parameters on navigation

- **GIVEN** the user is on `/issues`
- **WHEN** the user selects a filter for status "In Progress"
- **THEN** the URL updates to `/issues?status=in-progress`
- **AND** the issue list shows only issues with that status

#### Scenario: Read query parameters on page load

- **GIVEN** the user navigates directly to `/issues?status=done`
- **WHEN** the page loads
- **THEN** the status filter is pre-set to "Done"
- **AND** the issue list shows only completed issues

#### Scenario: Multiple query parameters

- **GIVEN** the user is on `/issues`
- **WHEN** the user filters by status "In Progress" and assignee "me"
- **THEN** the URL updates to `/issues?status=in-progress&assignee=me`
- **AND** the filter controls reflect both selections

### Requirement: ProgrammaticNavigation

#### Scenario: Navigate after action

- **GIVEN** the user is on any page
- **WHEN** the user completes an action (e.g., creates an issue)
- **THEN** the application navigates to the target page (e.g., `/issues/new-id`)
- **AND** the URL in the address bar updates accordingly

#### Scenario: Navigate with replace

- **GIVEN** the user is on `/issues`
- **WHEN** the user performs an action that triggers a replace navigation
- **THEN** the current history entry is replaced instead of pushed
- **AND** the browser back button skips the replaced entry

### Requirement: BrowserHistory

#### Scenario: Back button navigates to previous page

- **GIVEN** the user has navigated from `/issues` to `/projects`
- **WHEN** the user clicks the browser back button
- **THEN** the URL changes to `/issues`
- **AND** the IssuesPage component is rendered

#### Scenario: Forward button navigates to next page

- **GIVEN** the user has navigated from `/issues` to `/projects` and then back
- **WHEN** the user clicks the browser forward button
- **THEN** the URL changes to `/projects`
- **AND** the ProjectsPage component is rendered

### Requirement: SidebarHighlighting

#### Scenario: Active route highlighted in sidebar

- **GIVEN** the sidebar displays navigation links
- **WHEN** the user is on `/issues`
- **THEN** the "Issues" nav link in the sidebar has an active visual state
- **AND** other nav links do not have the active state

#### Scenario: Sidebar updates highlight on navigation

- **GIVEN** the user is on `/issues` with "Issues" highlighted
- **WHEN** the user navigates to `/projects`
- **THEN** the "Issues" link loses the active state
- **AND** the "Projects" link gains the active state

#### Scenario: Deep route highlights parent nav item

- **GIVEN** the user is on `/issues/abc-123`
- **WHEN** the page renders
- **THEN** the "Issues" nav link in the sidebar is highlighted
- **AND** the highlight reflects the parent route, not just exact match

### Requirement: RouteGuards

#### Scenario: Unauthenticated user redirected to login

- **GIVEN** the user is not authenticated
- **WHEN** the user navigates to a protected route
- **THEN** the user is redirected to `/login`
- **AND** the original URL is preserved as a `redirect` query parameter

#### Scenario: Authenticated user accesses protected route

- **GIVEN** the user is authenticated
- **WHEN** the user navigates to a protected route
- **THEN** the protected page component is rendered
- **AND** no redirect occurs

#### Scenario: Post-login redirect to original destination

- **GIVEN** the user was redirected from `/issues` to `/login`
- **WHEN** the user successfully logs in
- **THEN** the user is redirected to `/issues`
- **AND** the `redirect` parameter is cleared from the URL

### Requirement: SplashAndLoading

#### Scenario: Loading state shown during auth hydration

- **GIVEN** the application is starting
- **WHEN** the auth state is being hydrated
- **THEN** the splash screen is displayed
- **AND** no protected route content is rendered
- **AND** no redirect to login occurs

#### Scenario: Splash hidden after hydration

- **GIVEN** the application is hydrated
- **WHEN** auth state is determined
- **THEN** the splash screen is hidden
- **AND** the appropriate route (app or login) is shown

## User Flow

1. User enters URL or clicks a link
2. Router matches URL against registered route patterns
3. If no match → 404 page displayed
4. If match found, guard checks run (e.g., auth guard)
5. If guard fails → redirect to `/login?redirect=<original>`
6. If guard passes → page component rendered
7. Route parameters and query params passed to component
8. Sidebar updates active state based on current route
9. Browser history entry pushed/replaced accordingly

## Components

### RouteConfig

- **Purpose**: Central registry mapping URL patterns to page components
- **Props**: none (configuration module)
- **States**: N/A
- **Events**: N/A

### NotFoundPage

- **Purpose**: Displayed when URL does not match any registered route
- **Props**: none
- **States**: default (shows "Page not found" message + "Go to Dashboard" link)
- **Events**: none

### SplashPage

- **Purpose**: Full-screen loading indicator displayed during initial auth hydration
- **Props**: none
- **States**: loading (spinner/logo animation)
- **Events**: none (auto-transitions on hydration complete)

## Routing

| Route | Component | Auth Required | Purpose |
|-------|-----------|---------------|---------|
| `/login` | LoginPage | No | User authentication |
| `/` | DashboardPage | Yes | Main dashboard |
| `/issues` | IssuesPage | Yes | Issue list with filters |
| `/issues/:id` | IssueDetailPage | Yes | Single issue detail |
| `/projects` | ProjectsPage | Yes | Project list |
| `/projects/:id` | ProjectDetailPage | Yes | Single project detail |
| `/cycles` | CyclesPage | Yes | Cycles list |
| `/settings` | SettingsPage | Yes | User settings |
| `*` | NotFoundPage | No | 404 catch-all |

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Route param `:id` (issues/projects) | Must be a valid UUID format | — |
| Query param `status` | Must match known workflow status | — |
| Query param `assignee` | Must be a valid user ID or "me" | — |

## Accessibility

- 404 page includes a descriptive `<h1>` heading and announces page type via `role="alert"`
- Route changes update the document `<title>` to reflect the current page
- Sidebar nav links use `aria-current="page"` on the active route
- Splash screen uses `role="status"` and `aria-live="polite"` during auth hydration
- Navigation via browser back/forward buttons is announced to screen readers through focus management
