# ADR Review Manifest

- Status: completed
- Review date: 2026-07-22

## Review Summary

ADR review completed for this change. No new durable ADRs are needed — all architectural decisions follow existing patterns established by in-force ADRs.

## In-Force ADRs Reviewed

| ADR | Relevance | Conformance |
|-----|-----------|-------------|
| ADR-0004 Feature-Sliced Design | `CommentCard` and `CommentList` live in `entities/issue/ui/`, edit handler in `pages/IssueDetailPage.tsx` — follows FSD layer rules | ✅ Conforms |
| ADR-0007 Store Isolation | Comment data in `entities/issue` store; `updateComment` action updates the specific comment following the domain-separated store pattern | ✅ Conforms |
| ADR-0009 UI Component Architecture | Edit mode uses component-local `useState` (inline with field primitive pattern); Button and Textarea are existing `shared/ui/` primitives with `forwardRef` + native props | ✅ Conforms |
| ADR-0005 react-hook-form + Zod | Edit comment uses a simple textarea (no form library) — not triggered; the validation rule (minLength) is handled inline | ✅ Not applicable |

## New Durable ADRs Created

- None — no major durable architectural decisions were introduced. The inline edit pattern, pessimistic update strategy, and component-local state are established conventions covered by existing ADRs.
