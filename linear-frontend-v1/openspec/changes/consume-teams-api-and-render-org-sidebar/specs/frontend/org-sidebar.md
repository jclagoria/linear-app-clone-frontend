# Org Sidebar — Frontend Specification

## Behaviour

**Feature:** Org Sidebar with Team Navigation

The sidebar SHALL display the authenticated user's teams grouped by organization. It SHALL handle loading, empty, error, and populated states. The active team SHALL be visually distinct and persisted.

### Requirement: LoadTeamsOnAuth

#### Scenario: Successful load with multiple orgs

- **GIVEN** the user is authenticated
- **WHEN** the sidebar mounts
- **THEN** the teams are fetched from `GET /api/v1/me/teams`
- **AND** the sidebar shows org sections grouped by `orgId`
- **AND** each org section header displays the `orgName`
- **AND** team items appear indented under their org with `name` and `key` badge

#### Scenario: Successful load with single org

- **GIVEN** the user belongs to exactly one organization
- **WHEN** the sidebar mounts
- **THEN** the org section header is collapsed by default
- **AND** the single team is rendered as active without grouping

#### Scenario: Loading state

- **GIVEN** the fetch is in progress
- **WHEN** the sidebar mounts
- **THEN** a full-page skeleton is displayed
- **AND** if the fetch exceeds 2 seconds, a "Loading your teams…" message appears

#### Scenario: 401 Unauthorized

- **GIVEN** the user's token is expired or invalid
- **WHEN** the API returns 401
- **THEN** the user is redirected to the login page

#### Scenario: Server error with retry

- **GIVEN** the API returns a 5xx error
- **WHEN** the response is received
- **THEN** an inline banner "Could not load teams." is shown
- **AND** a "Retry" button is visible
- **WHEN** the user clicks "Retry"
- **THEN** the fetch is re-executed

#### Scenario: Network timeout

- **GIVEN** the request does not resolve within 10 seconds
- **WHEN** the timeout fires
- **THEN** a retry banner is shown
- **AND** the user can click "Retry" to re-fetch

#### Scenario: Empty state — no teams

- **GIVEN** the user has no team memberships
- **WHEN** the API returns an empty array
- **THEN** the sidebar displays "You are not a member of any team"
- **AND** a "Create a team" CTA button is shown

### Requirement: TeamSelection

#### Scenario: Select a team

- **GIVEN** the sidebar shows the team list
- **WHEN** the user clicks a team item
- **THEN** that team becomes the active team
- **AND** the active team is visually highlighted
- **AND** the selection is persisted in URL or localStorage

#### Scenario: Active team persists on reload

- **GIVEN** a team was previously selected
- **WHEN** the page reloads
- **THEN** the same team is shown as active

## User Flow

1. User authenticates → access token stored
2. Sidebar mounts → `GET /api/v1/me/teams` fires
3. Response received → teams grouped by `orgId`
4. Sidebar renders org sections with team items
5. User clicks a team → team set as active, navigation updates
6. On error → banner with retry shown; user retries or is redirected

## Components

### OrgSidebar

- **Purpose**: Root sidebar container that orchestrates loading, error, empty, and normal states
- **Props**: none (auth context consumed internally)
- **States**: loading (skeleton), error (retry banner), empty (no-teams message), populated (org sections)
- **Events**: none

### OrgSection

- **Purpose**: Collapsible org group with header and team list
- **Props**: `orgName: string`, `orgId: string`, `teams: Team[]`
- **States**: collapsed, expanded
- **Events**: `onToggle`

### TeamItem

- **Purpose**: Single team row with name and key badge
- **Props**: `name: string`, `key: string`, `isActive: boolean`, `onClick: () => void`
- **States**: active, inactive
- **Events**: `onClick`

## Routing

| Route | Page | Purpose |
|-------|------|---------|
| `/` | AppShell | Main layout with sidebar |
| `/login` | LoginPage | Redirect target for 401 |

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| API response | MUST be valid JSON array of team objects | "Could not load teams." |
| Token | MUST be present in auth header | Redirect to /login |

## Accessibility

- Org section headers SHALL use `<button>` elements with `aria-expanded` to indicate collapse state
- Team items SHALL use `<button>` or `<a>` with `role="treeitem"` within a `role="tree"` container
- Active team SHALL use `aria-current="page"`
- Skeleton loader SHALL use `aria-label="Loading teams"` and `aria-live="polite"`
- Retry button SHALL be focusable and announced on appearance via `aria-live="assertive"`
- Keyboard navigation SHALL support <kbd>Tab</kbd> between sections and <kbd>Enter</kbd>/<kbd>Space</kbd> to expand/collapse or select
- Focus SHALL move to the first team item after sidebar loads
