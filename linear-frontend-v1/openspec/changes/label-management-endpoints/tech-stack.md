# Tech Selection — Linear App Clone (Frontend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Frontend Framework | React 19 + Vite 8 | CSR sufficient; fast HMR; team React expertise | No SSR/SEO; bundle hydration for heavy pages |
| State Management | Zustand 5 | Minimal boilerplate; hook-based; optimistic update friendly | No built-in cache invalidation (manual rollback) |
| Styling | Tailwind CSS v4 | Utility-first; fast iteration; consistent design tokens | Verbose JSX; learning curve for design-token authors |
| Testing | Vitest + MSW + Playwright | Fast unit tests; API mocking without backend; reliable E2E | MSW requires handler maintenance |
| Deployment | Docker + nginx + CDN | Portable; simple; static SPA serving | No edge functions; manual cache invalidation |

## Generated Files

The tech-selection skill generated these files in `docs/`:

| File | Source Template | Status |
|------|----------------|--------|
| `docs/stack-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/stack-templates.md` | ✅ verified |
| `docs/architecture-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/architecture-templates.md` | ✅ verified |
| `docs/deployment.md` | `openspec/schemas/frontend-schema/templates/technology/deployment-templates.md` | ✅ verified |

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| 1 | — | All decisions | No challenges | approved |

## ADR References

- ADRs will be recorded in adr.md during the ADR artifact phase.

## Next Steps

1. Review generated docs in `docs/`
2. Proceed to design-frontend phase with tech stack now defined
3. Update ADRs if new architectural decisions emerge during design
