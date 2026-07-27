# Design System — Linear App Clone

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Grid columns | 12 | Content layout across all screens |
| Spacing cadence | 8px | Margin, padding, gap rhythm intent |
| Dense spacing | 4px | Dense data UI (tables, dashboards) |
| Max content width | 1200px | Container max-width for screens |
| Breakpoints | 640px / 1024px / 1280px | Responsive boundaries |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| heading-1 | Page title | 24px / 700 / 1.2 |
| heading-2 | Section title | 20px / 600 / 1.3 |
| heading-3 | Card/panel title | 16px / 600 / 1.4 |
| body | Body text | 14px / 400 / 1.5 |
| caption | Labels, metadata | 12px / 400 / 1.4 |
| small | Fine print | 11px / 400 / 1.4 |

## Color Semantics

| Token | Role | Usage |
|-------|------|-------|
| primary | Main actions, links | Buttons, active states |
| danger | Destructive actions | Delete, remove, error states |
| success | Positive feedback | Connected status, success states |
| warning | Attention | Reconnecting status, alerts |
| neutral | Backgrounds, borders | Layout, cards, dividers |
| text | Content | Body, headings |
| muted | Secondary text | Labels, metadata |

*Exact hex values defined in the hi-fi pass. This schema captures intent.*

## Component Catalog

### ConnectionStatusIndicator

**Purpose**: Displays WebSocket connection status as a colored dot in the header

**Anatomy**:
```
+-- indicator-container --+
|  +-- dot ------------+  |
|  |  (colored circle) |  |
|  +-------------------+  |
|  +-- label ----------+  |
|  |  (screen reader)  |  |
|  +-------------------+  |
+-------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| indicator-container | span | Flex container, align-items center |
| dot | span | 8px circle, background color based on state |
| label | span | Visually hidden, aria-label for screen readers |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| connected | Green dot (#22c55e) | Static, no animation |
| connecting | Yellow dot (#eab308) | Pulsing animation (1s infinite) |
| reconnecting | Yellow dot (#eab308) | Pulsing animation (1s infinite) |
| disconnected | Red dot (#ef4444) | Static, no animation |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | Dot color meets 3:1 against header background |
| Focus appearance | Not focusable (decorative element) |
| Target size | 8px dot, container 24×24 for touch |
| Keyboard operability | N/A (decorative) |
| Screen reader | role="status", aria-label with current status text |

**Variants**:

| Variant | When to use |
|---------|-------------|
| compact | Header (default, 8px dot) |
| expanded | Connection status panel (12px dot with label) |

---

### ConnectionErrorModal

**Purpose**: Displays critical WebSocket errors (auth_failed, invalid_token, forbidden, session.revoked)

**Anatomy**:
```
+-- modal-overlay ----------------+
|  +-- modal-content ------------+|
|  |  +-- modal-header ----------+|
|  |  |  icon  title             ||
|  |  +-------------------------+|
|  |  +-- modal-body -----------+|
|  |  |  error message          ||
|  |  +-------------------------+|
|  |  +-- modal-footer ---------+|
|  |  |  [Return to Login]      ||
|  |  +-------------------------+|
|  +----------------------------+|
+--------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| modal-overlay | div | Fixed position, backdrop blur, z-index 50 |
| modal-content | div | Max-width 400px, centered, rounded corners |
| modal-header | div | Flex row, icon + title |
| modal-body | div | Error message text |
| modal-footer | div | Flex row, action buttons |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| hidden | Not rendered | — |
| visible | Fade in (200ms) | Focus trapped within modal |
| auth_failed | Red icon, "Authentication failed" | Clear tokens, show Return to Login |
| invalid_token | Red icon, "Invalid token" | Close connection, show Return to Login |
| forbidden | Orange icon, "Access denied" | No reconnect, show Return to Login |
| session.revoked | Red icon, "Session expired" | Clear tokens, show Return to Login |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | Text meets 4.5:1, icon meets 3:1 |
| Focus appearance | 2px ring offset 2px on focused element |
| Target size | Button ≥44×44 CSS px (SC 2.5.8) |
| Keyboard operability | Escape closes modal, Tab cycles through focusable elements |
| Screen reader | role="dialog", aria-modal="true", aria-labelledby for title |

