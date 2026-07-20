# UI Module — Frontend Specification

## Behaviour

**Feature:** UI Generic Components

The UI Module SHALL provide a set of reusable, accessible generic components that can be composed by feature and form modules. All components SHALL accept a `className` prop for customization and SHALL support `disabled` and `error` states where applicable.

### Requirement: Button Variants

#### Scenario: Primary button triggers action

- **GIVEN** the user is on any page with a primary button
- **WHEN** the user clicks the primary button
- **THEN** the button's onClick handler is invoked
- **AND** the button shows a loading indicator if `isLoading` is set

#### Scenario: Disabled button does not respond to clicks

- **GIVEN** a button with `disabled` set to true
- **WHEN** the user clicks the button
- **THEN** the onClick handler is NOT invoked
- **AND** the button appears dimmed

#### Scenario: Danger variant conveys destructive action

- **GIVEN** a button with variant set to `danger`
- **WHEN** the button renders
- **THEN** it displays with a red/error color treatment

#### Scenario: Secondary variant renders with subdued styling

- **GIVEN** a button with variant set to `secondary`
- **WHEN** the button renders
- **THEN** it displays with a non-prominent color treatment

### Requirement: Input Field

#### Scenario: User types into input

- **GIVEN** an input field with a placeholder
- **WHEN** the user types into the field
- **THEN** the entered value is reflected in the component state
- **AND** the onChange callback is called with the new value

#### Scenario: Input shows error state

- **GIVEN** an input field with an error message
- **WHEN** the component renders
- **THEN** the input border SHALL be highlighted in an error color
- **AND** the error message SHALL be visible

#### Scenario: Disabled input does not accept input

- **GIVEN** an input with `disabled` set to true
- **WHEN** the user attempts to type
- **THEN** the value SHALL NOT change

### Requirement: Select Dropdown

#### Scenario: User selects an option

- **GIVEN** a select component with multiple options
- **WHEN** the user clicks the dropdown and selects an option
- **THEN** the selected value is displayed in the trigger
- **AND** the onChange callback is called with the selected value

#### Scenario: Select shows placeholder when no option chosen

- **GIVEN** a select with no initial value
- **WHEN** the component renders
- **THEN** a placeholder text is displayed

### Requirement: Checkbox

#### Scenario: User toggles checkbox

- **GIVEN** an unchecked checkbox
- **WHEN** the user clicks on it
- **THEN** the checkbox becomes checked
- **AND** the onChange callback is called with `true`

#### Scenario: Checkbox shows indeterminate state

- **GIVEN** a checkbox with `indeterminate` set to true
- **WHEN** the component renders
- **THEN** the checkbox displays a dash instead of a checkmark

### Requirement: Textarea

#### Scenario: User types into textarea

- **GIVEN** a textarea component
- **WHEN** the user types multiple lines of text
- **THEN** the content is displayed in a multi-line input area
- **AND** the onChange callback is called with the full content

#### Scenario: Textarea shows character count

- **GIVEN** a textarea with `maxLength` set
- **WHEN** the user types
- **THEN** a character counter is displayed showing current/max length

### Requirement: Modal with Stack Management

#### Scenario: Modal opens on trigger

- **GIVEN** the user is on a page
- **WHEN** a modal is triggered
- **THEN** the modal slides in with backdrop overlay
- **AND** focus is trapped inside the modal
- **AND** scroll on the body is locked

#### Scenario: Modal closes on Esc

- **GIVEN** an open modal
- **WHEN** the user presses the Escape key
- **THEN** the modal closes
- **AND** focus returns to the previously focused element

#### Scenario: Nested modals stack correctly

- **GIVEN** a modal is already open
- **WHEN** a second modal is triggered from within the first
- **THEN** the second modal renders on top
- **AND** closing the second modal reveals the first modal beneath

#### Scenario: Modal closes on backdrop click

- **GIVEN** an open modal with `closeOnBackdropClick` enabled
- **WHEN** the user clicks the backdrop
- **THEN** the modal closes

### Requirement: Card

#### Scenario: Card renders content

- **GIVEN** a card component with title and content
- **WHEN** it renders
- **THEN** the title is displayed at the top
- **AND** the content is displayed below the title

#### Scenario: Card is clickable

- **GIVEN** a card with `onClick` handler
- **WHEN** the user clicks the card
- **THEN** the onClick callback is invoked
- **AND** the card shows a hover state

### Requirement: Toast Notifications

#### Scenario: Toast appears on trigger

- **GIVEN** a toast notification is triggered
- **WHEN** the toast is pushed to the notification queue
- **THEN** the toast slides in at the configured position
- **AND** it auto-dismisses after the configured duration

#### Scenario: Toast variants show correct styling

- **GIVEN** a toast with type `success`
- **WHEN** it renders
- **THEN** it displays with a green treatment and check icon

- **GIVEN** a toast with type `error`
- **WHEN** it renders
- **THEN** it displays with a red treatment and X icon

- **GIVEN** a toast with type `info`
- **WHEN** it renders
- **THEN** it displays with a blue treatment and info icon

#### Scenario: User dismisses toast manually

- **GIVEN** a visible toast with a dismiss button
- **WHEN** the user clicks the dismiss button
- **THEN** the toast is removed immediately

### Requirement: Empty State

#### Scenario: Empty state displays message

