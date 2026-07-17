---
status: accepted
date: 2026-07-17
decision-makers: Developer
---

# ADR-0006: Stack Selection — Zustand, Vite, React Router, Vitest

## Context and Problem Statement

The frontend codebase uses several core technologies that were adopted during initial scaffolding without formal documentation of rationale. As the project grows, these decisions need to be recorded for consistency, onboarding, and future evaluation. The affected technologies are:

- State management library (Zustand)
- Build tool and dev server (Vite)
- Client-side routing (React Router DOM)
- Test runner (Vitest)

Each must be documented against alternatives evaluated in prior tech research.

## Decision Drivers

- Performance — build speed, dev server responsiveness, and runtime efficiency
- TypeScript integration — first-class TypeScript support without workarounds
- Ecosystem maturity — stable APIs, community adoption, and long-term maintainability
- Alignment with prior research — the tech research digest evaluates these options for React frontends

## Considered Options

### State Management: Zustand vs Redux Toolkit vs TanStack Query

| Criterion | Zustand | Redux Toolkit | TanStack Query |
|-----------|---------|---------------|----------------|
| Bundle size | ~1 KB | ~11 KB | ~13 KB |
| Boilerplate | Minimal (create) | Moderate (slice, store, actions) | Moderate (query key, fetcher) |
| Server state | Manual | Manual | Built-in caching, refetch, stale-while-revalidate |
| Client state | Natural (direct subscribe) | Natural (selectors) | Not designed for client state |
| Learning curve | Low | Moderate | Moderate |

### Build Tool: Vite vs Webpack vs Turbopack

| Criterion | Vite | Webpack | Turbopack |
|-----------|------|---------|-----------|
| Dev server startup | Instant (ES modules) | Slow (bundle) | Fast (Rust-based) |
| HMR | Fast (ESM-based) | Moderate | Fast |
| Production build | Rollup (mature) | Webpack (mature) | Beta (Rust) |
| Configuration | Minimal | Complex | Minimal |
| TypeScript | Native | Loader required | Native |
| Ecosystem | Mature | Mature | Emerging |

### Routing: React Router DOM vs TanStack Router

| Criterion | React Router DOM | TanStack Router |
|-----------|-----------------|-----------------|
| Maturity | De facto standard | Newer (v1) |
| Type safety | String paths, manual params | Full type inference on params, search params |
| Loader / action API | Yes (v6.4+) | Yes (built-in) |
| Community | Largest | Growing |
| Bundle size | ~14 KB | ~19 KB |

### Test Runner: Vitest vs Jest

| Criterion | Vitest | Jest |
|-----------|--------|------|
| ESM support | Native | Requires ts-jest, experimental |
| Speed | 2-3x faster (esbuild transform) | Slower (Babel/ts-jest transform) |
| API compatibility | Jest-compatible (drop-in for most cases) | Standard |
| Vite integration | Native (same config) | Separate config |
| TypeScript | Native | Requires ts-jest or Babel |

## Decision Outcome

### Chosen: Zustand (state management)

Chosen because it is the lightest weight option, has zero boilerplate, and the application's state needs (session, UI preferences) are simple client-only stores. TanStack Query can be added later if server-state caching complexity grows.

### Chosen: Vite (build tool)

Chosen because it provides instant dev server startup, fast HMR, native TypeScript support, and minimal configuration. The project is a CSR (client-side rendered) app, so SSR features from Next.js are not needed.

### Chosen: React Router DOM (routing)

Chosen because it is the de facto React routing standard with a mature API (v7 with loaders/actions). Its string-path approach is sufficient for the current page count. TanStack Router can be re-evaluated if type-safe routing becomes a pain point.

### Chosen: Vitest (test runner)

Chosen because it is ESM-native, 2-3x faster than Jest, shares the Vite config (no duplication), and provides a Jest-compatible API. This aligns with ADR-010 in the tech research digest.

### Consequences

- Good, because all four choices are listed as viable options in the tech research digest.
- Good, because Zustand + Vite + React Router + Vitest form a lightweight, fast, and well-documented stack.
- Good, because Vitest shares Vite's transform pipeline, reducing config duplication.
- Bad, because migrating from React Router to TanStack Router later would require rewriting all route definitions.
- Bad, because Zustand does not provide built-in server-state caching; a future migration to TanStack Query or React Query may be needed.

### Confirmation

- All four technologies are documented in the project's `package.json`.
- State stores use `create()` from Zustand.
- Routes use `createBrowserRouter` from React Router DOM.
- Tests use `vitest` with `@vitejs/plugin-react`.
- Build and dev use `vite` commands.

## Pros and Cons of the Options

### Zustand

- Good, because it is unopinionated — store shape and actions are plain functions, not framework constructs.
- Good, because selectors prevent unnecessary re-renders without memoization.
- Good, because middleware (persist, devtools) is opt-in.
- Bad, because for complex server-state synchronization, manual `useEffect` or a library like TanStack Query is still needed.

### Vite

- Good, because HMR is instant even with 100+ modules.
- Good, because Rollup-based production builds are consistently fast.
- Good, because Tailwind CSS v4 integration is native via `@tailwindcss/vite`.
- Bad, because if SSR becomes a requirement, migrating to Next.js or adding `@angular/ssr`-equivalent would be a large effort.

### React Router DOM

- Good, because nested layouts and relative routing compose naturally with the FSD page structure.
- Good, because data loaders and actions (v6.4+) enable per-route data fetching without `useEffect`.
- Bad, because string-path type safety requires manual parameter type annotations.

### Vitest

- Good, because ESM-native execution avoids the broken ESM support issues in Jest.
- Good, because `vi.mock`, `vi.spyOn`, and `vi.fn` match Jest's API — no new patterns to learn.
- Bad, because `jest-preset-angular` is not available; AnalogJS's Vitest preset is less mature (not applicable to this React project).

## More Information

The tech research digest (references/tech-research-digest.md) lists all four chosen technologies as recommended or viable options for React frontends:
- **Zustand**: Listed under React state options
- **Vite**: Listed as CSR option alongside Next.js for SSR
- **React Router DOM**: Listed as routing option alongside TanStack Router
- **Vitest**: Recommended for React over Jest (aligned with ADR-010)

The `@/` path alias is configured in both `vite.config.ts` and `vitest.config.ts` for consistent imports across source and test files.
