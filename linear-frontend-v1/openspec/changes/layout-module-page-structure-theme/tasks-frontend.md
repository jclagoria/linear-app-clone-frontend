# Tasks — Layout Module Page Structure & Theme (Frontend)

## Theme System

- [ ] Add CSS custom properties for dark mode in `index.css` under `html[data-theme="dark"]`
- [ ] Add inline anti-flash script in `index.html` that reads persisted theme from localStorage and sets `data-theme` on `<html>` before React mounts
- [ ] Wire `useUIStore.theme` to update `document.documentElement.dataset.theme` on change
- [ ] Listen to `prefers-color-scheme` media query when theme is "system" and update `data-theme` accordingly

## Components

- [ ] Create `src/widgets/Header/ui/Header.tsx` — extract header from AppLayout into its own widget with search trigger, notification bell, theme toggle, and user avatar
- [ ] Create `src/widgets/Header/ui/ThemeToggle.tsx` — cycles through light/dark/system with aria-label reflecting current mode and next action
- [ ] Create `src/widgets/Header/ui/SearchTrigger.tsx` — button stub that opens command palette (implementation deferred, shows trigger only)
- [ ] Extract `src/widgets/Header/ui/NotificationBell.tsx` — bell icon with unread badge from AppLayout's inline markup
- [ ] Create `src/widgets/Header/index.ts` — barrel export
- [ ] Create `src/widgets/Sidebar/ui/TeamSelector.tsx` — team selector dropdown with aria-haspopup, aria-expanded, role="listbox"
- [ ] Add TeamSelector to Sidebar header area above nav links
- [ ] Create mobile sidebar overlay: fixed panel with slide-in animation, backdrop, and focus trap in `Sidebar.tsx` (or a new `MobileSidebar.tsx`)
- [ ] Create `src/widgets/Sidebar/ui/HamburgerButton.tsx` — mobile menu toggle, visible only below 768px

## Responsive Layout

- [ ] Add responsive breakpoints to layout shell: desktop (>1024px), tablet (768-1024px), mobile (<768px)
- [ ] On mobile (<768px): hide sidebar, show hamburger button in header, sidebar renders as overlay panel with backdrop
- [ ] On tablet/mobile: ensure collapsed sidebar works side-by-side alongside content

## State & Data

- [ ] Ensure `uiStore` theme persists across sessions (already has `persist` middleware — verify `partialize` includes `theme`)
- [ ] Verify `uiStore.sidebarCollapsed` persists across sessions (already persists — verify)
- [ ] Add `isMobileSidebarOpen` local state (useState) in `AppLayout` or `Sidebar` — resets on navigation

## Routing

- [ ] Ensure AppLayout layout route in `router.tsx` wraps all authenticated pages with `<Outlet />` (already done — verify correct nesting)

## Accessibility

- [ ] Add `aria-current="page"` on active nav link (NavLink already handles via React Router — verify)
- [ ] Add focus trap on mobile sidebar overlay: trap Tab/Shift+Tab inside panel when open
- [ ] Move focus to first nav link when mobile sidebar opens; return to hamburger when it closes
- [ ] Add Escape key handler to close mobile sidebar overlay
- [ ] Ensure all icon-only buttons have descriptive `aria-label` (search trigger, collapse toggle, hamburger, theme toggle)
- [ ] Ensure notification bell `aria-label` includes unread count (e.g., "3 unread notifications")
- [ ] Ensure backdrop has `aria-label="Close menu"` and is dismissible on click
- [ ] Respect `prefers-reduced-motion: reduce` — disable sidebar collapse and overlay slide animations

## Testing

- [ ] Unit test: `Sidebar` renders nav items and toggle responds to `collapsed`/`onToggle` props
- [ ] Unit test: `NavLink` renders active state with `aria-current="page"`
- [ ] Unit test: `ThemeToggle` cycles through light → dark → system → light
- [ ] Unit test: `TeamSelector` opens/closes dropdown and calls onSelect
- [ ] Unit test: mobile sidebar overlay opens/closes, focus trap works, Escape dismisses
- [ ] Unit test: `uiStore` persist middleware saves/restores `sidebarCollapsed` and `theme`
- [ ] Integration test: layout renders sidebar, header, and Outlet content correctly
- [ ] E2E test: sidebar collapse/expand persists across page navigation
- [ ] E2E test: theme switch applies correctly and persists on reload
- [ ] E2E test: mobile sidebar opens via hamburger and closes via backdrop and Escape

## Review

- [ ] Verify all components follow FSD directory structure (widgets/Sidebar/, widgets/Header/)
- [ ] Verify all components align with existing ADRs (0007 store isolation, 0009 UI component architecture)
- [ ] Run `npm run lint` and fix any issues
- [ ] Run `npm run typecheck` and fix any type errors
- [ ] Run test suite and verify all tests pass
