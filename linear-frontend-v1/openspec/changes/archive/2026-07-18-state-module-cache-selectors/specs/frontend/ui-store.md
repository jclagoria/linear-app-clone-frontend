# UI Store — Frontend Specification

## Behaviour

**Feature:** UI State Management

The UI Store SHALL manage presentation-level state: sidebar visibility, theme preference, active modals, loading indicators, and keyboard context. This state is orthogonal to domain data.

### Requirement: Sidebar

#### Scenario: Toggle sidebar

- **GIVEN** a UI store with `sidebarCollapsed`
- **WHEN** the toggle sidebar action is dispatched
- **THEN** `sidebarCollapsed` SHALL flip its boolean value

#### Scenario: Persist sidebar state

- **GIVEN** a UI store
- **WHEN** `sidebarCollapsed` changes
- **THEN** the new value SHALL be persisted to local storage

### Requirement: Theme

#### Scenario: Switch theme

- **GIVEN** a UI store with a theme value
- **WHEN** the set theme action is dispatched
- **THEN** `theme` SHALL be updated to the provided value

#### Scenario: Persist theme preference

- **GIVEN** a UI store
- **WHEN** the theme changes
- **THEN** the value SHALL be persisted to local storage

#### Scenario: Hydrate theme on app start

- **GIVEN** a stored theme preference
- **WHEN** the application starts
- **THEN** the theme SHALL be restored from local storage

### Requirement: Modals

#### Scenario: Open modal

- **GIVEN** a UI store with no active modal
- **WHEN** an open modal action is dispatched
- **THEN** `activeModal` SHALL be set to the modal identifier

#### Scenario: Close modal

- **GIVEN** a UI store with an active modal
- **WHEN** a close modal action is dispatched
- **THEN** `activeModal` SHALL be set to null

### Requirement: KeyboardContext

#### Scenario: Change keyboard context

- **GIVEN** a UI store with keyboard context
- **WHEN** the keyboard context changes
- **THEN** `keyboardContext.current` SHALL be updated
- **AND** `keyboardContext.selectedIssueId` SHALL be set if applicable

## User Flow

1. User opens app → sidebar state and theme restored from local storage
2. User toggles sidebar → UI store updates → layout reflows
3. User switches theme → UI store updates → CSS variables swap
4. User opens a modal → UI store sets activeModal → modal renders
5. User presses Escape → modal closes → activeModal cleared
6. User navigates with keyboard → keyboard context updates → shortcut mappings change

## Components

### UIStore

- **Purpose**: Manages presentation-level UI state
- **Props**: initialState (optional for testing)
- **States**: default
- **Events**: onSidebarToggle, onThemeChange, onModalOpen, onModalClose, onKeyboardContextChange

## Routing

UI state is global across all routes. Theme and sidebar state persist across navigations.

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| theme | MUST be "light", "dark", or "system" | "Invalid theme value" |
| keyboardContext.current | MUST be "global", "list", or "detail" | "Invalid keyboard context" |

## Accessibility

Theme changes SHOULD respect `prefers-color-scheme`. Modal state SHALL trap focus when `activeModal` is set.
