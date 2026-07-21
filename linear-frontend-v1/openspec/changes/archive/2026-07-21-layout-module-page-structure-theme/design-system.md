# Design System — Linear App Clone (Frontend)

> Layout Module components. Reuses project-wide tokens (typography, colors, spacing) defined in the base design-system.md.

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Sidebar width (expanded) | 240px | Navigation panel |
| Sidebar width (collapsed) | 56px | Icon-only navigation |
| Header height | 48px | Sticky top bar |
| Mobile sidebar width | 280px | Overlay panel on mobile |
| Breakpoint mobile | <768px | Full-width content, overlay sidebar |
| Breakpoint tablet | 768-1024px | Side-by-side, collapsible sidebar |
| Breakpoint desktop | >1024px | Side-by-side, expanded sidebar |
| Spacing sidebar inner | 8px | Padding between nav items |
| Spacing header inner | 12px | Horizontal padding in header |
| Z-index header | 100 | Sticky header stacking |
| Z-index sidebar | 200 | Sidebar (higher than header) |
| Z-index overlay | 300 | Mobile sidebar backdrop |

## Theme Color Tokens

Theme colors are defined as CSS custom properties on `:root` (light) and `[data-theme="dark"]`. The system theme uses `prefers-color-scheme` media query.

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--bg-primary` | #FFFFFF | #1A1A2E | Main background (content area) |
| `--bg-secondary` | #F5F5F5 | #16213E | Sidebar, card backgrounds |
| `--bg-tertiary` | #EAEAEA | #0F3460 | Hovered items, subtle emphasis |
| `--text-primary` | #1A1A1A | #EAEAEA | Main body text |
| `--text-secondary` | #6B7280 | #9CA3AF | Secondary text, labels |
| `--text-tertiary` | #9CA3AF | #6B7280 | Placeholder, disabled text |
| `--border-color` | #E5E7EB | #2D3748 | Dividers, borders |
| `--accent-color` | #5E6AD2 | #7C8AFF | Active nav link, selection |
| `--accent-hover` | #4F5BD1 | #6B7AFF | Hover on accent elements |
| `--danger-color` | #EF4444 | #F87171 | Destructive actions |
| `--success-color` | #10B981 | #34D399 | Success indicators |
| `--overlay-backdrop` | rgba(0,0,0,0.5) | rgba(0,0,0,0.7) | Mobile sidebar backdrop |

*Exact hex values subject to design refinement. This schema captures light/dark semantic intent.*

## Typography

Layout module reuses the project-wide typography scale:

| Token | Intent | Scale |
|-------|--------|-------|
| heading-2 | Section title in sidebar | 20px / 600 / 1.3 |
| body | Nav link labels, header text | 14px / 400 / 1.5 |
| caption | Badge counts, metadata | 12px / 400 / 1.4 |

## Component Catalog

### PageLayout

**Purpose**: Root layout wrapper that composes sidebar, header, and scrollable content area. Provides the full-height application shell.

**Anatomy**:
```
+-- layout-container --------------------------+
|  +-- header ------------------------------+  |
|  |  [search] [notifications] [avatar]     |  |
|  +----------------------------------------+  |
|  +-- body ---------------------------------+  |
|  |  +-- sidebar --+  +-- content --------+  |  |
|  |  |  team        |  |  [page content]  |  |  |
|  |  |  Issues      |  |                  |  |  |
|  |  |  Projects    |  |                  |  |  |
|  |  |  Cycles      |  |                  |  |  |
|  |  |              |  |                  |  |  |
|  |  +--------------+  +------------------+  |  |
|  +----------------------------------------+  |
+----------------------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<div>` | `display: grid; grid-template-rows: auto 1fr; height: 100vh` |
| header | `<header>` | Sticky, role="banner" |
| body | `<div>` | `display: flex; flex: 1; overflow: hidden` |
| sidebar | `<nav>` | role="navigation"; collapsible width |
| content | `<main>` | role="main"; `overflow-y: auto` |

**States**: N/A — structural container, always rendered globally.

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Landmarks | header role="banner", nav role="navigation", main role="main" |
| Focus order | Sidebar → Header → Content (DOM order) |
| Keyboard operability | N/A (pass-through container) |

---

### Sidebar

**Purpose**: Main navigation panel with app links, team selector, and collapsed/expanded states.

**Anatomy**:
```
+-- sidebar-container ------------+
|  +-- team-selector ---------+  |
|  |  Team Name           ▼  |  |
|  +--------------------------+  |
|                                |
|  +-- nav-section ----------+  |
|  |  Issues                 |  |
|  |  Projects               |  |
|  |  Cycles                 |  |
|  +--------------------------+  |
|                                |
|  +-- sidebar-footer -------+  |
|  |  [collapse toggle]      |  |
|  +--------------------------+  |
+--------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| sidebar-container | `<nav>` | `role="navigation"`, `aria-label="Main navigation"` |
| team-selector | `<button>` | Expanded state: shows name + chevron; collapsed: icon only |
| nav-section | `<ul>` | List of primary navigation links |
| nav-link | `<a>` | Anchor or `<button role="link">`, `aria-current="page"` for active |
| sidebar-footer | `<div>` | Contains collapse toggle |
| collapse-toggle | `<button>` | `aria-label="Collapse sidebar"` / `"Expand sidebar"` |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| expanded | Full width (240px), labels visible | Default on desktop |
| collapsed | Narrow width (56px), icons only, labels hidden | Shows icon tooltips on hover |
| mobile-hidden | Hidden off-screen | Hamburger visible in header |
| mobile-overlay | Slides in from left, 280px, with backdrop | Backdrop clickable to close |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Tab between nav links; Enter/Space to activate |
| Screen reader | role="navigation" with aria-label; aria-current="page" on active link |
| Collapse toggle | aria-expanded reflects state; aria-label changes with state |
| Mobile overlay | Focus trapped inside when open; Escape to close |

