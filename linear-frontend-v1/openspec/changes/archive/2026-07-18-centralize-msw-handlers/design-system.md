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

This change introduces no new UI components. The centralized MSW handlers are an infrastructure layer — they serve mock API responses to all existing components. Below are the existing components whose data-fetching paths are affected by this change.

### IssueList

**Purpose**: Renders a paginated list of issues with filtering support.

**Anatomy**:
```
+-- issue-list --------------+
|  [Filter bar]              |
|  +-- issue-row ---------+  |
|  |  [checkbox] Title    |  |
|  |  Status | Priority   |  |
|  +-----------------------+  |
|  [Load more]               |
+----------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| filter-bar | `div` | Status, assignee, search filters |
| issue-row | `div` | Clickable row, navigates to detail |
| checkbox | `input[checkbox]` | Selection for batch actions |
| load-more | `button` | Pagination trigger |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| loading | Skeleton rows | Data fetching in progress |
| populated | Rendered rows with data | Normal state |
| empty | EmptyState component | No issues match filters |
| error | ErrorBanner in panel | Failed to load |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | Row ≥24×24 CSS px |
| Keyboard operability | Arrow keys to navigate rows, Enter to open |
| Screen reader | `role="list"` on container, `role="listitem"` on rows |

---

### AuthGuard

**Purpose**: Protects routes behind authentication — redirects unauthenticated users.

**Anatomy**:
```
+-- guard -------------------+
|  [Login form]              |
|  Email input               |
|  Password input            |
|  [Sign in button]          |
+----------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| email-input | `input[email]` | Validated email format |
| password-input | `input[password]` | Masked input |
| submit | `button` | Triggers login flow |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| idle | Empty form | Waiting for input |
| loading | Disabled form + spinner | Login request in flight |
| error | Inline error message | Invalid credentials or network failure |
| authenticated | Redirected to app | Token stored, navigation to main app |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | 2px ring offset 2px on inputs and button |
| Target size | Inputs and button ≥24×24 CSS px |
| Keyboard operability | Tab between fields, Enter to submit |
| Screen reader | Labels associated with inputs, `role="alert"` on error |

---

### HeaderBar

**Purpose**: Top navigation bar with user menu, notifications, and search.

**Anatomy**:
```
+-- header ------------------+
|  [Search]  [Notif] [User]  |
+----------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| search | `input` | Global search trigger |
| notifications | `button` | NotificationBadge with dropdown |
| user-menu | DropdownMenu | Profile, settings, logout |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Normal appearance | — |
| notifications-unread | Badge with count | WebSocket-driven indicator |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | 2px ring offset 2px |
| Target size | Each item ≥24×24 CSS px |
| Keyboard operability | Tab navigation, DropdownMenu keyboard contract |
| Screen reader | `role="banner"`, `aria-label` on icon buttons |

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

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | N/A |
| Target size | N/A |
| Keyboard operability | N/A |
| Screen reader | `aria-live="polite"` on status text |

---

### LoadingSkeleton

**Purpose**: Placeholder while data is loading — one skeleton per entity shape.

**Anatomy**:
```
+-- skeleton-row -----------+
|  [=====]  [========]      |
+---------------------------+
|  [===================]    |
+---------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| skeleton-row | `div` | Animated pulse gradient |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Gray pulse animation | Replaces content during loading |
| loaded | Removed from DOM | Real content rendered |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | Not focusable — inert placeholder |
| Screen reader | `aria-hidden="true"` + `aria-busy="true"` on parent |

---

### EmptyState

**Purpose**: Displayed when a collection has no items.

**Anatomy**:
```
+-- empty-state -------------+
|  [icon]                    |
|  Title                     |
|  Description               |
|  [Action button] (opt)     |
+----------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| icon | `svg` | Lucide icon, muted color |
| title | `h3` | heading-3 typography |
| description | `p` | body typography |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Centered layout | No interaction |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Screen reader | Role `region` with `aria-label="No items"` |

---

### ErrorBanner

**Purpose**: Display error feedback — inline or page-level.

**Anatomy**:
```
+-- error-banner ------------+
|  [!]  Error message        |
|          [Dismiss] (opt)   |
+----------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| icon | `svg` | Alert circle, danger color |
| message | `p` | body typography |
| dismiss | `button` | Optional close action |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Danger-colored background | Dismissible or persistent |
| dismissed | Removed from DOM | — |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Screen reader | `role="alert"` for live region |

**Variants**:

| Variant | When to use |
|---------|-------------|
| inline | Inside a card or panel |
| banner | Full-width at top of page |