- **GIVEN** a page with no data to display
- **WHEN** the empty state component renders
- **THEN** an illustration or icon is displayed
- **AND** a primary message is shown describing the empty state
- **AND** an optional action button is displayed

### Requirement: Loading Indicator

#### Scenario: Spinner shows during loading

- **GIVEN** a loading state is active
- **WHEN** the loading indicator renders
- **THEN** an animated spinner is displayed
- **AND** an optional label is shown next to the spinner

#### Scenario: Full-page loader covers content

- **GIVEN** a loading indicator with `fullPage` set to true
- **WHEN** it renders
- **THEN** it fills the viewport and centers the spinner vertically and horizontally

## User Flow

1. Developer imports a component from the UI library
2. Developer configures the component via props (variant, state, handlers)
3. Component renders with correct styling and behavior
4. User interacts with the component (click, type, select)
5. Component responds with visual feedback and calls the provided handler
6. For composed flows: Toast is triggered → Toast appears → Toast auto-dismisses or user dismisses; Modal is triggered → Modal opens with backdrop → User interacts or closes

## Components

### Button

- **Purpose**: Trigger actions with visual hierarchy
- **Props**: `variant` (primary | secondary | danger), `disabled`, `isLoading`, `onClick`, `children`, `className`, `type` (button | submit)
- **States**: default, hover, active, focused, disabled, loading
- **Events**: onClick

### Input

- **Purpose**: Single-line text entry
- **Props**: `value`, `onChange`, `placeholder`, `disabled`, `error`, `type` (text | email | password), `className`
- **States**: default, focused, filled, disabled, error
- **Events**: onChange, onBlur, onFocus

### Select

- **Purpose**: Choose from predefined options
- **Props**: `value`, `onChange`, `options` (label + value), `placeholder`, `disabled`, `error`, `className`
- **States**: default, open, option selected, disabled, error
- **Events**: onChange

### Checkbox

- **Purpose**: Boolean toggle with optional indeterminate state
- **Props**: `checked`, `onChange`, `indeterminate`, `disabled`, `label`, `className`
- **States**: unchecked, checked, indeterminate, disabled
- **Events**: onChange

### Textarea

- **Purpose**: Multi-line text entry
- **Props**: `value`, `onChange`, `placeholder`, `disabled`, `error`, `maxLength`, `rows`, `className`
- **States**: default, focused, filled, disabled, error
- **Events**: onChange

### Modal

- **Purpose**: Overlay dialog with stack management
- **Props**: `isOpen`, `onClose`, `title`, `children`, `closeOnBackdropClick`, `className`
- **States**: closed, open, stacked (behind another modal)
- **Events**: onClose

### Card

- **Purpose**: Content container with optional interaction
- **Props**: `title`, `children`, `onClick`, `className`
- **States**: default, hover, pressed (if clickable)
- **Events**: onClick (optional)

### Toast

- **Purpose**: Transient notification
- **Props**: `message`, `type` (success | error | info), `duration`, `position`, `onDismiss`, `className`
- **States**: entering, visible, exiting
- **Events**: onDismiss
- **Note**: Consumed via a toast API (push/dismiss), not rendered directly

### EmptyState

- **Purpose**: Placeholder when no data exists
- **Props**: `icon`, `title`, `description`, `actionLabel`, `onAction`, `className`
- **States**: (single state — always shows content)
- **Events**: onAction (optional)

### LoadingIndicator

- **Purpose**: Visual feedback during async operations
- **Props**: `size` (sm | md | lg), `label`, `fullPage`, `className`
- **States**: (animated — no interactive states)
- **Events**: none

## Routing

This change does not introduce new routes. Components are rendered within existing page routes.

## Validation Rules

| Component | Field | Rule | Error Message |
|-----------|-------|------|---------------|
| Input | value | Required (when `required` prop set) | "This field is required" |
| Select | value | Required (when `required` prop set) | "Please select an option" |
| Textarea | value | Required (when `required` prop set) | "This field is required" |
| Textarea | value | Max length (`maxLength` prop) | "Maximum {n} characters" |

*Note: Validation display (label, error, hint) is the Form Module's responsibility. The UI primitive SHALL accept and display an `error` string when provided.*

## Accessibility

All components SHALL follow WAI-ARIA authoring practices:

- **Button**: Native `<button>` element or `role="button"` with keyboard support (Enter/Space)
- **Input**: Native `<input>` with associated `<label>` via `id`/`htmlFor`
- **Select**: `role="combobox"` with `aria-expanded`, `aria-controls`, `aria-activedescendant` for option list
- **Checkbox**: Native `<input type="checkbox">` with `aria-checked` for indeterminate state
- **Textarea**: Native `<textarea>` with associated `<label>`
- **Modal**: `role="dialog"` with `aria-modal="true"`, `aria-labelledby` referencing title. Focus trap within modal. Return focus on close. Close on Escape
- **Card**: If clickable, `role="button"` or `<button>` styling with keyboard support
- **Toast**: `role="status"` with `aria-live="polite"` for live region announcements
- **EmptyState**: `role="region"` with `aria-label` describing the empty state
- **LoadingIndicator**: `aria-busy="true"` on container, `role="status"` with `aria-label="Loading"`

Keyboard navigation:
- Tab order SHALL follow visual order
- All interactive elements SHALL be reachable via keyboard
- Modal SHALL trap focus and cycle Tab/Shift+Tab within its content
- Toast SHALL receive focus only if it contains an action button
