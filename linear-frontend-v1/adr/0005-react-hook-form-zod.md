---
status: accepted
date: 2026-07-17
decision-makers: Developer
---

# ADR-0005: React Hook Form + Zod for Form Management

## Context and Problem Statement

The login form was implemented with raw `useState` for field values, manual `onChange` handlers, and custom validation functions (`isValidEmail`, `isValidPassword`). As the application grows to include signup, issue creation, project settings, and other forms, this approach leads to repetitive boilerplate, inconsistent validation patterns, and difficult-to-test form logic.

## Decision Drivers

- Reduce boilerplate — form state, validation, and submission should be declarative
- Type safety — form data types and validation schemas must be derived from a single source of truth
- Developer experience — fast field registration, minimal re-renders, and clear error handling
- Alignment with prior research — the tech research digest recommends React Hook Form for React projects

## Considered Options

- **React Hook Form + Zod** — performant uncontrolled form library with Zod schema validation
- **Formik** — mature controlled form library with built-in validation
- **Raw useState / useReducer** — current approach; fully manual

## Decision Outcome

Chosen option: "React Hook Form + Zod", because it minimizes re-renders (uncontrolled by default), provides first-class TypeScript inference from Zod schemas, and aligns with the tech research digest recommendation.

### Consequences

- Good, because Zod schemas define both runtime validation rules and compile-time TypeScript types via `z.infer`.
- Good, because React Hook Form's uncontrolled mode avoids re-rendering the entire form on every keystroke.
- Good, because `@hookform/resolvers/zod` integrates validation declaratively — no manual error wiring.
- Bad, because developers must learn React Hook Form's API (`register`, `handleSubmit`, `formState`).
- Bad, because complex cross-field validation (e.g., password confirmation) requires Zod refinements or custom resolvers.

### Confirmation

- All new forms must use `useForm` with `zodResolver` and a Zod schema for validation.
- Validation schemas are defined alongside the form or in the feature's model layer.
- Manual `useState`-based form management is deprecated.

## Pros and Cons of the Options

### React Hook Form + Zod

- Good, because it is the most performant option — fields are registered as uncontrolled inputs with ref-based tracking.
- Good, because Zod + `@hookform/resolvers` provides a single source of truth for types and validation.
- Good, because `forwardRef`-compatible custom inputs (like `TextInput`) work with `register()` out of the box.
- Neutral, because the API differs from standard controlled React patterns.
- Bad, because advanced use cases (dynamic fields, dependent validation) require understanding of both React Hook Form and Zod.

### Formik

- Good, because it has a larger ecosystem and more community examples.
- Bad, because it is a controlled library — every keystroke triggers a re-render of the entire form tree.
- Bad, because TypeScript integration requires manual type annotations rather than schema inference.

### Raw useState / useReducer

- Good, because it requires no dependencies and is familiar to all React developers.
- Bad, because validation logic is scattered across change handlers and submit callbacks.
- Bad, because every keystroke causes a re-render with `useState`.
- Bad, because type safety is manual — form data types and validation must be kept in sync by hand.

## More Information

Pattern adopted for forms:

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormData = z.infer<typeof schema>

function useMyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })
  // ...
}
```
