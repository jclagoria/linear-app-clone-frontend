# Field Wrapper Components — Frontend Specification

## Behaviour

**Feature:** Form Field Wrappers

The Form Module SHALL provide field wrapper components that compose UI primitives with label, error display, and hint text. Each field wrapper SHALL integrate with the Form State system for validation and touched state.

### Requirement: TextField Wrapper

#### Scenario: TextField Displays Label and Input

- **GIVEN** a TextField with label "Email" and placeholder "Enter email"
- **WHEN** the TextField renders
- **THEN** the label "Email" SHALL be displayed above the input
- **AND** the input SHALL have placeholder "Enter email"

#### Scenario: TextField Shows Error State

- **GIVEN** a TextField with a validation error "Email is required"
- **WHEN** the field is touched and invalid
- **THEN** the error message SHALL be displayed below the input
- **AND** the input SHALL have an error visual state (e.g., red border)

#### Scenario: TextField Shows Hint Text

- **GIVEN** a TextField with hint "We'll never share your email"
- **WHEN** the TextField renders
- **THEN** the hint text SHALL be displayed below the input
- **AND** the hint SHALL NOT display when an error is present

### Requirement: SelectField Wrapper

#### Scenario: SelectField Displays Options

- **GIVEN** a SelectField with options ["Low", "Medium", "High"]
- **WHEN** the SelectField renders
- **THEN** a dropdown SHALL display with the provided options
- **AND** the selected value SHALL reflect the current form value

#### Scenario: SelectField Shows Error State

- **GIVEN** a SelectField with a validation error
- **WHEN** the field is touched and invalid
- **THEN** the error message SHALL be displayed
- **AND** the select SHALL have an error visual state

### Requirement: CheckboxField Wrapper

#### Scenario: CheckboxField Toggles Boolean Value

- **GIVEN** a CheckboxField with label "Accept Terms"
- **WHEN** the user clicks the checkbox
- **THEN** the form value for that field SHALL toggle between true and false

#### Scenario: CheckboxField Shows Error State

- **GIVEN** a required CheckboxField with a validation error
- **WHEN** the field is touched and unchecked
- **THEN** the error message SHALL be displayed

### Requirement: TextareaField Wrapper

#### Scenario: TextareaField Displays Multi-Line Input

- **GIVEN** a TextareaField with label "Description" and rows: 4
- **WHEN** the TextareaField renders
- **THEN** a multi-line text area SHALL be displayed with 4 visible rows

#### Scenario: TextareaField Shows Character Count

- **GIVEN** a TextareaField with maxLength: 500
- **WHEN** the user types 250 characters
- **THEN** a character count "250/500" SHALL be displayed

### Requirement: Field Wrapper Accessibility

#### Scenario: Field Wrapper Label Association

- **GIVEN** any field wrapper with a label
- **WHEN** the field wrapper renders
- **THEN** the label SHALL be associated with the input via htmlFor/id
- **AND** clicking the label SHALL focus the input

#### Scenario: Error Announced to Screen Readers

- **GIVEN** a field with a validation error
- **WHEN** the error is displayed
- **THEN** the error SHALL be associated with the input via aria-describedby
- **AND** the error SHALL be announced to screen readers via aria-live
