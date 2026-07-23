# Issue Creation — Frontend Specification

## Purpose

Defines the behaviour, components, and validation for creating issues within the Linear clone frontend. Every issue is scoped to a team via `teamId`.

## Behaviour

**Feature:** Create Issue with Team Context

Every issue SHALL be created within a team scope. The API requires `teamId` in the POST body. The frontend MUST provide the currently selected team ID when creating an issue.

### Requirement: CreateIssueIncludesTeamId

#### Scenario: Successful issue creation with team context

- **GIVEN** the user has selected a team in the sidebar
- **WHEN** the user submits the create-issue form
- **THEN** the POST `/issues` request includes `teamId` matching the selected team
- **AND** the issue is added to the list on success
- **AND** a success toast is displayed

#### Scenario: Missing team context blocks submission

- **GIVEN** no team is selected
- **WHEN** the user opens the create-issue form
- **THEN** the form SHALL disable submission
- **AND** display a message: "Select a team before creating issues"

### Requirement: SelectedTeamIsShared

#### Scenario: Team selection propagates to issue creation

- **GIVEN** the user switches to Team B in the sidebar
- **WHEN** the user navigates to the Issues page and creates an issue
- **THEN** the issue is created under Team B's `teamId`

## User Flow

1. User selects a team from the sidebar TeamSelector dropdown
2. User navigates to the Issues page
3. User clicks "New Issue" button
4. IssueFormModal opens with the create form
5. Form collects: title, description, status, priority, assignee, labels
6. On submit: `createIssue()` is called with all form fields + the current `teamId`
7. On success: issue is added to the store, modal closes, toast shown
8. On error: error toast shown, modal stays open

## Components

### IssuesPage

- **Purpose**: Main page rendering issue list and orchestrating creation
- **Props**: none (reads from stores)
- **States**: loading, empty, error, populated
- **Events**: `handleCreateIssue(data)` — called on form submit

### IssueFormModal

- **Purpose**: Modal dialog containing the create/edit issue form
- **Props**: `isOpen`, `mode`, `onClose`, `onSubmit`
- **States**: open, closed, submitting (disabled form)
- **Events**: `onSubmit(formData)` — emits validated form data

## Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| `/issues` | IssuesPage | List + create issues |

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| title | required, max 255 chars | "Title is required" |
| teamId | must be a non-empty string | "Team must be selected" (handled at page level) |

## Accessibility

- IssueFormModal uses `role="dialog"` and `aria-modal="true"`
- Focus is trapped inside the modal when open
- Escape key closes the modal
- Submit button is disabled during request
- Error messages use `role="alert"`
