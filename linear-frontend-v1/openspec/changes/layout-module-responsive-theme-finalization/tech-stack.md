# Tech Selection — Linear App Clone (Frontend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Frontend Framework | React 19 + Vite 8 | CSR sufficient for this app; fast dev experience | No SSR/SSG benefits |
| State Management | Zustand 5 | Simple, hook-based, optimistic update friendly | Less ecosystem than Redux |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration | Larger bundle, learning curve |
| Testing | Vitest + Testing Library + MSW | Fast unit tests, reliable mocking | MSW setup complexity |
| Deployment | Docker (nginx) + Cloudflare | Static hosting, CDN caching | Container overhead |

## Generated Files

The tech-selection skill generated these files in `docs/`:

| File | Source Template | Status |
|------|----------------|--------|
| `docs/stack-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/stack-templates.md` | ✅ Complete |
| `docs/architecture-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/architecture-templates.md` | ✅ Complete |
| `docs/deployment.md` | `openspec/schemas/frontend-schema/templates/technology/deployment-templates.md` | ✅ Complete |

> **Note**: Status is updated to ✅ only after Phase 7 (File Verification) confirms each file exists on disk.

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| 1 | Frontend Framework | React 18 | React 19 | Approved — latest stable with improved performance |
| 2 | Build Tool | Vite 5 | Vite 8 | Approved — faster builds, better DX |
| 3 | State Management | Redux Toolkit | Zustand 5 | Approved — simpler API, less boilerplate |
| 4 | Styling | CSS Modules | Tailwind CSS v4 | Approved — utility-first, faster iteration |
| 5 | Testing | Jest | Vitest | Approved — faster, native ESM support |

## ADR References

- ADR-0001: Feature-Sliced Design adoption — see `adr.md` for full record
- ADR-0002: Zustand for state management — see `adr.md` for full record
- ADR-0003: Tailwind CSS v4 for styling — see `adr.md` for full record

## Next Steps

1. Review generated docs in `docs/`
2. Proceed to design phase with tech stack now defined
3. Update ADRs if new architectural decisions emerge during design