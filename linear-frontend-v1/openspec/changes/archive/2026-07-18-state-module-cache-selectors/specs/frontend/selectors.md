# Selectors — Frontend Specification

## Behaviour

**Feature:** Derived State Selectors

The application SHALL use pure selector functions to derive computed state from stores. Selectors MUST be memoized to avoid unnecessary recomputation when inputs are unchanged.

### Requirement: SelectorDefinition

#### Scenario: Selector derives computed value

- **GIVEN** a store with state
- **WHEN** a selector reads from the store
- **THEN** it SHALL return a derived value without mutating the source state

#### Scenario: Selector is memoized

- **GIVEN** a selector with memoization
- **WHEN** the same selector is called with unchanged inputs
- **THEN** it SHALL return the cached result
- **AND** the derivation function SHALL NOT re-execute

#### Scenario: Selector recomputes on input change

- **GIVEN** a memoized selector
- **WHEN** a dependency changes
- **THEN** the selector SHALL re-execute and return a fresh result

### Requirement: SelectorTypes

#### Scenario: selectIssuesByStatus filters and groups

- **GIVEN** issues store with multiple issues having different statuses
- **WHEN** `selectIssuesByStatus` is called
- **THEN** it SHALL return issues grouped by status
- **AND** it SHALL apply any active filters from the store

#### Scenario: selectProjectProgress computes percentage

- **GIVEN** issues store and a projectId
- **WHEN** `selectProjectProgress` is called
- **THEN** it SHALL return a completion percentage (0–100) for that project

#### Scenario: selectActiveCycle returns current cycle

- **GIVEN** cycles store with multiple cycles
- **WHEN** `selectActiveCycle` is called
- **THEN** it SHALL return the cycle whose date range includes the current date
- **AND** it SHALL return null if no active cycle exists

#### Scenario: selectUnreadCount counts notifications

- **GIVEN** websocket store with notifications
- **WHEN** `selectUnreadCount` is called
- **THEN** it SHALL return the count of unread notifications

### Requirement: SelectorComposition

#### Scenario: Selectors combine multiple stores

- **GIVEN** selectors that depend on multiple stores
- **WHEN** any dependency store changes
- **THEN** the selector SHALL recompute

## User Flow

1. Component imports selector function
2. Selector receives store state as input
3. If memoized and inputs unchanged → return cached value
4. Otherwise → derive and cache result
5. Component renders using derived value

## Components

### Selector

- **Purpose**: Pure function that derives state from one or more stores
- **Props**: state (from store)
- **States**: cached, recomputing
- **Events**: none (no side effects)

## Routing

No routing concern.

## Validation Rules

| Rule | Description |
|------|-------------|
| Purity | Selectors MUST NOT mutate their input state |
| Determinism | Same inputs MUST always produce the same output |

## Accessibility

Selectors are pure computation with no accessibility impact.
