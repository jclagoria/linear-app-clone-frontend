# Design System — Realtime WebSocket & Events

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
| heading-1 | Page title | 24px / 600 / 32px |
| heading-2 | Section title | 20px / 600 / 28px |
| heading-3 | Card/panel title | 16px / 600 / 24px |
| body | Body text | 14px / 400 / 20px |
| caption | Labels, metadata | 12px / 400 / 16px |
| mono | Code, status text | 12px / 500 / 16px |

## Color Semantics

| Token | Role | Usage |
|-------|------|-------|
| primary | Main actions, links | Buttons, active states, focus rings |
| danger | Destructive actions | Delete, remove, error states |
| success | Positive feedback | Connected state, success toasts |
| warning | Attention | Reconnecting state, stale updates |
| neutral | Backgrounds, borders | Layout, cards, dividers |
| text | Content | Body, headings, labels |
| muted | Secondary content | Captions, timestamps, disabled |
| surface | Card/panel background | Elevated content areas |

*Exact hex values defined in the hi-fi pass. This schema captures intent.*

## Component Catalog

### ConnectionStatusIndicator

**Purpose**: Visual indicator in the header showing the current WebSocket connection state

**Anatomy**:
```
+-- Indicator Container -----+
|  ● Status Dot              |
|  Status Text (optional)    |
+----------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Container | div | Flex row, align-center, gap-2 |
| Status Dot | span | 8px circle, color varies by state |
| Status Text | span | Caption typography, hidden on mobile |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| connected | Green dot, "Connected" text | No interaction |
| connecting | Yellow dot, "Connecting..." text | Pulse animation |
| reconnecting | Orange dot, "Reconnecting..." text | Pulse animation, clickable to retry |
| disconnected | Red dot, "Disconnected" text | Click triggers manual reconnection |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px on manual reconnect |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Tab to indicator, Enter/Space triggers reconnect when disconnected |
| Screen reader | role="status", aria-label="Connection status: {state}", aria-live="polite" |

**Variants**:

| Variant | When to use |
|---------|-------------|
| compact | Mobile header, minimal space |
| full | Desktop header, shows text label |

---

### ReconnectionToast

**Purpose**: Toast notification shown when WebSocket connection drops or reconnection fails

**Anatomy**:
```
+-- Toast Container --------------------+
|  ⚠ Icon                              |
|  Message Text                        |
|  Retry Button (optional)             |
|  Dismiss Button                      |
+---------------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Container | div | Fixed position, bottom-right, z-index high |
| Icon | span | Warning/error icon, color matches severity |
| Message Text | p | Body typography, describes the issue |
| Retry Button | button | Primary action when manual retry available |
| Dismiss Button | button | Ghost button, closes toast |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| visible | Slides in from right, auto-dismiss after 5s | User can interact or wait |
| dismissed | Slides out to right | Removed from DOM after animation |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px on buttons |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Tab to buttons, Enter/Space activates, Escape dismisses |
| Screen reader | role="alert", aria-live="assertive", announces message on appear |

**Variants**:

| Variant | When to use |
|---------|-------------|
| warning | Connection lost, reconnection in progress |
| error | Max reconnection attempts exhausted |
| network | Network failure detected |

---

### RevertToast

**Purpose**: Toast notification shown when an optimistic update fails (issue status change, assignment, project update) and the UI state reverts to its previous value

**Anatomy**:
```
+-- Toast Container --------------------+
|  ✗ Icon                              |
|  Message Text                        |
|  Retry Button (optional)             |
|  Dismiss Button                      |
+---------------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Container | div | Fixed position, bottom-right, z-index high (same placement as ReconnectionToast) |
| Icon | span | Error circle icon (✗), distinct from ReconnectionToast's warning triangle |
| Message Text | p | Body typography, describes what failed |
| Retry Button | button | Primary action, re-initiates the failed action |
| Dismiss Button | button | Ghost button, closes toast |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| visible | Slides in from right, auto-dismiss after 5s | User can interact or wait |
| dismissed | Slides out to right | Removed from DOM after animation |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px on buttons |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Tab to buttons, Enter/Space activates, Escape dismisses |
| Screen reader | role="alert", aria-live="assertive", announces message on appear |

**Variants**:

| Variant | When to use |
|---------|-------------|
| issue-status | Issue status change failed, reverted to previous status |
| issue-assignment | Issue assignment failed, reverted to previous assignee |
| project-update | Project save failed, reverted to previous values |
| network | Network failure prevented save |

---

### ConnectionErrorModal

**Purpose**: Modal dialog shown after 10 failed reconnection attempts, offering manual reconnect or logout

**Anatomy**:
```
+-- Modal Overlay ----------------------+
|  +-- Modal Content ----------------+  |
|  |  Title                          |  |
|  |  Description                    |  |
|  |  [Reconnect] [Logout]           |  |
|  +---------------------------------+  |
+---------------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Overlay | div | Semi-transparent black, click outside closes |
| Content | div | Centered card, max-width 400px |
| Title | h2 | Heading-3 typography |
| Description | p | Body typography |
| Reconnect Button | button | Primary action |
| Logout Button | button | Secondary/danger action |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| visible | Fade in overlay, scale up content | Focus trapped in modal |
| dismissed | Fade out overlay, scale down content | Return focus to trigger element |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px on buttons |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Tab cycles through buttons, Escape closes modal |
| Screen reader | role="dialog", aria-modal="true", aria-labelledby with title, aria-describedby with description |

