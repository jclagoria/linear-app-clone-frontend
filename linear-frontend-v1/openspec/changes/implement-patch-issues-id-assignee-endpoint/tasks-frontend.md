# Tasks — Issue Assign/Unassign Endpoint (Frontend)

## API Layer

- [ ] Add `assignIssue(id: string, assigneeId: string | null): Promise<{ data: Issue }>` function to `src/entities/issue/api/index.ts` that sends `PATCH /issues/${id}/assignee` with `{ assigneeId }` body

## Store

- [ ] Add `assignIssue` action to `useIssuesStore` in `src/entities/issue/model/store.ts` with the signature `(id: string, assigneeId: string | null) => Promise<void>`
- [ ] Implement optimistic update: deep-clone the issue, update `assigneeId` and `assigneeName` immediately in the `issues` array
- [ ] Implement cache invalidation: call `useCacheStore.getState().invalidateByPrefix('issues:list')` after optimistic update
- [ ] Implement rollback: on API failure, restore the cloned issue state and rethrow the error for caller handling

## Page Integration

- [ ] Update `IssueDetailPage` form submit handler to detect assignee changes and call `useIssuesStore.getState().assignIssue(id, assigneeId)` instead of `updateIssue` for the assignee field
- [ ] Add success toast "Assignee updated" on `assignIssue` completion
- [ ] Handle `BUSINESS_RULE_ERROR` (422) by displaying the server's error message in a toast and keeping the edit modal open
- [ ] Handle network errors with toast "Failed to update assignee. Please try again."

## Validation

- [ ] Verify assignee `<select>` sends `null` (not empty string) when "Unassigned" is selected — transform in form submit handler
- [ ] Verify the edit modal does not close on 422 business rule error

## Testing

- [ ] Unit test: `assignIssue` API function sends correct request shape and handles 200/422/network error responses
- [ ] Unit test: `assignIssue` store action performs optimistic update, cache invalidation, and rollback on failure
- [ ] Integration test: IssueDetailPage assignee change calls store action and displays toast feedback
- [ ] E2E test: assign a team member to an issue, verify the assignee reflects in the detail and list views
- [ ] E2E test: attempt to assign a non-team-member, verify 422 toast and state rollback

## Review

- [ ] Self-review: all files match the design-frontend.md component tree, state management, and error handling patterns
- [ ] Verify no direct API calls outside `src/entities/issue/api/` — all mutations go through store actions
- [ ] Verify ADR-0011 pattern is followed: dedicated endpoint, optimistic update with rollback, isolated error handling
