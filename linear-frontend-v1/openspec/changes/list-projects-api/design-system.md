# Design System — Linear App Clone Frontend

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Grid columns | 12 | Content layout across all screens |
| Spacing cadence | 8px | Margin, padding, gap rhythm intent |
| Dense spacing | 4px | Dense data UI (tables, dashboards) |
| Max content width | 1280px | Container max-width for screens |
| Breakpoints | mobile: 640px / tablet: 1024px / desktop: 1280px+ | Responsive boundaries |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| heading-1 | Page title | 32px / 600 / 40px |
| heading-2 | Section title | 24px / 600 / 32px |
| heading-3 | Card/panel title | 18px / 600 / 24px |
| body | Body text | 14px / 400 / 20px |
| caption | Labels, metadata | 12px / 400 / 16px |

## Color Semantics

| Token | Role | Usage |
|-------|------|-------|
| primary | Main actions, links | Buttons, active states |
| danger | Destructive actions | Delete, remove |
| success | Positive feedback | Success states |
| warning | Attention | Alerts |
| neutral | Backgrounds, borders | Layout, cards |
| text | Content | Body, headings |

*Exact hex values defined in the hi-fi pass. This schema captures intent.*

## Component Catalog

### ProjectList

**Purpose**: Container component rendering a scrollable list of ProjectCard components with loading, empty, error, and success states.

**Anatomy**:
```
+-- ProjectList -------------+
|  +-- StatusFilter        |
|  +-- ProjectCard (x N)   |
|  +-- LoadingSpinner      |
|  +-- ErrorMessage        |
|  +-- EmptyState          |
+---------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| StatusFilter | `<select>` | Top-right filter control |
| ProjectCard | `<article>` | Repeated for each project |
| LoadingSpinner | `<div>` | Shown during fetch |
| ErrorMessage | `<div>` | Shown on error |
| EmptyState | `<div>` | Shown when no projects |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| loading | Spinner centered | Blocks interaction until resolved |
| populated | List of cards | Scrollable, supports infinite scroll |
| empty | "No projects found" message | Shown when data array is empty |
| error | Error message + retry button | Allows user to retry fetch |
| success | Projects rendered | Final state after successful fetch |

**Accessibility Contract (DS-owned)**:

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Tab through cards, Enter for selection |
| Screen reader | `aria-live="polite"` for loading/error status |

**Variants**:

| Variant | When to use |
|---------|-------------|
| default | Standard project list with filters |
| compact | Dense view for dashboards |

---

### ProjectCard

**Purpose**: Displays a single project's name, status, and metadata in the project list.

**Anatomy**:
```
+-- ProjectCard --------------+
|  +-- ProjectTitle          |
|  +-- ProjectStatus         |
|  +-- ProjectMeta           |
+-----------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| ProjectTitle | `<h3>` | Project name |
| ProjectStatus | `<span>` | Status badge (planned, in_progress, completed, canceled) |
| ProjectMeta | `<div>` | Issue count, due date, etc. |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Card with border | Hover shows shadow |
| hover | Elevated shadow | Click navigates to project detail |
| active | Pressed state | Navigation triggered |
| disabled | Muted opacity | Not clickable when archived |

**Accessibility Contract (DS-owned)**:

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Enter/Space navigates to detail |
| Screen reader | Role="article" with aria-label of project name |

**Variants**:

| Variant | When to use |
|---------|-------------|
| default | Active project |
| archived | Project with canceled status |

---

### StatusFilter

**Purpose**: Dropdown select allowing the user to filter projects by status.

**Anatomy**:
```
+-- StatusFilter ---+
|  +-- Label        |
|  +-- Select       |
|  +-- Options      |
+--------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Label | `<label>` | "Filter by status" |
| Select | `<select>` | Native or custom dropdown |
| Options | `<option>` | planned, in_progress, completed, canceled, all |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Collapsed dropdown | Shows current filter or placeholder |
| expanded | Options visible | User can select a status |
| focused | Focus ring | Keyboard navigation active |
| disabled | Muted opacity | During loading state |

**Accessibility Contract (DS-owned)**:

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Arrow keys to navigate options, Enter to select |
| Screen reader | Label associated via `for`/`id` pairing |

**Variants**:

| Variant | When to use |
|---------|-------------|
| default | Standard filter dropdown |
| compact | In dense layouts |

---

### LoadingSpinner

**Purpose**: Visual indicator shown while projects are being fetched.

**Anatomy**:
```
+-- LoadingSpinner ---+
|  +-- Spinner        |
|  +-- Label          |
+----------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Spinner | `<div>` | Animated circle |
| Label | `<span>` | "Loading projects..." |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Spinning animation | Blocks interaction |
| loading | Active spin | aria-live="polite" announces status |

**Accessibility Contract (DS-owned)**:

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Not focusable (decorative) |
| Target size | N/A (decorative) |
| Keyboard operability | N/A (decorative) |
| Screen reader | `aria-live="polite"` with "Loading projects..." |

**Variants**:

| Variant | When to use |
|---------|-------------|
| default | Centered in list container |
| inline | Small spinner next to text |

---

### ErrorMessage

**Purpose**: Displays an error message with an optional retry action.

**Anatomy**:
```
+-- ErrorMessage ---+
|  +-- Icon          |
|  +-- Message       |
|  +-- RetryButton   |
+---------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Icon | `<svg>` | Warning/error icon |
| Message | `<p>` | Error description |
| RetryButton | `<button>` | Retry fetch |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Red border, icon | Shows error text |
| hover (retry) | Button hover state | Cursor pointer |
| focused (retry) | Focus ring | Keyboard accessible |

**Accessibility Contract (DS-owned)**:

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Enter/Space on retry button |
| Screen reader | `role="alert"` for error message |

**Variants**:

| Variant | When to use |
|---------|-------------|
| default | Full-width error in list container |
| inline | Small error below a field |

---

### EmptyState

**Purpose**: Displays a message when no projects are found.

**Anatomy**:
```
+-- EmptyState ---+
|  +-- Icon        |
|  +-- Title       |
|  +-- Description |
+-------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Icon | `<svg>` | Empty/inbox icon |
| Title | `<h3>` | "No projects found" |
| Description | `<p>` | "Try adjusting your filters" |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Centered content | Shown when data array is empty |

**Accessibility Contract (DS-owned)**:

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | N/A (static content) |
| Target size | N/A (static content) |
| Keyboard operability | N/A (static content) |
| Screen reader | `aria-live="polite"` announces empty state |

**Variants**:

| Variant | When to use |
|---------|-------------|
| default | Standard empty state in list container |