# Fix: Issue Model Missing 7 Fields from API Spec

## Problem Statement

The frontend `Issue` TypeScript type is missing 7 fields that the backend returns per the API spec. Additionally, the `status` field should be `statusId` (UUID) per the OpenAPI contract. This creates a type-safety gap where accessing properties like `issue.teamId` at runtime returns `undefined` with no compile-time warning.

## Motivation

Maintaining a typed model that matches the API contract prevents runtime bugs and ensures components can access all backend-provided data. Missing fields cause silent failures when features depend on them (e.g., sub-issue hierarchy, team association, completion tracking).

## Scope

- **In scope**: Update `Issue` interface to include all 7 missing fields, rename `status` → `statusId` (or add both), and update components that depend on the type.
- **Out of scope**: API contract changes, backend modifications, new feature development beyond type alignment.

## Impact

- `src/entities/issue/model/types.ts` — primary change
- Components consuming `Issue` type may need updates if they reference `status` directly
- Affects data display and filtering features that rely on team, hierarchy, or completion fields
