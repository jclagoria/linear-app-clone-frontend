# Tech Selection — Form Module (Validation & Submission)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Form Library | react-hook-form + Zod | Minimal re-renders, schema-based validation, TypeScript-first | Learning curve for Zod schemas vs ad-hoc validation |
| State Management | Zustand 5 | Existing project choice, lightweight, devtools support | Already adopted; no new dependency |
| Styling | Tailwind CSS v4 | Existing project choice, utility-first, design-system alignment | Already adopted; no new dependency |
| Testing | Vitest + Testing Library + MSW | Existing project choice, fast, mocks API at network level | Already adopted; no new dependency |

## Form Module Technology Stack

### react-hook-form

- **Why**: Minimal re-render performance, native Zod integration via `@hookform/resolvers`, uncontrolled components reduce memory
- **Usage**: `useForm` hook per form instance, `Controller` for custom field wrappers, `FormProvider` for nested fields
- **Validation**: Zod schemas defined per-form, resolved via `zodResolver`

### Zod 4

- **Why**: TypeScript inference eliminates manual type definitions, composable schemas, runtime validation with static types
- **Usage**: Schema per form (e.g., `createIssueSchema`), field-level refinements, async validation via `.refine()`
- **Trade-off**: Slightly larger bundle than Yup, but superior TypeScript support

### Field Wrapper Pattern

- **Why**: Composes label + input + hint + error into reusable component, encapsulates react-hook-form `Controller` logic
- **Components**: `TextField`, `SelectField`, `CheckboxField`, `TextareaField`
- **Integration**: Each wrapper accepts `name`, `control`, `rules` props and renders the field group

## Generated Files

The following files in `docs/` document the full project stack:

| File | Status | Notes |
|------|--------|-------|
| `docs/stack-frontend.md` | Existing | Full frontend stack (React 19, Vite 8, Zustand, etc.) |
| `docs/architecture-frontend.md` | Existing | Frontend architecture (FSD, component design, data flow) |
| `docs/deployment.md` | Existing | Deployment configuration |

> **Note**: These files already exist and cover the form module's technology choices within the broader project context. No updates required for this change.

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| 1 | Form Library | Ad-hoc validation | react-hook-form + Zod | Approved — reduces boilerplate, improves consistency |
| 2 | State Integration | Context API | Zustand (existing) | Approved — no new dependency, already in project |

## ADR References

- ADR-001: Form validation approach — react-hook-form + Zod over Formik or custom

## Next Steps

1. Review generated docs in `docs/`
2. Proceed to design phase with tech stack now defined
3. Update ADRs if new architectural decisions emerge during design
