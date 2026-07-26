# Design System — Layout Module — Responsive & Theme Finalization

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Grid columns | 12 | Content layout across all screens |
| Spacing cadence | 8px | Margin, padding, gap rhythm intent |
| Dense spacing | 4px | Dense data UI (tables, dashboards) |
| Max content width | 1440px | Container max-width for screens |
| Breakpoints | Mobile: <768px, Tablet: 768-1024px, Desktop: >1024px | Responsive boundaries |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| heading-1 | Page title | 24px/600/1.33 |
| heading-2 | Section title | 20px/600/1.4 |
| heading-3 | Card/panel title | 16px/600/1.5 |
| body | Body text | 14px/400/1.5 |
| caption | Labels, metadata | 12px/400/1.33 |

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

### Button

**Purpose**: Interactive element for user actions

**Anatomy**:
```
+-- button-container ----+
|  {icon}                |
|  {text-label}          |
+------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | button | Wraps all content |
| icon | i/span | Optional leading icon |
| text-label | span | Button text |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Standard styling | Click triggers action |
| hover | Slightly darker/lighter | — |
| active | Pressed state | — |
| disabled | Muted opacity | Blocked, may show tooltip |
| loading | Spinner replaces text | Blocking |
| error | Red border | Shows validation message |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Enter/Space to activate |
| Screen reader | Role + accessible name via aria-label or visible label |

**Variants**:

| Variant | When to use |
|---------|-------------|
| primary | Main call-to-action |
| secondary | Alternate actions |
| danger | Destructive operations |

---

### Sidebar

**Purpose**: Persistent navigation panel for desktop/tablet, overlay for mobile

**Anatomy**:
```
+-- sidebar-container ----+
|  {logo-area}            |
|  +-- nav-items ------+  |
|  |  {nav-item}        |  |
|  |  {nav-item}        |  |
|  +-------------------+  |
|  {footer-area}          |
+------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | aside | Main sidebar wrapper |
| logo-area | div | Branding/logo section |
| nav-items | nav | Navigation links list |
| nav-item | a/button | Individual navigation entry |
| footer-area | div | User settings/actions |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| expanded | Full width (240px) | Shows all labels |
| collapsed | Narrow (64px) | Icons only, tooltips on hover |
| overlay | Full height with backdrop | Mobile only, dismiss on backdrop click |
| hidden | Off-screen | Mobile default state |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Arrow keys for navigation, Enter/Space for selection |
| Screen reader | Navigation landmark with accessible name |

**Variants**:

| Variant | When to use |
|---------|-------------|
| desktop | Viewports >1024px, persistent |
| tablet | Viewports 768-1024px, collapsible |
| mobile | Viewports <768px, overlay |

---

### ThemeToggle

**Purpose**: Control for switching between light, dark, and system themes

**Anatomy**:
```
+-- toggle-container ----+
|  {theme-icon}          |
|  {dropdown}            |
+------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| container | button/div | Toggle wrapper |
| theme-icon | i/svg | Current theme indicator |
| dropdown | ul | Theme options list |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| light | Sun icon, light background | Applies light theme |
| dark | Moon icon, dark background | Applies dark theme |
| system | Auto icon | Follows OS preference |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Enter/Space to toggle, Arrow keys for dropdown |
| Screen reader | Announces current theme and options |

**Variants**:

| Variant | When to use |
|---------|-------------|
| button | Standalone toggle in header |
| dropdown | Menu with all three options |

---

### Modal

**Purpose**: Overlay dialog for focused interactions

**Anatomy**:
```
+-- modal-backdrop ------+
|  +-- modal-dialog ----+|
|  |  {header}          ||
|  |  {body}            ||
|  |  {footer}          ||
|  +-------------------+|
+------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| backdrop | div | Semi-transparent overlay |
| dialog | div | Main modal container |
| header | div | Title and close button |
| body | div | Modal content |
| footer | div | Action buttons |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| open | Visible with backdrop | Focus trapped inside |
| closing | Fade out | — |
| closed | Hidden | — |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Escape to close, Tab to cycle through focusable elements |
| Screen reader | Dialog role with aria-labelledby |

**Variants**:

| Variant | When to use |
|---------|-------------|
| confirmation | Yes/no decisions |
| form | Data entry |
| information | Display only |