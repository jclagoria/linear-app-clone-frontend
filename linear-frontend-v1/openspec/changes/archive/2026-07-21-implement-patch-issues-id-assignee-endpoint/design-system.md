# Design System — Linear App Clone Frontend

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Grid columns | 12 | Content layout across all screens |
| Spacing cadence | 8px | Margin, padding, gap rhythm intent |
| Dense spacing | 4px | Dense data UI (tables, dashboards) |
| Max content width | 1280px | Container max-width for screens |
| Breakpoints | 640px / 1024px / 1280px | Mobile / Tablet / Desktop |
| Border radius | 8px (cards), 4px (buttons/inputs), 9999px (badges) | Shape intent |
| Shadow | `0 1px 3px rgba(0,0,0,0.1)` (cards), `0 4px 12px rgba(0,0,0,0.15)` (modals) | Elevation |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| heading-1 | Page title | 24px / 700 / 1.2 |
| heading-2 | Section title | 18px / 600 / 1.3 |
| heading-3 | Card/panel title | 14px / 600 / 1.4 |
| body | Body text | 14px / 400 / 1.5 |
| caption | Labels, metadata | 12px / 400 / 1.4 |
| mono | Code, identifiers | 12px-14px / 400 / 1.4 monospace |

## Color Semantics

| Token | Role | Usage |
|-------|------|-------|
| primary | Main actions, links, active states | Buttons, selected items, interactive accents |
| danger | Destructive actions | Delete button, error banners |
| success | Positive feedback | Success toasts, completed states |
| warning | Attention | Warning alerts |
| neutral | Backgrounds, borders | Card backgrounds, dividers |
| surface | Container backgrounds | Cards, modals, panels |
| surface-alt | Hover/alternate backgrounds | Hover states, alternate rows |
| text | Content | Body text, headings |
| text-muted | Secondary content | Labels, metadata, placeholders |
| text-inverse | Text on primary/dark background | Primary buttons, avatar initials |
| border | Separators | Card borders, dividers, input borders |
| primary/5 | Subtle primary background | Selected card highlight |

## Component Catalog

### Toast (Snackbar)

**Purpose**: Display transient feedback messages (success, error, informational).

**Anatomy**:
```
+-- toast ---------------+
|  [icon]  [message]     |
+------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Container | `div[role="status"][aria-live="polite"]` | Fixed bottom-right; exits after `duration` ms |
| Icon | `<svg>` | Semantic: checkmark (success), alert (error), info |
| Message | `span` | Short text describing result |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Solid background, rounded | Slides in from right |
| success | Green background | Auto-dismiss after 3000ms |
| error | Red background | Auto-dismiss after 5000ms |
| exit | Fade out | Removed from DOM after animation |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | N/A — non-interactive |
| Target size | ≥24×24 CSS px |
| Keyboard operability | N/A — auto-dismissed |
| Screen reader | `role="status"` + `aria-live="polite"` announces on insertion |

**Variants**:

| Variant | When to use |
|---------|-------------|
| success | Operation completed successfully |
| error | Operation failed (network, validation, business rule) |

### Modal (IssueFormModal)

**Purpose**: Overlay form for creating or editing issues.

**Anatomy**:
```
+-- backdrop (scrim) ----------+
|  +-- modal --------------+  |
|  |  [header] [close btn] |  |
|  |  [form fields]        |  |
|  |  [actions: cancel/save]|  |
|  +------------------------+  |
+------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Backdrop | `div[role="presentation"]` | Dark scrim; click to close |
| Container | `div[role="dialog"][aria-modal="true"]` | Focus trapped inside |
| Header | `h2` | Title: "Edit Issue" or "Create Issue" |
| Close button | `button[aria-label="Close"]` | Top-right X icon |
| Form | `form` | Contains inputs + submit |
| Cancel | `button` | Closes modal without saving |
| Submit | `button[type="submit"]` | Triggers form validation + API call |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| open | Modal centered, backdrop | Focus trapped; Escape to close |
| submitting | Submit button shows spinner | Inputs disabled; no double-submit |
| error | Toast appears, modal stays | Validation errors inline; business rule errors in toast |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px |
| Keyboard operability | Tab cycles focus within modal; Escape closes; Enter submits |
| Screen reader | `role="dialog" aria-modal="true"` + `aria-label` on close button |

**Variants**:

| Variant | When to use |
|---------|-------------|
| create | New issue — empty form |
| edit | Existing issue — pre-filled form |

### Button

**Purpose**: Trigger actions.

**Anatomy**:
```
+-- button ----------+
|  [icon]  [label]   |
+--------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Container | `<button>` | Inline-flex with gap |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Filled or outlined background | Cursor pointer |
| hover | Slightly darker/lighter | — |
| active | Pressed | — |
| disabled | Opacity 60% | `cursor: not-allowed`, `pointer-events: none` |
| loading | Spinner replaces icon | `disabled` + aria-busy |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px |
| Keyboard operability | Enter/Space to activate |
| Screen reader | Accessible name via text content or `aria-label` |

**Variants**:

| Variant | When to use |
|---------|-------------|
| primary | Main call to action (Save, Create) |
| secondary | Alternative action (Cancel, Edit) |
| ghost | Toolbar, inline actions |
| danger | Destructive action (Delete) |

### Select

**Purpose**: Choose from a predefined list of options.

**Anatomy**:
```
+-- container ---------------+
|  [current value]  [caret]  |
+----------------------------+
+-- dropdown (popper) -------+
|  +-- option -------------+ |
|  |  [label]              | |
|  +------------------------+ |
|  +-- option (selected) --+ |
|  |  [check] [label]      | |
|  +------------------------+ |
+----------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Trigger | `button[role="combobox"]` | Shows current selection |
| Dropdown | `ul[role="listbox"]` | Absolutely positioned below trigger |
| Option | `li[role="option"]` | Clickable; `aria-selected` on current |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Border, current value shown | Click to open dropdown |
| open | Dropdown visible | Arrow keys cycle options; Enter selects |
| selected | Checkmark on current option | — |
| disabled | Opacity 60% | Cannot open |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | Visible 2px ring on trigger |
| Target size | ≥24×24 CSS px |
| Keyboard operability | Enter/Space opens; Arrow keys navigate; Enter selects; Escape closes |
| Screen reader | `role="combobox"` + `aria-expanded` + `aria-label` |

**Variants**: None (single variant)

## No New Components

This change introduces no new UI components. It adds a store action (`assignIssue`) and an API function (`assignIssue`) that integrate with the existing Button, Modal, Select, and Toast components listed above.
