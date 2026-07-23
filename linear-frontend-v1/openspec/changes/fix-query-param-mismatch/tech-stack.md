# Tech Selection — Fix Query Parameter Mismatch

## Decision Summary

No new technology decisions. This change operates entirely within the existing stack.

| Category | Current Decision | Relevance |
|----------|-----------------|-----------|
| Frontend Framework | React 19 + Vite 8 | Affected files use existing patterns |
| State Management | Zustand 5 | Filter state is managed via Zustand store |
| API Client | Axios via `apiClient` singleton | Query params constructed and sent here |
| API Protocol | REST (OpenAPI 3.1 Design-First) | The spec is the source of truth being aligned to |
| Language | TypeScript 6 | No type changes needed |

## Existing Stack Reference

See `docs/stack-frontend.md` for the full stack definition.

## ADR References

No new ADRs. This change follows the existing API contract without introducing architectural decisions.
