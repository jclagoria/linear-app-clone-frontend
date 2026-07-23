# Issue API — Frontend Specification

## Behaviour

**Feature:** Delete Issue API Return Type

The `deleteIssue()` function SHALL return `Promise<void>` to match the API contract where `DELETE /api/v1/issues/{id}` returns 204 No Content with no response body.

### Requirement: DeleteIssueReturnType

#### Scenario: DeleteIssueReturnsVoid

- **GIVEN** the user calls `deleteIssue(issueId)`
- **WHEN** the API responds with 204 No Content
- **THEN** the function resolves with `undefined` (void)
- **AND** no attempt is made to parse a response body

#### Scenario: DeleteIssueTypeAnnotation

- **GIVEN** a TypeScript consumer imports `deleteIssue`
- **WHEN** the consumer inspects the return type
- **THEN** the return type SHALL be `Promise<void>`
- **AND** no `data` property SHALL be accessible on the resolved value

## User Flow

1. User triggers issue deletion from the UI
2. `deleteIssue(id)` is called
3. API returns 204 No Content
4. Function resolves with void — caller does not access `.data.success`

## Components

### deleteIssue API Function

- **Purpose**: Send DELETE request for an issue
- **Props**: `id: string` (issue identifier)
- **States**: loading (pending promise), success (void resolution), error (API failure)
- **Events**: none (fire-and-forget pattern)

## Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| N/A | N/A | API function, not a routed component |

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| id | Required string | N/A — enforced by TypeScript |

## Accessibility

N/A — API layer, no UI interaction.
