# Design System — Linear App Clone

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Grid columns | 12 | Content layout across all screens |
| Spacing cadence | 8px | Margin, padding, gap rhythm intent |
| Dense spacing | 4px | Dense data UI (tables, dashboards) |
| Max content width | 1200px | Container max-width for screens |
| Breakpoints | 640px / 1024px / 1280px | Mobile / Tablet / Desktop |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| heading-1 | Page title | 24px / 600 / 1.3 |
| heading-2 | Section title | 20px / 600 / 1.4 |
| heading-3 | Card/panel title | 16px / 600 / 1.4 |
| body | Body text | 14px / 400 / 1.5 |
| caption | Labels, metadata | 12px / 400 / 1.4 |

## Color Semantics

| Token | Role | Usage |
|-------|------|-------|
| primary | Main actions, links | Buttons, active states |
| danger | Destructive actions | Delete, remove, errors |
| success | Positive feedback | Success states |
| warning | Attention | Alerts |
| neutral | Backgrounds, borders | Layout, cards |
| text | Content | Body, headings |

*Exact hex values defined in the hi-fi pass. This schema captures intent.*

## Component Catalog

### Button

**Purpose**: Trigger actions and submit forms

**Anatomy**:
```
+---------------------------+
|  [icon]  Label  [icon]   |
+---------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Label | span | Button text |
| Icon | svg/icon | Optional leading/trailing icon |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Solid background, text | Clickable |
| hover | Slightly darker bg | Cursor pointer |
| active | Pressed state | On click |
| disabled | Muted colors, reduced opacity | No interaction, tooltip |
| loading | Spinner replaces content | Blocking, no double-click |
| error | Danger border/bg | Validation feedback |

**Accessibility Contract**:

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Enter/Space activates button |
| Screen reader | Role="button", accessible name |

**Variants**:

| Variant | When to use |
|---------|-------------|
| primary | Main CTA, form submission |
| secondary | Alternative actions |
| danger | Destructive actions |
| ghost | Minimal emphasis actions |

---

### Input

**Purpose**: Capture text input from users

**Anatomy**:
```
+----------------------------------+
|  Label (optional)                |
+----------------------------------+
|  [icon]  Placeholder/Value       |
+----------------------------------+
|  Helper text / Error message     |
+----------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Label | label | Optional, above input |
| Input | input[type] | Text, email, password |
| Icon | svg/icon | Optional leading icon |
| Helper/Error | span | Below input, linked via aria-describedby |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Border, placeholder | Ready for input |
| focus | Primary border, ring | Active input |
| filled | Border, value visible | Has content |
| disabled | Muted border/bg | No interaction |
| error | Danger border, error msg | Validation failure |
| success | Success border | Valid input |

**Accessibility Contract**:

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA for text and borders |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px |
| Keyboard operability | Tab to focus, type to input |
| Screen reader | Label associated via htmlFor/id |

**Variants**:

| Variant | When to use |
|---------|-------------|
| text | General text input |
| email | Email addresses (validates format) |
| password | Passwords (masked, show/hide toggle) |

---

### FormField

**Purpose**: Wrapper for input + label + validation message

**Anatomy**:
```
+----------------------------------+
|  Label                           |
+----------------------------------+
|  Input                           |
+----------------------------------+
|  Error/Helper message            |
+----------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Label | label | Associated with input |
| Input | Input component | The actual input |
| Message | span | Error or helper text |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Neutral border | Ready |
| error | Danger border, error msg | Validation failure |
| success | Success border | Valid |

**Accessibility Contract**:

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | Visible on input focus |
| Keyboard operability | Tab through fields |
| Screen reader | Error linked via aria-describedby, aria-invalid on error |

---

### Card

**Purpose**: Group related content in a contained section

**Anatomy**:
```
+----------------------------+
|  Header (optional)         |
+----------------------------+
|  Content                   |
|                            |
+----------------------------+
|  Footer (optional)         |
+----------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Header | div | Title/actions area |
| Content | div | Main content |
| Footer | div | Actions/metadata |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Border, shadow | Static container |
| hover | Elevated shadow | Optional interactive hint |

**Accessibility Contract**:

| Concern | Commitment |
|---------|------------|
| Color contrast | Border visible against background |
| Keyboard operability | N/A (container) |
| Screen reader | role="region" if landmark, aria-label if titled |

---

### Alert

**Purpose**: Display error or status messages

**Anatomy**:
```
+----------------------------------+
|  [icon]  Message text      [x]  |
+----------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Icon | svg/icon | Status indicator |
| Message | span | Alert text |
| Close | button | Optional dismiss |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| error | Danger bg/border | Requires attention |
| success | Success bg/border | Positive feedback |
| warning | Warning bg/border | Caution |

**Accessibility Contract**:

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA for text |
| Keyboard operability | Close button focusable |
| Screen reader | role="alert", aria-live="assertive" |

---

### Spinner

**Purpose**: Indicate loading state

**Anatomy**:
```
   ( )
  (   )
   ( )
```

| Part | Element | Notes |
|------|---------|-------|
| Circle | svg/path | Animated rotation |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| loading | Animated spin | Blocks interaction |

**Accessibility Contract**:

| Concern | Commitment |
|---------|------------|
| Screen reader | aria-label="Loading" or visually hidden text |
