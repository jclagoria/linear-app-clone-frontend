# Tech Selection — Linear App Clone (Frontend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Frontend Framework | React 19 + Vite 8 (CSR) | Team expertise, ecosystem maturity | No SSR/SSG; CSR sufficient for this app |
| State Management | Zustand 5 | Simple, hook-based, optimistic update friendly | No built-in devtools; lighter than Redux |
| Routing | react-router-dom v7 | SPA routing, lazy loading | Less opinionated than TanStack Router |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration | Larger CSS output; purge needed |
| Testing (Unit) | Vitest + Testing Library | ESM-native, 2-3x faster, Jest-compatible API | Newer ecosystem than Jest |
| Testing (E2E) | Playwright | Multi-browser support | Heavier than Cypress for single-browser |
| Forms | react-hook-form + Zod | Type-safe validation, minimal re-renders | Learning curve for Zod schemas |
| Architecture | Feature-Sliced Design (FSD) | Clear layer boundaries, enforced by eslint-plugin-boundaries | More files/dirs than flat structure |
| API Protocol | REST (OpenAPI 3.1) | Design-first contract, clear documentation | No real-time subscriptions built-in |
| Real-time | SSE (Server-Sent Events) | Simpler than WebSocket for one-way events | No bidirectional communication |
| Linting | ESLint 9 + Prettier | Only tool with FSD boundary rules | Biome not viable for Angular |
| Package Manager | pnpm | Faster, disk-efficient | Different hoisting than npm/yarn |
| Containerization | Docker | Consistent dev/prod environments | Overhead for simple static apps |
| Deployment | Cloudflare + Docker (nginx) | CDN caching, SSL termination | Vendor lock-in for CDN |

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
| 1 | All | 14 decisions | — | Approved (none challenged) |

## ADR References

- ADR-005: Drizzle ORM — SQL-first, compile-time safety (backend)
- ADR-009: ESLint + @typescript-eslint — Layer-aware boundary rules
- ADR-010: Vitest over Jest — ESM-native, faster execution
- ADR-001: Angular 19+ Standalone — Default for new Angular projects
- ADR-002: SignalStore — Signal-native state management
- ADR-003: Jest + Testing Library + MSW — Mature Angular testing stack
- ADR-004: FSD with ESLint boundary rules — Enforce module isolation
- Cross-cutting ADR-001: Hexagonal/Clean Architecture — All backends
- Cross-cutting ADR-002: REST + OpenAPI — Design-first API approach

## Next Steps

1. Review generated docs in `docs/`
2. Proceed to design phase with tech stack now defined
3. Update ADRs if new architectural decisions emerge during design
