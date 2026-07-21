# ADR Review Manifest

- Status: completed
- Review date: 2026-07-21

## Review Summary

ADR review completed for this change. Four new durable ADRs were created for the Issues Store & UI components.

## In-Force ADRs Reviewed

- None — project has no existing in-force ADRs.

## New Durable ADRs Created

- ADR-0001: Zustand Issues Store following existing entity-store pattern
- ADR-0002: Separate API layer decoupled from store
- ADR-0003: Pessimistic updates for issue CRUD operations
- ADR-0004: react-hook-form with Zod for issue form validation

---

# ADR-0001: Zustand Issues Store Following Entity-Store Pattern

---
status: accepted
date: 2026-07-21
decision-makers: Frontend team
---

## Context and Problem Statement

The Work Module needs a canonical state container for issues — the primary work item. The application already has several Zustand stores (session, websocket, notifications) following an entity pattern under `src/entities/<domain>/model/store.ts`. The new Issues Store must integrate cleanly with this existing pattern while supporting CRUD, filtering, pagination, and loading states.

## Decision Drivers

- Consistency with existing store patterns (session store in `entities/session/model/store.ts`)
- Minimal boilerplate — Zustand is already in use and familiar
- Works outside React tree (ApiClient interceptors use auth store directly)
- TypeScript-first with inferred types

## Considered Options

- **Zustand under `entities/issue/model/`**: Follows existing pattern, co-locates store with entity
- **Redux Toolkit**: More boilerplate, not used elsewhere in project
- **Context + useReducer**: More boilerplate, no middleware, no devtools
- **TanStack Query (React Query)**: Server-state focused, but not used elsewhere; would add new dependency

## Decision Outcome

Chosen option: "Zustand under `entities/issue/model/`", because it follows the established project convention, requires no new dependencies, and allows the ApiClient to read store state directly (e.g., for auth tokens).

### Consequences

- Good, because the store pattern is familiar to the team and consistent with session, websocket, and notification stores.
- Good, because selectors in a separate `selectors/` directory compose and memoize cleanly.
- Bad, because all Issue type definitions must be manually kept in sync with the API contract.
- Bad, because there's no built-in cache invalidation — must implement manually.

### Confirmation

Store location confirmed at `src/entities/issue/model/store.ts`. Selectors at `src/entities/issue/model/selectors/`.

## Pros and Cons of the Options

### Zustand under `entities/issue/model/`

- Good, because matches existing pattern exactly
- Good, because Zustand stores can be accessed outside React (ApiClient)
- Neutral, because manual selectors needed for derived state
- Bad, because no built-in caching layer

### Redux Toolkit

- Good, because strong devtools and normalized state pattern
- Bad, because not used elsewhere — adds cognitive overhead
- Bad, because requires more boilerplate (slices, reducers, actions)

### Context + useReducer

- Good, because no dependencies beyond React
- Bad, because re-renders on any state change
- Bad, because no middleware for side effects

### TanStack Query (React Query)

- Good, because built-in caching, refetching, optimistic updates
- Bad, because adds a new major dependency not used elsewhere
- Bad, because server state only — client state (filters, selection) still needs Zustand

---

# ADR-0002: Separate API Layer Decoupled from Store

---
status: accepted
date: 2026-07-21
decision-makers: Frontend team
---

## Context and Problem Statement

The Issues Store needs to fetch, create, update, and delete issues via the backend API. The question is where to put the HTTP calls — embedded in the store actions, or in a separate API module.

## Decision Drivers

- Reuse existing ApiClient with interceptor pipeline (auth, 401 refresh, error mapping)
- Keep store actions thin — dispatch, don't HTTP
- Testability: API layer should be mockable independently from store logic

## Considered Options

- **Separate `api/` module**: API functions call ApiClient, store actions call API functions
- **API calls inline in store actions**: Store directly calls ApiClient
- **Repository pattern**: Full repository class wrapping all API calls

## Decision Outcome

Chosen option: "Separate `api/` module", because it keeps store actions focused on state management, enables independent testing of API calls and store logic, and allows future swapping of transport without changing store code.

### Consequences

- Good, because store actions are thin — dispatch API call, handle response, update state
- Good, because API functions can be unit-tested with MSW independently
- Good, because error mapping and response transformation happen once in the API layer
- Bad, because an extra file per entity (store + API + validation + types)

### Confirmation

API module located at `src/entities/issue/api/` with functions: `fetchIssues`, `createIssue`, `updateIssue`, `deleteIssue`.

