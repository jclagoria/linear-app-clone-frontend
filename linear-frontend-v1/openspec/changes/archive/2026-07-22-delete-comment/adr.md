# ADR Review Manifest

- Status: completed
- Review date: 2026-07-22

## Review Summary

ADR review completed for the delete-comment change.

## In-Force ADRs Reviewed

| ADR | Title | Relevance | Impact |
|-----|-------|-----------|--------|
| ADR-0004 | Feature-Sliced Design | CommentCard lives in `entities/comment/ui/`, delete button and confirmation are local state within the card — aligns with FSD layer rules | No change needed |
| ADR-0008 | API Error Taxonomy | Delete endpoint returns 403 (ForbiddenError), 500 (InternalError), or 204 (success). All covered by existing error classes | No change needed |
| ADR-0009 | UI Component Architecture | Inline confirmation uses existing Button (danger/secondary variants) + Toast via Zustand store. Matches existing patterns | No change needed |

## New Durable ADRs Created

- None — no major durable architectural decisions were introduced. The design decisions (inline confirmation within CommentCard, optimistic removal with rollback, client-side author guard) are implementation details within the existing FSD + Zustand + error taxonomy framework.
