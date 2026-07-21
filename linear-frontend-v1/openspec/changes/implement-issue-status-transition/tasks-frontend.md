# Tasks — Implement Issue Status Transitions (Frontend)

## Scaffold

- [x] Add `changeIssueStatus(id, statusId)` to `src/entities/issue/api/index.ts`
- [x] Add `changeStatus` action to `useIssuesStore` in `src/entities/issue/model/store.ts`

## Components

- [x] Create `IssueStatusBadge` component in `src/entities/issue/ui/IssueStatusBadge.tsx` — status pill trigger + dropdown with loading state
- [x] Integrate `IssueStatusBadge` into `IssueDetail` (`src/entities/issue/ui/IssueDetail.tsx`), replacing the static status span
- [x] Add status color mapping to the component (Backlog/Todo: neutral, In Progress: blue, Done: green, Canceled: neutral)

## State & Data

- [x] Implement `changeStatus(id, statusId)` action in `useIssuesStore` — calls API, updates local issue on success, reverts on error
- [x] Invalidate cache entries (`issues:list`) on successful status change via `useCacheStore.invalidateByPrefix`
- [x] Handle `BusinessRuleError` (422) in the store action — revert status, surface error message

## Routing

- [x] No new routes — status dropdown lives within existing `IssueDetailPage` route (`/issues/:id`)

## Integration

- [x] Wire the status dropdown to call `useIssuesStore.getState().changeStatus(id, statusId)` on selection
- [x] Wire error toast via `useToastStore.addToast` for success and error outcomes
- [x] Show success toast: "Status updated to {name}" on successful transition
- [x] Show error toast: API error message from `BusinessRuleError` on 422
- [x] Show error toast: "Failed to update status. Please try again." on network error

## Validation

- [x] Unit test: `changeIssueStatus` API function calls correct endpoint with body
- [x] Unit test: `changeStatus` store action updates issue on success, reverts on 422
- [x] Unit test: `IssueStatusBadge` renders status pill, opens dropdown, shows loading state
- [x] Integration test: `IssueDetailPage` status dropdown flows (valid/invalid transition, network error)
- [x] Verify 422 BusinessRuleError toast message rendering

## Review

- [x] Run `pnpm typecheck` — no TypeScript errors
- [x] Run `pnpm lint` — no new lint errors
- [x] Run `pnpm test:run` — all tests pass (2 pre-existing failures in routerConfig unrelated)
- [x] Run `pnpm build` — production build succeeds
- [x] Verify status dropdown keyboard navigation (Tab, Enter/Space, Arrow keys, Escape) — covered by IssueStatusBadge tests
- [x] Verify ARIA attributes on status badge (`aria-expanded`, `aria-haspopup`, `aria-busy`) — covered by IssueStatusBadge tests
- [x] Verify error toast has `role="alert"` for screen readers — covered by error banner component
