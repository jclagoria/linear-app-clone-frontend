# Design System — Add Dockerfile for Containerization

This change does not introduce or modify any UI components. The existing design system (Typography, Colors, Components, Layout Tokens, Accessibility Contract) is unaffected.

## Rationale

The Dockerfile and nginx.conf changes operate at the infrastructure level — they serve the already-built SPA assets. No new visual components, tokens, or UI states are introduced by this change.

## Component Inventory

No components added, removed, or modified.

| Component | Status | Notes |
|-----------|--------|-------|
| All existing components | Unchanged | Served as-is through the nginx container |

## Layout Tokens

Unchanged. The built SPA uses the same CSS/Tailwind tokens regardless of how it is served.

## Accessibility

Unchanged. The nginx server passes through the existing SPA's HTML/CSS/JS without modification.
