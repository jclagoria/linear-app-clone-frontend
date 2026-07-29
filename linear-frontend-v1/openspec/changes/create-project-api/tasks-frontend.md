# Tasks — Create Project API (Frontend)

## Scaffold

- [x] Create `src/features/projects/` directory structure (`ui/`, `model/`)
- [x] Add `createProject()` function to `src/shared/api/projects.ts` — `apiClient.post<Project>('/projects', { body: { teamId, name, description, startDate, targetDate } })`
- [x] Create `src/features/projects/model/validation.ts` with Zod schema matching spec validation rules (teamId UUID, name 1-255, description max 1000, startDate/targetDate ISO date regex, optional)

## Components

- [x] Create `src/features/projects/ui/ProjectForm.tsx`
  - Fields: teamId (hidden input), name (TextInput), description (Textarea), startDate (TextInput type="date"), targetDate (TextInput type="date")
  - States: idle → form enabled; submitting → button loading + fields disabled; field-error → per-field error message; server-error → ErrorBanner above form
- [x] Create `src/features/projects/ui/CreateProjectDialog.tsx`
  - Modal + ProjectForm wrapper, mirrors `IssueFormModal` pattern
  - Submitting: passes through to form loading state
  - Success: closes modal, success toast "Project created", calls `addProject()` in store
  - Server validation error (400): inline ErrorBanner in form
  - Business rule error (422): inline ErrorBanner in form
  - Forbidden (403): error toast "You don't have permission to create projects"
  - Generic error: error toast "Failed to create project"

## State & Data

- [x] In `CreateProjectDialog`, call `createProject()` on form submit, then `useProjectsStore.getState().addProject(project)` on success (pessimistic — no store changes until API confirms)

## Routing

- [x] In `ProjectsPage`, add "New Project" button that opens `CreateProjectDialog` — no new route, modal overlay pattern

## Integration

- [x] Connect `CreateProjectDialog` to existing `ProjectsPage` — button triggers `isOpen` state, dialog renders conditionally

## Validation

- [x] Write unit test for `createProject()` API function (vitest, mock `apiClient.post`)
- [x] Write unit test for `ProjectForm` validation — empty name, name >255, invalid date format, valid submission
- [x] Write component test for `CreateProjectDialog` — modal open/close, success flow, error flow (403 toast, 422 inline)
- [ ] Write a11y test — modal focus trap, Escape close, `aria-describedby` on errors, `aria-live` region

## Review

- [x] Verify all states from mockups are covered in components (idle, loading, empty, error, success)
- [x] Verify shared components used per design-system catalog (no new custom UI)
- [x] Verify error handling per spec (400 = inline, 403 = toast, 422 = inline, 401 = redirect via interceptor)