**Variants**:

| Variant | When to use |
|---------|-------------|
| reconnect-offer | After 10 failed attempts, offer retry |
| fatal-error | Unrecoverable error, force logout |

---

### IssueCard

**Purpose**: Card component displaying issue summary with real-time status and assignee updates

**Anatomy**:
```
+-- Issue Card --------------------------+
|  ○ Status Icon   Issue Title           |
|  ○ Priority      Assignee Avatar       |
|  Labels (optional)                     |
+-----------------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Container | div | Card with hover state, click navigates to detail |
| Status Icon | span | Circle with color based on status |
| Issue Title | span | Body typography, truncated with ellipsis |
| Priority Icon | span | Small icon indicating priority level |
| Assignee Avatar | img | 24px avatar circle |
| Labels | div | Row of colored label chips |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| idle | Default card styling | Click navigates to issue |
| optimistic | Subtle pulse animation on changed field | Field shows new value immediately |
| confirmed | Normal styling, changed field highlighted briefly | Animation completes |
| reverted | Flash red on reverted field, return to original | Toast shown, field restored |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Tab to card, Enter/Space navigates to issue |
| Screen reader | role="article", aria-label="Issue: {title}, Status: {status}", aria-busy during optimistic |

**Variants**:

| Variant | When to use |
|---------|-------------|
| list-item | In issue list view |
| compact | In sidebar or mini views |
| detail-header | At top of issue detail page |

---

### StatusCycleIndicator

**Purpose**: Visual indicator showing status cycling during optimistic update via keyboard shortcut

**Anatomy**:
```
+-- Status Indicator --------+
|  ● Status Dot             |
|  Status Label             |
|  Cycling Animation (opt)  |
+----------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Container | div | Inline flex, align-center |
| Status Dot | span | 12px circle, color matches status |
| Status Label | span | Caption typography |
| Cycling Animation | span | Rotating border during optimistic state |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| idle | Static status dot and label | No interaction |
| cycling | Animated rotating border around dot | Indicates status changing |
| confirmed | Brief green flash, then static | Animation completes |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | N/A (not interactive) |
| Target size | N/A (not interactive) |
| Keyboard operability | N/A (triggered by parent card keyboard shortcut) |
| Screen reader | aria-label="Status: {status}", aria-busy="true" during cycling |

**Variants**:

| Variant | When to use |
|---------|-------------|
| default | Standard status display |
| interactive | Clickable to open status picker |

---

### IssueAssigneeSelector

**Purpose**: Dropdown selector for choosing issue assignee with optimistic update

**Anatomy**:
```
+-- Assignee Button -------------------+
|  Avatar   Name   Chevron            |
+-- Dropdown Menu --------------------+
|  [Unassigned]                       |
|  Avatar  User 1                     |
|  Avatar  User 2                     |
|  Avatar  User 3                     |
+-------------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Trigger Button | button | Shows current assignee or "Unassigned" |
| Avatar | img | 24px circle |
| Name | span | Body typography |
| Chevron | span | Dropdown indicator |
| Menu | ul | Dropdown list, max-height with scroll |
| Menu Item | li | Row with avatar and name |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| closed | Trigger button only | Click opens dropdown |
| open | Trigger + menu visible | Click outside or Escape closes |
| selecting | Menu item highlighted | Arrow keys navigate, Enter selects |
| applied | Trigger updates, menu closes | Optimistic update applied |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px on trigger and items |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Enter/Space opens, Arrow keys navigate, Enter selects, Escape closes |
| Screen reader | role="combobox", aria-expanded, aria-haspopup="listbox", aria-activedescendant |

**Variants**:

| Variant | When to use |
|---------|-------------|
| compact | In issue list, shows only avatar |
| full | In issue detail, shows name |

---

### ProjectForm

**Purpose**: Form for editing project details with optimistic updates

**Anatomy**:
```
+-- Project Form -----------------------+
|  Project Name (input)                 |
|  Description (textarea)              |
|  [Save] [Cancel]                      |
+---------------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Container | form | Vertical stack with spacing |
| Name Input | input | Text input, heading-3 typography |
| Description | textarea | Multi-line, body typography |
| Save Button | button | Primary action |
| Cancel Button | button | Secondary action |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| idle | Default form styling | User can edit fields |
| optimistic | Fields show new values, save button disabled | API request in progress |
| confirmed | Brief success indication, form resets | Update complete |
| reverted | Fields flash red, return to original | Error toast shown |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px on inputs and buttons |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Tab through fields, Enter submits, Escape cancels |
| Screen reader | Labels associated with inputs, aria-busy during save, error messages linked via aria-describedby |