**Variants**:

| Variant | When to use |
|---------|-------------|
| auth_failed | Token invalid or auth error |
| forbidden | Access denied, no reconnect |
| session.revoked | Session expired, redirect to login |

---

### WebSocketErrorToast

**Purpose**: Displays transient WebSocket errors (rate_limited, invalid_channel)

**Anatomy**:
```
+-- toast-container ------------------+
|  +-- toast-content ----------------+|
|  |  icon  message  [dismiss]       ||
|  +--------------------------------+|
|  +-- toast-progress --------------+|
|  |  (auto-dismiss countdown)      ||
|  +--------------------------------+|
+------------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| toast-container | div | Fixed position, bottom-right, z-index 40 |
| toast-content | div | Flex row, icon + message + dismiss button |
| toast-progress | div | Progress bar for auto-dismiss countdown |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| hidden | Not rendered | — |
| visible | Slide in from right (300ms) | Auto-dismiss after 5s |
| rate_limited | Yellow icon, "Rate limited. Retry after Xs" | Countdown progress bar |
| invalid_channel | Orange icon, "Invalid channel subscription" | Auto-dismiss 5s |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | Text meets 4.5:1, icon meets 3:1 |
| Focus appearance | Dismiss button: 2px ring offset 2px |
| Target size | Dismiss button ≥24×24 CSS px |
| Keyboard operability | Escape dismisses toast, Tab to dismiss button |
| Screen reader | role="alert", aria-live="polite" |

**Variants**:

| Variant | When to use |
|---------|-------------|
| rate_limited | Server rate limit exceeded |
| invalid_channel | Invalid channel subscription attempt |

---

### ToastContainer

**Purpose**: Container for rendering all active toasts

**Anatomy**:
```
+-- toast-container --+
|  +-- toast-1 -----+|
|  |  ...           ||
|  +----------------+|
|  +-- toast-2 -----+|
|  |  ...           ||
|  +----------------+|
+--------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| toast-container | div | Fixed position, bottom-right, flex column, gap 8px |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| empty | Not rendered | — |
| has-toasts | Stack of toasts | Renders active toasts |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | N/A (container only) |
| Focus appearance | N/A (container only) |
| Target size | N/A (container only) |
| Keyboard operability | N/A (container only) |
| Screen reader | aria-live="polite" on container |

---

### RevertToast

**Purpose**: Displays notification when an optimistic update is reverted

**Anatomy**:
```
+-- toast-content ------------------+
|  icon  message  [undo] [dismiss] |
+----------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| toast-content | div | Flex row, icon + message + action buttons |
| undo button | button | Reverts the reverted change |
| dismiss button | button | Dismisses the toast |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| hidden | Not rendered | — |
| visible | Slide in from right (300ms) | Auto-dismiss after 10s |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | Text meets 4.5:1 |
| Focus appearance | 2px ring offset 2px on focused button |
| Target size | Buttons ≥24×24 CSS px |
| Keyboard operability | Tab to buttons, Enter/Space activates |
| Screen reader | role="alert", aria-live="assertive" |

---

### ReconnectionToast

**Purpose**: Displays reconnection status messages

**Anatomy**:
```
+-- toast-content ------------------+
|  icon  message                    |
+----------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| toast-content | div | Flex row, icon + message |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| hidden | Not rendered | — |
| reconnecting | Yellow icon, "Reconnecting..." | Auto-dismiss on reconnect |
| reconnected | Green icon, "Reconnected" | Auto-dismiss after 3s |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | Text meets 4.5:1 |
| Focus appearance | Not focusable (decorative) |
| Target size | N/A (decorative) |
| Keyboard operability | N/A (decorative) |
| Screen reader | role="status", aria-live="polite" |
