# {Domain} — Frontend Specification

## Behaviour

**Feature:** {Feature title — e.g., "Task Board View"}

{Rule or purpose description using RFC 2119 keywords (SHALL, MUST, SHOULD).}

### Requirement: {RequirementName}

#### Scenario: {ScenarioName}

- **GIVEN** {precondition — e.g., "the user is on the board page"}
- **WHEN** {action — e.g., "the user clicks 'Add Task'""}
- **THEN** {expected outcome — e.g., "a modal with the task form is displayed"}
- **AND** {additional assertion}

#### Scenario: {AnotherScenarioName}

- **GIVEN** {precondition}
- **WHEN** {action}
- **THEN** {expected outcome}

## User Flow

{Step-by-step user interaction sequence.}

## Components

### {ComponentName}

- **Purpose**: {what this component handles}
- **Props**: {input data}
- **States**: loading, empty, error, success
- **Events**: {user interactions it emits}

## Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| {path} | {Component} | {description} |

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| {field} | {validation} | {message} |

## Accessibility

{Keyboard navigation, ARIA roles, focus management.}