**Variants**:

| Variant | When to use |
|---------|-------------|
| modal | In modal dialog for quick edits |
| inline | Inline editing in project list |
| page | Full page form for detailed editing |

---

### ProjectCard

**Purpose**: Card displaying project summary with real-time update support

**Anatomy**:
```
+-- Project Card -----------------------+
|  Icon   Project Name                  |
|  Progress Bar                         |
|  Member Avatars (stack)               |
+---------------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Container | div | Card with hover state |
| Icon | span | Project icon or emoji |
| Project Name | span | Heading-3 typography |
| Progress Bar | div | Horizontal bar showing completion |
| Member Avatars | div | Stacked avatar circles |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| idle | Default card styling | Click navigates to project |
| optimistic | Subtle pulse on changed field | Field shows new value immediately |
| confirmed | Normal styling, changed field highlighted | Animation completes |
| reverted | Flash red on reverted field | Toast shown, field restored |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Tab to card, Enter/Space navigates to project |
| Screen reader | role="article", aria-label="Project: {name}", aria-busy during optimistic |

**Variants**:

| Variant | When to use |
|---------|-------------|
| list-item | In project list view |
| grid | In project grid view |
| compact | In sidebar or mini views |

---

### NotificationBadge

**Purpose**: Badge in header showing unread notification count

**Anatomy**:
```
+-- Badge Container ---------+
|  Count Number             |
+----------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Container | span | Small circle, positioned absolute on trigger |
| Count Number | span | Mono typography, bold |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| empty | Hidden | No unread notifications |
| counting | Red background, white text, shows number | Click opens notification panel |
| overflow | Red background, "99+" text | More than 99 unread |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | N/A (inherits from trigger button) |
| Target size | N/A (inherits from trigger button) |
| Keyboard operability | N/A (inherits from trigger button) |
| Screen reader | aria-label="{count} unread notifications" |

**Variants**:

| Variant | When to use |
|---------|-------------|
| dot | Simple dot indicator without count |
| count | Shows numeric count |

---

### NotificationPanel

**Purpose**: Dropdown panel listing recent notifications with real-time delivery

**Anatomy**:
```
+-- Panel Container --------------------+
|  Header: "Notifications"   [Mark All] |
|  +-- Notification Item ------------+  |
|  |  Icon  Title  Timestamp        |  |
|  +---------------------------------+  |
|  +-- Notification Item ------------+  |
|  |  Icon  Title  Timestamp        |  |
|  +---------------------------------+  |
|  Empty State (when no notifications)  |
+---------------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Container | div | Fixed position, max-height with scroll |
| Header | div | Title and "Mark All Read" action |
| Notification Item | article | Clickable row with icon, title, timestamp |
| Empty State | div | Shown when no notifications |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| empty | "No notifications" message | No interaction |
| populated | List of notification items | Click item navigates, scroll if overflow |
| unread | Items have bold title, unread indicator | Click marks as read |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px on items |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Tab to items, Enter/Space navigates, Escape closes panel |
| Screen reader | role="region", aria-label="Notifications", each item has aria-label with full text |

**Variants**:

| Variant | When to use |
|---------|-------------|
| dropdown | In header, toggled by badge click |
| sidebar | In sidebar, always visible |
| page | Full page view of all notifications |

---

### NotificationItem

**Purpose**: Individual notification item with read/unread state

**Anatomy**:
```
+-- Notification Item ------------------+
|  ● Unread Dot (optional)              |
|  Icon                                 |
|  Title Text                           |
|  Timestamp                            |
+---------------------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Container | article | Clickable row |
| Unread Dot | span | Small blue dot, shown when unread |
| Icon | span | Icon based on notification type |
| Title Text | span | Body typography, truncated |
| Timestamp | span | Caption typography, muted color |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| new | Bold title, blue unread dot, recent timestamp | Click marks as read |
| read | Normal title, no dot, older timestamp | Click navigates to entity |

**Accessibility Contract** (DS-owned):

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px (SC 2.5.8) |
| Keyboard operability | Tab to item, Enter/Space navigates |
| Screen reader | role="article", aria-label="{notification title}", aria-read="true"/"false" |

**Variants**:

| Variant | When to use |
|---------|-------------|
| compact | In dropdown panel, minimal height |
| detailed | In full notification page, shows more context |
