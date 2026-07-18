# Tech Selection — Linear App Clone (Frontend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Frontend Framework | React 19 + Vite | Latest React, fast dev, SPA-appropriate | No SSR; Vite instead of Next.js means manual code-splitting |
| State Management | Zustand | Minimal API, works outside React components, TypeScript-first | No built-time caching layer (React Query deferred to future) |
| Styling | Tailwind CSS + shadcn/ui | Rapid prototyping, accessible Radix primitives, design-system aligned | CSS bundle size; utility-first means verbose markup |
| Testing | Vitest + Playwright | Vitest integrates natively with Vite; Playwright for E2E | No Cypress ecosystem; Playwright requires browser installs |
| Deployment | Vercel | Zero-config SPA hosting, CDN, preview deployments | Vendor lock-in; no containerization flexibility |

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
| 1 | Frontend Framework | React 19 + Vite | — | Approved (existing project convention) |
| 2 | State Management | Zustand + React Query (deferred) | — | Approved (aligned with spec requirements) |
| 3 | Styling | Tailwind CSS + shadcn/ui | — | Approved (existing project stack) |
| 4 | Testing | Vitest + Playwright | — | Approved (Vite-native, full coverage) |
| 5 | Deployment | Vercel | — | Approved (zero-config, SPA-appropriate) |

## ADR References

- ADRs deferred to the `adr.md` artifact in this change.

## Next Steps

1. ✅ Review generated docs in `docs/`
2. Proceed to design phase with tech stack now defined
3. Update ADRs if new architectural decisions emerge during design
