# Create Project — Frontend Specification

## Behaviour

**Feature:** Create Project Form

The system SHALL provide a form to create a new project. The form SHALL validate all required fields before submission. On success, the project SHALL appear in the project list. On error, the system SHALL display the appropriate error message.

### Requirement: FormDisplay

#### Scenario: User opens create project form

- **GIVEN** the user is on the Projects page
- **WHEN** the user clicks the "New Project" button
- **THEN** a modal with the create project form is displayed
- **AND** the form contains fields: teamId (hidden), name, description, startDate, targetDate
- **AND** the submit button is labeled "Create Project"

#### Scenario: User cancels project creation

- **GIVEN** the create project modal is open
- **WHEN** the user clicks the "Cancel" button
- **THEN** the modal is closed
- **AND** no project is created

### Requirement: Validation

#### Scenario: User submits with empty name

- **GIVEN** the create project form is displayed
- **WHEN** the user submits the form without entering a name
- **THEN** a validation error "Name is required" is shown below the name field
- **AND** the form is not submitted

#### Scenario: User submits with name exceeding 255 characters

- **GIVEN** the create project form is displayed
- **WHEN** the user enters a name longer than 255 characters
- **THEN** a validation error "Name must be 255 characters or less" is shown

#### Scenario: User submits with invalid date format

- **GIVEN** the create project form is displayed
- **WHEN** the user enters a non-ISO date value in startDate or targetDate
- **THEN** a validation error "Invalid date format" is shown

### Requirement: Submission

#### Scenario: User successfully creates a project

- **GIVEN** the create project form is displayed with valid inputs
- **WHEN** the user clicks "Create Project"
- **THEN** the form shows a loading state
- **AND** on success, the modal closes
- **AND** the new project appears at the top of the project list
- **AND** a success toast "Project created" is displayed

#### Scenario: Server returns validation error (400)

- **GIVEN** the create project form is displayed with valid client-side inputs
- **WHEN** the user submits the form
- **AND** the server responds with a 400 validation error
- **THEN** the error message from the server is displayed in the form
- **AND** the form remains open

#### Scenario: Server returns unauthorized (401)

- **GIVEN** the user is not authenticated
- **WHEN** the user submits the form
- **THEN** the user is redirected to the login page

#### Scenario: Server returns forbidden (403)

- **GIVEN** the user lacks permission to create projects in the team
- **WHEN** the user submits the form
- **THEN** an error toast "You don't have permission to create projects" is displayed

#### Scenario: Server returns business rule error (422)

- **GIVEN** the create project form is displayed with valid inputs
- **WHEN** the user submits the form
- **AND** the server responds with a 422 business rule error
- **THEN** the business rule error message is displayed in the form

## User Flow

1. User navigates to the Projects page
2. User clicks "New Project" button
3. Create project modal opens
4. User fills in project details (name required, description/startDate/targetDate optional)
5. User clicks "Create Project"
6. On success: modal closes, project appears in list, success toast shown
7. On error: error displayed, form stays open

## Components

### ProjectForm

- **Purpose**: Create project form with validation and submission
- **Props**: `teamId: string`, `onSuccess?: () => void`, `onCancel?: () => void`
- **States**: idle, submitting, error (field-level + form-level)
- **Events**: `onSubmit(Project)`, `onCancel`

### CreateProjectDialog

- **Purpose**: Modal wrapper around ProjectForm
- **Props**: `teamId: string`, `isOpen: boolean`, `onClose: () => void`
- **States**: open, closed
- **Events**: `onClose`

## Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| `/projects` | ProjectsPage | Displays project list with "New Project" button |

Create project is a modal overlay on the Projects page, not a separate route.

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| teamId | Required, valid UUID | "Team is required" |
| name | Required, 1-255 chars | "Name is required" / "Name must be 255 characters or less" |
| description | Optional, max 1000 chars | "Description must be 1000 characters or less" |
| startDate | Optional, ISO 8601 date | "Invalid start date format" |
| targetDate | Optional, ISO 8601 date | "Invalid target date format" |

## Accessibility

- Modal uses ARIA `role="dialog"` with `aria-modal="true"` and `aria-labelledby`
- Focus is trapped within the modal when open
- Escape key closes the modal
- Submit and Cancel buttons are keyboard-accessible
- Field-level validation errors are announced via `aria-describedby`
- Form-level errors are announced via `aria-live="polite"`
- Loading state disables the submit button and announces status to screen readers