## Pros and Cons of the Options

### Separate `api/` module

- Good, because store doesn't know about HTTP
- Good, because API functions can be tested in isolation
- Neutral, because more files to create per entity
- Bad, because store actions become a thin passthrough

### API calls inline in store actions

- Good, because fewer files
- Bad, because store becomes coupled to HTTP
- Bad, because testing store requires mocking fetch globally

### Repository pattern

- Good, because full abstraction with class interface
- Bad, because over-engineered for current scope — class with no state
- Bad, because inconsistent with existing project pattern

---

# ADR-0003: Pessimistic Updates for Issue CRUD

---
status: accepted
date: 2026-07-21
decision-makers: Frontend team
---

## Context and Problem Statement

When a user creates, updates, or deletes an issue, the UI must reflect the change. Two strategies exist: optimistic (update UI immediately, rollback on failure) or pessimistic (wait for server confirmation, then update UI).

## Decision Drivers

- MVP simplicity — no rollback logic or conflict resolution needed yet
- Data consistency — UI always reflects server state
- Error handling is straightforward — no need to reverse state

## Considered Options

- **Pessimistic updates**: Wait for API response, then update store
- **Optimistic updates**: Update store immediately, rollback on error

## Decision Outcome

Chosen option: "Pessimistic updates", because it guarantees UI consistency with server state, simplifies error handling, and avoids rollback complexity for MVP.

### Consequences

- Good, because UI never shows stale or reverted data
- Good, because error states are simple — show error, re-enable form
- Bad, because user perceives a slight delay between submit and UI update
- Bad, because network latency affects perceived performance — consider adding optimistic updates post-MVP

### Confirmation

Store actions (`createIssue`, `updateIssue`, `deleteIssue`) use async/await with try/catch. Store only updates on successful API response.

## Pros and Cons of the Options

### Pessimistic updates

- Good, because data integrity is guaranteed
- Good, because no rollback edge cases
- Bad, because slower perceived UX

### Optimistic updates

- Good, because instant UI feedback
- Bad, because rollback on error is complex (ensure state is fully reversible)
- Bad, because conflicts when multiple users modify the same issue

---

# ADR-0004: react-hook-form with Zod for Issue Form Validation

---
status: accepted
date: 2026-07-21
decision-makers: Frontend team
---

## Context and Problem Statement

The IssueForm component (used in IssueFormModal) requires form state management and validation for title (required, max 255), description (max 50000), and structured fields (status, priority, assignee, labels). The approach must integrate with the existing stack and produce validation errors that can be rendered inline next to fields.

## Decision Drivers

- Already in use — react-hook-form + Zod are project dependencies
- Uncontrolled by default — fewer re-renders than controlled form state
- Validation schemas can be shared with backend (same Zod schema used on both sides)
- TypeScript inference from Zod schema to form types

## Considered Options

- **react-hook-form + Zod**: Already in stack, performant, schema-based
- **Manual useState + onChange handlers**: No dependencies, but verbose
- **Formik + Yup**: Similar to react-hook-form but heavier, not in stack

## Decision Outcome

Chosen option: "react-hook-form + Zod", because it is already a project dependency, provides performant uncontrolled inputs, and enables schema sharing between frontend validation and backend request validation.

### Consequences

- Good, because Zod schema is the single source of truth for field rules
- Good, because TypeScript types are inferred from the Zod schema
- Good, because react-hook-form minimizes re-renders (uncontrolled inputs by default)
- Bad, because react-hook-form's `register` API has learning curve for complex field types (labels array)
- Bad, because Zod v4 is new — must verify `@hookform/resolvers` compatibility

### Confirmation

Zod schema at `src/entities/issue/model/validation.ts`. Form component uses `useForm<IssueFormSchema>` with `zodResolver`.

## Pros and Cons of the Options

### react-hook-form + Zod

- Good, because already in package.json
- Good, because performant (uncontrolled)
- Good, because schema doubles as backend contract
- Neutral, because `@hookform/resolvers` needed for Zod bridge
- Bad, because complex array fields (labels) need custom `useFieldArray`

### Manual useState + onChange handlers

- Good, because zero dependencies
- Bad, because every keystroke triggers re-render
- Bad, because validation logic is ad-hoc, not schema-based
- Bad, because no easy way to share validation rules with backend

### Formik + Yup

- Good, because mature ecosystem
- Bad, because not in project — adds new dependency
- Bad, because Formik is heavier than react-hook-form (controlled)
- Bad, because Yup is redundant with Zod already in use
