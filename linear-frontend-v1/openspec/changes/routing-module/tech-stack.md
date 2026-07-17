# Tech Selection — Linear App Clone (Frontend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Frontend Framework | React 19 + Vite 8 | Latest React, fast dev with HMR, SPA-appropriate | No SSR/SSG; client-side rendering only |
| State Management | Zustand 5 | Minimal boilerplate, works outside React, ideal for auth + UI state | No built-in devtools; middleware needed for persistence |
| Styling | Tailwind CSS v4 + shadcn/ui | Rapid iteration, accessible Radix primitives, design-system alignment | Larger CSS bundle; utility-first learning curve |
| Routing | React Router v7 | Standard SPA routing, nested routes, loader/action pattern | Heavier than minimal routers; no built-in code splitting |
| Testing | Vitest (unit) + Playwright (E2E) | Fast Vitest (Vite-native), robust Playwright for browser flows | Two testing tools to maintain; MSW needed for API mocking |
| Deployment | Vercel SPA | Zero-config static deploy, CDN, preview deployments, SPA fallback | Vendor lock-in; edge functions not used |

## Generated Files

The tech-selection skill generated these files in `docs/`:

| File | Source Template | Status |
|------|----------------|--------|
| `docs/stack-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/stack-templates.md` | ✅ |
| `docs/architecture-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/architecture-templates.md` | ✅ |
| `docs/deployment.md` | `openspec/schemas/frontend-schema/templates/technology/deployment-templates.md` | ✅ |

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| 1 | All | Existing decisions from `docs/` | — | Approved as-is |

## ADR References

- No ADRs yet — architectural decisions will be recorded during the design phase.

## Next Steps

1. Review generated docs in `docs/`
2. Proceed to design phase with tech stack now defined
3. Update ADRs if new architectural decisions emerge during design
