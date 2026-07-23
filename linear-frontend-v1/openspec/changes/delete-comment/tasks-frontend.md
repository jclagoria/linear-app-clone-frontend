# Tasks — Delete Comment (Frontend)

## Components

- [ ] Add delete button to `CommentCard` (author only, `aria-label="Delete comment"`, Trash2 icon)
- [ ] Create `DeleteConfirmation` inline pattern within `CommentCard` (confirmation text + Cancel + Delete buttons)
- [ ] Connect `CommentCard` delete flow to `onDelete` callback prop (confirm open → confirm → loading → success/error)
- [ ] Add focus management: focus to Delete button on confirm open, return to delete button on cancel, move to next comment on success
- [ ] Update `CommentList` to thread `onDeleteComment` to each `CommentCard` and handle comment removal from list

## State & Data

- [ ] Add `deleteComment` action thunk to `useCommentStore` (optimistic removal + API call + rollback on failure)
- [ ] Add `DELETE /api/issues/:issueId/comments/:commentId` to API client
- [ ] Wire error handling: show inline error on `ForbiddenError` (403) or `InternalError` (500) with retry capability
- [ ] Show success toast "Comment deleted" via `useToastStore` on successful deletion

## Routing

- [ ] No new routes — deletion is inline on existing `/issues/:id` page

## Integration

- [ ] Connect `CommentList` to real API data (replace any mock data)
- [ ] Verify author check against `currentUserId` from auth store

## Validation

- [ ] Unit test: `CommentCard` renders delete button only for author
- [ ] Unit test: `CommentCard` confirmation open/close/cancel flows
- [ ] Unit test: `CommentCard` shows loading state while deleting
- [ ] Unit test: `CommentCard` shows error message on failure
- [ ] Unit test: `useCommentStore.deleteComment` optimistic update + rollback
- [ ] Unit test: API client sends correct `DELETE` request with comment ID
- [ ] Integration test: end-to-end comment deletion flow
- [ ] E2E test: delete comment flow (Playwright)

## Review

- [ ] Verify keyboard accessibility (Tab, Enter/Space, Escape)
- [ ] Verify focus management (focus moves correctly on open/cancel/success)
- [ ] Verify screen reader announcements (aria-live toast, aria-label on delete button)
- [ ] Verify error state recovery (retry works after failure)
- [ ] Verify non-author cannot see or trigger delete
- [ ] Run `pnpm run lint`, `pnpm run typecheck`, `pnpm run test:run`
