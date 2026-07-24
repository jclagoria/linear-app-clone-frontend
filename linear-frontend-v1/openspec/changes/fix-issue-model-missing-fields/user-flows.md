# User Flows — Fix: Issue Model Missing 7 Fields from API Spec

## Actors

| Actor | Description |
|-------|-------------|
| Frontend Developer | Consumes the `Issue` type in components |

## Flow Inventory

### Issue Model: Type Alignment

**Actor**: Frontend Developer  
**Entry**: Codebase  
**Exit**: Updated type definition

This change is a type-level alignment fix. No new user-facing screens or navigation changes are introduced. Existing flows that display issue data will benefit from correct type coverage.

#### Screen List

| Screen | States Visited | Description |
|--------|----------------|-------------|
| N/A | N/A | No screen changes — type-only fix |

#### Navigation Graph

No navigation changes.

#### State Transitions

No state transitions. Existing screens continue to function with the corrected type.
