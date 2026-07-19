# Tech Selection — Linear App Clone (Frontend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Frontend Framework | React 19 + Vite | Latest React, fastest dev server, SPA-appropriate, team familiarity | No SSR — SPA with client-side routing |
| State Management | Zustand | Minimal, works outside React (interceptors), perfect for auth + rate limit store | Less structured than Redux; manual devtools setup |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI development, accessible primitives (Toast, ErrorBanner), design-system aligned | Larger initial bundle; purge handles unused CSS |
| Unit Testing | Vitest | Fast, Jest-compatible API, native ESM, Vite integration | Smaller ecosystem than Jest (adequate for frontend) |
| Integration Testing | Vitest + MSW | Intercept fetch at network level; mock API client without real backend | MSW adds complexity for simple tests |
| E2E Testing | Playwright | Multi-browser, reliable selectors, great DX, parallel execution | Heavier setup than unit tests |
| API Client | Plain fetch + interceptors | Zero dependencies, easy interceptor pattern, full control of request lifecycle | No built-in retry/dedup/ caching (out of scope) |
| Auth | JWT dual token | Stateless, secure refresh rotation, httpOnly cookie for refresh | Token refresh adds interceptor complexity |
| Routing | React Router v7 | Standard, nested routes, loader/action pattern, wide adoption | Larger API surface than alternatives |
| Runtime | Node.js 20 LTS + pnpm 9 | LTS stability, pnpm for fast installs and disk efficiency | pnpm requires CI adaptation vs npm |
| Deployment | Vercel | SPA deploy, CDN, preview deployments, zero config | No containerization; tied to Vercel platform |

## Generated Files

The tech-selection skill generated these files in `docs/`:

| File | Source Template | Status |
|------|----------------|--------|
| `docs/stack-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/stack-templates.md` | ✅ |
| `docs/architecture-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/architecture-templates.md` | ✅ |
| `docs/deployment.md` | `openspec/schemas/frontend-schema/templates/technology/deployment-templates.md` | ✅ |

> **Note**: Status updated to ✅ only after Phase 7 (File Verification) confirms each file exists on disk.

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| 1 | All 11 categories | As shown in Decision Summary | None — approved | approved |

## ADR References

No ADRs recorded yet. Architectural decisions from this phase will be captured in `adr.md` during the design phase.

## Next Steps

1. Proceed to design phase (`design-frontend.md`) with tech stack now validated
2. Update ADRs if new architectural decisions emerge during design
3. Existing docs in `docs/` are consistent and verified
