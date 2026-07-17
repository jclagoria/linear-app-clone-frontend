# Design System — Linear App Clone

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Grid columns | 12 | Content layout across all screens |
| Spacing cadence | 4px | Margin, padding, gap rhythm |
| Dense spacing | 4px | Dense data UI (issue list, tables) |
| Max content width | 1440px | Container max-width for screens |
| Sidebar width | 240px | Collapsed: 56px |
| Breakpoints | 640 / 768 / 1024 / 1280 | Responsive boundaries |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| heading-1 | Page title | 24px / 700 / 1.3 |
| heading-2 | Section title | 18px / 600 / 1.4 |
| heading-3 | Card/panel title | 14px / 600 / 1.4 |
| body | Body text | 14px / 400 / 1.5 |
| body-small | Dense data rows | 13px / 400 / 1.4 |
| caption | Labels, metadata | 12px / 500 / 1.3 |
| mono | Code, IDs, hashes | 13px / 400 / 1.4 (SF Mono / JetBrains Mono) |

## Color Semantics

| Token | Role | Usage |
|-------|------|-------|
| primary | Main actions, links | Buttons, active states, selected row |
| danger | Destructive actions | Delete, remove, error borders |
| success | Positive feedback | Success states, connected indicator |
| warning | Attention | Alerts, at-risk status |
| neutral | Backgrounds, borders | Layout, cards, dividers |
| text | Content | Body, headings |
| text-secondary | Metadata | Secondary labels, placeholders |

*Exact hex values defined in the hi-fi pass. This schema captures intent.*

## Component Catalog

### LoadingSkeleton

**Purpose**: Placeholder while data is loading — one skeleton per entity shape.

**Anatomy**:
```
+-- skeleton-row -----------+
|  [=====]  [========]      |
+---------------------------+
|  [===================]    |
+---------------------------+
|  [==========]  [====]     |
+---------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| skeleton-row | `div` | Animated pulse gradient, height matches content |
| skeleton-block | `div` | Variable width via inline style |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Gray pulse animation | Replaces content during loading |
| loaded | Removed from DOM | Real content rendered |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Not focusable — inert placeholder |
| Target size | N/A (no interaction) |
| Keyboard operability | N/A |
| Screen reader | `aria-hidden="true"` + `aria-busy="true"` on parent |

**Variants**:

| Variant | When to use |
|---------|-------------|
| row | Issue list rows, project cards |
| card | Detail panels, modal content |
| text | Inline text replacement |

---

### EmptyState

**Purpose**: Displayed when a collection has no items — provides guidance or a call to action.

**Anatomy**:
```
+-- empty-state ------------+
|  [icon]                   |
|  Title                    |
|  Description text         |
|  [Action button] (opt)    |
+---------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| icon | `svg` | Lucide icon, muted color |
| title | `h3` | heading-3 typography |
| description | `p` | body typography |
| cta | `button` | Optional primary button |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Centered layout with icon + text | No interaction |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | 2px ring offset 2px on CTA button |
| Target size | CTA button ≥24×24 CSS px |
| Keyboard operability | CTA button: Enter/Space |
| Screen reader | Role `region` with `aria-label="No items"` |

**Variants**:

| Variant | When to use |
|---------|-------------|
| no-issues | "No issues match your filters" |
| no-results | "No search results" |
| no-projects | "No projects yet" |

---

### ErrorBanner

**Purpose**: Display error feedback — inline in a panel or as a page-level banner.

