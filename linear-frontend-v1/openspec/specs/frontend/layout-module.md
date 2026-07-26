# Layout Module — Frontend Specification

## Behaviour

**Feature:** Application Layout Shell

The Layout Module SHALL provide a consistent page structure across all authenticated pages. The layout SHALL compose a sidebar, header, and scrollable content area into a full-height viewport shell. The sidebar SHALL be collapsible with persisted state. A sticky header SHALL provide global action triggers. The layout SHALL adapt to screen size with responsive breakpoints. Theme switching SHALL support light, dark, and system-follow modes with persisted preference.

### Requirement: PageLayoutStructure

The application SHALL render a full-height layout with sidebar, header, and main content area. The content area SHALL scroll independently of the sidebar and header.

#### Scenario: DefaultLayoutRender

- **GIVEN** the user navigates to any authenticated page
- **WHEN** the page renders
- **THEN** a sidebar is displayed on the left
- **AND** a sticky header is displayed at the top
- **AND** the main content fills the remaining space
- **AND** the layout occupies the full viewport height

#### Scenario: ScrollableContent

- **GIVEN** the layout is rendered with content exceeding the viewport height
- **WHEN** the user scrolls within the content area
- **THEN** the sidebar remains fully visible
- **AND** the header remains fixed at the top
- **AND** only the content area scrolls

### Requirement: SidebarCollapse

The sidebar SHALL support a collapsed mode that shows icons only. The collapsed state SHALL be persisted across sessions.

#### Scenario: CollapseSidebar

- **GIVEN** the sidebar is in expanded state
- **WHEN** the user clicks the collapse toggle
- **THEN** the sidebar reduces to a narrow icon-only width
- **AND** navigation link labels are hidden
- **AND** the content area expands to fill the reclaimed space

#### Scenario: ExpandSidebar

- **GIVEN** the sidebar is in collapsed state
- **WHEN** the user clicks the expand toggle
- **THEN** the sidebar returns to full width
- **AND** navigation link labels are visible again
- **AND** the content area adjusts to its original width

#### Scenario: PersistCollapsedState

- **GIVEN** the user has collapsed the sidebar
- **WHEN** the user navigates to another page
- **THEN** the sidebar remains collapsed
- **AND** when the user refreshes the browser, the sidebar remains collapsed

### Requirement: SidebarNavigation

The sidebar SHALL display navigation links with visual indicators for the active route.

#### Scenario: NavigateViaSidebar

- **GIVEN** the user is on any page
- **WHEN** the user clicks a navigation link in the sidebar
- **THEN** the application navigates to the corresponding route
- **AND** the clicked link is visually highlighted as active

#### Scenario: ActiveRouteHighlight

- **GIVEN** the user navigates to a route via the sidebar
- **WHEN** the page loads
- **THEN** the corresponding sidebar link is marked as the active route

### Requirement: SidebarTeamSelector

The sidebar SHALL include a team selector at the top.

#### Scenario: SelectTeam

- **GIVEN** the user is on any page
- **WHEN** the user clicks the team selector in the sidebar
- **THEN** a dropdown with available teams is displayed
- **AND** selecting a team navigates to that team's context

### Requirement: StickyHeader

The header SHALL remain fixed at the top of the viewport during content scroll. It SHALL display a search trigger, notification bell with unread count, and user avatar.

#### Scenario: HeaderStickyBehavior

- **GIVEN** the layout is rendered
- **WHEN** the user scrolls the content area
- **THEN** the header remains fixed at the viewport top

#### Scenario: HeaderElementsDisplay

- **GIVEN** the layout is rendered
- **WHEN** the user views the header
- **THEN** a search trigger icon is displayed
- **AND** a notification bell with unread count badge is displayed
- **AND** the current user's avatar is displayed

#### Scenario: SearchTriggerClick

- **GIVEN** the header is displayed
- **WHEN** the user clicks the search trigger
- **THEN** the command palette opens (implementation deferred to a separate change)

#### Scenario: NotificationBellDisplay

- **GIVEN** the user has unread notifications
- **WHEN** the header renders
- **THEN** the notification bell displays a badge with the unread count

### Requirement: ResponsiveBreakpoints

The layout SHALL adapt to screen width using defined breakpoints: desktop (>1024px), tablet (768-1024px), and mobile (<768px).

#### Scenario: DesktopLayout

- **GIVEN** the viewport width is greater than 1024px
- **WHEN** the layout renders
- **THEN** the sidebar is always visible and accessible, displayed side-by-side with the content area
- **AND** the sidebar is in its default (expanded) state
- **AND** the sidebar maintains consistent positioning and width

#### Scenario: TabletLayout

- **GIVEN** the viewport width is between 768px and 1024px
- **WHEN** the layout renders
- **THEN** the sidebar is side-by-side with the content area
- **AND** the sidebar can be collapsed to icon-only mode

#### Scenario: MobileLayoutOverlay

- **GIVEN** the viewport width is less than 768px
- **WHEN** the layout renders
- **THEN** the sidebar is hidden
- **AND** the header displays a hamburger menu button
- **AND** the content takes full viewport width

#### Scenario: MobileSidebarOpen

