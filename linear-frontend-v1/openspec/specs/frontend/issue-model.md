# Issue Model — Frontend Specification

## Behaviour

**Feature:** Issue Type Alignment with API Contract

The frontend `Issue` type SHALL include all fields returned by the backend API per the OpenAPI 3.1 contract. The type SHALL use `statusId` (UUID) instead of `status` (string) to match the API schema.

### Requirement: IssueTypeIncludesAllApiFields

#### Scenario: Issue object contains teamId

- **GIVEN** the backend returns an Issue with a `teamId` field
- **WHEN** the frontend deserializes the response into the `Issue` type
- **THEN** `issue.teamId` SHALL be accessible as a `string`

#### Scenario: Issue object contains hierarchy fields

- **GIVEN** the backend returns an Issue with `parentId`, `sortOrder`, and `sequence`
- **WHEN** the frontend deserializes the response into the `Issue` type
- **THEN** `issue.parentId` SHALL be accessible as `string | null`
- **AND** `issue.sortOrder` SHALL be accessible as `number`
- **AND** `issue.sequence` SHALL be accessible as `number`

#### Scenario: Issue object contains timestamp fields

- **GIVEN** the backend returns an Issue with `completedAt`, `canceledAt`, and `deletedAt`
- **WHEN** the frontend deserializes the response into the `Issue` type
- **THEN** `issue.completedAt` SHALL be accessible as `string | null`
- **AND** `issue.canceledAt` SHALL be accessible as `string | null`
- **AND** `issue.deletedAt` SHALL be accessible as `string | null`

### Requirement: StatusFieldUsesStatusId

#### Scenario: Issue type uses statusId instead of status

- **GIVEN** the API spec defines the field as `statusId` (UUID, required)
- **WHEN** the frontend defines the `Issue` interface
- **THEN** the field SHALL be named `statusId` with type `string`
- **AND** components referencing `issue.status` SHALL be updated to use `issue.statusId`

## User Flow

No new user flow. This is a type-level alignment fix. Existing flows that display issue data will benefit from correct type coverage.

## Components

### IssueType

- **Purpose**: Define the shape of Issue data returned by the API
- **Props**: N/A (type definition)
- **States**: N/A
- **Events**: N/A

## Routing

No routing changes.

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| `statusId` | Required UUID string | N/A (compile-time type check) |
| `teamId` | Required UUID string | N/A (compile-time type check) |

## Accessibility

No accessibility impact. This is a type alignment change.
