# Tech Selection — Linear App Clone (Frontend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Frontend Framework | React 19 + Vite 8 (CSR) | SPA is sufficient; team expertise; fast dev experience with HMR via Vite | No SSR/SEO; bundle size managed via code-splitting |
| State Management | Zustand 5 | Simple hook-based API; optimistic update friendly; minimal boilerplate vs Redux | No built-in devtools; manual cache invalidation |
| Styling | Tailwind CSS v4 | Utility-first, rapid iteration, consistent design tokens via config | Larger HTML output; purgeCSS mitigates final bundle |
| Routing | react-router-dom v7 | Standard SPA routing; lazy loading support; nested layouts | CSR-only; no server-side routing |
| Forms | react-hook-form + Zod 4 | Type-safe validation; minimal re-renders; large ecosystem | Extra dependency; Zod schemas need maintenance alongside API types |
| Testing | Vitest + Testing Library + Playwright | Fast Vitest runner; RTL for component tests; Playwright for reliable E2E | Three test tools; some duplication between integration and E2E |
| Deployment | Docker (nginx) + Cloudflare CDN | Portable container; CDN for static asset caching and SSL | Requires container registry and orchestrator; simpler than full k8s |

## Generated Files

The tech-selection evaluation used these established project documents in `docs/`:

| File | Source Template | Status |
|------|----------------|--------|
| `docs/stack-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/stack-templates.md` | ✅ verified |
| `docs/architecture-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/architecture-templates.md` | ✅ verified |
| `docs/deployment.md` | `openspec/schemas/frontend-schema/templates/technology/deployment-templates.md` | ✅ verified |

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| 1 | State Management | Context/Redux | Zustand 5 | approved — existing project already uses Zustand |
| 2 | Styling | CSS Modules | Tailwind CSS v4 | approved — existing project already uses Tailwind |
| 3 | API Protocol | GraphQL | REST (OpenAPI 3.1) | approved — backend contract is REST-first, design-driven |

## ADR References

- ADR-0001: Feature-Sliced Design architecture — see `docs/architecture-frontend.md` for full record
- ADR-0002: Zustand for client state management — see Current Decisions table in `docs/architecture-frontend.md`
- ADR-0003: REST with OpenAPI 3.1 design-first contract — see `docs/stack-frontend.md`

## Next Steps

1. Review generated docs in `docs/` — already established and verified
2. Proceed to design phase (`design-frontend`) with tech stack now defined
3. Update ADRs if new architectural decisions emerge during design
