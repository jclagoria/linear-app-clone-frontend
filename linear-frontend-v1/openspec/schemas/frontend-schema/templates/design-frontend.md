# {Domain} — Frontend Design

## Architecture Decisions

{Key decisions, rationale, and trade-offs.}

## Component Tree

```
{ComponentHierarchy}
```

| Component | Responsibility | Props | State |
|-----------|---------------|-------|-------|
| {Name} | {purpose} | {inputs} | {loading, empty, error, success} |

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| {path} | {Component} | {public/protected/role} | {notes} |

## State Management

- **Global state**: {store, context, what data}
- **Local state**: {component-level, form state}
- **Server state**: {React Query, SWR, cache strategy}

## Data Fetching

- **Client**: {fetch, axios, graphql}
- **Error handling**: {toast, retry, fallback}
- **Optimistic updates**: {pessimistic/optimistic, rollback}

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| {icon/component} | {path} | {notes} |

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| {field} | {validation} | {message} |

## Accessibility

- **Keyboard navigation**: {tab order, shortcuts, focus trap}
- **ARIA**: {roles, live regions, announcements}
- **Screen reader**: {headings, labels, alt text}
