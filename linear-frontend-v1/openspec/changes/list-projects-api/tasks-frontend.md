# Tasks — List Projects API (Frontend)

## Scaffold

- [ ] Add `listProjects` function to `src/shared/api/projects.ts` — `apiClient.get<PaginatedResponse<Project>>('/projects', { params })` with `teamId`, `status`, `cursor`, `limit`
- [ ] Add `PaginatedResponse<T>` generic type and `ProjectListParams` type in api types

## Components

- [ ] Update `src/pages/ProjectsPage.tsx` — wire to API, add loading/empty/error states per design-frontend
- [ ] Add `StatusFilter` dropdown component in `src/features/projects/ui/` — filters by `planned | in_progress | completed | canceled`
- [ ] Add `ErrorMessage` component in `src/features/projects/ui/` — inline message + retry button
- [ ] Add `LoadingSpinner` component in `src/features/projects/ui/` — CSS-based spinner
- [ ] Refine `EmptyState` in `src/features/projects/ui/` — variants: filtered-to-zero, first-run

## State & Data

- [ ] Extend `useProjectsStore` in `src/features/realtime/lib/project-store.ts` — add `pagination` (nextCursor, hasMore), `fetchProjects`, `fetchMore`, loading/error fields
- [ ] Handle pagination: append on scroll, `hasMore` guard, "No more projects" indicator
- [ ] Handle re-fetch on status filter change (replace list, not append)

## Routing

- [ ] Update route `/projects` to use updated `ProjectsPage` (path likely exists already)

## Integration

- [ ] Connect `ProjectsPage` to real `apiClient.get` calls via `useProjectsStore.fetchProjects`
- [ ] Replace mock data with live API response

## Validation

- [ ] Unit tests: `listProjects` params validation (teamId required/UUID, status enum, limit range)
- [ ] Unit tests: `useProjectsStore` fetch/more/pagination/reset logic
- [ ] Integration test: `ProjectsPage` render cycle — loading → populated filter → scroll pagination → error/retry

## Review

- [ ] Self-review: verify all BDD scenarios from `list-projects.spec.md` are covered
- [ ] Check a11y: `aria-live` on loading/error, `role="article"` on cards, keyboard nav through filter + list
- [ ] PR checklist: no new deps, inline error handling, cursor pagination follows API contract