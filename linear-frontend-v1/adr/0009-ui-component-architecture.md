---
status: accepted
date: 2026-07-20
decision-makers: Developer
---

# ADR-0009: UI Component Architecture — Presentational Primitives

## Context and Problem Statement

The UI Module specification defines 10 generic components (Button, Input, Select, Checkbox, Textarea, Modal, Card, Toast, EmptyState, LoadingIndicator) that must be built as reusable primitives. These components are consumed by feature modules, the Form Module, and the Layout Module.

The team needs to decide on component architecture patterns:

1. How should components accept and forward HTML attributes?
2. Where should state live (local vs global) for each component?
3. How should composed components (Modal, Toast) manage stack/multi-instance state?
4. How should variants be managed (prop-based, CSS-based)?

## Decision Drivers

- Consistency — all primitives follow the same compositional and API patterns
- Developer experience — intuitive props that mirror native HTML elements
- Accessibility — ARIA attributes must be composable, not obscured
- Bundle size — minimal overhead per component
- Alignment with existing codebase — Button, Spinner, TextInput already exist in `shared/ui/`

## Considered Options

### Component API: forwardRef + native props vs custom prop interface

| Criterion | forwardRef + native props | Custom prop interface |
|-----------|--------------------------|-----------------------|
| Ref forwarding | Built-in | Manual ref management |
| Native attribute support | Automatic via spread | Must redefine every prop |
| TypeScript ergonomics | Extends `ButtonHTMLAttributes` | Custom interface, less familiar |
| Accessibility | Native `aria-*` props work naturally | Must expose aria props explicitly |
| Bundle impact | Negligible | Negligible |

### State strategy: component-local vs Zustand store

| Criterion | Component-local useState | Zustand store |
|-----------|--------------------------|---------------|
| State isolation | Natural per-instance | Must instance-key in store |
| Reset on unmount | Automatic | Manual cleanup |
| Cross-component communication | Impossible without lift | Built-in |
| Complexity | Zero | Store setup, selectors |
| Testability | Simple (render + assert) | Store mock or real store |

### Toast / Modal state: instance-keyed Zustand vs Context

| Criterion | Zustand store | React Context |
|-----------|---------------|---------------|
| Access outside React | Natural (store.getState) | Impossible |
| Re-render isolation | Selector-based | All consumers re-render |
| Devtools | Zustand devtools | React DevTools |
| Boilerplate | create() + actions | Provider + reducer + dispatch |

## Decision Outcome

### Chosen: forwardRef + native HTML attribute extension

All components extend their corresponding native HTML element props using `ComponentPropsWithoutRef` or `ComponentPropsWithRef` + `forwardRef`. This enables:

- Automatic forwarding of `aria-*`, `data-*`, `on*`, and standard HTML attributes
- Ref forwarding for form libraries (React Hook Form) and imperative focus management
- Consistent API surface across all primitives

Existing components (Button, TextInput) already follow this pattern; new components will adopt the same convention.

### Chosen: component-local useState for field primitives

Input, Select, Checkbox, and Textarea manage their UI state (focus, hover, open/close) via `useState`. Value state is controlled via props (`value`/`onChange`). This keeps them pure presentational components with zero global side effects.

### Chosen: Zustand stores for cross-cutting UI state

Toast and Modal use dedicated Zustand stores:
- `useToastStore` — manages toast queue, position, auto-dismiss timers
- `useModalStore` — manages modal stack, z-index, scroll lock count

This enables toast/modal triggers from anywhere in the app (including API interceptors, non-React code) and provides selector-based re-render isolation.

### Chosen: class-variance-authority for variant management

CVA (already in dependencies) provides type-safe variant props with Tailwind-compatible class merging via `tailwind-merge`.

### Consequences

- Good, because `forwardRef` + native prop extension is the React 19 standard for library components.
- Good, because component-local state keeps primitives simple, testable, and side-effect-free.
- Good, because Zustand stores for Toast/Modal follow the existing pattern (ADR-0007 store isolation).
- Good, because CVA + `tailwind-merge` handles variant composition without runtime overhead.
- Bad, because `forwardRef` with generic props requires explicit type annotations in TypeScript.
- Bad, because Zustand stores add ~1 KB per store, though negligible compared to the app bundle.

### Confirmation

- All new components in `shared/ui/` extend native HTML element props via `extends ComponentPropsWithoutRef<...>` or equivalent.
- CVA is used for variant definitions in each component.
- Toast and Modal have isolated Zustand stores in `shared/stores/`.
- Field components (Input, Select, Checkbox, Textarea) use controlled `value`/`onChange` with local UI state.

## Pros and Cons of the Options

### forwardRef + native props

- Good, because consumers pass `onClick`, `aria-label`, `data-testid` without wrapper props.
- Good, because React Hook Form's `register()` returns native input props that spread directly onto Input and Select.
- Bad, because TypeScript may require explicit generic annotations for forwarded ref types.

### Component-local useState

- Good, because each instance is fully isolated — no shared state leaks.
- Good, because tests render a component and assert state transitions without store setup.
- Bad, because parent components cannot programmatically control internal UI state (e.g., open a Select from outside).

### Zustand for cross-cutting state

- Good, because `toastStore.addToast()` can be called from API interceptors, effects, and non-React code.
- Good, because modal stack management (push/pop, z-index, scroll lock) is centralized and debuggable.
- Bad, because each store adds a small conceptual overhead for new developers.

## More Information

The component architecture follows patterns from:
- Radix UI primitive design (headless, accessible, composable)
- React 19 `forwardRef` and `useId` documentation
- shadcn/ui component patterns (CVA + Tailwind + forwardRef)

The Zustand store pattern follows ADR-0007 (Store Isolation) — each cross-cutting concern gets its own store rather than a shared global store.
