# Tech Selection — Linear App Clone (Frontend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Frontend Runtime | Node.js 20+ LTS | Stable, wide ecosystem support | Heavier than Bun/Deno |
| Frontend Framework | React 19 + Vite 8 (CSR) | CSR sufficient for SPA; fast HMR; React ecosystem maturity | No SSR/SSG benefits |
| State Management | Zustand 5 | Minimal API, hook-based, optimistic updates are trivial | Smaller ecosystem than Redux |
| Routing | react-router-dom v7 | Standard for React SPAs, lazy loading, nested routes | Less type-safe than TanStack Router |
| Forms | react-hook-form + Zod 4 | Minimal re-renders, type-safe schema validation | Zod v4 is newer, some plugins lag |
| Styling | Tailwind CSS v4 | Utility-first, rapid iteration, design-token friendly | Purge complexity, class verbosity |
| Testing (Unit) | Vitest + Testing Library + MSW | Fast, Vite-native, MSW mocks API at network level | MSW setup complexity |
| Testing (E2E) | Playwright | Multi-browser, reliable, good DX | Slower than unit, flaky tests risk |
| Real-time | SSE (Server-Sent Events) | Simpler than WebSocket for one-way server→client updates | No bidirectional; connection limits |
| Architecture | Feature-Sliced Design (FSD) | Clear layer boundaries, enforced by eslint-plugin-boundaries | Learning curve for team |
| API Protocol | REST (OpenAPI 3.1) | Design-first contract, clear docs | More verbose than GraphQL/tRPC |
| Forms Validation | Zod 4 | Type inference from schema, co-located with react-hook-form | Zod v4 migration from v3 needed |

## Generated Files

The tech-selection skill generated these files in `docs/`:

| File | Source Template | Status |
|------|----------------|--------|
| `docs/stack-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/stack-templates.md` | ✅ verified |
| `docs/architecture-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/architecture-templates.md` | ✅ verified |
| `docs/deployment.md` | `openspec/schemas/frontend-schema/templates/technology/deployment-templates.md` | ✅ verified |

## Real-time Architecture (for this change)

The `realtime-issue-updates` change relies on SSE for live issue/project/cycle updates. The existing stack already includes SSE support:

- **SSE EventSource** in `shared/lib/` for connection management
- **Zustand store actions** updated on incoming SSE events
- **Optimistic updates** in store thunks with rollback on failure
- **No new dependencies required** — SSE is native browser API

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| — | All | — | — | All approved (no challenges) |

## Next Steps

1. Review generated docs in `docs/`
2. Proceed to design phase with tech stack now defined
3. Update ADRs if new architectural decisions emerge during design
