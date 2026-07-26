# Layout Module — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| Layout State | Zustand store | Centralized responsive state management | Additional store complexity |
| Theme Persistence | localStorage + CSS custom properties | Instant theme switching, no flash | Storage limit, no sync across tabs |
| Responsive Detection | CSS media queries + JS matchMedia | Reliable breakpoint detection | Requires JS for dynamic changes |
| Sidebar Animation | CSS transitions | Smooth, performant animations | Limited control vs JS animation |

## Component Tree

```
App
├── AppLayout (Zustand-backed)
│   ├── Sidebar
│   │   ├── TeamSelector
│   │   ├── SidebarToggle
│   │   ├── NavItems
│   │   └── SidebarFooter
│   ├── MobileSidebarOverlay (mobile)
│   ├── Header
│   │   ├── Logo
│   │   ├── ThemeToggle
│   │   └── UserMenu
│   └── MainContent
│       └── {PageContent}
└── Backdrop (mobile)
```

| Component | Responsibility | Props | State |
|-----------|---------------|-------|-------|
| AppLayout | Manages layout state via Zustand useUIStore | — | sidebarCollapsed, theme |
| Sidebar | Navigation panel (desktop/tablet) | collapsed, onToggle | — |
| MobileSidebarOverlay | Mobile sidebar overlay | isOpen, onClose | — |
| Header | Top navigation bar | — | — |
| ThemeToggle | Theme selection control | currentTheme, availableThemes, onThemeChange | light, dark, system |
| Backdrop | Mobile sidebar overlay | isVisible, onClick | — |

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| / | Dashboard | protected | Main layout with sidebar |
| /projects | Projects | protected | Project list view |
| /tasks | Tasks | protected | Task management view |
| /settings | Settings | protected | User preferences |

## State Management

- **Global state**: Zustand store (useUIStore) for sidebar and theme state, persisted to localStorage
- **Local state**: Component-level UI state (dropdowns, modals)
- **Server state**: Zustand stores for data fetching (projects, tasks)

## Data Fetching

- **Client**: fetch with custom API client
- **Error handling**: Toast notifications, retry logic
- **Optimistic updates**: Sidebar state persisted to localStorage

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| Logo | public/logo.svg | App branding |
| Icons | shared/ui/icons/ | Navigation icons |
| Fonts | Inter (Google Fonts) | Primary typeface |

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| themeSelection | MUST be one of: light, dark, system | Invalid theme selection |
| breakpoint | MUST match device thresholds | Invalid device detection |
| sidebarState | MUST persist across page refreshes | Sidebar state lost |
| themePreference | MUST store in local storage | Theme preference not persisted |

## Accessibility

- **Keyboard navigation**: Tab order follows header → sidebar → main content
- **ARIA**: Navigation landmark, aria-labels for icon buttons
- **Screen reader**: Live regions for theme changes, sidebar state announcements
- **Focus management**: Focus returns to trigger after overlay closes
- **Reduced motion**: Respects prefers-reduced-motion media query