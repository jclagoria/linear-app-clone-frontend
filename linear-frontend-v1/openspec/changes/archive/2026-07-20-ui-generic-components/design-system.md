# Design System — Linear App Clone (Frontend)

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Grid columns | 12 | Content layout across all screens |
| Spacing cadence | 8px | Margin, padding, gap rhythm intent |
| Dense spacing | 4px | Dense data UI (tables, dashboards) |
| Max content width | 1280px | Container max-width for screens |
| Breakpoints | 768px / 1024px / 1280px | Responsive boundaries for mobile/tablet/desktop |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| heading-1 | Page title | 24px / 700 / 1.25 |
| heading-2 | Section title | 20px / 600 / 1.3 |
| heading-3 | Card/panel title | 16px / 600 / 1.4 |
| body | Body text | 14px / 400 / 1.5 |
| caption | Labels, metadata | 12px / 400 / 1.4 |

## Color Semantics

| Token | Role | Usage |
|-------|------|-------|
| primary | Main actions, links | Buttons (primary variant), active states, links |
| danger | Destructive actions | Button (danger variant), delete/remove actions |
| success | Positive feedback | Toast (success), completion indicators |
| warning | Attention | Toast (warning), alerts |
| neutral | Backgrounds, borders | Layout, cards, dividers, disabled states |
| text | Content | Body text, headings |

*Exact hex values defined in the hi-fi pass. This schema captures intent.*

## Component Catalog

### Button

**Purpose**: Triggers actions with visual hierarchy indicating importance.

**Anatomy**:
```
+-- button ------------+
|  [icon] label        |
+----------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<button>` | Native button or role="button" |
| icon | `<svg>` | Optional leading icon |
| label | `<span>` | Button text |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Filled background (primary) or outlined (secondary) | Cursor pointer |
| hover | Slightly darker background or subtle lift | — |
| active | Pressed state (darkest shade) | — |
| focused | Visible focus ring | Keyboard Tab navigation |
| disabled | Reduced opacity (50%) | Pointer events blocked, aria-disabled |
| loading | Spinner replaces or precedes label | onClick blocked, aria-busy |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Enter/Space to activate |
| Screen reader | Role="button" + accessible name via text content or aria-label |

**Variants**:

| Variant | When to use |
|---------|-------------|
| primary | Main call-to-action (one per view) |
| secondary | Alternative actions, cancel |
| danger | Destructive irreversible actions (delete) |
| ghost | Toolbar, subtle inline actions |

---

### Input

**Purpose**: Single-line text entry for forms and search.

**Anatomy**:
```
+-- wrapper ----------+
|  +-- input ------+  |
|  |               |  |
|  +---------------+  |
+---------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| wrapper | `<div>` | Container for styling (border, background) |
| input | `<input>` | Native input with type support |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | 1px border, white background | — |
| focused | Primary color border, focus ring | Keyboard Tab |
| filled | Default + value present | — |
| disabled | Reduced opacity (50%) | Pointer events blocked |
| error | Danger color border | Error message below input |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Tab to focus, type to input |
| Screen reader | Associated `<label>` via htmlFor/id, aria-describedby for error |

**Variants**:

| Variant | When to use |
|---------|-------------|
| text | General text entry |
| email | Email address (type="email") |
| password | Hidden input (type="password") |

---

### Select

**Purpose**: Choose one option from a predefined list.

**Anatomy**:
```
+-- trigger ----------+
|  selected value  ▼  |
+---------------------+
+-- dropdown ---------+
|  option 1           |
|  option 2           |
|  option 3           |
+---------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| trigger | `<button>` | Shows selected value, opens dropdown |
| value | `<span>` | Currently selected option label |
| chevron | `<svg>` | Rotates when open |
| dropdown | `<ul>` | Options list, role="listbox" |
| option | `<li>` | Role="option", aria-selected |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | 1px border, placeholder shown | — |
| open | Dropdown visible, chevron rotated | Arrow keys navigate, Enter selects |
| option selected | Highlighted value in trigger | — |
| disabled | Reduced opacity (50%) | Pointer events blocked |
| error | Danger color border | Error message below |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring on trigger |
| Target size | ≥24×24 CSS px |
| Keyboard operability | Enter/Space opens dropdown, Arrow keys navigate, Enter/Esc selects/closes |
| Screen reader | Role="combobox" with aria-expanded, aria-controls, aria-activedescendant |

**Variants**:

| Variant | When to use |
|---------|-------------|
| default | Standard option selection |

---

### Checkbox

**Purpose**: Boolean toggle with optional indeterminate state for partial selections.

**Anatomy**:
```
+-- label ------------+
|  [+] Checkbox label |
+---------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<label>` | Clickable area |
| box | `<input type="checkbox">` | Hidden native input for accessibility |
| checkmark | `<svg>` | Check or dash icon |
| label | `<span>` | Descriptive text |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| unchecked | Empty square border | — |
| checked | Filled with checkmark | aria-checked="true" |
| indeterminate | Filled with dash | aria-checked="mixed" |
| disabled | Reduced opacity (50%) | Pointer events blocked |
| focused | Focus ring on box | Keyboard Tab |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px |
| Keyboard operability | Tab to focus, Space to toggle |
| Screen reader | Role="checkbox" with aria-checked, label via visible text |

**Variants**:

| Variant | When to use |
|---------|-------------|
| default | Single boolean |
| indeterminate | Parent of grouped checkboxes (partial selection) |

---

### Textarea

**Purpose**: Multi-line text entry for longer content.