**Variants**: expanded, collapsed, mobile-hidden, mobile-overlay

---

### Header

**Purpose**: Sticky top bar with global action triggers: search, notifications, user menu.

**Anatomy**:
```
+-- header-container -----------------------------+
|  +-- left ----+  +-- center ---+  +-- right ---+  |
|  | [hamburger]|  |  [search]   |  | [bell] [av]|  |
|  | (mobile)   |  |             |  |            |  |
|  +------------+  +-------------+  +------------+  |
+---------------------------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| header-container | `<header>` | `position: sticky; top: 0; z-index: 100`, role="banner" |
| hamburger | `<button>` | Visible only on mobile (<768px); `aria-label="Open menu"` |
| search-trigger | `<button>` | Opens command palette; `aria-label="Search"` |
| notification-bell | `<button>` | Shows badge with unread count; `aria-label="Notifications"` |
| user-avatar | `<button>` | Opens user menu dropdown; `aria-haspopup="true"` |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Fixed height 48px, border-bottom | Always sticky at top |
| with-unread | Badge visible on bell | Unread count > 0 |
| mobile | Hamburger replaces sidebar | Viewport <768px |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Tab navigation through triggers |
| Screen reader | aria-label on all icon-only buttons |
| Hamburger | aria-expanded reflects mobile sidebar state |

---

### SidebarToggle

**Purpose**: Button to collapse or expand the sidebar.

**Anatomy**:
```
+-- button -------+
|  [double arrow] |
+-----------------+
```

| Part | Element | Notes |
|------|---------|-------|
| button | `<button>` | Icon-only; changes aria-label with state |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| collapsed | Chevron pointing right | aria-label="Expand sidebar" |
| expanded | Chevron pointing left | aria-label="Collapse sidebar" |

**Accessibility Contract**: Same as Button a11y contract.

---

### HamburgerButton

**Purpose**: Mobile menu toggle to open/close sidebar overlay.

**Anatomy**:
```
+-- button -------+
|  [hamburger ☰]  |
+-----------------+
```

| Part | Element | Notes |
|------|---------|-------|
| button | `<button>` | Visible only on mobile breakpoint |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| closed | Three horizontal lines | aria-label="Open menu" |
| open | X icon | aria-label="Close menu" |

**Accessibility Contract**: Same as Button a11y contract.

---

### NavLink

**Purpose**: Navigation link within the sidebar.

**Anatomy**:
```
+-- link -----------------+
|  [icon]  Label          |
+-------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| link | `<a>` | Uses client-side router Link component |
| icon | `<svg>` | Leading icon for quick recognition |
| label | `<span>` | Hidden when sidebar collapsed |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Neutral text color, no background | — |
| hover | Subtle background highlight | Cursor pointer |
| active | Accent color text / background | aria-current="page" |
| collapsed | Icon only, label hidden | Tooltip shows on hover/focus |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Tab to focus, Enter to navigate |
| Screen reader | aria-current="page" on active link; aria-label for icon-only (collapsed) |