**Anatomy**:
```
+-- error-banner -----------+
|  [!]  Error message       |
|          [Dismiss] (opt)  |
+---------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| icon | `svg` | Alert circle, danger color |
| message | `p` | body typography, description of issue |
| dismiss | `button` | Optional close action |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Danger-colored background + border | Dismissible or persistent |
| dismissed | Removed from DOM | — |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | 2px ring offset 2px on dismiss |
| Target size | Dismiss button ≥24×24 CSS px |
| Keyboard operability | Dismiss: Enter/Space |
| Screen reader | `role="alert"` for live region |

**Variants**:

| Variant | When to use |
|---------|-------------|
| inline | Inside a card or panel |
| banner | Full-width at top of page |

---

### NotificationBadge

**Purpose**: Unread notification count indicator.

**Anatomy**:
```
+-- badge ----+
|  3          |
+-------------+
```

| Part | Element | Notes |
|------|---------|-------|
| count | `span` | Number or dot, primary color |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| has-unread | Filled primary background with count | — |
| empty | Hidden | No badge rendered |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | N/A (parent element focusable) |
| Target size | N/A (part of parent) |
| Keyboard operability | N/A |
| Screen reader | `aria-label="{count} unread notifications"` |

**Variants**:

| Variant | When to use |
|---------|-------------|
| dot | Minimal — just an indicator |
| count | Numeric — shows exact unread count |

---

### ConnectionIndicator

**Purpose**: WebSocket connection status indicator.

**Anatomy**:
```
+-- indicator --------------+
|  [●] Connected / [○] Off  |
+---------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| dot | `span` | Colored circle via CSS |
| label | `span` | Status text |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| connected | Green dot + "Connected" | Stable connection |
| connecting | Yellow dot + "Connecting" | Pending |
| disconnected | Gray dot + "Disconnected" | No connection |
| reconnecting | Yellow dot + "Reconnecting..." | Auto-retry in progress |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | N/A |
| Target size | N/A |
| Keyboard operability | N/A |
| Screen reader | `aria-live="polite"` on status text |

**Variants**:

| Variant | When to use |
|---------|-------------|
| header | In header bar, compact |
| settings | In connection settings, expanded with details |

---

### Sidebar

**Purpose**: Main navigation sidebar — lists sections, projects, cycles.

**Anatomy**:
```
+-- sidebar ----------------+
|  Logo/Title               |
|  ---                      |
|  Navigation items         |
|  ---                      |
|  Projects section         |
|  Cycles section           |
|  ---                      |
|  User info / Logout       |
+---------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| nav-item | `a` or `button` | Active state highlighted |
| section-header | `span` | Collapsible section label |
| collapse-toggle | `button` | Collapse sidebar to icon-only mode |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| expanded | Full width (240px) | All labels visible |
| collapsed | Icon only (56px) | Labels hidden, icons remain |
| active | Primary accent on selected item | Current route indicator |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | 2px ring offset 2px |
| Target size | Nav items ≥24×24 CSS px |
| Keyboard operability | Arrow keys to navigate, Enter to select |
| Screen reader | `role="navigation"`, `aria-label="Main navigation"` |

---

### Modal

**Purpose**: Overlay dialog for forms, confirmations, detail views.

**Anatomy**:
```
+-- overlay ----------------+
|  +-- modal -------------+ |
|  |  [close X]           | |
|  |  Title               | |
|  |  Content area        | |
|  |  [Cancel] [Confirm]  | |
|  +----------------------+ |
+---------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| overlay | `div` | Semi-transparent backdrop, click to close (opt) |
| modal | `div` / `section` | `role="dialog"`, `aria-modal="true"` |
| close | `button` | Always visible, top-right |
| title | `h2` | heading-2 typography |
| actions | `button` group | Cancel + primary action |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| open | Overlay + modal visible | Focus trapped inside modal, Esc to close |
| closed | Removed from DOM | Focus restored to trigger |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | 2px ring offset 2px on actionable elements |
| Target size | Close button ≥24×24 CSS px |
| Keyboard operability | Esc to close, Tab cycle within modal (focus trap) |
| Screen reader | `role="dialog"`, `aria-labelledby="title-id"` |

---

### DropdownMenu

**Purpose**: Contextual action menu — trigger + popover list.

**Anatomy**:
```
[Trigger button]
+-- dropdown ---------------+
|  Action 1    [shortcut]   |
|  Action 2    [shortcut]   |
|  ---                      |
|  Danger action            |
+---------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| trigger | `button` | Click to toggle |
| menu | `ul` / `div` | `role="menu"` |
| item | `li` / `button` | `role="menuitem"` |
| separator | `hr` | Visual divider between groups |
| danger-item | `button` | Danger color, destructive action |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| closed | Hidden | Click trigger to open |
| open | Visible below/above trigger | Click outside or Esc to close |
| item-hover | Highlighted background | — |
| item-danger-hover | Danger tint background | Confirmation required |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | 2px ring offset 2px |
| Target size | Items ≥24×24 CSS px |
| Keyboard operability | Arrow keys to navigate, Enter to select, Esc to close |
| Screen reader | `role="menu"`, `aria-labelledby="trigger-id"` |
