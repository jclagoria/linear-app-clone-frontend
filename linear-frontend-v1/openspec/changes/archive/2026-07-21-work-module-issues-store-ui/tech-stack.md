# Tech Selection — Linear App Clone (Frontend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Frontend Framework | React 19 + Vite | Already in use — SPA with react-router-dom v7. Faster DX than Next.js for this scope. | No SSR/SSG; pages are client-rendered. |
| State Management | Zustand v5 | Already in use — minimal boilerplate, excellent TS support, works outside React tree (API client uses it for auth). | No devtools middleware built-in; must add separately. |
| Styling | Tailwind CSS v4 | Already in use — zero-runtime, utility-first, Vite plugin. Pair with cva + tailwind-merge for component variants. | Class strings grow in complex components; cva abstraction mitigates. |
| Form Validation | react-hook-form v7 + Zod v4 | Already in use — performant (uncontrolled), Zod schemas double as API request validation. | Zod v4 is new — ecosystem compatibility must be verified. |
| API Client | Custom ApiClient (fetch-based) | Already built — request/response interceptors, auto-refresh on 401, single-flight token refresh. | Not a library; must maintain in-house. |
| Testing (Unit) | Vitest + Testing Library | Already in use — fast, Vite-native, MSW v2 for API mocking. | — |
| Testing (E2E) | Playwright | Already in use — cross-browser, parallel execution, trace viewer. | — |
| Icons | lucide-react | Already in use — tree-shakeable, consistent 24px grid. | Limited icon set vs. Phosphor or Material. |
| Routing | react-router-dom v7 | Already in use — nested layouts, loaders, TypeScript-first. | v7 layout routes are still evolving. |
| Build | Vite 8 | Already in use — fast HMR, native TS, Tailwind v4 plugin, path aliases. | — |
| Language | TypeScript 6.0 | Already in use — strict mode, path aliases via `@/`. | — |

## Generated Files

The tech-selection process generated these files in `docs/`:

| File | Source Template | Status |
|------|----------------|--------|
| `docs/stack-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/stack-templates.md` | ✅ |
| `docs/architecture-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/architecture-templates.md` | ✅ |
| `docs/deployment.md` | `openspec/schemas/frontend-schema/templates/technology/deployment-templates.md` | ✅ |

> Decisions are based on existing codebase (`package.json`, `vite.config.ts`, `tsconfig.json`, `src/`). No speculative tech — every choice traces to an existing dependency or built infrastructure.

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| 1 | Frontend Framework | React 19 + Vite | — | Approved (existing) |
| 2 | State Management | Zustand v5 | — | Approved (existing) |
| 3 | Styling | Tailwind CSS v4 | — | Approved (existing) |
| 4 | Form Validation | react-hook-form + Zod | — | Approved (existing) |
| 5 | API Client | Custom ApiClient | — | Approved (existing) |

## ADR References

- ADR-0001: Zustand-based state management pattern (see `adr.md` for full record when created)
- ADR-0002: Fetch-based API client with interceptor pipeline (see `adr.md`)

## Next Steps

1. Reviewed generated docs in `docs/`
2. Proceed to design phase with tech stack now defined
3. Update ADRs if new architectural decisions emerge during design
