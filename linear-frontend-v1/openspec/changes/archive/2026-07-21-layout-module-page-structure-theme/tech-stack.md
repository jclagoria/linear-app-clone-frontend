# Tech Selection — Linear App Clone (Frontend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Layout Architecture | Flexbox shell with collapsible sidebar | Simpler than CSS Grid for variable-width sidebar; flex shrink/grow handles content area expansion natively | Grid would give more control over header/ sidebar/ content row/column placement at the cost of extra markup |
| Sidebar State | Zustand (existing pattern) | UIStore already has `sidebarCollapsed` field with persist middleware; no new dependency or pattern to learn | Ties sidebar state to Zustand; would need migration if state strategy changes |
| Theme System | CSS custom properties + `data-theme` attribute | Works outside React context (prevents flash on load); Tailwind `dark:` variant insufficient for three-state system (light/dark/system) | Two sources of truth risk (Tailwind classes + custom properties); must coordinate token definition |
| Theme Persistence | localStorage via Zustand persist middleware | Existing pattern in UIStore; survives refresh; no cookie overhead | Not syncable across tabs without BroadcastChannel; not available in SSR |
| Mobile Overlay | Fixed panel with backdrop + focus trap | Native to layout; no library dependency; focus trapped via JS | Loses ARIA dialog pattern vs `<dialog>` element; must manage focus manually |

## Generated Files

The tech-selection process produced these files in `docs/`:

| File | Source Template | Status |
|------|----------------|--------|
| `docs/stack-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/stack-templates.md` | ✅ Updated |
| `docs/architecture-frontend.md` | `openspec/schemas/frontend-schema/templates/technology/architecture-templates.md` | ✅ Updated |
| `docs/deployment.md` | `openspec/schemas/frontend-schema/templates/technology/deployment-templates.md` | ✅ Verified |

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| 1 | Layout Architecture | Flexbox shell | — | Approved |
| 2 | Sidebar State | Zustand | — | Approved |
| 3 | Theme System | CSS custom properties + data-theme | — | Approved |
| 4 | Theme Persistence | localStorage | — | Approved |
| 5 | Mobile Overlay | Fixed panel + focus trap | — | Approved |

## ADR References

- ADR decision: Layout architecture → flexbox shell with collapsible sidebar, CSS custom property theme system, Zustand-managed UI state. See `adr.md` for full record (pending).

## Next Steps

1. ✅ Generated docs in `docs/` — stack, architecture, deployment
2. Proceed to design phase with tech stack now defined
3. Update ADRs if new architectural decisions emerge during design
