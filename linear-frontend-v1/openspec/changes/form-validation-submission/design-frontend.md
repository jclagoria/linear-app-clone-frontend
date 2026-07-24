# Form Module — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| Form Library | react-hook-form | Minimal re-renders, native Zod integration, uncontrolled components | Learning curve vs ad-hoc validation |
| Validation | Zod schemas | TypeScript inference, composable, runtime + static types | Slightly larger bundle than Yup |
| Field Wrappers | Custom components | Compose label + input + hint + error, encapsulate Controller | More code than raw inputs, but consistent UX |
| Double-Submit Guard | `isSubmitting` flag | Simple, no external dependency, blocks during async | No mutex library needed |
| Async Validation | Zod `.refine()` + debounce | Single validation pipeline, no separate library | Manual debounce implementation |

## Component Tree

```
FormModule/
├── useFormFormik/
│   ├── useForm (react-hook-form)
│   ├── zodResolver
│   └── validation state
├── FieldWrappers/
│   ├── TextField/
│   │   ├── Label
│   │   ├── Input
│   │   ├── Hint
│   │   └── ErrorMessage
│   ├── SelectField/
│   │   ├── Label
│   │   ├── Select
│   │   ├── Hint
│   │   └── ErrorMessage
│   ├── CheckboxField/
│   │   ├── Checkbox
│   │   ├── Label
│   │   ├── Description
│   │   └── ErrorMessage
│   └── TextareaField/
│       ├── Label
│       ├── Textarea
│       ├── CharacterCount
│       ├── Hint
│       └── ErrorMessage
└── SubmitButton/
    ├── Spinner
    └── Label
```

| Component | Responsibility | Props | State |
|-----------|---------------|-------|-------|
| `useFormFormik` | Central form state, validation, submission | `defaultValues`, `schema`, `onSubmit` | values, errors, touched, isSubmitting, isValid |
| `TextField` | Single-line text input with label/error/hint | `name`, `control`, `label`, `placeholder`, `hint`, `rules` | touched, error, value |
| `SelectField` | Dropdown selection with label/error/hint | `name`, `control`, `label`, `options`, `hint`, `rules` | touched, error, value |
| `CheckboxField` | Boolean toggle with label/error | `name`, `control`, `label`, `description`, `rules` | touched, error, value |
| `TextareaField` | Multi-line input with label/error/hint/char count | `name`, `control`, `label`, `rows`, `maxLength`, `hint`, `rules` | touched, error, value, charCount |
| `SubmitButton` | Form submission trigger with loading state | `isSubmitting`, `disabled`, `children` | loading |

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| `/issues/create` | `CreateIssuePage` | Protected | Uses `IssueCreateForm` feature |
| `/issues/:id/edit` | `EditIssuePage` | Protected | Uses `IssueEditForm` feature |
| `/projects/:id/settings` | `ProjectSettingsPage` | Protected | Uses `ProjectSettingsForm` feature |
| `/profile` | `ProfilePage` | Protected | Uses `ProfileForm` feature |

## State Management

- **Form state**: react-hook-form (local to each form instance, no global store needed)
- **Global state**: Zustand stores for auth, UI state, theme (unchanged)
- **Server state**: Zustand action thunks for API calls; form submission triggers store actions
- **Optimistic updates**: Store actions save previous state before API call, roll back on failure

### Data Flow (Form Submission)

```
User clicks Submit
  → react-hook-form validates (Zod schema)
    → valid: isSubmitting = true, fields disabled
      → onSubmit handler called with form values
        → API call (fetch via shared/api/client)
          → success: isSubmitting = false, success callback (toast + redirect)
          → failure: isSubmitting = false, error callback (toast), form re-enabled
    → invalid: errors displayed, isSubmitting remains false
```

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| Spinner | `shared/ui/Spinner.tsx` | Used in SubmitButton during loading |
| Error icon | Unicode `⚠` | Inline in ErrorMessage component |
| Success icon | Unicode `✓` | Inline in success banner |
| Check icon | Unicode `✓` | Inline in CheckboxField |

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| Title | required | "Title is required" |
| Title | minLength: 3 | "Title must be at least 3 characters" |
| Title | maxLength: 255 | "Title must be 255 characters or less" |
| Description | maxLength: 5000 | "Description must be 5000 characters or less" |
| Project Slug | required | "Project slug is required" |
| Project Slug | pattern: /^[a-z0-9-]+$/ | "Slug must contain only lowercase letters, numbers, and hyphens" |
| Project Slug | async (check availability) | "This name is already taken" |
| Priority | required | "Priority is required" |

### Validation Timing

- **Default**: On blur (field validates when user leaves the field)
- **On submit**: All fields validated, all errors displayed
- **Async**: Debounced (300ms), blocks submission until complete

## Accessibility

- **Keyboard navigation**: Tab through fields in logical order; Enter/Space for buttons; Escape to cancel
- **ARIA**:
  - `aria-describedby` links error messages to inputs
  - `aria-live="polite"` on error container for screen reader announcements
  - `aria-invalid="true"` on fields with errors
  - `aria-disabled="true"` on form during submission
- **Screen reader**:
  - Labels associated via `htmlFor`/`id`
  - Error messages announced when displayed
  - Loading state announced via `aria-busy`
  - Heading hierarchy: h1 (page) → h2 (form title)
- **Focus management**: Focus moves to first error field on validation failure; focus returns to form after success toast
