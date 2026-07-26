# Design System — Linear App Clone

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Grid columns | 12 | Content layout across all screens |
| Spacing cadence | 8px | Margin, padding, gap rhythm intent |
| Dense spacing | 4px | Dense data UI (tables, dashboards) |
| Max content width | 1280px | Container max-width for screens |
| Breakpoints | 480px / 768px / 1024px | Responsive boundaries (mobile / tablet / desktop) |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| heading-1 | Page title | 24px / 600 weight / 32px line-height |
| heading-2 | Section title | 20px / 600 weight / 28px line-height |
| heading-3 | Card/panel title | 16px / 600 weight / 24px line-height |
| body | Body text | 14px / 400 weight / 20px line-height |
| caption | Labels, metadata | 12px / 400 weight / 16px line-height |

## Color Semantics

| Token | Role | Usage |
|-------|------|-------|
| primary | Main actions, links | Buttons, active states, focused elements |
| danger | Destructive actions | Delete, remove, error states |
| success | Positive feedback | Success states, completed actions |
| warning | Attention | Alerts, warning states |
| neutral | Backgrounds, borders | Layout, cards, subtle dividers |
| text | Content | Body text, headings |

*Exact hex values defined in the hi-fi pass. This schema captures intent.*

## Component Catalog

### Button

**Purpose**: Primary interactive element for user actions.

**Anatomy**:
```
+-------------------+
|  [Icon] Label     |
+-------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Container | button | Wraps icon and label |
| Icon | span | Optional leading icon |
| Label | span | Text content |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Solid primary color background | Clickable |
| hover | Darkened primary background | — |
| active | Pressed state | — |
| disabled | Muted color, reduced opacity | Not interactive, tooltip on hover |
| loading | Spinner replaces icon | Blocks interaction |
| error | Danger color background | — |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Enter/Space to activate |
| Screen reader | Role button + accessible name |

**Variants**:

| Variant | When to use |
|---------|-------------|
| primary | Main call-to-action |
| secondary | Alternative actions |
| danger | Destructive operations |
| ghost | Inline actions, minimal visual weight |

---

### Input

**Purpose**: Text input field for user data entry.

**Anatomy**:
```
+---------------------------+
|  Label                    |
|  +----------------------+ |
|  |  [Icon] Placeholder  | |
|  +----------------------+ |
|  Helper text              |
+---------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Label | label | Field description |
| Container | div | Wraps input element |
| Icon | span | Optional leading icon |
| Input | input | Text entry field |
| Helper | span | Validation or help text |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Neutral border | Focusable |
| hover | Slight border darkening | — |
| focus | Primary border, ring | Active input |
| disabled | Muted background | Not interactive |
| error | Danger border | Validation message below |
| success | Success border | — |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA for labels and text |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px |
| Keyboard operability | Tab to focus, type to input |
| Screen reader | Label associated via htmlFor, aria-describedby for helpers |

**Variants**:

| Variant | When to use |
|---------|-------------|
| text | Standard text input |
| search | Search fields with magnifier icon |
| number | Numeric input with validation |

---

### Card

**Purpose**: Container for grouping related content and actions.

**Anatomy**:
```
+---------------------------+
|  Header                   |
|  +----------------------+ |
|  |  Title     [Actions] | |
|  +----------------------+ |
|  Body                     |
|  +----------------------+ |
|  |  Content             | |
|  +----------------------+ |
|  Footer (optional)       |
+---------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Container | article | Semantic wrapper |
| Header | div | Title and optional actions |
| Body | div | Main content area |
| Footer | div | Optional metadata or actions |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Neutral border, white background | Clickable if interactive |
| hover | Subtle shadow elevation | — |
| selected | Primary border | — |
| disabled | Muted background | — |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | Visible 2px ring if interactive |
| Target size | ≥24×24 CSS px for interactive areas |
| Keyboard operability | Tab to focus, Enter to select if interactive |
| Screen reader | Role article or group, heading for title |

**Variants**:

| Variant | When to use |
|---------|-------------|
| default | Standard content grouping |
| interactive | Clickable cards for navigation |
| compact | Dense layouts (lists, sidebars) |

---

### Modal

**Purpose**: Overlay dialog for focused user interactions.

**Anatomy**:
```
+----------------------------------+
|  Backdrop                        |
|  +----------------------------+ |
|  |  Dialog                    | |
|  |  +----------------------+ | |
|  |  |  Header    [Close]   | | |
|  |  +----------------------+ | |
|  |  |  Body                | | |
|  |  +----------------------+ | |
|  |  |  Footer   [Cancel] [OK] | |
|  |  +----------------------+ | |
|  +----------------------------+ |
+----------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Backdrop | div | Semi-transparent overlay |
| Dialog | div | Main modal container |
| Header | header | Title and close button |
| Body | main | Content area |
| Footer | footer | Action buttons |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| closed | Not visible | — |
| open | Visible with backdrop | Focus trapped inside |
| loading | Spinner in body | Blocks actions |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | Focus trapped within modal |
| Keyboard operability | Escape to close, Tab cycles within |
| Screen reader | Role dialog, aria-modal, aria-labelledby |
| Focus restoration | Return focus to trigger on close |

