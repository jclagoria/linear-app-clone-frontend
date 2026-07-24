# Issue Model Alignment — Frontend Design

## Architecture Decisions

No architectural decisions. This change modifies an existing TypeScript type definition to align with the API contract. The existing FSD architecture and stack remain unchanged.

## Component Tree

No new components. The change only updates the `Issue` interface in `src/entities/issue/model/types.ts`.

## Routing

No routing changes.

## State Management

No state management changes. Existing Zustand stores that consume the `Issue` type will automatically benefit from the updated type.

## Data Fetching

No data fetching changes. API responses will now be correctly typed.

## Asset Map

No assets needed.

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| `statusId` | Required UUID string | Compile-time type check |
| `teamId` | Required UUID string | Compile-time type check |
| `parentId` | UUID string or null | Compile-time type check |
| `completedAt` | ISO datetime string or null | Compile-time type check |
| `canceledAt` | ISO datetime string or null | Compile-time type check |
| `deletedAt` | ISO datetime string or null | Compile-time type check |
| `sortOrder` | Number | Compile-time type check |
| `sequence` | Number | Compile-time type check |

## Accessibility

No accessibility changes. Existing a11y implementations continue to work.
