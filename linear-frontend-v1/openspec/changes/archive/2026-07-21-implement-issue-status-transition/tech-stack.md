# Tech Selection — Linear App Clone (Frontend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Frontend Framework | React 19 + Vite 8 | Existing in codebase, fast DX, SPA model | Heavier than vanilla for simple pages; JS bundle size |
| State Management | Zustand v5 | Existing in codebase, minimal boilerplate, works outside React | No built-in data-fetching primitives (vs React Query) |
| Styling | Tailwind CSS v4 + cva + tailwind-merge | Existing in codebase, utility-first, design-system tokens | Verbose JSX without component extraction discipline |
| API Client | Custom fetch-based with interceptor pipeline | Existing in codebase, lightweight, full control | Manual error handling vs Axios interceptor ecosystem |
| Testing | Vitest + Testing Library (unit), MSW (integration), Playwright (E2E) | Existing in codebase, fast, Vite-native | MSW requires mock server maintenance |
| Deployment | Docker + Docker Compose, Cloudflare CDN, GitHub Actions | Existing in codebase, simple multi-service setup | No Kubernetes — scaling requires manual ops |

## Generated Files

The following documentation files already exist in the project and are validated against the codebase:

| File | Source Template | Status |
|------|----------------|--------|
| `docs/stack-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/stack-templates.md` | ✅ |
| `docs/architecture-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/architecture-templates.md` | ✅ |
| `docs/deployment.md` | `openspec/schemas/frontend-schema/templates/technology/deployment-templates.md` | ✅ |

All files were verified on disk and match the actual project dependencies (`package.json`, `vite.config.*`, etc.).

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| 1 | API Client | Custom fetch-based | Axios | Approved — custom client is lighter, already built, interceptor pipeline covers auth/retry needs |
| 2 | State Management | Zustand v5 | TanStack Query | Approved — Zustand simpler for domain stores; no server-state cache layer needed yet |

## ADR References

- ADR-0001: Architecture — Feature-slice modular monolith (see `adr.md`)
- ADR-0002: State management — Zustand v5 domain stores
- ADR-0003: API client — Custom fetch-based with interceptor pipeline

## Next Steps

1. Review generated docs in `docs/`
2. Proceed to design phase with tech stack now defined
3. Update ADRs if new architectural decisions emerge during design
