# User Flows — {Change Title}

## Actors

| Actor | Description |
|-------|-------------|
| {Actor} | {who they are and what they can do} |

## Flow Inventory

### {Domain}: {FlowName}

**Actor**: {actor}  
**Entry**: {how user arrives}  
**Exit**: {where user goes after}

#### Screen List

| Screen | States Visited | Description |
|--------|----------------|-------------|
| {Screen} | empty, loading, populated, error, success | {what happens on this screen} |

#### Navigation Graph

```mermaid
graph TD
    {ScreenA} -->|{action}| {ScreenB}
    {ScreenB} -->|{action}| {ScreenC}
    {ScreenB} -->|{cancel}| {ScreenA}
```

#### State Transitions

| From | Action | To | Notes |
|------|--------|----|-------|
| {screen} | {user action} | {next screen} | {condition, edge case} |

---

### {Domain}: {FlowName}

...
