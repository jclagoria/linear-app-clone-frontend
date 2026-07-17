# Tech Selection — Linear App Clone (Frontend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Frontend Framework | React 19 + Vite + pnpm | Latest React with concurrent features, Vite for fast HMR, pnpm for strict dep management | No SSR — SPA architecture accepted. Must use client-side routing. |
| State Management | Zustand | Minimal boilerplate (~1KB), works outside React tree (critical for AuthStore), excellent TS support | Smaller ecosystem than Redux; must set up devtools manually |
| Styling | Tailwind CSS + shadcn/ui | Rapid prototyping, design-system tokens map directly to utility classes; shadcn/ui provides accessible, copy-pasteable primitives | Verbose HTML with utility classes; shadcn/ui is a copy-paste pattern, not a dependency |
| Testing | Vitest + Playwright | Vite-native unit testing (same transform config); Playwright for reliable E2E auth flow testing | Playwright requires browser binaries in CI |
| Language | TypeScript (strict) | Security-critical auth surface benefits from strict typing | Development overhead compared to plain JS |
| API Protocol | REST (fetch) | API contract is OpenAPI/REST; simple interceptor pattern for Bearer token injection | No type-safe client generation in initial scope |
| Deployment | Vercel | Zero-config Vite SPA deploy, built-in CDN, preview deployments per branch | Vercel vendor lock-in; no containerization |

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
| 1 | Frontend Framework | React 18 + Vite | React 19 + Vite + pnpm | approved |
| 2 | State Management | Zustand | Zustand (unchanged) | approved |
| 3 | Styling | Tailwind CSS | Tailwind CSS + shadcn/ui | approved |
| 4-7 | Remaining categories | As proposed | none | approved |

## ADR References

- ADR-0001: React 19 + Vite + pnpm — see `adr.md` for full record.
- ADR-0002: Zustand for state management — see `adr.md` for full record.
- ADR-0003: Tailwind CSS + shadcn/ui — see `adr.md` for full record.

## Next Steps

1. Review generated docs in `docs/` (stack-frontend.md, architecture-frontend.md, deployment.md)
2. Proceed to design phase with tech stack now defined
3. Update ADRs if new architectural decisions emerge during design
