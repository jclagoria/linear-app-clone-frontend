# Tech Selection — Realtime Module (Frontend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| WebSocket API | Native `WebSocket` | No protocol overhead; backend owns the server; custom reconnect per spec | No automatic fallback to HTTP long-polling (socket.io provides) |
| State Management | Zustand (existing stores) | Already in use; natural extension with new slices | No built-in devtools integration like Redux Toolkit |
| Optimistic Update Tracking | Custom Zustand slice | Centralized pending state; 30s staleness check; revert data co-located | Custom implementation vs. TanStack Query's built-in optimistic updates |
| Testing (WebSocket) | MSW websocket handler | Already in devDependencies; no extra mocking library | MSW WS support is newer; less community examples than socket.io mocks |
| Real-time Transport | WebSocket | Full-duplex; lower latency than SSE; bidirectional needed for heartbeat | More complex than SSE; requires custom reconnection logic |

## Generated Files

| File | Source Template | Status |
|------|----------------|--------|
| `docs/stack-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/stack-templates.md` | ✅ |
| `docs/architecture-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/architecture-templates.md` | ✅ |
| `docs/deployment.md` | `openspec/schemas/frontend-schema/templates/technology/deployment-templates.md` | ✅ |

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| — | — | — | — | No challenges submitted |

## ADR References

- Will be documented in `adr.md` after that artifact is created.

## Next Steps

1. Review generated docs in `docs/`
2. Proceed to design phase with tech stack now defined
3. Update ADRs if new architectural decisions emerge during design
