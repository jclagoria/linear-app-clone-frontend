# Design System — Linear App Clone

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Grid columns | 12 | Content layout across all screens |
| Spacing cadence | 8px | Margin, padding, gap rhythm |
| Dense spacing | 4px | Dense data UI (label badges, filters) |
| Max content width | 1200px | Container max-width for screens |
| Breakpoints | 640px / 768px / 1024px / 1280px | Responsive boundaries |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| heading-1 | Page title | 24px / bold / 1.3 |
| heading-2 | Section title | 18px / semibold / 1.4 |
| heading-3 | Card/panel title | 16px / semibold / 1.4 |
| body | Body text | 14px / normal / 1.5 |
| caption | Labels, metadata | 12px / medium / 1.4 |

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

### LabelBadge

**Purpose**: Renders a single label name as a compact pill badge with optional remove affordance.

**Anatomy**:
```
+-- badge --------------+
|  [label name]    [X]  |
+-----------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| badge | `span` or custom | Rounded-full pill |
| label text | `span` | Label name |
| remove button | `button` | Only rendered when `removable=true` |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Filled pill with label text | Static display |
| removable | Same + X icon button at trailing edge | Click X fires `onRemove` |
| hover (remove btn) | X icon darkens | — |
| disabled | Reduced opacity | Remove button disabled during API call |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | Minimum 24×24 CSS px for remove button |
| Keyboard operability | Enter/Space on remove button |
| Screen reader | `role="listitem"` on badge; remove button has `aria-label="Remove {name} label"` |

**Variants**:

| Variant | When to use |
|---------|-------------|
| default | Solid pill with primary/10 background |
| removable | Adds X icon button for detach action |

---

### LabelList

**Purpose**: Composes LabelBadge components into a labelled section with empty, loading, and error states.

**Anatomy**:
```
+-- container ------------+
|  [LabelBadge] [X]       |
|  [LabelBadge] [X]       |
|  [+ Add label]          |
+-------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `div` | Flex wrap container with `gap-1` |
| badges | `LabelBadge[]` | Rendered with `removable=true` |
| add button | `Button` | Ghost variant, "+ Add label" label |
| empty state | `p` | "No labels" text when list is empty |
| error state | `ErrorBanner` | Shows fetch error with retry |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| loading | `SkeletonLoader` shapes | Placeholder while labels fetch |
| empty | "No labels" text + [+ Add label] button | Prompt to attach first label |
| populated | LabelBadge items + [+ Add label] button | Normal display |
| error | `ErrorBanner` with retry | Fetch failure |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px |
| Keyboard operability | Tab through badges; Enter/Space on remove |
| Screen reader | `role="list"` on container, `aria-label="Issue labels"` |

**Variants**: None (single usage context).

---

### LabelPicker

**Purpose**: Dropdown popover for searching and selecting from available label definitions.

**Anatomy**:
```
+-- popover ----------------+
|  [Search input]           |
|  ---                      |
|  [x] bug                  |
|  [ ] frontend             |
|  [ ] enhancement          |
|  ...                      |
+---------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| trigger | `Button` | "+ Add label" ghost button |
| popover | `div` | Absolute-positioned panel |
| search input | `TextInput` | Filters available labels by name |
| option list | `div[role="listbox"]` | Checkable rows |
| option row | `div[role="option"]` | Checkbox + label name |
| empty state | `p` | "No labels found" when search yields no results |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| closed | Trigger button visible | — |
| open-populated | Panel with label rows | Focus trapped; type to filter |
| open-empty | Panel with "No labels found" | No labels match search or no labels exist |
| selecting | Checkbox toggles on click | Optimistic; fires `onSelect` |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px |
| Keyboard operability | Arrow keys navigate options; Enter/Space to select; Escape to close |
| Screen reader | `role="listbox"` with `aria-label="Select a label"`; `aria-selected` on option rows |

**Variants**: None.

---

### Toast

**Purpose**: Transient notification for success, error, and informational messages.

**Anatomy**:
```
+-- toast ------------+
|  [icon]  [message]  |
+---------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `div` | Fixed-position bottom-right stack |
| wrapper | `div` | Individual toast with `role="alert"` |
| icon | `div` | Success/error/warning icon |
| message | `p` | Toast body text |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| success | Green accent border | Auto-dismiss after 3s |
| error | Red accent border | Auto-dismiss after 5s |
| info | Blue accent border | Auto-dismiss after 3s |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | Not focusable (transient) |
| Screen reader | `role="alert"` on each toast, `aria-live="polite"` on container |

**Variants**:

| Variant | When to use |
|---------|-------------|
| `success` | Operation completed |
| `error` | Operation failed |

---

### Button (existing — extended for labels)

**Purpose**: Triggers actions. Existing component with ghost variant for inline label actions.

**States**: default, hover, active, disabled, loading.

**Label-specific usage**:
| Variant | Usage |
|---------|-------|
| `ghost` | "Add label" inline trigger; remove (X) on label badges |
| `primary` | "Save" in form submit |

---

### ErrorBanner (existing)

**Purpose**: Displays error messages with optional dismiss/retry. Used in LabelList error state.

**States**: server error, validation error.

---

### SkeletonLoader (existing)

**Purpose**: Placeholder shapes during loading. Used in LabelList loading state.

---

### TextInput (existing)

**Purpose**: Text input field. Used in LabelPicker search input.

---

### Select (existing — extended for form labels)

**Purpose**: Dropdown selection. Issue form uses Select for label multi-selection (currently as string[]).

**Label-specific addition**: Multi-select variant for `labelIds` in IssueForm.
