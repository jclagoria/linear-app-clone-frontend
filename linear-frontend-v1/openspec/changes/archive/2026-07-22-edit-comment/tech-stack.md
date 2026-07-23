# Tech Selection — Linear App Clone (Frontend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Frontend Framework | React 19 + Vite 8 (CSR) | Mature ecosystem, fast dev experience with Vite, CSR sufficient for this app | No SSR/SEO — not needed for internal tool clone |
| State Management | Zustand 5 | Simple hook-based API, optimistic update friendly, <2kB | No built-in devtools (addons available), manual cache invalidation |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration, design-system tokens map directly to utility classes | Larger HTML output, learning curve for utility-first |
| Testing | Vitest + Testing Library + Playwright | Fast Vitest (Vite-native), Testing Library for component behavior, Playwright for reliable E2E | MSW for integration mocking adds setup overhead |
| Deployment | Docker + nginx + Cloudflare CDN | Portable container, CDN caching for static assets, SSL termination | Requires container registry and orchestrator |

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
| 1 | All categories | All current stack decisions | — | Approved |

## ADR References

- ADR will be created in the design phase documenting architectural decisions for this change.

## Next Steps

1. Review generated docs in `docs/`
2. Proceed to design phase with tech stack now defined
3. Update ADRs if new architectural decisions emerge during design