- **GIVEN** the viewport width is less than 768px and the sidebar is hidden
- **WHEN** the user taps the hamburger menu button
- **THEN** the sidebar slides in as an overlay
- **AND** a semi-transparent backdrop is displayed behind the sidebar
- **AND** tapping the backdrop closes the sidebar

#### Scenario: MobileSidebarCloseOnNavigate

- **GIVEN** the mobile sidebar overlay is open
- **WHEN** the user taps a navigation link
- **THEN** the sidebar overlay closes
- **AND** the application navigates to the selected route

### Requirement: ThemeSwitching

The application SHALL support three theme modes: light, dark, and system (follow OS preference). The selected mode SHALL be persisted and applied instantly.

#### Scenario: SwitchToDarkTheme

- **GIVEN** the current theme is light
- **WHEN** the user selects dark theme
- **THEN** all UI elements display in dark mode colors
- **AND** the theme preference is saved

#### Scenario: SwitchToLightTheme

- **GIVEN** the current theme is dark
- **WHEN** the user selects light theme
- **THEN** all UI elements display in light mode colors
- **AND** the theme preference is saved

#### Scenario: SystemThemeFollow

- **GIVEN** the user has selected system theme
- **WHEN** the OS theme preference changes from light to dark
- **THEN** the application switches to dark mode
- **AND** when the OS preference returns to light, the application switches back

#### Scenario: ThemePersistence

- **GIVEN** the user has selected dark theme
- **WHEN** the user refreshes the browser
- **THEN** the application renders in dark mode
- **AND** the theme preference is applied before the first paint to avoid flashing

#### Scenario: ThemeInitialDefault

- **GIVEN** a user visits the application for the first time
- **WHEN** no theme preference is stored
- **THEN** the default theme is system (follow OS preference)

## User Flow

1. User authenticates and is redirected to the dashboard
2. Layout Module renders PageLayout: sidebar, sticky header, content area
3. Sidebar shows nav links with active route highlighted; user can collapse/expand
4. On mobile (<768px), sidebar is hidden behind hamburger menu with overlay
5. Header shows search trigger, notification bell with count, user avatar
6. User can switch theme via a theme toggle (placement TBD in design)
7. Theme and sidebar collapsed state persist across sessions

## Components

### PageLayout

- **Purpose**: Root layout component that composes sidebar, header, and content
- **Props**: `children` (ReactNode — page content)
- **States**: N/A (always rendered)
- **Events**: N/A (pass-through container)

### Sidebar

- **Purpose**: Main navigation sidebar with collapsible state and responsive behavior
- **Props**: `collapsed` (boolean), `onToggle` (callback), `currentRoute` (string), `deviceType` (desktop | tablet | mobile)
- **States**: expanded, collapsed, mobile-overlay (visible), mobile-hidden
- **Events**: `onToggle`, `onNavigate`, `onCloseRequest`

### Header

- **Purpose**: Sticky top bar with global action triggers
- **Props**: `unreadCount` (number), `user` (User)
- **States**: default
- **Events**: `onSearchClick`, `onNotificationsClick`, `onUserMenuClick`

### ThemeToggle

- **Purpose**: Button or menu item to switch between light/dark/system themes
- **Props**: `currentTheme` (Theme), `onChange` (callback)
- **States**: light, dark, system
- **Events**: `onChange`

## Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| * (all authenticated routes) | PageLayout | Wraps all pages inside the layout shell |

The Layout Module does not define routes; it wraps any authenticated page rendered by the Routing Module.

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Theme preference | MUST be one of "light", "dark", "system" | N/A (internal enum) |
| Sidebar collapsed | MUST be boolean | N/A (internal state) |

## Accessibility

- **PageLayout**: The layout SHALL use `role="none"` on the container, `role="banner"` on header, `role="navigation"` on sidebar, and `role="main"` on content area.
- **Sidebar**: The sidebar SHALL be navigable via keyboard. Collapse toggle SHALL have `aria-label="Collapse sidebar"` / `aria-label="Expand sidebar"`. Nav links SHALL use proper `<a>` elements or elements with `role="link"`.
- **Sidebar overlay (mobile)**: The backdrop SHALL have `aria-label="Close menu"` and dismiss on `Escape` key. Focus SHALL be trapped inside the overlay when open.
- **Header**: The search trigger SHALL have `aria-label="Search"` or `aria-label="Open command palette"`. The notification bell SHALL have `aria-label="Notifications"` with `aria-label` including unread count (e.g., "3 unread notifications"). The user avatar SHALL have `aria-haspopup="true"`.
- **Theme toggle**: SHALL have proper `aria-label` indicating current theme and action (e.g., "Switch to dark mode").
- **Focus management**: When mobile sidebar opens, focus SHALL move to the first nav link. When it closes, focus SHALL return to the hamburger button.
- **Color contrast**: Both light and dark themes SHALL meet WCAG 2.1 AA contrast ratios for all text and interactive elements.
- **Reduced motion**: Theme transitions and sidebar animations SHOULD respect `prefers-reduced-motion`.
- **High contrast**: Theme switching SHALL include high contrast mode options for users who need enhanced visibility.
