# Tasks — Layout Module Page Structure & Theme (Frontend)

## Theme System

- [x] Add CSS custom properties for dark mode in `index.css` under `html[data-theme="dark"]`
- [x] Add inline anti-flash script in `index.html` that reads persisted theme from localStorage and sets `data-theme` on `<html>` before React mounts
- [x] Wire `useUIStore.theme` to update `document.documentElement.dataset.theme` on change
- [x] Listen to `prefers-color-scheme` media query when theme is "system" and update `data-theme` accordingly

## Components

- [x] Create `src/widgets/Header/ui/Header.tsx` — extract header from AppLayout into its own widget with search trigger, notification bell, theme toggle, and user avatar
- [x] Create `src/widgets/Header/ui/ThemeToggle.tsx` — cycles through light/dark/system with aria-label reflecting current mode and next action
- [x] Create `src/widgets/Header/ui/SearchTrigger.tsx` — button stub that opens command palette (implementation deferred, shows trigger only)
- [x] Extract `src/widgets/Header/ui/NotificationBell.tsx` — bell icon with unread badge from AppLayout's inline markup
- [x] Create `src/widgets/Header/index.ts` — barrel export
- [x] Create `src/widgets/Sidebar/ui/TeamSelector.tsx` — team selector dropdown with aria-haspopup, aria-expanded, role="listbox"
- [x] Add TeamSelector to Sidebar header area above nav links
- [x] Create mobile sidebar overlay: fixed panel with slide-in animation, backdrop, and focus trap (`MobileSidebarOverlay.tsx`)
- [x] Create `src/widgets/Sidebar/ui/HamburgerButton.tsx` — mobile menu toggle, visible only below 768px

## Responsive Layout

- [x] Add responsive breakpoints to layout shell: desktop (>1024px), tablet (768-1024px), mobile (<768px)
- [x] On mobile (<768px): hide sidebar, show hamburger button in header, sidebar renders as overlay panel with backdrop
- [x] On tablet/mobile: ensure collapsed sidebar works side-by-side alongside content

## State & Data

- [x] Ensure `uiStore` theme persists across sessions (already has `persist` middleware — verify `partialize` includes `theme`)
- [x] Verify `uiStore.sidebarCollapsed` persists across sessions (already persists — verify)
- [x] Add `isMobileSidebarOpen` local state (useState) in `AppLayout` — resets on navigation (closes on nav link click)

## Routing

- [x] Ensure AppLayout layout route in `router.tsx` wraps all authenticated pages with `<Outlet />` (already done — verified correct nesting)

## Accessibility

- [x] Add `aria-current="page"` on active nav link (NavLink already handles via React Router — verified)
- [x] Add focus trap on mobile sidebar overlay: trap Tab/Shift+Tab inside panel when open
- [x] Move focus to first nav link when mobile sidebar opens; return to hamburger when it closes
- [x] Add Escape key handler to close mobile sidebar overlay
- [x] Ensure all icon-only buttons have descriptive `aria-label` (search trigger, collapse toggle, hamburger, theme toggle)
- [x] Ensure notification bell `aria-label` includes unread count (e.g., "3 unread notifications")
- [x] Ensure backdrop is dismissible on click (backdrop is decorative per DS: `aria-hidden="true"`, close action via Escape + hamburger button)
- [x] Respect `prefers-reduced-motion: reduce` — disable sidebar collapse and overlay slide animations

## Testing

- [x] Unit test: `Sidebar` renders nav items and toggle responds to `collapsed`/`onToggle` props
- [x] Unit test: `NavLink` renders active state with `aria-current="page"`
- [x] Unit test: `ThemeToggle` cycles through light → dark → system → light
- [x] Unit test: `TeamSelector` opens/closes dropdown and calls onSelect
- [x] Unit test: mobile sidebar overlay opens/closes, focus trap works, Escape dismisses
- [x] Unit test: `uiStore` persist middleware saves/restores `sidebarCollapsed` and `theme`
- [x] Integration test: layout renders sidebar, header, and Outlet content correctly
- [ ] E2E test: sidebar collapse/expand persists across page navigation (requires Playwright setup)
- [ ] E2E test: theme switch applies correctly and persists on reload (requires Playwright setup)
- [ ] E2E test: mobile sidebar opens via hamburger and closes via backdrop and Escape (requires Playwright setup)

## Review

- [x] Verify all components follow FSD directory structure (widgets/Sidebar/, widgets/Header/)
- [x] Verify all components align with existing ADRs (0007 store isolation — UIStore persist, 0009 UI component architecture — forwardRef + native prop extension)
- [x] Run `npm run lint` and fix any issues (all new code clean; pre-existing warnings remain in apiClient tests)
- [x] Run `npm run typecheck` and fix any type errors (passes clean)
- [x] Run test suite and verify all tests pass (221/221 passing)
