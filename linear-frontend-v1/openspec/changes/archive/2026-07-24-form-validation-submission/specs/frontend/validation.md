# Validation System — Frontend Specification

## Behaviour

**Feature:** Form Validation

The Form Module SHALL support multiple validation types including required, minLength, maxLength, pattern, custom, and async validators. Validation SHALL be configurable per-field and per-form with adjustable timing.

### Requirement: Validation Types

#### Scenario: Required Field Validation

- **GIVEN** a field is configured with required validation
- **WHEN** the field value is empty or undefined
- **THEN** a validation error SHALL be set for that field
- **AND** the error message SHALL be configurable

#### Scenario: MinLength Validation

- **GIVEN** a field is configured with minLength: 3
- **WHEN** the user enters "ab" (2 characters)
- **THEN** a validation error SHALL be set
- **WHEN** the user enters "abc" (3 characters)
- **THEN** the validation error SHALL be cleared

#### Scenario: MaxLength Validation

- **GIVEN** a field is configured with maxLength: 100
- **WHEN** the user enters 101 characters
- **THEN** a validation error SHALL be set

#### Scenario: Pattern Validation

- **GIVEN** a field is configured with pattern: /^[a-zA-Z]+$/
- **WHEN** the user enters "abc123"
- **THEN** a validation error SHALL be set
- **WHEN** the user enters "abc"
- **THEN** the validation error SHALL be cleared

#### Scenario: Custom Validation

- **GIVEN** a field has a custom validator function
- **WHEN** the validator returns false
- **THEN** a validation error SHALL be set
- **AND** the error message SHALL be the returned string

#### Scenario: Async Validation

- **GIVEN** a field has an async validator (e.g., check username availability)
- **WHEN** the async validation is in progress
- **THEN** the form SHALL indicate validation is pending
- **AND** the form SHALL NOT be submittable until async validation completes

### Requirement: Validation Timing

#### Scenario: On Blur Validation

- **GIVEN** a field is configured for on-blur validation
- **WHEN** the user blurs the field
- **THEN** validation SHALL run immediately
- **AND** errors SHALL display if validation fails

#### Scenario: On Submit Validation

- **GIVEN** a form is configured for on-submit validation
- **WHEN** the user submits the form
- **THEN** all fields SHALL be validated
- **AND** all errors SHALL be displayed
- **AND** the form SHALL NOT submit if any errors exist

#### Scenario: Real-Time Validation (Optional)

- **GIVEN** a field is configured for real-time validation
- **WHEN** the field value changes
- **THEN** validation SHALL run after each change
- **AND** errors SHALL update immediately
