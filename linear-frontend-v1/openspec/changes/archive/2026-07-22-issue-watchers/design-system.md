# Design System — Linear App Clone

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Grid columns | 12 | Content layout across all screens |
| Spacing cadence | 8px | Margin, padding, gap rhythm intent |
| Dense spacing | 4px | Dense data UI (tables, dashboards) |
| Max content width | 1280px | Container max-width for app content |
| Breakpoints | 640px / 768px / 1024px / 1280px | Responsive boundaries (Tailwind default) |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| heading-1 | Page title | 24px / 700 / 1.25 |
| heading-2 | Section title | 18px / 600 / 1.3 |
| heading-3 | Card/panel title | 15px / 600 / 1.4 |
| body | Body text | 14px / 400 / 1.5 |
| caption | Labels, metadata | 12px / 400 / 1.4 |
| mono | Identifiers, code | 12px / 400 / 1.4 (font-mono) |

## Color Semantics

| Token | Role | Usage |
|-------|------|-------|
| primary (#5e6ad2) | Main actions, links | Buttons, active states, focus rings |
| danger (#e5484d) | Destructive actions | Delete, remove, errors |
| success (#30a46c) | Positive feedback | Success states |
| warning (#f5a623) | Attention | Alerts |
| surface (#ffffff) | Card/panel backgrounds | Layout surfaces |
| surface-alt (#f7f8fa) | Alternate background | Hover, subtle distinction |
| border (#e2e4e8) | Dividers, borders | Containers, cards |
| text (#1a1d23) | Primary content | Body, headings |
| text-muted (#6b7280) | Secondary content | Labels, metadata |
| text-inverse (#ffffff) | On-brand backgrounds | Primary button text |

## Component Catalog

### WatcherList

**Purpose**: Displays users watching an issue

**Anatomy**:
```
+-- watcher-list ------------+
|  heading "Watchers"        |
|  +-- watcher-item ------+  |
|  |  [avatar] User Name   |  |
|  +-----------------------+  |
|  +-- watcher-item ------+  |
|  |  [avatar] User Name   |  |
|  +-----------------------+  |
|  ...                        |
+-----------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | `<section>` | Section landmark for watchers |
| heading | `<h3>` or `<h4>` | "Watchers" label |
| list | `<ul>` with `role="list"` | `aria-label="Watchers"` |
| item | `<li>` | Each watcher row |
| avatar | `<span>` or `<img>` | Initials or user avatar |
| name | `<span>` | User display name |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| loading | 3 skeleton rows (pulse animation) | Spinner/skeleton shown while fetching |
| empty | "No watchers yet" text | Informational label, non-interactive |
| populated | List of avatar + name rows | Scroll within container if >5 items |
| error | Error message + Retry button | `role="alert"` for screen reader |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Screen reader | `role="list"` + `aria-label="Watchers"` |

---

### WatchButton

**Purpose**: Toggle button to subscribe/unsubscribe from an issue. Built on the existing Button component with variant `secondary`.

**Anatomy**:
```
+-- button -------------+
|  [eye-icon] Watching  |
+-----------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| button | `<button>` | Uses existing `Button` component |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| not-watching | Outline icon + "Watch" label | Click adds user as watcher |
| watching | Filled icon + "Watching" label | Click removes user as watcher |
| loading | Spinner replaces icon | Disabled while request in-flight |
| disabled | Opacity 50% | When not authenticated |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px (inherit from Button) |
| Target size | ≥44×44 CSS px (SC 2.5.8) |
| Keyboard operability | Enter/Space to toggle |
| Screen reader | `aria-pressed` reflects toggle state; `aria-label` describes action ("Watch this issue" / "Unwatch this issue") |

**Variants**:

| Variant | When to use |
|---------|-------------|
| default (not-watching) | User is not subscribed to this issue |
| watching | User is currently subscribed |
