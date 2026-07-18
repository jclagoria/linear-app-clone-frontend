# Store Architecture — Frontend Specification

## Behaviour

**Feature:** Store Interface & Architecture

The application SHALL organise client state into domain-specific stores. Each store MUST expose a consistent interface for reading state, subscribing to changes, and dispatching mutations.

### Requirement: StoreInterface

#### Scenario: Define store with initial state

- **GIVEN** a store definition
- **WHEN** the store is initialised
- **THEN** the store state SHALL match the provided initial state shape

#### Scenario: Read current state

- **GIVEN** a store with state
- **WHEN** a component reads the state
- **THEN** it SHALL receive the current snapshot

#### Scenario: Subscribe to state changes

- **GIVEN** a store with subscribers
- **WHEN** state changes
- **THEN** all subscribers SHALL be notified with the new state

#### Scenario: Mutate state via action

- **GIVEN** a store with initial state
- **WHEN** an action dispatches a mutation
- **THEN** the state SHALL be updated immutably
- **AND** subscribers SHALL be notified

### Requirement: DomainStores

#### Scenario: Stores are isolated by domain

- **GIVEN** multiple domain stores (Issues, Auth, UI, WebSocket, Projects, Cycles)
- **WHEN** one store is updated
- **THEN** other stores SHALL NOT be affected

#### Scenario: Store reset on logout

- **GIVEN** stores with populated state
- **WHEN** a reset action is dispatched
- **THEN** all stores SHALL return to their initial state

## User Flow

1. Application initialises and hydrates persisted state
2. Components read state via store hooks or selectors
3. User interactions dispatch mutations through store actions
4. Subscribers re-render with updated state
5. On logout, all stores reset to initial state

## Components

### StoreProvider

- **Purpose**: Initialises and provides all domain stores to the component tree
- **Props**: stores, children
- **States**: initialising, ready, error
- **Events**: onHydrated, onError

## Routing

No routing concern — stores exist outside the routing layer.

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Store name | MUST be unique per domain | "Store already defined for domain {name}" |
| State shape | MUST be an object | "Store state must be an object" |

## Accessibility

Stores are data-layer concerns with no direct accessibility impact. Components that consume stores are responsible for ARIA roles and focus management.
