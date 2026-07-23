# Design System — Linear App Clone (Frontend)

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Grid columns | 12 | Content layout across all screens |
| Spacing cadence | 8px | Margin, padding, gap rhythm intent |
| Dense spacing | 4px | Dense data UI (tables, dashboards) |
| Max content width | 1440px | Container max-width for screens |
| Breakpoints | 640 / 768 / 1024 / 1280 | Responsive boundaries (Tailwind defaults) |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| heading-1 | Page title | 24px / 700 / 1.25 |
| heading-2 | Section title | 18px / 600 / 1.3 |
| heading-3 | Card/panel title | 15px / 600 / 1.4 |
| body | Body text | 14px / 400 / 1.5 |
| caption | Labels, metadata | 12px / 400 / 1.4 |

## Color Semantics

| Token | Role | Usage |
|-------|------|-------|
| primary | Main actions, links | Buttons (primary variant), active states |
| danger | Destructive actions | Delete, remove (danger variant) |
| success | Positive feedback | Toast success variant |
| warning | Attention | Alerts |
| neutral | Backgrounds, borders | Layout, cards (surface, border, bg) |
| text | Content | Body, headings |

## Component Catalog

### Button

**Purpose**: Trigger actions; used for delete, cancel, and retry in comment deletion flow.

**Anatomy**:
```
+-- button --------------+
|  [icon]  [label]       |
|  [spinner] (loading)   |
+------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<button>` | Inline-flex, centered content |
| icon | `<span>` | Optional, 16×16px |
| label | `<span>` | Text node |
| spinner | `<Spinner>` | Replaces icon + label when `loading` |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Filled/outline per variant | Pointer cursor |
| hover | Darker shade | — |
| active | Pressed shade | — |
| disabled | 50% opacity, no pointer-events | Tooltip on disabled action |
| loading | Spinner replaces content | Blocks interaction |

**Variants**:

| Variant | When to use |
|---------|-------------|
| danger | Delete, destructive actions |
| secondary | Cancel, dismiss |

### Toast

**Purpose**: Transient feedback after delete success or error.

**Anatomy**:
```
+-- toast ----------------------------+
| [icon]  [title]           [close]   |
|         [message]                   |
|         [action] (optional)         |
+-------------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<div role="status">` | `aria-live="polite"` |
| title | `<p>` | Bold, 14px |
| message | `<p>` | Optional subtitle |
| action | `<button>` | Optional call-to-action link |
| close | `<button>` | Dismisses toast |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| info | Primary left border | Default information |
| success | Success left border | Positive outcome (used for "Comment deleted") |
| error | Danger left border | Error feedback (used for delete failure) |

### Inline Confirmation Pattern (CommentCard)

**Purpose**: Compact confirmation prompt embedded within the comment card — replaces a modal for lightweight destructive actions.

**Anatomy**:
```
+-- Card ------------------------------+
|  [avatar]  [name]  [timestamp] [X]   |
|  [body text]                         |
|  +-- confirmation prompt ----------+ |
|  |   "Are you sure you want to      | |
|  |   delete this comment?"          | |
|  |   [Cancel] [Delete]              | |
|  +----------------------------------+ |
+---------------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| heading | `<p>` | Warning text, 14px |
| Cancel | `<Button variant="secondary" size="sm">` | Dismisses prompt |
| Delete | `<Button variant="danger" size="sm">` | Confirms deletion; shows spinner when `loading` |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| closed | Not rendered | Default comment card |
| open | Inline banner inside card | Cancel/Delete buttons visible |
| submitting | Delete button shows spinner | Both buttons disabled |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Enter/Space for buttons |
| Screen reader | Role + accessible name via aria-label or visible label |
| Escape key | Dismisses confirmation, returns focus to delete button |
| Focus management | On open: focus moves to "Delete" button; on cancel: back to delete button; on delete success: to next comment or heading |

### CommentCard (entity-level — modified)

**Purpose**: Display a single comment with actions (edit, delete).

**States**: default, editing, confirm-delete, deleting, error

| Part | Element | Notes |
|------|---------|-------|
| container | `<div>` | `role="listitem"` |
| avatar | `<span>` | Author initials |
| name | `<span>` | Author display name |
| timestamp | `<span>` | Relative time |
| edit button | `<button>` | Existing, author-only |
| delete button | `<button>` | New, author-only, `aria-label="Delete comment"` |
| body | `<p>` | Whitespace-pre-wrap text |
| confirmation | Inline pattern | Replaces action buttons area when open |
| error | `<p role="alert">` | Shown on delete failure |

### CommentList (entity-level — modified)

**Purpose**: Render list of CommentCard components.

| Part | Element | Notes |
|------|---------|-------|
| heading | `<h3>` | "Comments ({count})" |
| list | `<div role="list">` | Space-y-3 gap |
| item | `<div role="listitem">` | Wraps each CommentCard |
| empty state | `<EmptyState>` | Shown when no comments exist |
