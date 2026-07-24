# Design System — Form Module

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Grid columns | 12 | Content layout across all screens |
| Spacing cadence | 8px | Margin, padding, gap rhythm |
| Dense spacing | 4px | Compact form layouts |
| Max content width | 720px | Form container max-width |
| Breakpoints | 640px / 1024px / 1280px | Mobile / Tablet / Desktop |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| heading-2 | Form section title | 18px / 600 / 28px |
| heading-3 | Field group title | 14px / 600 / 20px |
| body | Field labels, hints | 14px / 400 / 20px |
| caption | Error messages, metadata | 12px / 400 / 16px |

## Color Semantics

| Token | Role | Usage |
|-------|------|-------|
| primary | Active states, focus rings | Button backgrounds, focus indicators |
| danger | Validation errors | Error text, error borders |
| success | Valid states, submission success | Success messages, valid borders |
| neutral | Backgrounds, borders | Form backgrounds, field borders |
| text | Content | Labels, values, hints |
| text-muted | Secondary content | Hint text, placeholder |
| surface | Input backgrounds | Field backgrounds |
| border | Field borders | Input borders, separators |

## Component Catalog

### TextField

**Purpose**: Single-line text input with label, error, and hint support

**Anatomy**:
```
+-- Label --------------------+
|  [Input Field             ] |
|  Hint text or Error message |
+----------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Label | `<label>` | Associated with input via htmlFor |
| Input | `<input>` | Text input element |
| Hint | `<p>` | Shown when no error, muted text |
| Error | `<p>` | Shown when touched + invalid, danger color |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Neutral border, white background | Accepts input |
| hover | Slightly darker border | — |
| focus | Primary ring, primary border | Keyboard accessible |
| disabled | Muted background, 50% opacity | No interaction |
| error | Danger border, error text | Shows validation message |
| success | Success border (optional) | Valid field indicator |

**Accessibility Contract**:

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥44×44 CSS px (mobile-friendly) |
| Keyboard operability | Tab to focus, type to input |
| Screen reader | Label announced, error via aria-describedby |

---

### SelectField

**Purpose**: Dropdown selection with label, error, and hint support

**Anatomy**:
```
+-- Label --------------------+
|  [Select ▼               ] |
|  Hint text or Error message |
+----------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Label | `<label>` | Associated with select |
| Select | `<select>` | Dropdown element |
| Hint | `<p>` | Shown when no error |
| Error | `<p>` | Shown when touched + invalid |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Neutral border, white background | Opens dropdown on click |
| hover | Slightly darker border | — |
| focus | Primary ring, primary border | Keyboard arrow navigation |
| disabled | Muted background, 50% opacity | No interaction |
| error | Danger border, error text | Shows validation message |

**Accessibility Contract**:

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥44×44 CSS px |
| Keyboard operability | Arrow keys to navigate options, Enter to select |
| Screen reader | Label announced, options announced |

---

### CheckboxField

**Purpose**: Boolean toggle with label, error, and optional description

**Anatomy**:
```
+-- [✓] Label ---------------+
|  Description (optional)    |
|  Error message             |
+----------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Checkbox | `<input type="checkbox">` | Toggle element |
| Label | `<label>` | Associated with checkbox |
| Description | `<p>` | Optional helper text |
| Error | `<p>` | Shown when touched + invalid |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Unchecked, neutral border | Toggles on click |
| checked | Filled with primary, checkmark | Toggles on click |
| hover | Slightly darker border | — |
| focus | Primary ring | Keyboard accessible |
| disabled | Muted, 50% opacity | No interaction |
| error | Danger border, error text | Shows validation message |

**Accessibility Contract**:

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | Visible 2px ring |
| Keyboard operability | Space to toggle |
| Screen reader | "Checked"/"Unchecked" announced |

---

### TextareaField

**Purpose**: Multi-line text input with label, error, hint, and optional character count

**Anatomy**:
```
+-- Label --------------------+
|  [Textarea                ] |
|  [                        ] |
|  Hint text or Error message |
|  Character count (optional) |
+----------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Label | `<label>` | Associated with textarea |
| Textarea | `<textarea>` | Multi-line input |
| Hint | `<p>` | Shown when no error |
| Error | `<p>` | Shown when touched + invalid |
| CharCount | `<span>` | Shows current/max characters |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Neutral border, white background | Accepts multi-line input |
| hover | Slightly darker border | — |
| focus | Primary ring, primary border | Keyboard accessible |
| disabled | Muted background, 50% opacity | No interaction |
| error | Danger border, error text | Shows validation message |

**Accessibility Contract**:

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥44×44 CSS px |
| Keyboard operability | Tab to focus, type to input |
| Screen reader | Label announced, error via aria-describedby, char count announced |

---

### SubmitButton

**Purpose**: Form submission trigger with loading state and double-click prevention

**Anatomy**:
```
+-- [Spinner] Button Label ---+
```

| Part | Element | Notes |
|------|---------|-------|
| Spinner | `<Spinner>` | Shown during submission |
| Label | `<span>` | Button text |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Primary variant | Triggers form submission |
| hover | Primary hover | — |
| loading | Spinner replaces icon, disabled | Blocks interaction |
| disabled | Muted, 50% opacity | No interaction (during submit or invalid) |

**Accessibility Contract**:

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA |
| Focus appearance | Visible 2px ring offset 2px |
| Keyboard operability | Enter/Space to submit |
| Screen reader | "Submitting..." announced during loading |
