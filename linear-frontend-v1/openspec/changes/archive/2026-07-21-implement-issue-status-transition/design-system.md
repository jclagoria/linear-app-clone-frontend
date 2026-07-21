# Design System — Linear App Clone

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Spacing cadence | 8px | Margin, padding, gap rhythm |
| Dense spacing | 4px | Dense data UI (status badges, labels) |
| Max content width | 960px | Issue detail page |
| Breakpoints | 640px / 1024px / 1280px | Responsive boundaries |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| heading-1 | Page title | 24px / bold / 1.2 |
| heading-2 | Section title | 18px / semibold / 1.3 |
| body | Body text | 14px / normal / 1.5 |
| caption | Labels, metadata | 13px / medium / 1.4 |
| mono | Identifiers, code | 13px / monospace / 1.4 |

## Color Semantics

| Token | Role | Usage |
|-------|------|-------|
| primary | Main actions, links | Buttons, active states |
| danger | Destructive actions | Delete, error toasts |
| success | Positive feedback | Success toasts, Done status |
| warning | Attention | Canceled status |
| neutral | Backgrounds, borders | Layout, empty states |
| text | Content | Body, headings |
| text-muted | Secondary content | Labels, metadata |

*Exact hex values defined in the hi-fi pass. This schema captures intent.*

## Component Catalog

### IssueStatusBadge

**Purpose**: Displays current issue status with a dropdown to change it. Combines a visual status pill with the existing `Select` component for transition selection.

**Anatomy**:
```
+-- trigger ---------------+
|  [status icon] Status    |
|  [dropdown arrow]        |
+--------------------------+
+-- dropdown (overlay) ----+
|  Backlog                 |
|  Todo                    |
|  In Progress             |
|  Done                    |
|  Canceled                |
+--------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| trigger | `<button>` | Shows current status with color-coded background, aria-expanded |
| dropdown | `<ul role="listbox">` | Positioned absolutely below trigger, reuses Select pattern |
| status icon | decorative | Colored dot or icon per status |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Colored pill with status name | Click opens dropdown |
| open | Dropdown visible below trigger | Arrow key navigation, Enter to select, Escape to close |
| loading | Spinner replaces dropdown arrow | Dropdown disabled, aria-busy="true" |
| success | Status pill updates to new color | Toast: "Status updated to {name}" |
| error | Status pill reverts to previous color | Toast: error message from API (422 BUSINESS_RULE_ERROR) |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Enter/Space to open, Arrow keys to navigate, Enter to select, Escape to close |
| Screen reader | Role combobox + aria-expanded + aria-activedescendant |

**Variants**:

| Variant | When to use |
|---------|-------------|
| Status colors | Backlog: neutral, Todo: neutral, In Progress: blue, Done: green, Canceled: neutral |

### Select (existing — integration note)

**Purpose**: Reused as the status dropdown within IssueStatusBadge.

**Integration**: The existing `Select` component is used for the dropdown list. The trigger button is replaced by the status-colored pill instead of the default Select trigger.

### Toast (existing — integration note)

**Purpose**: Feedback for successful or failed status transitions.

**Variants used**:
- `success` — "Status updated to In Progress"
- `error` — "Invalid transition: Cannot move from Todo to Done directly"

### Spinner (existing — integration note)

**Purpose**: Loading indicator on the status badge during API call.

**Size**: `sm` — inline within the badge button.
