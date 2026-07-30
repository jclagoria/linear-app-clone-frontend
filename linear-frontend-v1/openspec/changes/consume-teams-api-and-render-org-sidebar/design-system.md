# Design System — Org Sidebar (Linear App Clone)

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Sidebar width | 280px | Fixed left panel for org/team navigation |
| Section spacing | 8px | Gap between org sections |
| Item padding | 8px 12px | Team item inner padding |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| org-header | Org section title | 12px / 600 / 1.4 |
| team-name | Team display name | 14px / 500 / 1.5 |
| team-key | Team key badge | 11px / 600 / 1.3 |

## Color Semantics

| Token | Role | Usage |
|-------|------|-------|
| sidebar-bg | Sidebar background | Panel background |
| sidebar-hover | Item hover | Team item hover state |
| sidebar-active-bg | Active team background | Active team highlight |
| sidebar-active-text | Active team text | Active team name color |
| badge-bg | Team key badge background | Key label |
| divider | Section separator | Between org groups |

*Exact hex values defined in the hi-fi pass. This schema captures intent.*

## Component Catalog

### OrgSidebar

**Purpose**: Root container that orchestrates loading, error, empty, and populated states for team navigation.

**Anatomy**:
```
+-- sidebar ------------+
|  +-- skeleton -----+  |  (loading state)
|  |  placeholder    |  |
|  |  placeholder    |  |
|  +-----------------+  |
|  +-- error-banner -+  |  (error state)
|  |  message [retry]|  |
|  +-----------------+  |
|  +-- empty-state --+  |  (empty state)
|  |  "no teams" CTA |  |
|  +-----------------+  |
|  +-- org-section --+  |  (populated state)
|  |  header ▼       |  |
|  |  +-- team -----+|  |
|  |  |  name  BADGE||  |
|  |  +-------------+|  |
|  +-----------------+  |
+-----------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<aside>` | Role="complementary", aria-label="Organization navigation" |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| loading | Skeleton placeholders | After 2s shows "Loading your teams…" |
| error | Inline banner with retry | On 5xx or timeout |
| empty | EmptyState component | "You are not a member of any team" + Button |
| populated | Org sections with team items | Normal navigation state |
| 401 | — | Redirect to /login |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Screen reader | `<aside>` with aria-label, aria-live="polite" for dynamic content |

**Variants**:

| Variant | When to use |
|---------|-------------|
| default | Primary sidebar in app shell |

---

### OrgSection

**Purpose**: Collapsible org group with header and team list.

**Anatomy**:
```
+-- section -------------+
|  +-- header --------+  |
|  |  ▼ Org Name       |  |
|  +-------------------+  |
|  +-- team-list -----+  |
|  |  +-- team -----+|  |
|  |  |  Team  KEY  ||  |
|  |  +-------------+|  |
|  |  +-- team -----+|  |
|  |  |  Team  KEY  ||  |
|  |  +-------------+|  |
|  +-----------------+  |
+------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| header | `<button>` | `aria-expanded` controls collapse |
| chevron | `<svg>` | Rotates when expanded |
| org-name | `<span>` | Organization display name |
| team-list | `<ul>` | Role="group" when collapsed/expanded |
| team-item | `<li>` | Individual team row |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| collapsed | Chevron right, team list hidden | aria-expanded="false" |
| expanded | Chevron down, team list visible | aria-expanded="true" |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Keyboard operability | Enter/Space to toggle, Arrow keys to navigate items |
| Screen reader | Button with aria-expanded, role="treeitem" on teams |

**Variants**:

| Variant | When to use |
|---------|-------------|
| default | Standard collapsible org group |

---

### TeamItem

**Purpose**: Clickable team row showing name, key badge, and active state.

**Anatomy**:
```
+-- team-item -----------+
|  Team Name     [KEY]   |
+------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<button>` or `<a>` | Role="treeitem", full-width clickable |
| name | `<span>` | Team display name |
| badge | `<span>` | Uppercase team key, small pill |
| active-indicator | `<div>` | Left border or background highlight |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Neutral background | Cursor pointer |
| hover | Lighter background (sidebar-hover) | — |
| active | Highlighted background + left accent | aria-current="page" |
| active hover | Slightly darker highlight | — |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA contrast on active state vs default |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px |
| Keyboard operability | Enter/Space to select, Arrow keys navigate |
| Screen reader | aria-current="page" for active, aria-label includes team name |

**Variants**:

| Variant | When to use |
|---------|-------------|
| default | Standard team row |

---

### ErrorBanner

**Purpose**: Inline error notification with retry action.

**Anatomy**:
```
+-- banner --------------+
|  [icon] Message [Retry]|
+------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<div>` | Role="alert", aria-live="assertive" |
| icon | `<svg>` | Warning/exclamation icon |
| message | `<span>` | Error description text |
| retry | `<button>` | Button variant="secondary" |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| visible | Warning-styled banner | Focusable retry button; auto-focus on appear |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | Visible 2px ring on retry |
| Target size | ≥24×24 CSS px |
| Screen reader | Role="alert", aria-live="assertive" announces on appearance |

**Variants**:

| Variant | When to use |
|---------|-------------|
| default | Inline error with retry |

---

### SkeletonLoader

**Purpose**: Full-page placeholder shown while teams are loading.

**Anatomy**:
```
+-- skeleton ------------+
|  +-- line ---------+   |
|  |  ████████       |   |
|  +-----------------+   |
|  +-- line ---------+   |
|  |    ████████     |   |
|  +-----------------+   |
|  +-- line ---------+   |
|  |      ████████   |   |
|  +-----------------+   |
+------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<div>` | aria-label="Loading teams", aria-live="polite" |
| line | `<div>` | Animated pulse shimmer, multiple lines mimicking org/team layout |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| visible | Animated shimmer placeholders | Replaced by content when fetch completes |
| slow-load | Same + text "Loading your teams…" | Text appears after 2s |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Screen reader | aria-label="Loading teams", aria-busy="true" on parent |

**Variants**:

| Variant | When to use |
|---------|-------------|
| sidebar | Skeleton mimicking org section + team items layout |
