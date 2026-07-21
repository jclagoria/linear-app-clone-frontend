# Tasks — Implement Issue Status Transitions (Frontend)

## Scaffold

- [ ] Add `changeIssueStatus(id, statusId)` to `src/entities/issue/api/index.ts`
- [ ] Add `changeStatus` action to `useIssuesStore` in `src/entities/issue/model/store.ts`

## Components

- [ ] Create `IssueStatusBadge` component in `src/entities/issue/ui/IssueStatusBadge.tsx` — status pill trigger + dropdown with loading state
- [ ] Integrate `IssueStatusBadge` into `IssueDetail` (`src/entities/issue/ui/IssueDetail.tsx`), replacing the static status span
- [ ] Add status color mapping to the component (Backlog/Todo: neutral, In Progress: blue, Done: green, Canceled: neutral)

## State & Data

- [ ] Implement `changeStatus(id, statusId)` action in `useIssuesStore` — calls API, updates local issue on success, reverts on error
- [ ] Invalidate cache entries (`issues:list`) on successful status change via `useCacheStore.invalidateByPrefix`
- [ ] Handle `BusinessRuleError` (422) in the store action — revert status, surface error message

## Routing

- [ ] No new routes — status dropdown lives within existing `IssueDetailPage` route (`/issues/:id`)

## Integration

- [ ] Wire the status dropdown to call `useIssuesStore.getState().changeStatus(id, statusId)` on selection
- [ ] Wire error toast via `useToastStore.addToast` for success and error outcomes
- [ ] Show success toast: "Status updated to {name}" on successful transition
- [ ] Show error toast: API error message from `BusinessRuleError` on 422
- [ ] Show error toast: "Failed to update status. Please try again." on network error

## Validation

- [ ] Unit test: `changeIssueStatus` API function calls correct endpoint with body
- [ ] Unit test: `changeStatus` store action updates issue on success, reverts on 422
- [ ] Unit test: `IssueStatusBadge` renders status pill, opens dropdown, shows loading state
- [ ] Integration test: `IssueDetailPage` status dropdown flows (valid/invalid transition, network error)
- [ ] Verify 422 BusinessRuleError toast message rendering

## Review

- [ ] Run `npm run typecheck` — no TypeScript errors
- [ ] Run `npm run lint` — no lint errors
- [ ] Run `npm run test:run` — all tests pass
- [ ] Run `npm run build` — production build succeeds
- [ ] Verify status dropdown keyboard navigation (Tab, Enter/Space, Arrow keys, Escape)
- [ ] Verify ARIA attributes on status badge (`aria-expanded`, `aria-haspopup`, `aria-busy`)
- [ ] Verify error toast has `role="alert"` for screen readers
