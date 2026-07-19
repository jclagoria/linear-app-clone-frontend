# Design System — Linear App Clone (Frontend)

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Grid columns | 12 | Content layout across all screens |
| Spacing cadence | 8px | Margin, padding, gap rhythm intent |
| Dense spacing | 4px | Dense data UI (tables, dashboards) |
| Max content width | 1200px | Container max-width for screens |
| Breakpoints | 768px / 1024px | Mobile / Tablet / Desktop |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| heading-1 | Page title | 24px / 700 / 1.2 |
| heading-2 | Section title | 18px / 600 / 1.3 |
| heading-3 | Card/panel title | 15px / 600 / 1.4 |
| body | Body text | 14px / 400 / 1.5 |
| caption | Labels, metadata | 12px / 500 / 1.4 |

*Font family: Inter, system-ui, -apple-system, sans-serif*

## Color Semantics

| Token | Role | Usage |
|-------|------|-------|
| primary | Main actions, links | Buttons, active states, focus borders |
| danger | Destructive actions | Delete, remove |
| success | Positive feedback | Success states |
| warning | Attention | Alerts, warnings |
| surface | Card/container backgrounds | Layout, cards |
| surface-alt | Alternative backgrounds | Sidebar, hover states |
| border | Dividers, borders | Cards, inputs, table rows |
| text | Primary content | Body, headings |
| text-muted | Secondary content | Labels, placeholders, metadata |
| text-inverse | Text on colored backgrounds | Primary button label |
| error-bg | Error background | Error banner, alerts |
| error-border | Error borders | Error banner outline |
| error-text | Error message text | Error descriptions |

*Exact hex values in `src/app/index.css` `@theme` block. This schema captures intent.*

## Component Catalog

### Toast

**Purpose**: Display temporary notifications for system events (rate limit, errors, success confirmations).

**Anatomy**:
```
+-- toast-root -------+
|  +-- icon ---+      |
|  |           |      |
|  +-----------+      |
|  +-- content -+     |
|  |  title     |     |
|  |  message   |     |
|  +-----------+      |
|  +-- action --+     |
|  |  [button]  |     |
|  +-----------+      |
+---------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| toast-root | `div[role="status"]` | Fixed-position container, top-right |
| icon | `svg[aria-hidden]` | Semantic icon (warning, error, info) |
| content | `div` | Title and description text |
| action | `Button (ghost)` | Optional call-to-action (e.g., "Retry") — ghost variant for low emphasis |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Light background + border | Slides in from top-right, auto-dismisses after 5s |
| hover | Slight shadow elevation | — |
| loading | — | Not applicable |
| error | Red accent (danger) | Rate limit, server error notifications |
| success | Green accent (success) | Operation completed |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Enter/Space to dismiss or trigger action |
| Screen reader | `role="status"` with `aria-live="polite"`, auto-announced |

**Variants**:

| Variant | When to use |
|---------|-------------|
| info | General notifications |
| error | Rate limit exceeded, server errors |
| success | Successful operations |

---

### ErrorBanner

**Purpose**: Display inline error messages within forms and page content.

**Anatomy**:
```
+-- error-banner ------------+
|  [icon]  message text      |
+----------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| root | `div[role="alert"]` | Red-themed container with border |
| icon | `svg[aria-hidden]` | AlertTriangle icon from lucide-react |
| message | `span` | Error description text |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Red background (`error-bg`), red border (`error-border`), red text (`error-text`) | Persistent until dismissed or error cleared |
| empty | `display: none` | Returns `null` if `message` is empty/falsy |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | N/A — no interactive elements |
| Keyboard operability | N/A — read-only display |
| Screen reader | `role="alert"` with `aria-live="polite"`, auto-announced on mount |

**Variants**:

| Variant | When to use |
|---------|-------------|
| default | Inline form errors, API error display |

---

### Button

**Purpose**: Trigger actions, submit forms, close notifications. Used across all feature modules.

**Anatomy**:
```
+-- button -------------+
|  [icon]  label        |
+-----------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| root | `button` | Native button element with type |
| icon | `svg[aria-hidden]` | Optional leading icon (lucide) |
| label | `span` | Button text; hidden for icon-only variant |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Background + border per variant | Pointer cursor |
| hover | Slight elevation / background shift | — |
| active | Pressed state | — |
| disabled | Reduced opacity | `pointer-events: none`, `aria-disabled="true"` |
| loading | Spinner replaces or precedes label | `aria-busy="true"`, disabled interaction |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Enter/Space to activate |
| Screen reader | Icon-only variant requires `aria-label`; loading state `aria-busy="true"` |

**Variants**:

| Variant | Visual | When to use |
|---------|--------|-------------|
| primary | Solid `primary` background, `text-inverse` label | Main CTA, submit, confirm |
| secondary | `surface` background, `text` label, `border` outline | Alternative action, cancel |
| ghost | No background/border, `text` label, `primary` on hover | Low-emphasis action (e.g., Toast "Retry") |
| icon-only | Square, no label, single lucide icon | Dismiss, close, icon toolbar (e.g., Toast `[X]`) |
| danger | Solid `danger` background, `text-inverse` label | Destructive action, delete, remove |
