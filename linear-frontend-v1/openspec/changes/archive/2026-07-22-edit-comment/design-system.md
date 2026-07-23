# Design System — Edit Comment

## Component Catalog

### CommentCard (augmented)

**Purpose**: Display a single comment. When the current user authored it, also provide inline edit capability.

**Anatomy**:
```
+-- card -------------------------+
|  +- avatar -+ body -----------+ |
|  |  [A]     |  Author Name 3m | |
|  |          |  [pencil]       | |
|  +----------+-----------------+ |
|  |  Comment body text…         | |
|  |                             | |
|  +-- edit-mode (conditional) -+ |
|  |  [textarea…………………]        | |
|  |  [Save]  [Cancel]          | |
|  +----------------------------+ |
+---------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| card | `<div>` | Container with border, rounded corners, background |
| avatar | `<span>` | Circular initial-letter avatar |
| author name | `<span>` | Bold text |
| timestamp | `<span>` | Muted small text |
| body | `<p>` | Whitespace-preserving text body |
| edit button | `<button>` | Pencil icon; visible only when `comment.authorId === currentUserId` |
| textarea | `<textarea>` | Replaces body in edit mode; pre-filled with current body |
| save button | `<button>` | Primary variant; submits the edit |
| cancel button | `<button>` | Ghost variant; reverts to display mode |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| display (default) | Shows avatar, name, timestamp, body, and edit button (if author) | — |
| display (non-author) | Same as default but no edit button | — |
| editing | Body replaced by textarea, save + cancel buttons visible, edit pencil hidden | Textarea auto-focused |
| saving | Save button shows loading spinner, textarea and buttons disabled | PATCH request in flight |
| error after save | Error toast shown; textarea preserves unsaved edits | Save button re-enabled, cancel still available |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px |
| Keyboard operability | Enter/Space for buttons; Escape to cancel edit |
| Screen reader | `aria-label="Edit comment"` on edit button; `aria-label="Save comment"` on save; `aria-label="Cancel edit"` on cancel |

**Variants**:

| Variant | When to use |
|---------|-------------|
| display | Default — viewing comments |
| editing | Author clicked the edit button |

---

### Button (existing — referenced here for completeness)

**Purpose**: Trigger actions. Referenced by edit/save/cancel buttons in CommentCard.

| Variant | Usage in this change |
|---------|----------------------|
| primary (sm) | Save button in edit mode |
| ghost (sm) | Cancel button in edit mode |
| tertiary (sm) | Edit pencil button on comment card |

---

### Textarea (editor)

**Purpose**: Multiline text input for editing comment body.

| Part | Element | Notes |
|------|---------|-------|
| textarea | `<textarea>` | Full width, 2-4 rows visible, match border/radius of existing forms |

| State | Behaviour |
|-------|-----------|
| default | Border, focus ring on focus |
| disabled | Greyed out during save |
| error | Red border on validation failure |

**Accessibility Contract**:

| Concern | Commitment |
|---------|------------|
| Keyboard operability | Tab to focus, type, Tab away |
| Screen reader | Associated label or `aria-label="Edit comment body"` |
