# Consume Teams API and Render Org Sidebar

## Problem Statement

After authentication completes, the application provides no way for a user to see their teams or switch between organizations. The sidebar shows no org structure, leaving users with no context about which teams they belong to or how they are grouped.

## Motivation

Users need a persistent org switcher and team sidebar to navigate their workspace. Without it, the app has no top-level navigation after login — users cannot discover their teams, switch contexts, or understand which org a team belongs to. This is the primary navigation pattern in Linear and the foundation for all subsequent screens.

## Scope

- **In scope**:
  - New `GET /api/v1/me/teams` API client call
  - Hook that fetches teams and groups them by `orgId`
  - Org sidebar component with collapsible org sections
  - Team items with name and key badge
  - Active team state (persisted in URL/localStorage)
  - Loading, error, empty, and normal states
  - 401 → redirect to login
  - Retry mechanism on 5xx/timeout
  - Single-team/single-org optimization (skip grouping)

- **Out of scope**:
  - Real-time team/org name sync (handled on next page load)
  - Team creation flow (CTA stubs to create-team flow)
  - Drag-and-drop reordering of org sections
  - Search/filter within sidebar
  - Mobile responsive sidebar behavior

## Impact

Affects the frontend sidebar area. New files in `src/api/`, `src/hooks/`, and `src/components/sidebar/`. No backend changes needed — the endpoint already exists. No database schema changes. Existing auth flow is extended but not modified.
