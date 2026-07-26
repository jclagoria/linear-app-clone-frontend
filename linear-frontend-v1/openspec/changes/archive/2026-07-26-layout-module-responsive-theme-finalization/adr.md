# ADR Review Manifest

- Status: completed
- Review date: 2026-07-26

## Review Summary

ADR review completed for the Layout Module — Responsive & Theme Finalization change.

## In-Force ADRs Reviewed

- ADR-0001: Feature-Sliced Design adoption — architecture pattern
- ADR-0002: Zustand for state management — state management approach
- ADR-0003: Tailwind CSS v4 for styling — styling solution

## New Durable ADRs Created

### ADR-0004: Layout State Management via React Context

**Status**: Accepted

**Context**: The Layout Module requires centralized state management for responsive sidebar behavior and theme switching across all screen sizes. This state must be accessible throughout the component tree without prop drilling.

**Considered Options**:
- React Context + useReducer: Built-in, no additional dependencies, simple API
- Zustand store: Consistent with existing state management, but adds another store
- Redux Toolkit: Overkill for layout state, adds complexity

**Decision**: We will use React Context with useReducer for layout state management because:
1. Layout state is primarily UI state, not business data
2. Reduces bundle size vs adding another Zustand store
3. Built-in React solution with no external dependencies
4. Simpler API for layout-specific operations

**Consequences**:
- Positive: Lightweight solution, no additional dependencies
- Positive: Natural fit for UI state that doesn't need persistence
- Negative: Cannot use Zustand devtools for debugging layout state
- Follow-up: Document context usage patterns in shared/ui/LayoutProvider

### ADR-0005: Theme Persistence via localStorage + CSS Custom Properties

**Status**: Accepted

**Context**: Theme preference must persist across browser sessions and apply instantly without flash of unstyled content (FOUC).

**Considered Options**:
- localStorage + CSS custom properties: Instant switching, no FOUC
- Cookies + server-side: Adds backend complexity, slower
- URL parameters: Not persistent, poor UX

**Decision**: We will use localStorage for persistence and CSS custom properties for instant theme application because:
1. Instant theme switching with no network requests
2. No server-side complexity
3. Works offline
4. CSS custom properties enable smooth transitions

**Consequences**:
- Positive: Instant theme switching, no FOUC
- Positive: Works offline, no server dependency
- Negative: Theme not synced across tabs (acceptable trade-off)
- Negative: Storage limit (5MB) but theme data is minimal
- Follow-up: Consider broadcast channel API for cross-tab sync if needed

### ADR-0006: Responsive Detection via CSS Media Queries + matchMedia

**Status**: Accepted

**Context**: The application must detect viewport size to adapt sidebar behavior (expanded, collapsed, overlay).

**Considered Options**:
- CSS media queries + JS matchMedia: Reliable, performant, standard
- Viewport resize events: Can cause performance issues
- Third-party library: Adds dependency, overkill

**Decision**: We will use CSS media queries for layout changes and JS matchMedia for dynamic detection because:
1. CSS media queries handle most responsive layout needs
2. JS matchMedia provides programmatic access for sidebar state
3. No performance overhead from resize event listeners
4. Standard web APIs with broad browser support

**Consequences**:
- Positive: Performant, no resize event listeners needed
- Positive: Consistent behavior across browsers
- Negative: Requires JS for dynamic state changes
- Follow-up: Test on target devices to verify breakpoint accuracy