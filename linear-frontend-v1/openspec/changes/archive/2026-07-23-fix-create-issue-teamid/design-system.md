# Design System — Linear App Clone

## Layout Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Grid columns | 12 | Content layout across all screens |
| Spacing cadence | 8px | Margin, padding, gap rhythm |
| Dense spacing | 4px | Dense data UI (tables, dashboards) |
| Max content width | 1200px | Container max-width for screens |
| Breakpoints | 640 / 768 / 1024px | Responsive boundaries |

## Typography

| Token | Intent | Scale |
|-------|--------|-------|
| heading-1 | Page title | 24px / 700 / 1.2 |
| heading-2 | Section title | 18px / 600 / 1.3 |
| body | Body text | 14px / 400 / 1.5 |
| caption | Labels, metadata | 12px / 400 / 1.4 |

## Color Semantics

| Token | Role | Usage |
|-------|------|-------|
| primary | Main actions, links | Buttons, active states |
| danger | Destructive actions | Delete, remove |
| success | Positive feedback | Success states |
| neutral | Backgrounds, borders | Layout, cards |
| text | Content | Body, headings |

## Component Catalog

### IssueFormModal

**Purpose**: Modal dialog for creating or editing an issue.

**Anatomy**:
```
+-- Modal Backdrop ----------+
|  +-- Modal Panel --------+ |
|  |  Title                | |
|  |  Form fields:         | |
|  |  - Title (text input)  | |
|  |  - Description (textarea)| |
|  |  - Status (select)    | |
|  |  - Priority (select)  | |
|  |  - Assignee (select)  | |
|  |  - Labels (multi-select)| |
|  |  - teamId (hidden, from context) | |
|  |  Submit / Cancel      | |
|  +------------------------+ |
+----------------------------+
```

| Part | Element | Notes |
|------|---------|-------|
| Backdrop | `div` | Dark overlay, click to close |
| Panel | `div[role="dialog"]` | Focus trap, aria-modal |
| Submit | Button | Triggers validation + API call |

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| open | Modal visible with backdrop | Focus trap active; form ready |
| submitting | Submit button disabled + spinner | All inputs disabled; prevents double submit |
| error | Toast visible | Form stays open; error toast displayed |
| closed | Modal hidden | Backdrop removed; focus returned to trigger |

**No changes needed** to the component anatomy — `teamId` is provided by the parent (IssuesPage) from a shared team context, not added as a visible form field.

### IssuesPage

**Purpose**: Main issue list view with create action.

**States**:

| State | Visual | Behaviour |
|-------|--------|-----------|
| loading | Skeleton list | Initial fetch in progress |
| populated | Issue cards | Filter/sort controls active |
| error | Error message + retry | Retry button calls loadIssues |
| empty | Empty state illustration | "No issues yet" + create prompt |

**Change**: `handleCreateIssue` must read current team ID from a shared team store/context and pass it to `createIssue()`.

### TeamSelector (existing)

**Purpose**: Dropdown to select active team.

**Change**: On team selection, the selected team ID must be written to a shared store so other pages (IssuesPage) can read it.

## Accessibility Contract

| Concern | Commitment |
|---------|------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus appearance | Visible 2px ring offset 2px |
| Target size | ≥24×24 CSS px |
| Keyboard operability | Enter/Space for buttons, Arrow for selection |
| Screen reader | Role + accessible name via aria-label |
