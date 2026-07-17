# ADR Review Manifest

- Status: completed
- Review date: 2026-07-17

## Review Summary

ADR review completed for the Routing Module change. Existing repository ADRs were reviewed for impact. No new durable ADRs are required — all routing design decisions implement already-accepted architectural choices (ADR-0004 FSD layer structure, ADR-0005 form management).

## In-Force ADRs Reviewed

- **ADR-0004: Feature-Sliced Design Architecture** — Confirmed compatible. The routing module lives in a new `src/app/` layer (consistent with FSD: `app/` owns the router provider, shell layout, and providers). Route config is centralized at `src/app/router.ts`. Sidebar and nav components belong in `src/widgets/Sidebar/` (FSD widgets layer). Page components remain in `src/pages/`. No FSD boundary violations introduced.

- **ADR-0005: React Hook Form + Zod for Form Management** — Not directly impacted by this change. The routing module does not introduce new forms. LoginPage form (pre-existing) remains compliant.

## New Durable ADRs Created

- None — the routing module's design decisions are implementations of already-accepted architectural choices:

  | Design Decision | Existing ADR / Doc |
  |----------------|--------------------|
  | React Router v7 (createBrowserRouter) | ADR-0001 (stack selection), docs/stack-frontend.md |
  | AuthGuard wrapper + Zustand useAuthStore | docs/architecture-frontend.md (boot sequence, auth module) |
  | useSearchParams() for query param state | Standard React Router pattern — not architecturally significant |
  | axios not chosen; native fetch with interceptor | docs/architecture-frontend.md (REST + fetch with interceptor) |
  | Splash / auth hydration in App boot | docs/architecture-frontend.md (boot sequence) |
  | Sidebar useLocation() + useMatch() for active route | Implementation detail of design-frontend.md — not a durable architectural decision |
  | 404 catch-all via `*` route | Standard React Router pattern |

  If any of these decisions later prove contentious or need revisiting, a new ADR should be created at that time.
