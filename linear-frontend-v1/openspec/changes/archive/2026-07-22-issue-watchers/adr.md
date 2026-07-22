# ADR Review Manifest

- Status: completed
- Review date: 2026-07-22

## Review Summary

ADR review completed for this change. The watcher feature introduces a new FSD entity and feature slice, which represents an extension of the established FSD and store-isolation patterns.

## In-Force ADRs Reviewed

- **ADR-0004 (Feature-Sliced Design)** — Verified that the new `entities/watcher/` and `features/watchers/` slices follow FSD layer rules: entity imports shared only; feature imports entity and shared. No layer violations.
- **ADR-0007 (Store Isolation)** — Verified that the new `useWatchersStore` follows the separate-store-per-domain pattern. The watcher store is independent from `useIssuesStore`, with its own loading/error state and optimistic update logic.
- **ADR-0010 (Dedicated Status Endpoint)** — Verified that the watcher API pattern (`GET/POST /issues/{id}/watchers`, `DELETE /issues/{id}/watchers/{userId}`) follows the same dedicated-endpoint pattern as status and assignee.
- **ADR-0011 (Dedicated Assignee Endpoint)** — Verified that the watcher store action pattern (dedicated `addWatcher`/`removeWatcher` actions with optimistic update + rollback) mirrors the assignee action pattern.

## New Durable ADRs Created

- **ADR-0012 (Watcher Feature Slice — New FSD Entity and Feature for Issue Watchers)** — `adr/0012-watcher-feature-slice.md`. Records the decision to create `entities/watcher/` and `features/watchers/` slices rather than extending `entities/issue/` or inlining state in the page component. Covers the rationale, FSD compliance, store isolation, and confirmation criteria.
