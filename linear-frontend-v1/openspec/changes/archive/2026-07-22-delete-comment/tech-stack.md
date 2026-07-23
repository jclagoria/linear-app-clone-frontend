# Tech Selection — Linear App Clone (Frontend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Frontend Framework | React 19 + Vite 8 (CSR) | Fast dev experience, mature ecosystem, CSR sufficient for Linear-like SPA | No SSR/SEO for public pages (not needed for authenticated app) |
| State Management | Zustand 5 | Lightweight, hook-based, optimistic update friendly | No built-side effect management (handled in action thunks) |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration, consistent design tokens | Larger HTML output (mitigated by purge) |
| Testing | Vitest + Testing Library + MSW + Playwright | Fast unit tests, reliable E2E, MSW for API mocking | Multiple test runners to maintain |
| Deployment | Docker + nginx (static SPA) | Simple, portable, CDN-ready | Requires container orchestration |

## Generated Files

The tech-selection skill generated these files in `docs/`:

| File | Source Template | Status |
|------|----------------|--------|
| `docs/stack-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/stack-templates.md` | ✅ done |
| `docs/architecture-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/architecture-templates.md` | ✅ done |
| `docs/deployment.md` | `openspec/schemas/frontend-schema/templates/technology/deployment-templates.md` | ✅ done |

> **Note**: All three doc files exist and were reviewed against the tech research digest. No changes needed — the existing stack supports the comment deletion feature without modification (inline confirmation pattern, toast notifications, and API calls via existing Zustand stores are all covered by the current choices).

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| 1 | Styling | Tailwind CSS v4 | None — utility-first handles inline confirmation pattern and toast variants well | approved |
| 2 | State | Zustand 5 | None — action thunk pattern with optimistic rollback matches delete flow requirements | approved |
| 3 | Components | React 19 + shared/ui | Existing Button (danger/secondary variants) and Toast components cover all required UI | approved |

## ADR References

- ADR-0001: Feature-Sliced Design — see `adr.md` for full record.
- ADR-0002: Zustand for state management
- ADR-0003: React 19 + Vite 8

## Next Steps

1. Review generated docs in `docs/`
2. Proceed to design phase with tech stack now defined
3. Update ADRs if new architectural decisions emerge during design
