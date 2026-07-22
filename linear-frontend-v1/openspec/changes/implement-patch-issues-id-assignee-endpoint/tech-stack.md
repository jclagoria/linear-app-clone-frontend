# Tech Selection — Linear App Clone (Frontend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Frontend Framework | React 19 + Vite 8 CSR | Already in use; CSR sufficient for SPA; fast HMR | No SSR/SEO — not needed for this app |
| State Management | Zustand 5 | Already in use; simple hook-based API; optimistic update friendly | No devtools as rich as Redux; fine for this scale |
| Styling | Tailwind CSS v4 | Already in use; utility-first, fast iteration | No runtime CSS-in-JS; all static |
| Routing | react-router-dom v7 | Already in use; SPA routing with lazy loading | No SSR route matching |
| Forms | react-hook-form + Zod 4 | Already in use; type-safe validation, minimal re-renders | Heavier than native forms for simple use cases |
| Testing (Unit) | Vitest + Testing Library | Already in use; ESM-native, fast | Jest-compatible API; minimal migration cost |
| Testing (E2E) | Playwright | Already in use; multi-browser support | Heavier setup than Cypress for simple tests |
| Architecture | Feature-Sliced Design | Already in use; clear layer boundaries enforced by ESLint | More boilerplate than flat structure |
| Linting | ESLint + eslint-plugin-boundaries | Already in use; only option with FSD boundary rules | Biome not viable for FSD enforcement |
| Deployment | Docker + nginx static hosting | Simple, portable; serves built Vite output | Requires container runtime; no serverless edge |
| API Protocol | REST (OpenAPI 3.1) | Design-first contract; already documented | No GraphQL flexibility |
| Auth | JWT dual-token (access + refresh) | Stateless; refresh rotation via httpOnly cookie | Token lifecycle management complexity |

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
| 1 | All | Full decision table | (none) | Approved |

## Next Steps

1. Review generated docs in `docs/`
2. Proceed to design phase with tech stack now defined
3. Update ADRs if new architectural decisions emerge during design
