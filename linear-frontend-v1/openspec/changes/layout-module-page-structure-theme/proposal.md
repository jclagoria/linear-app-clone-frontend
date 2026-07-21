# Layout Module — Page Structure & Theme

## Problem Statement

The application lacks a consistent page structure. Each page must independently handle sidebar, header, and layout — leading to duplicated effort, inconsistent navigation, and no unified approach to responsive behavior or theme switching. Users cannot collapse the sidebar, the layout does not adapt to mobile screens, and there is no theme support (light/dark/system).

## Motivation

A shared Layout Module provides a consistent, responsive application shell across all pages. Users benefit from a collapsible sidebar for focused work, a sticky header with global actions (search, notifications, user menu), a mobile-friendly layout that adapts to any screen size, and the ability to switch between light and dark themes with preference persistence. This is foundational infrastructure that every page depends on.

## Scope

- **In scope**:
  - `PageLayout` component composing sidebar, header, and content area
  - Collapsible sidebar with navigation links and team selector
  - Sticky header with search trigger, notification bell, and user menu
  - Responsive behavior: side-by-side on desktop, overlay sidebar with backdrop on mobile
  - Theme switching: light, dark, and system (follow OS preference)
  - Theme preference persistence across sessions
  - Full-height layout with scrollable content area
  - Sidebar collapsed state persistence
- **Out of scope**:
  - Actual search/command palette functionality (trigger only)
  - Notification list or real-time notification features (count display only)
  - User menu dropdown content (avatar and trigger only)
  - Backend theme API or user-specific theme sync
  - Keyboard shortcut integration for sidebar toggle (UI component only)

## Impact

- **Routing Module**: Routes render inside the new `PageLayout` — layout wraps all authenticated pages
- **State Module (UI Store)**: Consumes `sidebarCollapsed` and `theme` fields already defined in the UI Store shape
- **State Module (Persistence)**: Theme preference and sidebar state are persisted to local storage per existing patterns
- **All page components**: Will render inside the shared layout instead of managing their own page structure
