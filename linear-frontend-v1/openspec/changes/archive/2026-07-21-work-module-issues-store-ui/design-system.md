# Design System — Linear App Clone (Work Module)

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Grid columns | 12 | Content layout across all screens |
| Spacing cadence | 8px | Margin, padding, gap rhythm |
| Dense spacing | 4px | Dense data UI (issue lists, tables) |
| Max content width | 1440px | Container max-width for screens |
| Breakpoints | 768px / 1024px | Mobile / Tablet / Desktop |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| heading-1 | Page title | 24px / 700 / 1.3 |
| heading-2 | Section title | 18px / 600 / 1.4 |
| heading-3 | Card/panel title | 14px / 600 / 1.4 |
| body | Body text | 14px / 400 / 1.5 |
| caption | Labels, metadata | 12px / 400 / 1.4 |
| identifier | Issue ID (ENG-123) | 12px / 500 / 1.4 / monospace |

## Color Semantics

| Token | Role | Usage |
|-------|------|-------|
| primary | Main actions, links | Buttons, active states, selected filter |
| danger | Destructive actions | Delete issue, remove label |
| success | Positive feedback | Status "Done", success toast |
| warning | Attention | Status "In Progress" |
| neutral | Backgrounds, borders | Cards, list rows, dividers |
| text | Content | Body, headings |
| text-muted | Secondary content | Metadata, timestamps, placeholders |

*Exact hex values defined in the hi-fi pass. This schema captures intent.*

## Component Catalog

### Button

**Purpose**: Trigger actions — create, save, cancel, delete

**Anatomy**:
```
+-- button ---------+
|  [icon] label     |
+-------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<button>` | Clickable region |
| icon | `<svg>` | Optional leading icon |
| label | `<span>` | Text content |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Filled or outline | Cursor pointer |
| hover | Slightly darker bg | — |
| active | Pressed inset shadow | — |
| disabled | 50% opacity | Pointer events none, tooltip on long press |
| loading | Spinner replaces icon | Button disabled during operation |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Enter/Space |
| Screen reader | Role `button` + accessible name via label or aria-label |

**Variants**:

| Variant | When to use |
|---------|-------------|
| primary | Main action (Create issue, Save) |
| secondary | Secondary action (Cancel) |
| danger | Destructive action (Delete) |
| ghost | Subtle action (Edit, filter clear) |

---

### Input

**Purpose**: Text field for form input (title, description, search)

**Anatomy**:
```
+-- input-wrapper --+
|  label            |
|  +-- input ----+ |
|  |              | |
|  +-------------+ |
|  error-message    |
+-------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| wrapper | `<div>` | Groups label + input + error |
| label | `<label>` | Associated via `for` attribute |
| input | `<input>` or `<textarea>` | Text entry |
| error | `<span>` | Validation message, linked via `aria-describedby` |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | 1px border, white bg | — |
| focus | 2px primary border ring | — |
| hover | Slightly darker border | — |
| disabled | 50% opacity | Not editable |
| error | Red border | Validation message visible below |

**Accessibility Contract**: Standard DS contract + error message linked via `aria-describedby`.

---

### Select

**Purpose**: Dropdown for filter selection (status, assignee, project, cycle)

**Anatomy**:
```
+-- select-wrapper -+
|  label            |
|  +-- select ----+ |
|  | value  [▼]   | |
|  +--------------+ |
|  dropdown-list     |
+--------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| trigger | `<button>` | Shows current value, opens dropdown |
| value | `<span>` | Selected option label |
| chevron | `<svg>` | Expand indicator |
| dropdown | `<ul>` | Options list with role="listbox" |
| option | `<li>` | Selectable option with role="option" |

**States**: default, focus, hover, disabled, open

---

### Badge

**Purpose**: Status and priority indicator for issues

**Anatomy**:
```
+-- badge ------+
|  label        |
+---------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<span>` | Inline element |
| dot (optional) | `<span>` | Colored circle for status |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Rounded pill, colored bg | Static display |
| clickable | Cursor pointer | Opens status/priority menu |

**Variants**:

| Variant | When to use |
|---------|-------------|
| status-todo | Grey | 
| status-in-progress | Blue |
| status-done | Green |
| priority-urgent | Red |
| priority-high | Orange |
| priority-medium | Yellow |
| priority-low | Grey |

---

### Avatar

**Purpose**: Display user or assignee image

