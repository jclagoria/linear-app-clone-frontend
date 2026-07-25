# Design System — Keyboard Module

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Grid columns | 12 | Content layout across all screens |
| Spacing cadence | 8px | Margin, padding, gap rhythm intent |
| Dense spacing | 4px | Dense data UI (tables, dashboards) |
| Max content width | 1200px | Container max-width for screens |
| Breakpoints | 640px / 1024px / 1440px | Responsive boundaries |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| heading-1 | Page title | 24px / 600 / 1.3 |
| heading-2 | Section title | 18px / 600 / 1.4 |
| heading-3 | Card/panel title | 14px / 600 / 1.4 |
| body | Body text | 14px / 400 / 1.5 |
| caption | Labels, metadata | 12px / 400 / 1.4 |
| shortcut-key | Shortcut key labels | 13px / 500 / 1.0 |

## Color Semantics

| Token | Role | Usage |
|-------|------|-------|
| primary | Main actions, links | Buttons, active states |
| danger | Destructive actions | Delete, remove |
| success | Positive feedback | Success states |
| warning | Attention | Alerts |
| neutral | Backgrounds, borders | Layout, cards |
| text | Content | Body, headings |
| shortcut-bg | Shortcut key background | Key label badges |
| shortcut-border | Shortcut key border | Key label borders |
| highlight | Selected item | List item selection |
| highlight-subtle | Selection background | Subtle selection indication |

*Exact hex values defined in the hi-fi pass. This schema captures intent.*

## Component Catalog

### Modal

**Purpose**: Overlay for focused interactions (help, confirmations, pickers)

**Anatomy**:
```
+-- Overlay -------------------+
|  +-- Modal Container ------+ |
|  |  +-- Header ----------+ | |
|  |  |  Title    [Close]  | | |
|  |  +--------------------+ | |
|  |  +-- Content ---------+ | |
|  |  |                    | | |
|  |  +--------------------+ | |
|  |  +-- Footer ----------+ | |
|  |  |  Actions           | | |
|  |  +--------------------+ | |
|  +-------------------------+ |
+------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Overlay | div (backdrop) | Semi-transparent background, click to close |
| Container | div | Centered, max-width defined |
| Header | div | Contains title and close button |
| Content | div | Scrollable content area |
| Footer | div | Action buttons |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Visible with backdrop | Focus trapped inside modal |
| closing | Fade out | Focus returns to trigger element |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Esc to close, Tab cycles within modal |
| Screen reader | role="dialog", aria-modal="true", aria-labelledby |

**Variants**:

| Variant | When to use |
|---------|-------------|
| Shortcut Help | Display keyboard shortcuts |
| Confirmation | Confirm destructive actions |
| Picker | Select from list (assignee, label) |

---

### Kbd (Keyboard Key Label)

**Purpose**: Display keyboard shortcut keys visually

**Anatomy**:
```
+-- Kbd ------------+
|  Key Label        |
+-------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Container | kbd | Inline element with key styling |
| Label | text | The key character(s) |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Background badge, border, rounded | Static display |
| pressed | Slightly darker background | Visual feedback on press |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 for text on badge) |
| Focus appearance | Not focusable (decorative) |
| Target size | Inherited from parent |
| Keyboard operability | N/A (display only) |
| Screen reader | aria-label describing the shortcut |

**Variants**:

| Variant | When to use |
|---------|-------------|
| Single key | Single character shortcuts (C, J, K) |
| Sequence | Key sequences (G then I) |
| Modifier | Modifier + key combos (Ctrl+K) |

---

### List Item

**Purpose**: Selectable item in a list view

**Anatomy**:
```
+-- List Item --------------------+
|  [Selection Indicator]         |
|  Content Area                  |
|  +-- Actions ----------------+ |
|  |  [Shortcut] [Action Btn]  | |
|  +---------------------------+ |
+--------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Selection Indicator | div | Visual highlight when selected |
| Content Area | div | Primary content |
| Actions | div | Action buttons or shortcuts |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Normal background | Click to select |
| hover | Light background change | Visual feedback |
| selected | Highlight background | Issue shortcuts active |
| focused | Focus ring | Keyboard navigation |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | J/K to navigate, Enter to select |
| Screen reader | aria-selected, role="option" |

**Variants**:

| Variant | When to use |
|---------|-------------|
| Issue | Issue list items |
| Project | Project list items |
| Cycle | Cycle list items |

---

### Shortcut Help Table

**Purpose**: Display shortcuts organized by category

**Anatomy**:
```
+-- Shortcut Help Table ----------+
|  Category Header                |
|  +-- Row ---------------------+ |
|  |  Shortcut    Action        | |
|  +----------------------------+ |
|  +-- Row ---------------------+ |
|  |  Shortcut    Action        | |
|  +----------------------------+ |
+--------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Category Header | h3 | Category name (Global, List, Issue) |
| Row | tr | Single shortcut entry |
| Shortcut | td | Kbd component(s) |
| Action | td | Description text |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Normal table styling | Static display |
| filtered | Category highlighted | Shows only selected category |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | Not focusable (display only) |
| Target size | N/A |
| Keyboard operability | N/A (parent modal handles navigation) |
| Screen reader | Table structure with headers |

**Variants**:

| Variant | When to use |
|---------|-------------|
| Full | All shortcuts displayed |
| Filtered | Single category displayed |

---

### Settings Row

**Purpose**: Display and edit a single shortcut in settings

**Anatomy**:
```
+-- Settings Row -------------------+
|  Shortcut Name     [Kbd]  [Edit] |
+-----------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Shortcut Name | span | Action description |
| Kbd | kbd | Current key combination |
| Edit | button | Triggers edit mode |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Read-only display | Shows current shortcut |
| editing | Input active | User can press new key combo |
| conflict | Error styling | Key combination conflict |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Tab to edit button, Enter to start editing |
| Screen reader | aria-label for edit action |

**Variants**:

| Variant | When to use |
|---------|-------------|
| Default | Pre-defined shortcuts |
| Custom | User-customized shortcuts |

---

### Toast / Notification

**Purpose**: Provide feedback on shortcut actions

**Anatomy**:
```
+-- Toast ----------------+
|  Icon  Message  [Close] |
+-------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Icon | svg | Status indicator |
| Message | span | Action feedback text |
| Close | button | Dismiss toast |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| success | Green accent | Auto-dismiss after 3s |
| error | Red accent | Requires manual dismiss |
| info | Neutral accent | Auto-dismiss after 3s |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | Not focusable (auto-dismiss) |
| Target size | N/A |
| Keyboard operability | Esc to dismiss |
| Screen reader | role="status", aria-live="polite" |

**Variants**:

| Variant | When to use |
|---------|-------------|
| Success | Shortcut executed successfully |
| Error | Shortcut failed or conflict |
| Info | Shortcut registered/disabled |