**Variants**:

| Variant | When to use |
|---------|-------------|
| confirmation | Destructive action confirmation |
| form | Data entry forms |
| informational | Display information |

---

### Dropdown

**Purpose**: Contextual menu or selection list.

**Anatomy**:
```
+-------------------+
|  Trigger Element  |
+-------------------+
|  +--------------+ |
|  |  Option 1    | |
|  |  Option 2    | |
|  |  Option 3    | |
|  +--------------+ |
+-------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Trigger | button | Opens dropdown |
| Menu | ul | List container |
| Option | li | Individual items |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| closed | Only trigger visible | — |
| open | Menu visible below trigger | Arrow keys navigate |
| highlighted | Background color on item | — |
| disabled | Muted text | Not selectable |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | Visible ring on trigger and items |
| Keyboard operability | Arrow keys, Enter to select, Escape to close |
| Screen reader | aria-haspopup, aria-expanded, role menu |
| Focus management | Focus returns to trigger on close |

**Variants**:

| Variant | When to use |
|---------|-------------|
| action menu | Contextual actions (edit, delete) |
| select | Single selection from options |
| multi-select | Multiple selections with checkboxes |

---

### Badge

**Purpose**: Status indicator and notification counter.

**Anatomy**:
```
+-----------+
|  Content  |
+-----------+
```

| Part | Element | Notes |
|------|---------|-------|
| Container | span | Wraps content |
| Content | span | Text or count |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Solid background color | Static display |
| success | Green background | Positive status |
| warning | Yellow background | Attention needed |
| danger | Red background | Critical status |
| neutral | Gray background | Default or inactive |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA for text on background |
| Screen reader | aria-label for notification counts |

**Variants**:

| Variant | When to use |
|---------|-------------|
| status | Issue/project status |
| count | Notification count |
| label | Categorical label |

---

### Avatar

**Purpose**: User identity representation.

**Anatomy**:
```
+-----------+
|  Image /  |
|  Initials |
+-----------+
```

| Part | Element | Notes |
|------|---------|-------|
| Container | span | Circular wrapper |
| Image | img | User photo |
| Fallback | span | Initials if no image |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Circular image or initials | Static |
| online | Green dot indicator | — |
| offline | No indicator | — |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA for initials |
| Screen reader | alt text or aria-label with user name |

**Variants**:

| Variant | When to use |
|---------|-------------|
| small | Inline with text (16px) |
| medium | Cards and lists (32px) |
| large | Profiles and headers (48px) |

---

### Comment Thread

**Purpose**: Display chronological list of comments on an issue.

**Anatomy**:
```
+---------------------------+
|  Comment 1                |
|  +----------------------+ |
|  |  Avatar  Content     | |
|  +----------------------+ |
|  Comment 2                |
|  +----------------------+ |
|  |  Avatar  Content     | |
|  +----------------------+ |
|  Add Comment Input        |
+---------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Thread | section | Semantic container |
| Comment | article | Individual comment |
| Avatar | Avatar component | User representation |
| Content | div | Comment body |
| Input | Input component | New comment entry |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| empty | Placeholder message | — |
| populated | List of comments | Scrollable |
| loading | Skeleton placeholders | — |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Keyboard operability | Tab through comments and input |
| Screen reader | region landmark, each comment announced |
| Focus management | New comment receives focus after submit |

**Variants**:

| Variant | When to use |
|---------|-------------|
| threaded | Nested replies |
| flat | Simple linear list |

---

### Status Badge

**Purpose**: Display issue or entity status with color coding.

**Anatomy**:
```
+-------------------+
|  [Dot] Label      |
+-------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Container | span | Wraps dot and label |
| Dot | span | Color indicator |
| Label | span | Status text |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| backlog | Gray dot | — |
| todo | Blue dot | — |
| in_progress | Yellow dot, animated | — |
| done | Green dot | — |
| cancelled | Red dot | — |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA for text |
| Screen reader | Status announced with aria-label |
| Not color-only | Text label always present |

**Variants**:

| Variant | When to use |
|---------|-------------|
| compact | Inline in text |
| full | Standalone display |

---

### Notification Badge

**Purpose**: Header badge showing unread notification count.

**Anatomy**:
```
+-----------+
|  Count    |
+-----------+
```

| Part | Element | Notes |
|------|---------|-------|
| Container | span | Positioned over icon |
| Count | span | Numeric count |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| zero | Hidden | — |
| positive | Red background, white text | Increments on new event |
| overflow | 99+ display | — |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Screen reader | "N unread notifications" |
| Not color-only | Count text always visible |

**Variants**:

| Variant | When to use |
|---------|-------------|
| dot | Simple presence indicator |
| count | Numeric count display |