---

### TeamSelector

**Purpose**: Dropdown to select the current team context.

**Anatomy**:
```
+-- trigger ---------+
|  Team Name     ▼   |
+--------------------+
+-- dropdown --------+
|  Team Alpha        |
|  Team Beta         |
|  Team Gamma        |
+--------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| trigger | `<button>` | aria-haspopup="listbox", aria-expanded |
| current-name | `<span>` | Displayed team name (hidden when sidebar collapsed) |
| chevron | `<svg>` | Rotates when open (hidden when collapsed) |
| dropdown | `<ul>` | role="listbox" |
| option | `<li>` | role="option", aria-selected |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Team name + chevron | — |
| open | Dropdown visible, chevron rotated | Arrow keys navigate options |
| collapsed | Icon only (sidebar collapsed) | Tooltip shows team name |
| selected | Highlighted in dropdown | aria-selected="true" |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Focus appearance | Visible 2px ring offset 2px |
| Keyboard operability | Enter/Space to open; Arrow to navigate; Enter to select; Escape to close |
| Screen reader | role="listbox" + role="option"; aria-selected on current option |

---

### ThemeToggle

**Purpose**: Switch between light, dark, and system theme modes.

**Anatomy**:
```
+-- button ---------+
|  [sun/moon icon]  |
+-------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| button | `<button>` | Cycles through modes or opens a sub-menu |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| light | Sun icon | aria-label="Switch to dark mode" |
| dark | Moon icon | aria-label="Switch to light mode" |
| system | Auto icon | aria-label="Theme follows system preference" |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Focus appearance | Visible 2px ring offset 2px |
| Keyboard operability | Enter/Space to toggle; or Arrow keys in a grouped control |
| Screen reader | aria-label reflects current mode and available action |

---

### NotificationBadge

**Purpose**: Badge showing unread notification count. Appears on the notification bell icon in the header.

**Anatomy**:
```
+-- bell -------+
|  🔔          |
|  +--badge-+  |
|  |  3     |  |
|  +--------+  |
+---------------+
```

| Part | Element | Notes |
|------|---------|-------|
| wrapper | `<button>` | Icon button |
| icon | `<svg>` | Bell icon |
| badge | `<span>` | Role="status"; hidden when count is 0 |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| empty | No badge | aria-label="Notifications" |
| has-unread | Red badge with count | aria-label="3 unread notifications" |
| double-digit | Badge widens for "99+" | Caps at "99+" |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | White text on red badge; WCAG AA |
| Screen reader | aria-label includes count when > 0; role="status" for live region |

---

### Backdrop

**Purpose**: Semi-transparent overlay behind the mobile sidebar. Closes the sidebar when clicked.

**Anatomy**:
```
+-- backdrop ---+
|  (fullscreen) |
|               |
|               |
+---------------+
```

| Part | Element | Notes |
|------|---------|-------|
| backdrop | `<div>` | role="presentation"; `position: fixed; inset: 0` |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| visible | Semi-transparent dark overlay | Click or Escape to dismiss |
| hidden | Not rendered | CSS `display: none` or unmounted |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Keyboard operability | Escape key closes sidebar + backdrop |
| Screen reader | role="presentation" (decorative); aria-hidden="true" |
