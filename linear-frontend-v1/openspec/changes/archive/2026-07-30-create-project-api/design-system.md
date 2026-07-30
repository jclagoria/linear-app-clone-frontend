# Design System — Linear App Clone

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Grid columns | 12 | Content layout across all screens |
| Spacing cadence | 8px | Margin, padding, gap rhythm |
| Dense spacing | 4px | Dense data UI (tables, dashboards, lists) |
| Max content width | 1200px | Container max-width for screens |
| Breakpoints | sm: 640px / md: 768px / lg: 1024px / xl: 1280px | Responsive boundaries |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| heading-1 | Page title | text-2xl font-bold leading-tight |
| heading-2 | Section title | text-lg font-semibold leading-snug |
| heading-3 | Card/panel title | text-base font-semibold leading-snug |
| body | Body text | text-sm leading-normal |
| caption | Labels, metadata | text-xs leading-normal |

## Color Semantics

| Token | Role | Usage |
|-------|------|-------|
| primary | Main actions, links | Buttons (primary variant), focus rings, active states |
| primary-hover | Primary button hover | Button hover state |
| primary-active | Primary button active | Button active/pressed state |
| danger | Destructive actions | Delete buttons, validation error borders/text |
| danger-hover | Danger button hover | Danger variant hover |
| success | Positive feedback | Toast success variant, success indicators |
| text | Content | Body text, headings |
| text-muted | Secondary content | Labels, hints, placeholders |
| text-inverse | Text on primary bg | Primary button text |
| surface | Component backgrounds | Card, input, modal backgrounds |
| surface-alt | Alternate surface | Hover states, secondary backgrounds |
| border | Borders, dividers | Input borders, card borders, modal header divider |
| bg-black/50 | Modal backdrop | Overlay behind modals |
| error-text | Validation error text | TextInput error message |

## Component Catalog

### Button

**Purpose**: Triggers actions. Used for form submission, cancel, and secondary actions.

**Anatomy**:
```
+-- button --------------+
|  [spinner] [icon] text |
+------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| button | `<button>` | Has `disabled` and `loading` states |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Solid bg (per variant) | Cursor pointer |
| hover | Darker bg | — |
| active | Pressed bg | — |
| disabled | Opacity 50, pointer-events none | Not clickable |
| loading | Spinner replaces icon | Button disabled during loading |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | md ≥44×44 CSS px, sm ≥32×32 (SC 2.5.8) |
| Keyboard operability | Enter/Space |
| Screen reader | Role button, loading state announces spinner |

**Variants**:

| Variant | When to use |
|---------|-------------|
| primary | Main submit action |
| secondary | Cancel, dismiss |
| danger | Destructive confirm |
| ghost | Toolbar actions, less emphasis |

---

### Modal

**Purpose**: Overlay dialog for forms, confirmations, and secondary content.

**Anatomy**:
```
+-- backdrop (bg-black/50) ------------+
|  +-- dialog ----------------------+  |
|  |  +-- header ----------------+  |  |
|  |  |  title        [X] close  |  |  |
|  |  +--------------------------+  |  |
|  |  +-- body ------------------+  |  |
|  |  |  children content        |  |  |
|  |  +--------------------------+  |  |
|  +--------------------------------+  |
+--------------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| backdrop | `<div>` | Clicks close modal (closeOnBackdropClick) |
| dialog | `<div>` | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| close button | `<button>` | `aria-label="Close"` |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| open | Dialog visible, backdrop visible | Focus trapped inside, body scroll locked |
| closed | Dialog not rendered | — |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Focus trap | Tab/Shift+Tab cycles within modal |
| Focus restore | Previous focus restored on close |
| Escape | Closes modal |
| Backdrop | Clicks on backdrop close modal (configurable) |

---

### Toast

**Purpose**: Transient notification for success, error, and info messages.

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| info | Blue left border | Neutral notification |
| success | Green left border | Positive feedback |
| error | Red left border | Error/warning feedback |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Live region | `role="status"`, `aria-live="polite"` |
| Dismiss | Close button with `aria-label="Close notification"` |
| Auto-dismiss | 5000ms default, configurable via `duration` |
| Action | Optional action button with `aria-label` |

---

### TextInput

**Purpose**: Single-line text input for form fields.

**Anatomy**:
```
+-- group ---------------+
|  label                 |
|  +-- input ---------+  |
|  |                  |  |
|  +------------------+  |
|  error/hint            |
+------------------------+
```

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Border border | — |
| focus | Primary ring 2px | — |
| error | Danger border + ring | Error message below with `role="alert"` |
| disabled | Opacity 50, gray bg | Not editable |
| filled | With value | — |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Label | Visible `<label>` with `htmlFor` |
| Error | `aria-invalid`, `aria-describedby` to error ID |
| Hint | `aria-describedby` to hint ID (when no error) |

---

### Textarea

**Purpose**: Multi-line text input for descriptions and long content.

**States**: Same as TextInput.

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Border, resize-y | — |
| error | Danger border + ring | Error message below |
| char count | Counter at bottom right | Turns danger when at limit |

**Accessibility Contract**: Same as TextInput.

---

### Select

**Purpose**: Dropdown for choosing from predefined options.

**Anatomy**:
```
+-- combobox ------------------+
|  Selected option    [arrow]  |
+------------------------------+
+-- listbox (dropdown) -------+
|  option 1                    |
|  option 2                    |
|  option 3                    |
+------------------------------+
```

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| closed | Button with selected value or placeholder | — |
| open | Dropdown visible | Arrow rotated 180deg |
| active | Highlighted option | Keyboard nav highlight |
| selected | Bold + primary color | Selected option in list |
| error | Danger border | Error message below |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Role | `combobox` with `aria-haspopup="listbox"` |
| List | `role="listbox"` with `role="option"` children |
| Active descendant | `aria-activedescendant` on combobox |
| Expanded | `aria-expanded` |
| Keyboard | Enter/Space toggle, Arrow Up/Down navigate, Escape close |

---

### Spinner

**Purpose**: Loading indicator used inside Buttons and standalone.

**States**: Only one — spinning.

---

### Card

**Purpose**: Container for grouped content (projects, issues, sections).

**Anatomy**:
```
+-- card --------------------+
|  content                   |
|  content                   |
+----------------------------+
```

---

### EmptyState

**Purpose**: Placeholder when no data is available.

**Anatomy**:
```
+-- empty-state -------------+
|  icon                      |
|  title                     |
|  description               |
|  [action button]           |
+----------------------------+
```

---

### Checkbox

**Purpose**: Binary selection input.

---

### ErrorBanner

**Purpose**: Page-level error display.

---

### LoadingOverlay

**Purpose**: Full-content loading cover.
