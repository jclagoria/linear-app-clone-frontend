# Tech Selection — Linear App Clone (Frontend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Frontend Framework | React 19 + Vite | Existing — unchanged | None |
| State Management | Zustand | Existing — unchanged | None |
| Styling | Tailwind CSS + shadcn/ui | Existing — unchanged | None |
| Testing | Vitest + Playwright + MSW | Existing — unchanged | None |
| Auth | JWT dual token (access in memory, refresh in httpOnly cookie) | Existing — this change completes the httpOnly migration | Removes XSS surface for refresh token |

## Generated Files

No new files generated. Existing docs already document the current state:

| File | Status |
|------|--------|
| `docs/stack-frontend.md` | Already exists — auth line already says "refresh in httpOnly cookie" (line 21) |
| `docs/architecture-frontend.md` | Already exists — security section already documents httpOnly cookie approach (lines 119-120) |
| `docs/deployment.md` | Not applicable — deployment unchanged |

## Interactive Review Log

No technology decisions were made or changed. This is a pure code-level migration within the existing stack:

- **Stack**: All stack choices remain identical (React 19, Zustand, Tailwind CSS, Vite, MSW)
- **Architecture**: Auth module structure unchanged; only the session store internals change (remove localStorage helpers, add `credentials: 'include'`)
- **Deployment**: No changes

## ADR References

No new ADRs needed — the httpOnly cookie strategy was already adopted when the architecture was defined. This change merely removes the legacy localStorage code path that predated the cookie implementation.

## Next Steps

1. Proceed to design-frontend phase
2. Implementation consists solely of: deleting localStorage helpers, adding `credentials: 'include'` to fetch calls, cleaning up login/refresh response handling, updating types, and fixing MSW handlers
