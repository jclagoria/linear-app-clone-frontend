# Authentication — Frontend Specification

## Behaviour

**Feature:** User Registration

The application SHALL provide a registration form allowing new users to create an account by submitting email, name, and password. Upon successful registration, the user SHALL be authenticated and redirected to the main application.

### Requirement: Registration Form Display

#### Scenario: User navigates to registration page

- **GIVEN** the user is on the login page
- **WHEN** the user clicks the "Sign up" link
- **THEN** the registration form is displayed with email, name, and password fields
- **AND** the form includes a "Create account" submit button
- **AND** a link to return to the login page is visible

#### Scenario: Registration form renders with empty fields

- **GIVEN** the user navigates to the registration page
- **WHEN** the page finishes loading
- **THEN** the email field is empty and focused
- **AND** the name field is empty
- **AND** the password field is empty

### Requirement: Client-Side Validation

#### Scenario: Submitting form with empty email

- **GIVEN** the user is on the registration page
- **WHEN** the user leaves the email field empty and clicks "Create account"
- **THEN** an error message "Email is required" is displayed below the email field
- **AND** the form is not submitted

#### Scenario: Submitting form with invalid email format

- **GIVEN** the user is on the registration page
- **WHEN** the user enters "notanemail" in the email field and clicks "Create account"
- **THEN** an error message "Please enter a valid email" is displayed below the email field
- **AND** the form is not submitted

#### Scenario: Submitting form with empty name

- **GIVEN** the user is on the registration page
- **WHEN** the user leaves the name field empty and clicks "Create account"
- **THEN** an error message "Name is required" is displayed below the name field
- **AND** the form is not submitted

#### Scenario: Submitting form with short password

- **GIVEN** the user is on the registration page
- **WHEN** the user enters "abc" in the password field and clicks "Create account"
- **THEN** an error message "Password must be at least 8 characters" is displayed below the password field
- **AND** the form is not submitted

#### Scenario: Submitting form with password mismatch

- **GIVEN** the user is on the registration page
- **WHEN** the user enters "password123" in the password field and "password456" in the confirm password field and clicks "Create account"
- **THEN** an error message "Passwords do not match" is displayed below the confirm password field
- **AND** the form is not submitted

#### Scenario: Clearing validation errors on input

- **GIVEN** the registration form is displaying a validation error
- **WHEN** the user modifies the corresponding field
- **THEN** the error message for that field is removed

### Requirement: Successful Registration

#### Scenario: User submits valid registration form

- **GIVEN** the user is on the registration page
- **WHEN** the user enters a valid email, name, and password (minimum 8 characters)
- **AND** the user clicks "Create account"
- **THEN** a loading spinner is displayed on the submit button
- **AND** the form fields are disabled during submission

#### Scenario: Registration succeeds and user is authenticated

- **GIVEN** the user submitted a valid registration form
- **WHEN** the API returns a 201 response with user data and access token
- **THEN** the access token is stored
- **AND** the refresh token cookie is set by the browser
- **AND** the user is redirected to the main application dashboard
- **AND** the user's name and email are available in the auth context

### Requirement: Server Error Handling

#### Scenario: Registration fails due to existing email

- **GIVEN** the user is on the registration page
- **WHEN** the user submits the form with an email that already exists
- **AND** the API returns a 409 conflict response
- **THEN** an error message "An account with this email already exists" is displayed
- **AND** the form remains editable for the user to try another email

#### Scenario: Registration fails due to server validation error

- **GIVEN** the user is on the registration page
- **WHEN** the user submits the form with invalid data
- **AND** the API returns a 400 validation error response
- **THEN** the specific field errors from the server are displayed below each field
- **AND** the form remains editable

#### Scenario: Registration fails due to network error

- **GIVEN** the user is on the registration page
- **WHEN** the user submits the form
- **AND** the network request fails
- **THEN** a generic error message "Something went wrong. Please try again." is displayed
- **AND** the form remains editable

### Requirement: Loading State

#### Scenario: Submit button shows loading during API call

- **GIVEN** the user has clicked "Create account" with valid inputs
- **WHEN** the API request is in progress
- **THEN** the submit button displays a loading spinner
- **AND** the submit button text changes to "Creating..."
- **AND** the form fields are disabled

## User Flow

1. User arrives at login page
2. User clicks "Sign up" link
3. Registration form is displayed
4. User fills in email, name, and password
5. User clicks "Create account"
6. Client-side validation runs
7. If valid, API request is sent
8. On success: tokens stored, user redirected to dashboard
9. On error: error message displayed, form remains editable

## Components

### RegisterForm

- **Purpose**: Captures user registration input and handles form submission
- **Props**: `onSuccess: () => void`, `onSwitchToLogin: () => void`
- **States**: idle, loading, error
- **Events**: submit registration data, switch to login

### RegisterPage

- **Purpose**: Page wrapper for the registration flow
- **Props**: none (route component)
- **States**: idle, loading, error
- **Events**: navigation to login or dashboard

## Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| `/register` | RegisterPage | User registration form |

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| email | Required, valid email format | "Email is required" / "Please enter a valid email" |
| name | Required, non-empty | "Name is required" |
| password | Required, minimum 8 characters | "Password must be at least 8 characters" |
| confirmPassword | Required, must match password | "Passwords do not match" |

## Accessibility

- Form fields SHALL have associated `<label>` elements
- Error messages SHALL be linked to inputs via `aria-describedby`
- The submit button SHALL be disabled during loading state
- Focus SHALL remain on the form after error display
- Keyboard navigation: Enter submits the form, Tab moves between fields
- The form heading SHALL use an appropriate heading level (h1)
