# Tech Selection — Consume Teams API and Render Org Sidebar (Frontend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Runtime | Node.js 22 LTS | Current LTS, fast cold start, excellent TypeScript support | Slightly larger memory footprint vs Deno |
| Framework | React 19.2.7 + Vite 8.1.1 | Mature ecosystem, React 19 concurrent features, Vite for instant HMR | No SSR/SSG (SPA-only), manual code splitting |
| State Management | Zustand 5.0.4 | Lightweight, minimal boilerplate, excellent TypeScript inference | No built-in devtools (vs Redux), less structure than Context |
| Styling | Tailwind CSS 4.2.1 | Utility-first, rapid prototyping, design-token compatible | HTML bloat, learning curve for team |
| Routing | React Router 7.6.2 | Declarative routing, nested layouts, lazy loading | Manual code splitting, no file-based routing |
| API | fetch (no axios) | Native, no additional dependency, works with MSW | No interceptors, manual retry logic |
| Testing (Unit) | Vitest 3.2.1 | Vite-native, fast, compatible with Jest APIs | Newer ecosystem, fewer community plugins than Jest |
| Testing (E2E) | Playwright 1.61.1 | Multi-browser, auto-wait, trace viewer | Heavier than Cypress for simple flows |
| Mocking | MSW 2.7.5 | Network-level mocking, no code changes, BDD-friendly | Setup overhead for simple mocks |
| Linting | ESLint 9.39.5 + Prettier 3.9.5 | Industry standard, extensive plugin ecosystem | Config complexity, multiple passes needed |
| Deployment | Vercel / Netlify static SPA | Zero-config static hosting, automatic HTTPS, CDN | No SSR/SSG, SPA-only routing |

## Generated Files

| File | Source Template | Status |
|------|----------------|--------|
| `docs/stack-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/stack-templates.md` | ✅ verified |
| `docs/architecture-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/architecture-templates.md` | ✅ verified |
| `docs/deployment.md` | `openspec/schemas/frontend-schema/templates/technology/deployment-templates.md` | ✅ verified |

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| 1 | All | (pre-existing) | — | approved (no challenge) |

## ADR References

- ADR-0001: WebSocket Client Alignment — see `adr.md` for full record (pending creation)

## Next Steps

1. Review generated docs in `docs/`
2. Proceed to design phase with tech stack now defined
3. Update ADRs if new architectural decisions emerge during design
