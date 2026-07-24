# Tasks — Form Module: Validation & Submission (Frontend)

## Scaffold

- [x] Create form module directory structure: `src/features/form/`
- [x] Install `@hookform/resolvers` if not present
- [x] Create `src/features/form/model/` for validation schemas
- [x] Create `src/features/form/ui/` for field wrapper components
- [x] Create `src/features/form/lib/` for form utilities

## Components

- [x] Create `TextField` component with label, input, hint, error display
- [x] Create `SelectField` component with label, select, hint, error display
- [x] Create `CheckboxField` component with checkbox, label, description, error display
- [x] Create `TextareaField` component with label, textarea, hint, error, character count
- [x] Create `SubmitButton` component with loading spinner and disabled state
- [x] Create `useFormFormik` hook wrapping react-hook-form with Zod resolver

## State & Data

- [x] Define Zod schemas for form validation (required, minLength, maxLength, pattern)
- [x] Implement async validation via Zod `.refine()` with debounce
- [x] Create form state management hook (values, errors, touched, isSubmitting, isValid)
- [x] Implement double-submit prevention via `isSubmitting` flag
- [x] Implement form disabled state during submission

## Routing

- [x] Add `/issues/create` route with `CreateIssuePage`
- [x] Add `/issues/:id/edit` route with `EditIssuePage`
- [x] Add `/projects/:id/settings` route with `ProjectSettingsPage`
- [x] Add `/profile` route with `ProfilePage`

## Integration

- [x] Connect `IssueCreateForm` to `useFormFormik` with `createIssueSchema`
- [x] Connect `IssueEditForm` to `useFormFormik` with `editIssueSchema`
- [x] Connect `ProjectSettingsForm` to `useFormFormik` with `projectSettingsSchema`
- [x] Connect `ProfileForm` to `useFormFormik` with `profileSchema`
- [x] Wire form submission to Zustand store actions

## Validation

- [x] Unit tests for Zod validation schemas (required, minLength, maxLength, pattern)
- [x] Unit tests for `useFormFormik` hook (form state, submission, error handling)
- [x] Unit tests for field wrapper components (TextField, SelectField, CheckboxField, TextareaField)
- [x] Integration tests for form submission flow (validate → loading → submit → success/error)
- [x] Integration tests for double-submit prevention
- [x] Integration tests for async validation (pending, valid, invalid states)
- [x] E2E test for standard form submission flow
- [x] E2E test for form validation error display
- [x] E2E test for async validation (username availability)

## Review

- [x] Self-review: all components follow ADR-0009 (forwardRef, native props, CVA)
- [x] Self-review: all forms use react-hook-form + Zod per ADR-0005
- [x] Self-review: accessibility (keyboard, ARIA, screen reader) per design-frontend.md
- [x] PR checklist: tests pass, lint clean, no console errors
