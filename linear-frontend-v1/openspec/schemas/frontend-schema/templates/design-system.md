# Design System — {Project Name}

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Grid columns | 12 | Content layout across all screens |
| Spacing cadence | 8px | Margin, padding, gap rhythm intent |
| Dense spacing | 4px | Dense data UI (tables, dashboards) |
| Max content width | {value} | Container max-width for screens |
| Breakpoints | {mobile / tablet / desktop} | Responsive boundaries |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| {heading-1} | Page title | {size/weight/line-height intent} |
| {heading-2} | Section title | {size/weight/line-height intent} |
| {heading-3} | Card/panel title | {size/weight/line-height intent} |
| {body} | Body text | {size/weight/line-height intent} |
| {caption} | Labels, metadata | {size/weight/line-height intent} |

## Color Semantics

| Token | Role | Usage |
|-------|------|-------|
| {primary} | Main actions, links | Buttons, active states |
| {danger} | Destructive actions | Delete, remove |
| {success} | Positive feedback | Success states |
| {warning} | Attention | Alerts |
| {neutral} | Backgrounds, borders | Layout, cards |
| {text} | Content | Body, headings |

*Exact hex values defined in the hi-fi pass. This schema captures intent.*

## Component Catalog

### {ComponentName}

**Purpose**: {what this component does}

**Anatomy**:
```
+-- {part} ----------+
|  {part}            |
|  +-- {nested} --+  |
|  |              |  |
|  +--------------+  |
+--------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| {part} | {html element} | {behavior} |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | {description} | {interaction} |
| hover | {description} | — |
| active | {description} | — |
| disabled | {description} | {blocked, tooltip} |
| loading | {skeleton/spinner} | {blocking?} |
| error | {description} | {validation message placement} |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Enter/Space for buttons, Arrow for selection |
| Screen reader | Role + accessible name via aria-label or visible label |

**Variants**:

| Variant | When to use |
|---------|-------------|
| {variant} | {context} |

---

### {ComponentName}

...
