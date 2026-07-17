---
status: accepted
date: 2026-07-17
decision-makers: Developer
---

# ADR-0004: Feature-Sliced Design Architecture

## Context and Problem Statement

The frontend codebase started with a flat folder structure (`components/`, `hooks/`, `stores/`, `pages/`, `lib/`, `types/`). As the project grows, this structure leads to decreasing module isolation, unclear dependency direction, and difficulty locating code by domain. A scalable architectural pattern is needed to enforce boundaries, improve navigability, and prevent circular dependencies.

## Decision Drivers

- Module isolation — features should not import from one another arbitrarily
- Dependency direction — lower layers must not depend on higher layers
- Navigability — a new developer should find code by domain, not by type
- Alignment with prior research — the tech research digest recommends FSD for React frontends

## Considered Options

- **Feature-Sliced Design (FSD)** — structured by layers (app → pages → features → entities → shared) with strict import rules
- **Flat / modular** — current structure; groups files by type (components/, hooks/, stores/)
- **Vertical slices** — group by feature only, without strict layer boundaries

## Decision Outcome

Chosen option: "Feature-Sliced Design (FSD)", because it provides enforceable layer rules, aligns with prior tech research (ADR-0001 stack selection), and prevents the common React anti-pattern of unconstrained cross-feature imports.

### Consequences

- Good, because dependency direction is explicit: `shared` → `entities` → `features` → `pages` → `app`; no circular imports.
- Good, because adding a new feature means creating a self-contained slice under `features/` without touching unrelated directories.
- Good, because `shared/` components and `entities/` models are reusable across features.
- Bad, because migrating an existing flat codebase to FSD requires moving many files and updating imports.
- Bad, because over-engineering small features into FSD layers adds friction for trivial code.

### Confirmation

- All source files under `src/` must belong to one of the FSD layers: `app/`, `pages/`, `features/`, `entities/`, `shared/`.
- Imports must follow FSD layer rules (e.g., `features/` may not import from other `features/` slices).
- The `lint-staged` configuration or CI must enforce boundary rules once an ESLint/eslint-plugin-boundaries setup is adopted.

## Pros and Cons of the Options

### Feature-Sliced Design (FSD)

- Good, because layer rules are well-documented and widely adopted in the React ecosystem.
- Good, because it maps cleanly to domain-driven concepts (entities = business models, features = user interactions).
- Neutral, because FSD adds some initial structure overhead for small apps.
- Bad, because without tool-enforced boundaries (eslint-plugin-boundaries), the rules remain convention-only.

### Flat / modular (current)

- Good, because it is simple and has no learning curve.
- Bad, because as the app grows, cross-feature imports become hard to track.
- Bad, because related code is scattered across `components/`, `hooks/`, `stores/`, `types/`, making refactors costly.

### Vertical slices

- Good, because it groups by feature without multiple layers.
- Bad, because without a `shared/` layer, common UI and logic is duplicated across slices.
- Bad, because it does not distinguish between business entities and feature-specific code.

## More Information

The FSD layer structure adopted:

```
  src/
    app/           — Application shell, router, providers, global styles
    pages/         — Route pages composing features
    features/      — Feature slices (auth, issues, projects, …)
    widgets/       — Composable UI blocks combining entities/features
    entities/      — Business entities (session, user, project, …)
    shared/        — Reusable UI components, utilities, API client
  ```

Layer import rules:
- `app/` → `pages/`, `features/`, `widgets/`, `entities/`, `shared/`
- `pages/` → `features/`, `widgets/`, `entities/`, `shared/`
- `features/` → `entities/`, `shared/`, `widgets/` (NOT other features)
- `widgets/` → `features/`, `entities/`, `shared/` (NOT pages, NOT app)
- `entities/` → `shared/` (NOT features)
- `shared/` → itself, node_modules only
