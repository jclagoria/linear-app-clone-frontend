# ADR Review Manifest

- Status: completed
- Review date: 2026-07-19

## Review Summary

ADR review completed for this change. New durable decisions from the API Client & Error Handling change are recorded as repo-level ADRs.

## In-Force ADRs Reviewed

- ADR-0004: Feature-Sliced Design Architecture — the API client is placed in `shared/` layer (as cross-cutting infrastructure), consistent with FSD rules.
- ADR-0005: React Hook Form + Zod — ErrorBanner integrates with form-level validation display; the error taxonomy supplies `ValidationError.details` for per-field error mapping.
- ADR-0006: Stack Selection (Zustand, Vite, React Router, Vitest) — RateLimitStore uses Zustand (consistent with ADR-0006); the interceptor pipeline works alongside Vitest for unit testing.
- ADR-0007: Store Isolation — RateLimitStore follows the per-domain store pattern (separate `create()` call at `src/stores/rate-limit.ts`).

## New Durable ADRs Created

- ADR-0008: API Error Taxonomy via Class Hierarchy — recorded at `adr/0008-error-taxonomy-class-hierarchy.md`. Covers the decision to use typed error subclasses extending `ApiError` over discriminated unions, error-code enums, or callback-only patterns.
