# Keyboard Module — Frontend Specification

## Behaviour

**Feature:** Keyboard Shortcuts

The application SHALL provide keyboard shortcuts for efficient navigation and action execution. Shortcuts SHALL be context-aware, adapting to the current view and selection state.

### Requirement: Shortcut Registration

#### Scenario: Register global shortcuts

- **GIVEN** the application loads
- **WHEN** the keyboard module initializes
- **THEN** 14 shortcuts are registered in the shortcut registry
- **AND** each shortcut has an action, context, and key combination

#### Scenario: Define shortcut key combinations

- **GIVEN** a shortcut is registered
- **WHEN** the shortcut definition is examined
- **THEN** it contains a single key or key sequence (e.g., "C", "G then I")
- **AND** it specifies the context in which it is active (global, list, detail)

### Requirement: Shortcut Execution

#### Scenario: Execute shortcut on key press

- **GIVEN** a shortcut is registered for the current context
- **WHEN** the user presses the shortcut key combination
- **THEN** the associated action is executed
- **AND** the shortcut does not fire if the user is in a text input field

#### Scenario: Disable shortcuts during text input

- **GIVEN** the user is focused on a text input field
- **WHEN** the user presses a key that matches a registered shortcut
- **THEN** the shortcut action is NOT executed
- **AND** the character is entered into the input field

#### Scenario: Handle key sequences

- **GIVEN** a shortcut uses a key sequence (e.g., "G then I")
- **WHEN** the user presses the first key ("G")
- **THEN** the system waits for the second key
- **AND** if the second key ("I") is pressed within the timeout, the action executes
- **AND** if the timeout expires, the sequence is cancelled

### Requirement: Context Management

#### Scenario: Set context on route change

- **GIVEN** the user navigates to a new route
- **WHEN** the route change completes
- **THEN** the keyboard context updates based on the route type
- **AND** global shortcuts remain active
- **AND** route-specific shortcuts become active

#### Scenario: Update context on issue selection

- **GIVEN** the user is on a list view
- **WHEN** the user selects an issue (via click or keyboard)
- **THEN** the `selectedIssueId` is set in the keyboard context
- **AND** issue-specific shortcuts (S, A, L, E, Delete) become active

#### Scenario: Clear context on deselection

- **GIVEN** an issue is selected in a list view
- **WHEN** the user presses Escape or clicks away
- **THEN** the `selectedIssueId` is cleared
- **AND** issue-specific shortcuts are deactivated

### Requirement: Specificity-Based Conflict Resolution

#### Scenario: Detail context takes precedence

- **GIVEN** the user is on a detail view with an issue selected
- **WHEN** a shortcut is available in both list and detail contexts
- **THEN** the detail context action executes

#### Scenario: Global shortcuts always active

- **GIVEN** the user is on any page
- **WHEN** a global shortcut is pressed (C, G then I, G then P, G then C, /, Esc)
- **THEN** the global action executes regardless of current context

#### Scenario: List shortcuts require list context

- **GIVEN** the user is on a list view without an issue selected
- **WHEN** the user presses J, K, or Enter
- **THEN** the list navigation action executes

### Requirement: Shortcut Help Modal

#### Scenario: Open help modal with ? key

- **GIVEN** the user is on any page
- **WHEN** the user presses the "?" key
- **THEN** a modal displaying all available shortcuts opens
- **AND** shortcuts are organized by category (Global, List, Issue)

#### Scenario: Close help modal

- **GIVEN** the shortcut help modal is open
- **WHEN** the user presses Escape or clicks the close button
- **THEN** the modal closes
- **AND** focus returns to the previous element

#### Scenario: Filter shortcuts in help modal

- **GIVEN** the shortcut help modal is open
- **WHEN** the user selects a category filter
- **THEN** only shortcuts in that category are displayed

### Requirement: Shortcut Customization

#### Scenario: View current shortcuts in settings

- **GIVEN** the user navigates to keyboard settings
- **WHEN** the settings page loads
- **THEN** all shortcuts are displayed with their current key combinations
- **AND** each shortcut has an edit button

#### Scenario: Customize a shortcut

- **GIVEN** the user is on keyboard settings
- **WHEN** the user clicks edit on a shortcut and presses a new key combination
- **THEN** the new key combination is validated for conflicts
- **AND** if no conflict exists, the shortcut is updated
- **AND** if a conflict exists, an error message is displayed

#### Scenario: Reset shortcuts to defaults

- **GIVEN** the user has customized shortcuts
- **WHEN** the user clicks "Reset to defaults"
- **THEN** all shortcuts revert to their original key combinations
- **AND** a confirmation dialog is shown before resetting

## User Flow

1. User navigates to any page in the application
2. Keyboard module registers context-appropriate shortcuts
3. User presses "?" to view available shortcuts
4. User closes help modal
5. User presses shortcut key to execute action
6. On list views, user uses J/K to navigate, Enter to select
7. On issue selection, issue-specific shortcuts become available
8. User can customize shortcuts in Settings > Keyboard

## Components

### KeyboardProvider

- **Purpose**: Wraps the application and provides keyboard context
- **Props**: children
- **States**: active, inactive (during modals)
- **Events**: keydown, keyup

### ShortcutRegistry

- **Purpose**: Stores and manages all registered shortcuts
- **Props**: shortcuts
- **States**: loading, ready
- **Events**: shortcutTriggered

### ShortcutHelpModal

- **Purpose**: Displays available shortcuts in a modal
- **Props**: isOpen, onClose, shortcuts, categories
- **States**: open, closed
- **Events**: close, filterChange

### ShortcutSettings

- **Purpose**: Allows users to customize keyboard shortcuts
- **Props**: shortcuts, onSave, onReset
- **States**: editing, viewing
- **Events**: save, reset, edit

## Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| `/settings/keyboard` | ShortcutSettings | Customize keyboard shortcuts |

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Shortcut key | Must not conflict with existing shortcut | "This key combination is already in use" |
| Shortcut key | Must not be a browser shortcut | "This key combination is reserved by the browser" |
| Shortcut key | Must be a single printable character or modifier+character | "Invalid key combination" |

## Accessibility

- All shortcuts SHALL be discoverable via the help modal (? key)
- The help modal SHALL be keyboard navigable (Tab, Escape)
- Shortcuts SHALL NOT conflict with screen reader shortcuts
- Focus management SHALL return to the triggering element after modal close
- ARIA labels SHALL describe the action of each shortcut