**Anatomy**:
```
+-- wrapper ----------+
| +-- textarea -----+ |
| |                  | |
| |                  | |
| +------------------+ |
| 0 / 500 chars       |
+---------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| wrapper | `<div>` | Container for styling |
| textarea | `<textarea>` | Native textarea, resizable |
| counter | `<span>` | Optional character count when maxLength set |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | 1px border, white background | — |
| focused | Primary color border, focus ring | Keyboard Tab |
| filled | Default + content present | — |
| disabled | Reduced opacity (50%) | Pointer events blocked |
| error | Danger color border | Error message below |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px |
| Keyboard operability | Tab to focus, type to input |
| Screen reader | Associated `<label>` via htmlFor/id, aria-describedby for error |

**Variants**:

| Variant | When to use |
|---------|-------------|
| default | Standard multi-line input |

---

### Modal

**Purpose**: Overlay dialog that interrupts the current context for focused interaction.

**Anatomy**:
```
+-- backdrop --------+
|  +-- modal ------+ |
|  |  +-- header + | |
|  |  | title  X | | |
|  |  +----------+ | |
|  |  +-- body ---+ | |
|  |  | content   | | |
|  |  +----------+ | |
|  |  +-- footer + | |
|  |  | [cancel]  | | |
|  |  | [confirm] | | |
|  |  +----------+ | |
|  +---------------+ |
+--------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| backdrop | `<div>` | Semi-transparent overlay, click to close (optional) |
| container | `<div>` | Modal panel, centered, role="dialog" |
| header | `<div>` | Title row |
| title | `<h2>` | aria-labelledby reference |
| close | `<button>` | X button, aria-label="Close" |
| body | `<div>` | Content area |
| footer | `<div>` | Action buttons |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| closed | Not rendered or hidden | — |
| open | Centered panel with backdrop | Body scroll locked, focus trapped |
| stacked | Behind another modal | Parent modal preserved in background |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px |
| Keyboard operability | Tab/Shift+Tab cycle within modal, Escape to close |
| Screen reader | Role="dialog", aria-modal="true", aria-labelledby on title, focus on first focusable element on open, return focus on close |

**Variants**:

| Variant | When to use |
|---------|-------------|
| default | Standard modal with backdrop |

---

### Card

**Purpose**: Content container for grouped information.

**Anatomy**:
```
+-- card --------------+
| +-- header --------+ |
| |  title            | |
| +-------------------+ |
| +-- content -------+ |
| |                   | |
| +-------------------+ |
+-----------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<div>` | Bordered box with rounded corners, padding |
| header | `<div>` | Optional title section |
| title | `<h3>` | Card heading |
| content | `<div>` | Main content area |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | 1px border, white background | — |
| hover (clickable) | Subtle background change, cursor pointer | — |
| pressed (clickable) | Slight scale or darker background | onClick fires |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring on clickable cards |
| Target size | ≥24×24 CSS px |
| Keyboard operability | If clickable: role="button", Enter/Space to activate |
| Screen reader | If clickable: role="button" + aria-label or visible text |

**Variants**:

| Variant | When to use |
|---------|-------------|
| default | Non-interactive content group |
| clickable | Navigable card (e.g., issue card, project card) |

---

### Toast

**Purpose**: Transient notification for system feedback.

**Anatomy**:
```
+-- toast -------------+
|  [icon] message  [X] |
+----------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<div>` | Role="status", aria-live="polite" |
| icon | `<svg>` | Type indicator (check, X, info) |
| message | `<span>` | Notification text |
| dismiss | `<button>` | Manual close, aria-label="Dismiss" |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| entering | Slides in from configured edge | Animation |
| visible | Fully displayed at position | Timer counting down |
| exiting | Slides out | Animation, removed after complete |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring on dismiss button |
| Target size | ≥24×24 CSS px |
| Keyboard operability | — (no focus by default unless action button present) |
| Screen reader | Role="status" with aria-live="polite" announces on change |

**Variants**:

| Variant | When to use |
|---------|-------------|
| success | Operation completed successfully |
| error | Operation failed |
| info | General information |

---

### EmptyState

**Purpose**: Placeholder when a list or view has no data.

**Anatomy**:
```
+-- container ---------+
|    [illustration]    |
|   Title text         |
|   Description text   |
|   [Action button]    |
+----------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<div>` | Role="region", centered content |
| illustration | `<svg>` | Optional visual indicator |
| title | `<h3>` | Primary message |
| description | `<p>` | Secondary guidance text |
| action | `<button>` | Optional call-to-action |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| visible | Centered illustration + text + optional action | Action button triggers onAction |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring on action button |
| Target size | ≥24×24 CSS px |
| Keyboard operability | Tab to action button, Enter/Space to activate |
| Screen reader | Role="region" with aria-label describing empty state |

**Variants**:

| Variant | When to use |
|---------|-------------|
| default | Generic empty state |

---

### LoadingIndicator

**Purpose**: Visual feedback during async operations.

**Anatomy**:
```
+-- container ---------+
|    [spinner]         |
|    Label text        |
+----------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<div>` | Role="status", aria-busy="true" |
| spinner | `<svg>` | Animated rotating circle |
| label | `<span>` | Optional descriptive text |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| visible | Animated spinner | Continuous animation until removed |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | — (non-interactive) |
| Target size | — (non-interactive) |
| Keyboard operability | — |
| Screen reader | Role="status", aria-busy="true", aria-label="Loading" |

**Variants**:

| Variant | When to use |
|---------|-------------|
| sm | Inline, button loading state |
| md | Section loading |
| lg | Full-page loading |
