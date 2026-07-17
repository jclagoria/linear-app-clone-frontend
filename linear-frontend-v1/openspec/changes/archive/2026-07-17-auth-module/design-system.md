# Design System — Linear App Clone

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Grid columns | 12 | Content layout across all screens |
| Spacing cadence | 8px | Margin, padding, gap rhythm intent |
| Dense spacing | 4px | Dense data UI (tables, dashboards) |
| Max content width | 480px | Login form container max-width |
| Breakpoints | 640px / 1024px / 1280px | Mobile / tablet / desktop |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| heading-1 | Page title | Bold / 24px / 1.3 |
| heading-2 | Section title | Semi-bold / 18px / 1.4 |
| heading-3 | Card/panel title | Semi-bold / 16px / 1.4 |
| body | Body text | Regular / 14px / 1.5 |
| caption | Labels, metadata | Regular / 12px / 1.4 |

## Color Semantics

| Token | Role | Usage |
|-------|------|-------|
| primary | Main actions, links | Buttons, active states, focus rings |
| danger | Destructive actions | Logout, delete |
| success | Positive feedback | Success states |
| warning | Attention | Alert banners |
| neutral | Backgrounds, borders | Card backgrounds, dividers |
| text | Content | Body, headings |
| text-muted | Secondary content | Labels, placeholders, hints |
| surface | Page background | App background |
| surface-alt | Elevated surface | Cards, modals, dropdowns |

*Exact hex values defined in the hi-fi pass. This schema captures intent.*

## Component Catalog

### Button

**Purpose**: Triggers actions — login submit, logout, form cancellation.

**Anatomy**:

```
+-- button ---------------------+
|  [icon]  [label]  [spinner]   |
+-------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| button | `<button>` | Native button element |
| label | `<span>` | Visible text label |
| icon | `<svg>` | Optional leading icon |
| spinner | `<span>` | Replaces icon during loading |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Filled bg (primary), white text, rounded 6px | Hover prepares, click triggers action |
| hover | Slightly darker bg | Pointer cursor |
| active | Darkest bg | Brief press state |
| disabled | 50% opacity, no pointer events | Blocked, tooltip if needed |
| loading | Spinner replaces icon, disabled | Action blocked |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Enter/Space to activate |
| Screen reader | Role `button` + accessible name via visible label or aria-label |

**Variants**:

| Variant | When to use |
|---------|-------------|
| primary | Main CTA (e.g., "Log in") |
| secondary | Alternative action (e.g., "Cancel") |
| danger | Destructive action (e.g., "Logout") |
| ghost | Low emphasis, inline actions |

---

### TextInput

**Purpose**: Single-line text entry for email and password fields.

**Anatomy**:

```
+-- fieldset ----------------+
|  +-- label -------------+  |
|  | Email                |  |
|  +----------------------+  |
|  +-- input-wrapper ----+  |
|  |  +-- input -------+ |  |
|  |  | user@mail.com  | |  |
|  |  +----------------+ |  |
|  +----------------------+  |
|  +-- hint/error --------+  |
|  | Error message        |  |
|  +----------------------+  |
+----------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| fieldset | `<div>` | Groups label + input + message |
| label | `<label>` | Associated via `htmlFor` |
| input | `<input>` | `type="email"` or `type="password"` |
| hint/error | `<span>` | `aria-live="polite"` for error announcements |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | 1px border, white bg | Editable |
| focus | 2px primary border, ring | Keyboard input ready |
| filled | Default + text present | — |
| error | 1px danger border + error message below | Validation message shown |
| disabled | 50% opacity | Not editable, no interaction |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Tab to focus, Enter triggers form |
| Screen reader | label via `htmlFor`/`id`, error via `aria-describedby` |

**Variants**:

| Variant | When to use |
|---------|-------------|
| email | `input type="email"` with email validation |
| password | `input type="password"` with show/hide toggle |

---

### LoginForm

**Purpose**: Composite component — email input, password input, submit button, error display.

**Anatomy**:

