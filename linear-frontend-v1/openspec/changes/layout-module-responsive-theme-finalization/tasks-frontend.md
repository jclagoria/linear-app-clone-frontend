# Tasks — Layout Module — Responsive & Theme Finalization (Frontend)

## Scaffold

- [ ] Create LayoutProvider context with theme and sidebar state
- [ ] Set up CSS custom properties for theme tokens
- [ ] Configure responsive breakpoints in Tailwind config
- [ ] Add localStorage persistence for theme and sidebar state

## Components

- [ ] Create Header component with logo, theme toggle, and user menu
- [ ] Create Sidebar component with navigation items and toggle
- [ ] Create ThemeToggle component with light/dark/system options
- [ ] Create Backdrop component for mobile sidebar overlay
- [ ] Create MainContent wrapper for page content
- [ ] Implement responsive sidebar states (expanded, collapsed, overlay)

## State & Data

- [ ] Create LayoutContext with useReducer for state management
- [ ] Implement theme switching with CSS custom properties
- [ ] Add device detection via matchMedia API
- [ ] Create sidebar toggle and collapse logic
- [ ] Add localStorage persistence for user preferences

## Routing

- [ ] Set up React Router with layout wrapper
- [ ] Create Dashboard page component
- [ ] Create Projects page component
- [ ] Create Tasks page component
- [ ] Create Settings page component with theme selection

## Integration

- [ ] Connect LayoutProvider to app root
- [ ] Integrate Header and Sidebar into layout
- [ ] Add responsive CSS for tablet and mobile breakpoints
- [ ] Implement theme switching across all components

## Validation

- [ ] Unit tests for LayoutProvider context
- [ ] Unit tests for theme switching logic
- [ ] Integration tests for sidebar responsive behavior
- [ ] E2E tests for theme persistence across sessions
- [ ] Accessibility tests for keyboard navigation and ARIA

## Review

- [ ] Self-review against design-frontend.md
- [ ] Verify all mockup screens are implemented
- [ ] Test responsive behavior at all breakpoints
- [ ] Validate theme switching and persistence
- [ ] PR checklist completed