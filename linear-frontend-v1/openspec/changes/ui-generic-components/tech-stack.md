# Tech Selection — Linear App Clone (Frontend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Frontend Framework | React 19 + Vite | Latest React with fast dev server, SPA-appropriate; Vite provides instant HMR and optimized builds | No SSR built-in (Vite SPA); backend team manages separate API deployment |
| State Management | Zustand | Minimal boilerplate, works outside React components, perfect for auth state; lighter than Redux | Less opinionated than Redux Toolkit; no devtools middleware included by default |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI development with utility classes; shadcn provides accessible headless primitives; aligns with design-system tokens | Larger initial CSS bundle (purged in prod); learning curve for Tailwind syntax |
| Testing | Vitest + Playwright | Vitest integrates natively with Vite; Playwright provides reliable E2E with auto-waiting and cross-browser support | Vitest ecosystem smaller than Jest; Playwright requires browser binaries in CI |
| Deployment | Vercel | Zero-config SPA deployment, preview deployments per branch, edge CDN, automatic SSL | Limited backend support; vendor lock-in for advanced features; cold starts for Serverless Functions |

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
| 1 | Frontend Framework | React 19 + Vite | — | Approved (current project stack) |
| 2 | State Management | Zustand | — | Approved (already in dependencies) |
| 3 | Styling | Tailwind CSS + shadcn/ui | — | Approved (Tailwind v4 + CVA in use) |
| 4 | Testing | Vitest + Playwright | — | Approved (already configured) |
| 5 | Deployment | Vercel | — | Approved (SPA-friendly, preview deploys) |

## ADR References

- ADR-0001: React 19 + Vite as frontend framework — see `adr.md` for full record.
- ADR-0002: Zustand for state management — see `adr.md` for full record.
- ADR-0003: Tailwind CSS + shadcn/ui for styling — see `adr.md` for full record.

## Next Steps

1. Review generated docs in `docs/`
2. Proceed to design phase with tech stack now defined
3. Update ADRs if new architectural decisions emerge during design
