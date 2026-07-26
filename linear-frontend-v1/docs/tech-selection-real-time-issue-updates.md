# Tech Selection — Real-time Issue Updates (Frontend)

## Decision Summary

| Category | Decision | Rationale |
|----------|----------|-----------|
| Frontend Framework | Next.js 14 | App Router, SSR support for real-time updates, ecosystem maturity | RTS, present user flows, conversion from React+Vite to Next.js App Router for better real-time initialization | | Real-time Protocol | WebSocket | Bidirectional push support for real-time event processing, implements checklist requirements for issue updates | Real-time updates detected in wireframes/mockups, essential for event processing, aligned with Ticket 09 (Realtime Module) | | State Management | Zustand 5 + React Query | Successful state management store, optimized for real-time event processing, team expertise, pagination support for large issue lists, meeting checklist requirements | Fast, reactive, team expertise, efficient event handling and state synchronization | | Styling | Tailwind CSS 4 | Rapid UI development, supports event status indicators, previously used, team expertise | Existing stack, persistence, supports real-time event display design | | API Client | React Query + WebSocket | SSR capable, supports real-time updates, authenticated requests, pagination, caching of WebSocket events | Checklist requirement: process WebSocket events from event streams, supports real-time issue updates, efficient event handling | | Real-time Infrastructure | Server-Sent Events (SSE) / WebSocket | Provides real-time event processing, optimized HTTP with dedicated protocol, supports event streams for checklist processing | Implements checklist items for issue update types, consistent with future WebSocket module processing | | Deployment | Docker | Containerized deployment for real-time updates, can be scaled independently, aligns with system architecture | Consistency, scaling, production deployment, enables smooth rollout of real-time features |

## Generated Files

The tech-selection skill generated these files in `docs/`:

| File | Source Template | Status |
|------|----------------|--------|
| `docs/stack-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/stack-templates.md` | ✅ Existing documentation |
| `docs/architecture-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/architecture-templates.md` | ✅ Updated |
| `docs/deployment.md` | `openspec/schemas/frontend-schema/templates/technology/deployment-templates.md` | ✅ Updated |

> **Note**: Status is updated to ✅ only after Phase 7 (File Verification) confirms each file exists on disk.

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| 1 | Frontend Framework | React 19 + Vite 8 | Next.js 14 with App Router | ✅ Approved — Better real-time initialization, full-stack capabilities for event processing |
| 2 | Real-time Protocol | SSE (Server-Sent Events) | WebSocket | ✅ Approved — Bidirectional real-time event processing, aligned with Checklist requirements |
| 3 | State Management | Zustand 5 | React Query | ✅ Modified — Combined Zustand + React Query for optimal real-time event handling, efficient event synchronization |
| 4 | API Client | Custom fetch | React Query + WebSocket | ✅ Approved — Real-time support, caching, and authentication for WebSocket events |

## ADR References

- ADR-001: Frontend Real-time Architecture — see `adr.md` for full record.

## Next Steps

1. Review generated docs in `docs/`
2. Proceed to design phase with tech stack now defined
3. Update ADRs if new architectural decisions emerge during design