**Anatomy**:
```
+-- avatar --------+
|  [image]         |
|  or initials     |
+-------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<span>` | Circular clipping |
| image | `<img>` | User photo |
| fallback | `<span>` | Initials when no image |

**States**: default

**Sizes**:

| Size | Diameter | When to use |
|------|----------|-------------|
| sm | 20px | Inline in IssueCard |
| md | 32px | IssueDetail assignee |
| lg | 40px | User menu |

---

### Modal

**Purpose**: Overlay dialog for IssueForm (create/edit), confirmation

**Anatomy**:
```
+-- backdrop --------+
|  +-- modal ------+ |
|  | header  [×]   | |
|  | body           | |
|  | footer         | |
|  +----------------+ |
+---------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| backdrop | `<div>` | Semi-transparent overlay, closes on click |
| container | `<div>` | Dialog, role="dialog", aria-modal="true" |
| header | `<div>` | Title + close button |
| close | `<button>` | aria-label="Close" |
| body | `<div>` | Form content |
| footer | `<div>` | Action buttons |

**States**: open (visible with backdrop), closed (hidden)

**Accessibility Contract**: Focus trapped inside, Esc closes, initial focus on first input, restore focus on close.

---

### IssueCard

**Purpose**: Compact single-issue display in list views

**Anatomy**:
```
+-- card ------------+
|  [checkbox] ID     |
|  Title text          |
|  [Status] [Priority]|
|  Assignee avatar    |
+---------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<div>` | role="button", clickable, focusable |
| identifier | `<span>` | ENG-123, monospace |
| title | `<span>` | Issue title |
| status badge | Badge | Status indicator |
| priority badge | Badge | Priority indicator |
| assignee | Avatar | Optional, right-aligned |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | White bg, border | — |
| hover | Subtle bg shift | — |
| selected | Primary left border | Active in list |
| focused | Focus ring | Keyboard navigation |

---

### IssueList

**Purpose**: Filtered, scrollable list of IssueCards

**Anatomy**:
```
+-- list-container -+
|  [filters bar]    |
|  card             |
|  card             |
|  card             |
|  [pagination]     |
+--------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<div>` | Scrollable overflow |
| list | `<ul>` | IssueCard items |
| empty state | `<div>` | "No issues yet" + create button |
| loading state | `<div>` | Skeleton placeholders |

**States**: loading (skeleton rows), empty (message + CTA), populated, error (retry button)

---

### IssueDetail

**Purpose**: Full issue view with metadata, description, comments

**Anatomy**:
```
+-- detail-container +
|  [back button]     |
|  Title              |
|  Identifier         |
|  +-- metadata ----+|
|  | Status Assignee||
|  | Priority Labels||
|  +----------------+|
|  Description        |
|  +-- comments ----+|
|  | CommentCard    ||
|  | CommentCard    ||
|  +----------------+|
|  [Add comment]     |
+--------------------+
```

**States**: loading, populated, not-found, error

---

### IssueFilters

**Purpose**: Filter bar to narrow issue list

**Anatomy**:
```
+-- filters-bar -----+
|  Status [▼]        |
|  Assignee [▼]      |
|  Project [▼]       |
|  Cycle [▼]         |
|  Labels [▼]        |
|  [Clear all]       |
+---------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<div>` | Horizontal bar, wraps on mobile |
| filter selects | Select | Each filter is a Select component |
| clear button | Button | Ghost variant, visible when any filter active |

**States**: default (no active filters), active (some filters set)

---

### IssueForm

**Purpose**: Create/edit issue form in modal

**Anatomy**:
```
+-- modal body ------+
|  Title [input]     |
|  Description [area]|
|  Status [select]   |
|  Priority [select] |
|  Assignee [select] |
|  Labels [multi]    |
|  [Cancel] [Save]   |
+---------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| title | Input | Required, max 255 |
| description | Textarea | Optional, max 50000 |
| status | Select | Todo by default |
| priority | Select | No Priority by default |
| assignee | Select | User search |
| labels | Multi-select | Label tags with remove |
| footer | Button group | Cancel + Save (primary) |

**States**: create (empty), edit (pre-filled), submitting (disabled), validation-error

### ConfirmDeleteDialog

**Purpose**: Confirmation before deleting an issue

**Anatomy**:
```
+-- modal body ------+
|  Delete issue?     |
|  "Issue title"     |
|  This cannot be    |
|  undone.           |
|  [Cancel] [Delete] |
+---------------------+
```

**States**: default, submitting (delete button spins)
