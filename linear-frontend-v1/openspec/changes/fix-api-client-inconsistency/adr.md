# ADR Review Manifest

- Status: completed
- Review date: 2026-07-22

## Review Summary

ADR review completed for this change.

## In-Force ADRs Reviewed

- None — no in-force ADRs in the repository.

## New Durable ADRs Created

- None — the decision to use the existing `apiClient` over raw `fetch()` restores the intended architecture rather than introducing a new durable decision. The codebase already established the pattern; this change corrects a deviation.
