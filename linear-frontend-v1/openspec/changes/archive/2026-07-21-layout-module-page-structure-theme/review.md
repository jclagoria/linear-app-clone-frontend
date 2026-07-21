# Review — Layout Module Page Structure & Theme

## Spec Compliance

All requirements from `specs/frontend/layout-module.md` are covered by the planning artifacts:

| Requirement | Covered In | Tasks |
|-------------|-----------|-------|
| PageLayoutStructure — full-height sidebar + header + content | design-frontend (component tree, routing), design-system (PageLayout anatomy) | AppLayout layout route, Header widget extraction |
| ScrollableContent — independent scroll areas | design-frontend (overflow-y auto on content), design-system (content overflow) | Responsive layout tasks |
| SidebarCollapse — toggle with persisted state | tech-stack (Zustand persist), design-frontend (state mgmt), uiStore exists | Sidebar toggle tasks, uiStore verification |
| SidebarNavigation — nav links with active highlight | Sidebar.tsx + NavLink.tsx exist, design-system (NavLink) | Verify active route accessibility |
| SidebarTeamSelector — dropdown team picker | design-frontend (TeamSelector component), design-system (TeamSelector) | Create TeamSelector component |
| StickyHeader — fixed header with search, bell, avatar | design-frontend (Header component tree), AppLayout.tsx exists | Extract Header widget, create SearchTrigger, NotificationBell |
| ResponsiveBreakpoints — desktop, tablet, mobile | design-frontend (responsive strategy), design-system (breakpoint tokens) | Mobile overlay, hamburger, responsive CSS |
| ThemeSwitching — light/dark/system, persist, anti-flash | tech-stack (CSS custom props + data-theme), design-frontend (theme system) | Theme CSS vars, anti-flash script, ThemeToggle, system listener |

## Edge Cases

- **Theme flash on load**: Addressed by inline script in `index.html` that reads localStorage and sets `data-theme` before React mounts — must execute synchronously in `<head>`
- **Mobile sidebar focus management**: Focus must trap inside overlay when open, return to hamburger on close — captured in accessibility tasks
- **System theme changes mid-session**: `matchMedia('prefers-color-scheme')` listener must update `data-theme` reactively when theme is "system"
- **Zero unread notifications**: Badge hidden, aria-label falls back to "Notifications" without count
- **Collapsed sidebar tooltips on hover/focus**: Tooltip appears on icon-only nav links — included in NavLink design but not explicitly in tasks (add if needed)
- **No teams available**: TeamSelector should handle empty teams array gracefully (hide or show "No teams")

## Leakage Check

- No implementation details (file paths, library APIs, framework internals) leaked into specs
- Design decisions reference existing ADRs rather than repeating rationale
- Tasks reference concrete file paths and components without dictating internal implementation
- Tech stack and architecture are documented in `docs/` — planning artifacts reference them by name

## Artifact Coherence

| Artifact | Status | Notes |
|----------|--------|-------|
| proposal | ✅ | Scope well-defined with in/out boundaries |
| specs-frontend | ✅ | BDD scenarios cover all layout behaviors |
| user-flows | ✅ | (implied by proposal + spec flow section) |
| design-system | ✅ | Component catalog with anatomy, states, a11y contracts |
| wireframes | ✅ | Desktop, mobile, collapsed — all 3 states covered |
| mockups | ✅ | Interactive HTML with state toggles (populated/loading/error) |
| tech-stack | ✅ | Approved decisions, references ADRs |
| design-frontend | ✅ | Full component tree, routing, state, a11y |
| adr | ✅ | Existing ADRs confirmed; no new durable ADRs needed |
| tasks-frontend | ✅ | 30 checkboxed tasks covering all components, states, tests, a11y |

## Gaps

- `user-flows.md` artifact exists but was not explicitly reviewed — flow content is embedded in spec scenarios which is sufficient
- `caveman-review` skill not invoked (review is planning-level, not PR-level code review)

## Checklist

- [x] All requirements covered across artifacts
- [x] Scenarios from specs map to design and tasks
- [x] Error states handled (loading skeleton, error state, empty state in mockups)
- [x] No technical detail leaked into specs
- [x] Tasks cover implementation, testing, and accessibility
- [x] Architecture decisions align with existing ADRs and tech research digest
