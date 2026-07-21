# ADR Review Manifest

- Status: completed
- Review date: 2026-07-21

## Review Summary

ADR review completed for this change. Six in-force ADRs were reviewed. One new durable ADR was created.

## In-Force ADRs Reviewed

- `adr/0004-feature-sliced-design.md` — Feature-Sliced Design Architecture. Status: accepted. This change follows FSD layer rules: the new `changeIssueStatus` API function lives in `entities/issue/api/`, the new `changeStatus` store action lives in `entities/issue/model/`, and the `IssueStatusBadge` component concept is integrated into `IssueDetail`.
- `adr/0005-react-hook-form-zod.md` — React Hook Form + Zod. Status: accepted. Not directly applicable — the status dropdown is a single Select change, not a form submission.
- `adr/0006-stack-selection.md` — Stack Selection. Status: accepted. This change uses the existing stack (Zustand for store, apiClient for fetch, Vitest for tests).
- `adr/0007-store-isolation.md` — Store Isolation. Status: accepted. The new `changeStatus` action follows the existing pattern: `useIssuesStore` remains the single domain store for issues, with cache invalidation via `useCacheStore`.
- `adr/0008-error-taxonomy-class-hierarchy.md` — Error Taxonomy via Class Hierarchy. Status: accepted. This change specifically leverages `BusinessRuleError` for 422 status transition errors, surfacing its message in error toasts.
- `adr/0009-ui-component-architecture.md` — UI Component Architecture. Status: accepted. The `IssueStatusBadge` wraps the existing `Select` component (which follows the `forwardRef` + native props pattern from this ADR).

## New Durable ADRs Created

- `adr/0010-dedicated-status-endpoint.md` — Dedicated Status Transition Endpoint for Issue Workflow. Decision: use `PATCH /issues/{id}/status` as a dedicated endpoint rather than routing status changes through the generic `PATCH /issues/{id}`.
