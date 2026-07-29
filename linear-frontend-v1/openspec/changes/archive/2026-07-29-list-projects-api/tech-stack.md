# Tech Selection — Linear App Clone (Frontend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Runtime | Node.js 22 LTS | Current LTS, fast cold start, excellent TypeScript support | Larger memory footprint vs Deno |
| Framework | React 19 + Vite 8 | Mature ecosystem, React 19 concurrent features, instant HMR | No SSR/SSG (SPA-only) |
| State Management | Zustand 5 | Lightweight, minimal boilerplate, excellent TypeScript inference | No built-in devtools vs Redux |
| Styling | Tailwind CSS 4 | Utility-first, rapid prototyping, design-token compatible | HTML bloat |
| API Client | fetch API (no axios) | Native, no extra dependency, sufficient for REST needs | No interceptors, manual error handling |
| Routing | React Router 7 | Declarative routing, nested layouts, lazy loading | Manual code splitting |
| Testing | Vitest + Playwright | Vite-native unit tests (Vitest), multi-browser E2E (Playwright) | Newer ecosystem vs Jest |
| Mocking | MSW 2 | Network-level mocking, no code changes | Setup overhead for simple mocks |
| Forms | React Hook Form + Zod 4 | Performant re-renders, schema-based validation | Two dependencies |
| Linting | ESLint 9 + Prettier 3 | Industry standard | Config complexity |

## Generated Files

| File | Source Template | Status |
|------|----------------|--------|
| `docs/stack-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/stack-templates.md` | ✅ verified |
| `docs/architecture-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/architecture-templates.md` | ✅ verified |
| `docs/deployment.md` | `openspec/schemas/frontend-schema/templates/technology/deployment-templates.md` | ✅ verified |

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| 1-8 | All categories | — | — | approved (no challenges) |

## ADR References

- ADR records documented in `adr.md` (pending creation)

## Next Steps

1. Proceed to design phase with tech stack now defined
2. Update ADRs if new architectural decisions emerge during design