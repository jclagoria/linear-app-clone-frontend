# Layout Module — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Layout shell | Flexbox with sidebar + header + content | Flex shrink/grow handles variable-width sidebar; simpler than CSS Grid for this layout pattern |
| Sidebar state | Zustand persist middleware | Existing UIStore pattern; collapsed state survives refresh; no new dependencies |
| Theme system | CSS custom properties + `data-theme` attribute | Works outside React (anti-flash script runs before React mount); supports three-state (light/dark/system); Tailwind `dark:` variant insufficient for three modes |
| Theme persistence | Zustand persist → localStorage | Same pattern as sidebar state; no cookie overhead; survives refresh |
| Mobile sidebar | Fixed overlay panel + backdrop + focus trap | Native to layout; no library needed; focus trapped in JS; `<dialog>` pattern avoided for visual control |
| Responsive strategy | CSS media queries at 768px and 1024px | Clean breakpoint separation; sidebar transitions between side-by-side (>=768px) and overlay (<768px) |

## Component Tree

```
App
└── AppLayout
    ├── Sidebar
    │   ├── TeamSelector
    │   ├── NavLink (×N)
    │   └── SidebarToggle
    ├── Header
    │   ├── HamburgerButton (mobile only)
    │   ├── SearchTrigger
    │   ├── ThemeToggle
    │   ├── NotificationBell
    │   │   └── NotificationBadge
    │   └── UserAvatar
    ├── Backdrop (mobile sidebar open)
    └── <Outlet /> (page content)
```

| Component | Responsibility | Props | State |
|-----------|---------------|-------|-------|
| AppLayout | Root shell composing sidebar, header, content | `children` | N/A (structural) |
| Sidebar | Collapsible nav panel with nav links and team selector | `collapsed`, `onToggle`, `currentRoute` | expanded, collapsed, mobile-hidden, mobile-overlay |
| TeamSelector | Dropdown for team context switching | `teams`, `currentTeam`, `onSelect` | default, open, collapsed |
| NavLink | Sidebar navigation link with active state | `to`, `icon`, `label`, `active` | default, hover, active, collapsed |
| SidebarToggle | Button to collapse/expand sidebar | `collapsed`, `onToggle` | expanded, collapsed |
| Header | Sticky top bar with global action triggers | `unreadCount`, `user` | default |
| HamburgerButton | Mobile menu toggle | `open`, `onToggle` | closed, open |
| SearchTrigger | Opens command palette | `onClick` | default |
| ThemeToggle | Cycles light/dark/system themes | `currentTheme`, `onChange` | light, dark, system |
| NotificationBell | Bell icon with unread badge | `unreadCount` | default, with-unread |
| UserAvatar | User avatar button opening menu dropdown | `user` | default |
| Backdrop | Semi-transparent overlay behind mobile sidebar | `visible`, `onClose` | visible, hidden |

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| * (all authenticated) | AppLayout (via layout route) | Protected | Wraps all authenticated pages via React Router `<Outlet />` |
| /login | LoginPage | Public | Outside layout |

Layout Module does not define page routes; it wraps any authenticated page rendered by the Routing Module using React Router's layout route pattern.

## State Management

- **Global state (Zustand — UIStore)**: `sidebarCollapsed` (boolean, persist middleware), `theme` ("light" | "dark" | "system", persist middleware)
- **Local state**: Mobile sidebar `isOverlayOpen` (boolean, component-level useState — resets on navigation)
- **Server state**: N/A for layout (data fetching is page-level concern)

## Data Fetching

- **Client**: Plain `fetch` with auth interceptor (lib/api)
- **Error handling**: N/A for layout shell (structural wrapper — pages handle their own errors)
- **Optimistic updates**: N/A for layout

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| lucide-react icons | `lucide-react` | Menu, Search, Bell, Sun, Moon, ChevronLeft, ChevronRight, X |
| User avatar | Dynamic (initials fallback) | Generated in component; no static asset |
| Font | Inter (system-ui fallback) | Imported in CSS |

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| Theme preference | MUST be one of "light", "dark", "system" | N/A (internal enum — validated at store setter) |
| Sidebar collapsed | MUST be boolean | N/A (internal state — Zustand schema enforcement) |
| Unread count | MUST be non-negative integer | N/A (API contract) |

## Accessibility

- **Keyboard navigation**: Tab moves through sidebar nav links → header triggers → content. Sidebar collapse toggle is tabbable. On mobile, overlay traps focus inside sidebar until Escape or backdrop click.
- **ARIA**: Sidebar has `role="navigation"` + `aria-label="Main navigation"`. Header has `role="banner"`. Content area has `role="main"`. Active nav link has `aria-current="page"`. Team selector has `aria-haspopup="listbox"` + `aria-expanded`. Collapse toggle changes `aria-label` with state ("Collapse sidebar" / "Expand sidebar"). Icon-only buttons (collapsed sidebar) have `aria-label` matching the link label.
- **Screen reader**: Notification bell `aria-label` includes unread count (e.g., "3 unread notifications"). Badge has `aria-hidden="true"` (count already announced). Theme toggle `aria-label` reflects current mode (e.g., "Switch to dark mode"). Hamburger `aria-label` changes with state ("Open menu" / "Close menu").
- **Focus management**: When mobile sidebar opens, focus moves to first nav link. When it closes, focus returns to hamburger button. Backdrop and Escape key both close overlay.
- **Reduced motion**: Sidebar collapse and overlay slide animations respect `prefers-reduced-motion: reduce` (disable transitions).
- **Color contrast**: Both light and dark theme tokens meet WCAG 2.1 AA (4.5:1 normal text, 3:1 large text).
