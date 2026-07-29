# List Projects API

## Problem Statement

The frontend needs an API client function to call `GET /api/v1/projects` to list projects for a given team, with support for pagination and filtering by project status.

## Motivation

This enables the Projects page to fetch and display projects from the backend API. Currently there's no client-side function to call this endpoint, so the Projects page cannot load project data.

## Scope

**In scope:**
- Add `listProjects(params)` function to `src/shared/api/projects.ts`
- Function accepts: `teamId` (required UUID), `status` (optional: planned|in_progress|completed|canceled), `cursor` (optional string), `limit` (optional 1-100, default 20)
- Returns `{ data: Project[], pagination: { nextCursor: string | null, hasMore: boolean } }`
- Error handling for 400 (validation) and 401 (unauthorized)
- Update `useProjectsStore` to call the API on mount with loading state
- Add cursor-based pagination support for infinite scroll
- Update `ProjectsPage.tsx` to fetch on mount with loading state

**Out of scope:**
- Backend API implementation (handled separately)
- Project creation/update/delete endpoints
- Real-time updates via WebSocket

## Impact

- **Files affected:** `src/shared/api/projects.ts`, `src/features/projects/store/projectsStore.ts`, `src/features/projects/pages/ProjectsPage.tsx`
- **Consumers:** Projects page, any feature listing projects
- **Dependencies:** Requires `apiClient` from `src/shared/api/client.ts` and `Project` type from shared types