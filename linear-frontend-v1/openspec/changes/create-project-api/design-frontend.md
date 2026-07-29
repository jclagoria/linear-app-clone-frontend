# Create Project API — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| API function location | `src/shared/api/projects.ts` | Co-located with existing `listProjects()` |
| Store method location | `src/features/realtime/lib/project-store.ts` | `addProject()` already declared; wire to API |
| Form location | `src/features/projects/ui/ProjectForm.tsx` | New feature directory, matches `entities/issue/` pattern |
| Dialog location | `src/features/projects/ui/CreateProjectDialog.tsx` | Wraps ProjectForm in Modal, mirrors `IssueFormModal` |
| Modal overlay, not route | No routing change | Spec says create project is a modal on `/projects` |
| Error pattern per status code | `401` → redirect (auth interceptor handles), `403` → error toast, `400`/`422` → inline form error | Matches IssueFormModal: `BusinessRuleError` re-thrown for inline display |
| Optimistic update | Pessimistic (wait for API success) | Simpler, no rollback needed; projects list is low-frequency |

## Component Tree

```
ProjectsPage
├── PageHeader ("New Project" button)
├── ProjectCardGrid
│   ├── ProjectCard (×N)
│   └── SkeletonCard (loading)
├── EmptyState (no projects)
└── CreateProjectDialog (modal, controlled by isOpen prop)
    └── ProjectForm
        ├── TextInput (name)
        ├── Textarea (description)
        ├── TextInput (startDate — optional)
        ├── TextInput (targetDate — optional)
        ├── ErrorBanner (server/validation error)
        └── Button (Cancel + Create Project)
```

| Component | Responsibility | Props | State |
|-----------|---------------|-------|-------|
| `CreateProjectDialog` | Modal shell, toast on success, error dispatch | `teamId`, `isOpen`, `onClose` | open, closed |
| `ProjectForm` | Form fields, Zod validation, submit handler | `teamId`, `onSuccess`, `onCancel` | idle, submitting, field-error, server-error |
| `ProjectsPage` (existing) | Project list + "New Project" button | — | (unchanged) |

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| `/projects` | `ProjectsPage` | protected | "New Project" button toggles `isOpen` on `CreateProjectDialog` |

No new route — modal overlay on existing page.

## State Management

- **Global state**: `useProjectsStore` (Zustand) — `addProject(project)` inserts at top of project list after successful API call.
- **Local state**: `useForm` + `zodResolver` in `ProjectForm` — form values, field errors, `isSubmitting`.
- **Server state**: No cache layer (no React Query). `useCacheStore` invalidation within `addProject()` already handles `projects` list refresh.

## Data Fetching

- **Client**: `apiClient.post<Project>('/projects', { body })` in `createProject()` function at `src/shared/api/projects.ts`.
- **Error handling**:
  - `ValidationError` (400) → `setError()` on specific fields in form
  - `BusinessRuleError` (422) → re-throw, caught in dialog for inline `ErrorBanner`
  - `ForbiddenError` (403) → error toast "You don't have permission to create projects"
  - `UnauthorizedError` (401) → auth interceptor handles redirect
  - Generic → error toast "Failed to create project"
- **Optimistic updates**: Pessimistic — only add to store on success response.

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| `Modal` | `@/shared/ui/Modal` | Existing, used as wrapper |
| `TextInput` | `@/shared/ui/TextInput` | For name, startDate, targetDate |
| `Textarea` | `@/shared/ui/Textarea` | For description |
| `Button` | `@/shared/ui/Button` | Primary (submit) + secondary (cancel) |
| `ErrorBanner` | `@/shared/ui/ErrorBanner` | Server error display |
| `Toast` | `@/shared/stores/toastStore` | Via `useToastStore().addToast()` |
| `Spinner` | `@/shared/ui/Spinner` | In Button `loading` prop |
| Icons | lucide-react | Already in dependency tree |

No new assets required.

## Validation Strategy

| Field | Rule | Zod Schema | Error Message |
|-------|------|-----------|---------------|
| `teamId` | Required, valid UUID | `z.string().uuid()` | "Team is required" |
| `name` | Required, 1-255 chars | `z.string().min(1).max(255)` | "Name is required" / "Name must be 255 characters or less" |
| `description` | Optional, max 1000 chars | `z.string().max(1000).optional().or(z.literal(''))` | "Description must be 1000 characters or less" |
| `startDate` | Optional, ISO 8601 date | `z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal(''))` | "Invalid start date format" |
| `targetDate` | Optional, ISO 8601 date | `z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal(''))` | "Invalid target date format" |

Schema defined in `src/features/projects/model/validation.ts`.

## Accessibility

- **Keyboard navigation**: Modal handles Escape → close, Tab trap, auto-focus first field (via existing `Modal` component).
- **ARIA**: `Modal` provides `role="dialog"`, `aria-modal="true"`, `aria-labelledby` on title.
- **Screen reader**: Field errors via `aria-describedby` (TextInput component), form-level errors via `aria-live="polite"` region, loading state disables submit button.
