# ADR Review Manifest

- Status: completed
- Review date: 2026-07-21

## Review Summary

ADR review completed for this change. Five architecture decisions were identified in the frontend design. One new durable ADR was created for the dedicated assignee endpoint, following the established pattern from ADR-0010 (dedicated status endpoint). The remaining four decisions follow established project conventions and do not warrant standalone ADRs.

## In-Force ADRs Reviewed

- `0004-feature-sliced-design.md` — Feature-Sliced Design architecture; no conflicts with this change
- `0005-react-hook-form-zod.md` — Form management pattern; used by the assignee `<select>` field
- `0006-stack-selection.md` — Tech stack decisions; no conflicts
- `0007-store-isolation.md` — Store isolation pattern; `assignIssue` action follows the same isolation as `changeStatus`
- `0008-error-taxonomy-class-hierarchy.md` — Error taxonomy; 422 BusinessRuleError handling is consistent
- `0009-ui-component-architecture.md` — UI component architecture; no new components introduced
- `0010-dedicated-status-endpoint.md` — Dedicated status endpoint; new ADR-0011 mirrors this pattern for assignment

## New Durable ADRs Created

- `0011-dedicated-assignee-endpoint.md` — Dedicated `PATCH /issues/{id}/assignee` endpoint with team-membership validation, optimistic update with rollback, and isolated error handling. Mirrors the pattern established by ADR-0010 for status transitions.
