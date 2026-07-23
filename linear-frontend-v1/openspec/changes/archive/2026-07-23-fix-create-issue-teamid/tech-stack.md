# Tech Selection — Linear App Clone (Frontend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Frontend Framework | React 19 + Vite 8 (CSR) | Existing project decision — no change needed | — |
| State Management | Zustand 5 | Existing project decision — used for TeamsStore addition | — |
| Styling | Tailwind CSS v4 | Existing project decision | — |
| Forms | react-hook-form + Zod 4 | Existing project decision — no new forms needed | — |
| Testing | Vitest + Testing Library + MSW | Existing project decision — MSW handler update needed | — |

## Generated Files

The existing stack documentation is already in place. No new stack decisions are needed for this change — `teamId` is added to existing data structures and API calls using the current tech stack.

| File | Source Template | Status |
|------|----------------|--------|
| `docs/stack-frontend.md` | Already exists | ✅ (unchanged) |
| `docs/architecture-frontend.md` | Already exists | ✅ (unchanged) |
| `docs/deployment.md` | Already exists | ✅ (unchanged) |

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| — | — | — | — | No new tech decisions needed |

## ADR References

- No new ADRs required — this fix uses existing patterns and technologies.

## Next Steps

1. Proceed to design phase — technical design for the teamId fix
2. Implement: add `teamId` to `CreateIssueData`, create TeamStore, pass teamId in API call
