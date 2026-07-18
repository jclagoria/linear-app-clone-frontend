# ADR Review Manifest

- Status: completed
- Review date: 2026-07-18

## Review Summary

ADR review completed for this change. No new durable architectural decisions were introduced — this change removes the legacy localStorage token path now that the backend serves the refresh token via HttpOnly cookie. The cookie-based auth strategy was already established in the existing architecture docs.

## In-Force ADRs Reviewed

- None — `<repo>/adr/` has no in-force ADRs.

## New Durable ADRs Created

- None — no major durable architectural decisions were introduced. The decision to use HttpOnly cookies for refresh tokens was already made at the architecture definition stage. This change simply removes the superseded localStorage code path.
