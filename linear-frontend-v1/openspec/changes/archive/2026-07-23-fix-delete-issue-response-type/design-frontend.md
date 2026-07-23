# Issue API — Frontend Design

## Architecture Decisions

No architecture changes — this is a type correction in an existing API function. The existing `apiClient` layer and entity module structure remain unchanged.

## Component Tree

No new components — the change is in the API utility layer.

| Component | Responsibility | Props | State |
|-----------|---------------|-------|-------|
| N/A | N/A | N/A | N/A |

## Routing

No routing changes.

## State Management

No state management changes — `deleteIssue()` is a fire-and-forget call.

## Data Fetching

- **Client**: Existing `apiClient.delete()` — no changes
- **Error handling**: Existing error handling — no changes
- **Optimistic updates**: Not applicable

## Asset Map

No new assets required.

## Validation Strategy

No validation changes — the `id` parameter is enforced by TypeScript.

## Accessibility

No accessibility changes — API layer only.
