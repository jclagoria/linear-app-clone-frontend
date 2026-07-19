# Tech Selection — Linear App Clone (Frontend)

## Decision Summary

This change does not modify the technology stack. The centralized MSW handlers use the existing `msw` (v2.7.5) package already declared in `package.json`. All technology decisions are documented in the existing files below.

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Frontend Framework | React 19 + Vite | See `docs/stack-frontend.md` | — |
| State Management | Zustand | See `docs/stack-frontend.md` | — |
| Styling | Tailwind CSS + shadcn/ui | See `docs/stack-frontend.md` | — |
| Testing | Vitest + MSW + Playwright | See `docs/stack-frontend.md` | — |
| API Mocking | MSW v2 | Already a dependency, supports both Node (vitest) and browser (dev/Playwright/Storybook) | — |
| Deployment | Vercel | See `docs/deployment.md` | — |

## Generated Files

The tech stack is already fully documented. No new files were generated — this change reuses the existing stack.

| File | Source Template | Status |
|------|----------------|--------|
| `docs/stack-frontend.md` | Existing | ✅ Already exists |
| `docs/architecture-frontend.md` | Existing | ✅ Already exists |
| `docs/deployment.md` | Existing | ✅ Already exists |

## ADR References

No new architectural decisions introduced by this change. The MSW handler centralization is a code organization refactor, not a technology choice.

## Next Steps

1. Proceed to design phase with existing tech stack
2. Create `design-frontend.md` documenting the handler structure