```
+-- form -----------------------+
|  +-- EmailInput ----------+  |
|  | TextInput (email)      |  |
|  +-------------------------+  |
|  +-- PasswordInput -------+  |
|  | TextInput (password)   |  |
|  +-------------------------+  |
|  +-- ErrorBanner ---------+  |
|  | Invalid credentials    |  |
|  +-------------------------+  |
|  +-- SubmitButton --------+  |
|  | Button (primary)       |  |
|  | "Log in"               |  |
|  +-------------------------+  |
+-------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| form | `<form>` | `onSubmit` handler |
| EmailInput | TextInput | Type email, autocomplete email |
| PasswordInput | TextInput | Type password, autocomplete current-password |
| ErrorBanner | `<div>` | `role="alert"`, shown on API error |
| SubmitButton | Button | Variant primary, label "Log in" |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Empty inputs, enabled button | Ready for input |
| loading | Inputs disabled, spinner on button | `isLoading` prevents re-submit |
| error | Error banner above button, inputs editable | User can correct and retry |
| success | — | Triggers redirect to main app |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Tab between fields, Enter submits |
| Screen reader | Error banner `role="alert"`, form `aria-label="Login"` |

---

### AuthGuard

**Purpose**: Route wrapper that checks auth state and conditionally renders children or redirects.

**Anatomy**:

```
+-- AuthGuard ---------------------+
|  +-- checking state ---------+  |
|  | Spinner + "Checking..."   |  |
|  +---------------------------+  |
|  +-- authenticated state ---+  |
|  | {children}               |  |
|  +---------------------------+  |
|  +-- unauthenticated state -+  |
|  | <Navigate to /login>     |  |
|  +---------------------------+  |
+----------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| AuthGuard | `<div>` or Fragment | Wrapper container |
| Spinner | `<span>` or component | Shown during hydration |
| children | ReactNode | Protected route content |
| Navigate | `<Navigate>` or redirect | React Router redirect |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| checking | Centered spinner with label | `role="status"`, `aria-live="polite"` |
| authenticated | Renders children | No visual impact |
| unauthenticated | — | `<Navigate to="/login" replace />` |

---

### UserAvatar

**Purpose**: Displays current user info with logout action in a dropdown.

**Anatomy**:

```
+-- UserAvatar -----------------+
|  +-- trigger --------------+  |
|  | [avatar]  [name]  [▼]  |  |
|  +-------------------------+  |
|  +-- dropdown (open) -----+  |
|  |  +-- user-info ------+ |  |
|  |  | user@mail.com     | |  |
|  |  +-------------------+ |  |
|  |  +-- divider -------+ |  |
|  |  +-- logout btn ----+ |  |
|  |  | Log out          | |  |
|  |  +------------------+ |  |
|  +------------------------+  |
+-------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| trigger | `<button>` | Avatar + name, `aria-haspopup="true"` |
| avatar | `<img>` or `<div>` | User avatar image or initial fallback |
| name | `<span>` | User display name |
| dropdown | `<div>` | `role="menu"`, positioned absolutely |
| logout button | Button (ghost/danger) | `aria-label="Log out {user.name}"` |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| default | Avatar + name shown | Click opens dropdown |
| dropdown open | Dropdown visible below trigger | Click outside closes, Escape closes |
| dropdown closed | Dropdown hidden | — |

---

### Spinner

**Purpose**: Indicates loading state for buttons, form submission, and full-page hydration.

**Anatomy**:

```
+-- spinner -------+
|   (animation)    |
+------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| spinner | `<span>` | CSS animation, `aria-label="Loading"`, `role="status"` |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| active | Rotating circle | CSS animation running |
| hidden | `display: none` | Removed from layout |

---

### ErrorBanner

**Purpose**: Displays API-level error messages above the login form.

**Anatomy**:

```
+-- error-banner ---------------+
|  [⚠]  Invalid email or password|
+--------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| banner | `<div>` | `role="alert"`, danger bg, `aria-live="polite"` |
| icon | `<svg>` | Warning icon |
| message | `<span>` | Error text content |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| visible | Red-tinted bg, icon + message | Shown when API returns error |
| hidden | `display: none` | Cleared when user edits input |
