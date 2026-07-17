# ADR Review Manifest

- Status: completed
- Review date: 2026-07-17

## Review Summary

Three durable architecture decision records were created for the auth module change, covering the frontend framework, state management, and styling decisions defined during tech-selection. Additional implementation-level decisions (auth token strategy, route protection) are documented in the design doc but do not warrant repo-level ADRs — they are specific to this change's implementation.

## In-Force ADRs Reviewed

- None — `<repo>/adr/` has no prior in-force ADRs.

## New Durable ADRs Created

### ADR-0001: React 19 + Vite + pnpm

**Status**: Accepted

**Context**: The frontend needs a framework for the Linear App Clone SPA. The app is a dashboard-style client-side application with no SSR requirement. The API backend is external and already defined via OpenAPI.

**Decision Drivers**:
- Fast developer iteration (HMR, build speed)
- Strong TypeScript ecosystem
- Minimal configuration overhead
- Dependency management strictness

**Considered Options**:
- React 18 + Vite + npm
- Next.js 14 (App Router)
- Vue 3 + Vite
- SvelteKit

**Decision Outcome**: Chosen **React 19 + Vite + pnpm** because React 19 provides the latest concurrent features, Vite offers sub-second HMR and native ESM builds, and pnpm provides strict dependency resolution with disk-efficient storage.

**Consequences**:
- Good: Fast HMR, simple build config, strict dependency tree
- Good: pnpm's workspace support for future monorepo expansion
- Bad: No SSR — all content is client-rendered
- Follow-up: Evaluate Vite PWA plugin for offline support

### ADR-0002: Zustand for State Management

**Status**: Accepted

**Context**: The auth module requires a store that holds `accessToken`, `user`, and auth status. This store must be accessible outside the React tree (API interceptor needs to read the token without a component context).

**Decision Drivers**:
- Token must be readable outside React (fetch interceptor)
- Minimal boilerplate for a single auth store
- TypeScript first-class support

**Considered Options**:
- Zustand
- Redux Toolkit
- Jotai
- React Context + useReducer

**Decision Outcome**: Chosen **Zustand** because it is ~1KB, works outside React tree natively, requires no Provider wrapper, and has excellent TypeScript inference.

**Consequences**:
- Good: Auth store can be imported directly in API client module
- Good: Minimal boilerplate — store is ~30 lines
- Bad: Manual devtools setup required
- Follow-up: Add Zustand devtools middleware in development

### ADR-0003: Tailwind CSS + shadcn/ui

**Status**: Accepted

**Context**: The app needs consistent styling that maps to design-system tokens (colors, spacing, typography). Components must be accessible by default.

**Decision Drivers**:
- Design-system token alignment with utility classes
- Accessible component primitives out of the box
- Rapid prototyping without context-switching to CSS files

**Considered Options**:
- Tailwind CSS alone
- CSS Modules
- styled-components
- Tailwind CSS + shadcn/ui

**Decision Outcome**: Chosen **Tailwind CSS + shadcn/ui** because Tailwind's utility-first approach maps directly to design-system tokens, and shadcn/ui provides copy-pasteable, accessible React primitives built on Radix UI.

**Consequences**:
- Good: Design tokens → Tailwind config → consistent styling
- Good: shadcn/ui components are accessible by default (keyboard, ARIA, screen reader)
- Bad: JSX can become verbose with many utility classes
- Bad: shadcn/ui is a copy-paste pattern, not a dependency — upgrades are manual
- Follow-up: Extract repeated utility patterns into shared component wrappers
