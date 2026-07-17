# Design System — Linear App Clone (Frontend)

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Grid columns | 12 | Content layout across all screens |
| Spacing cadence | 8px | Margin, padding, gap rhythm intent |
| Dense spacing | 4px | Dense data UI (tables, dashboards) |
| Max content width | 1200px | Container max-width for screens |
| Breakpoints | 768px / 1024px / 1280px | Responsive boundaries |
| Sidebar width | 240px (expanded), 56px (collapsed) | Main navigation panel |
| Header height | 48px | Top bar with global actions |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| heading-1 | Page title | 24px / 600 / 1.3 |
| heading-2 | Section title | 18px / 600 / 1.4 |
| heading-3 | Card/panel title | 14px / 600 / 1.4 |
| body | Body text | 14px / 400 / 1.5 |
| body-small | Secondary text | 13px / 400 / 1.4 |
| caption | Labels, metadata | 12px / 500 / 1.3 |
| nav-item | Sidebar/link labels | 14px / 500 / 1.4 |

## Color Semantics

| Token | Role | Usage |
|-------|------|-------|
| primary | Main actions, active states | Buttons, active nav items |
| primary-hover | Hover state for primary | Button hover, nav hover |
| danger | Destructive actions | Delete, remove |
| success | Positive feedback | Success states |
| warning | Attention | Alerts |
| neutral-100 | Background | Page background, cards |
| neutral-200 | Elevated surface | Sidebar, header, modals |
| neutral-300 | Borders, dividers | Separators, card borders |
| text-primary | Primary content | Body, headings |
| text-secondary | Secondary content | Labels, metadata |
| text-muted | Disabled, placeholder | Disabled text, hints |
| sidebar-bg | Sidebar background | Navigation panel fill |
| sidebar-hover | Sidebar item hover | Nav link hover background |
| sidebar-active-bg | Active nav background | Current route highlight |
| sidebar-active-text | Active nav label | Current route text colour |
| splash-bg | Splash screen background | Full-screen loading backdrop |

*Exact hex values defined in the hi-fi pass. This schema captures intent.*

## Component Catalog

### NavLink (Sidebar)

**Purpose**: Navigation link in the sidebar that highlights when its route is active.

**Anatomy**:
```
+-- link ---------------------+
|  [icon]  Label              |
+-----------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<a>` | Full-width clickable row |
| icon | `<svg>` | Lucide icon |
| label | `<span>` | Route name text |
| active indicator | `<div>` | Left-border accent bar (active only) |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Text-secondary bg-transparent | Click navigates to route |
| hover | Text-primary bg-neutral-200/50 | — |
| active | Text-primary bg-sidebar-active-bg with left accent bar | Matched current route (exact or parent) |
| collapsed | Icon-only, label hidden | Tooltip on hover shows label |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Enter to navigate |
| Screen reader | `aria-current="page"` on active link |

**Variants**:

| Variant | When to use |
|---------|-------------|
| Default | Top-level route links (Issues, Projects, Cycles) |
| Sub-item | Nested route links under a parent |

---

### RouteLink (Inline)

**Purpose**: Inline text link for programmatic navigation within content (e.g., issue titles, "Go to Dashboard" on 404 page).

**Anatomy**:
```
+-- link ------+
|  Label       |
+--------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<a>` or `<button>` | Inline clickable text |
| icon | `<svg>` | Optional leading icon |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Text-primary underline | Click navigates |
| hover | Text-primary-hover | — |
| visited | Text-secondary | Standard visited style |
| focus | Focus ring | Keyboard tab navigation |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Colour contrast | WCAG AA |
| Focus appearance | Visible 2px ring offset 2px |
| Keyboard operability | Enter to navigate |

**Variants**:

| Variant | When to use |
|---------|-------------|
| Text | Standard inline navigation |
| Icon+text | Action links with leading icon |

---

### SplashScreen

**Purpose**: Full-screen loading indicator displayed during initial auth hydration before any route renders.

**Anatomy**:
```
+-- overlay ----+
|  [logo]       |
|  [spinner]    |
|  "Loading..." |
+---------------+
```

| Part | Element | Notes |
|------|---------|-------|
| overlay | `<div>` | Full viewport, centred content |
| logo | `<img>` or `<svg>` | App logo/wordmark |
| spinner | `<div>` | CSS-animated spinner |
| status text | `<p>` | Accessible loading label |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| loading | Centred logo + spinner on solid background | Auto-dismisses when hydration completes |
| hidden | `display: none` | Removed from DOM after hydration |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Screen reader | `role="status"` and `aria-live="polite"` |
| Focus management | No focusable elements inside splash — auto-transitions |

**Variants**: None

---

### NotFoundPage

**Purpose**: Static page displayed when the URL does not match any registered route.

**Anatomy**:
```
+-- container ------------+
|  [404 heading]          |
|  [message paragraph]    |
|  [Go to Dashboard link] |
+-------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<main>` | Centred layout |
| heading | `<h1>` | "Page not found" |
| message | `<p>` | Descriptive text |
| action link | `<a>` or `<button>` | RouteLink variant navigating to `/` |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Centred content with 404 graphic/text | N/A (single state) |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Landmark | `<main>` with `role="alert"` |
| Heading hierarchy | Single `<h1>` describing the page |
| Focus management | Focus moved to heading on mount |

**Variants**: None

---

### Breadcrumb (Route Indicator)

**Purpose**: Shows current location path for deep pages (e.g., Issues > LAG-21).

**Anatomy**:
```
+-- nav ------+
|  Parent > Current |
+--------------+
```

| Part | Element | Notes |
|------|---------|-------|
| nav | `<nav>` | `aria-label="Breadcrumb"` |
| parent links | `<a>` | Clickable segments (e.g., Issues) |
| separator | `<span>` | ">" or "/" icon between segments |
| current | `<span>` | `aria-current="page"` on last item |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Parent links underlined, current bold | Parent links navigable, current is plain text |
| truncated | "..." for overflow segments | Responsive collapse |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Landmark | `<nav aria-label="Breadcrumb">` |
| Current page | `aria-current="page"` on last segment |
| Separator | Hidden from screen readers (`aria-hidden="true"`) |

**Variants**: None
