# Tasks — List Projects API (Frontend)

## Scaffold

- [x] Add `listProjects` function to `src/shared/api/projects.ts` — `apiClient.get<PaginatedResponse<Project>>('/projects', { params })` with `teamId`, `status`, `cursor`, `limit`
- [x] Add `PaginatedResponse<T>` generic type and `ProjectListParams` type in api types

## Components

- [x] Update `src/pages/ProjectsPage.tsx` — wire to API, add loading/empty/error states per design-frontend
- [x] Add `StatusFilter` dropdown component in `src/features/projects/ui/` — filters by `planned | in_progress | completed | canceled`
- [x] Add `ErrorMessage` component in `src/features/projects/ui/` — inline message + retry button
- [x] Add `LoadingSpinner` component in `src/features/projects/ui/` — CSS-based spinner
- [x] Refine `EmptyState` in `src/features/projects/ui/` — variants: filtered-to-zero, first-run

## State & Data

- [x] Extend `useProjectsStore` in `src/features/realtime/lib/project-store.ts` — add `pagination` (nextCursor, hasMore), `fetchProjects`, `fetchMore`, loading/error fields
- [x] Handle pagination: append on scroll, `hasMore` guard, "No more projects" indicator
- [x] Handle re-fetch on status filter change (replace list, not append)

## Routing

- [x] Update route `/projects` to use updated `ProjectsPage` (path likely exists already)

## Integration

- [x] Connect `ProjectsPage` to real `apiClient.get` calls via `useProjectsStore.fetchProjects`
- [x] Replace mock data with live API response

## Validation

- [x] Unit tests: `listProjects` params validation (teamId required/UUID, status enum, limit range)
- [x] Unit tests: `useProjectsStore` fetch/more/pagination/reset logic
- [x] Integration test: `ProjectsPage` render cycle — loading → populated filter → scroll pagination → error/retry

## Review

- [x] Self-review: verify all BDD scenarios from `list-projects.spec.md` are covered
- [x] Check a11y: `aria-live` on loading/error, `role="article"` on cards, keyboard nav through filter + list
- [x] PR checklist: no new deps, inline error handling, cursor pagination follows API contract