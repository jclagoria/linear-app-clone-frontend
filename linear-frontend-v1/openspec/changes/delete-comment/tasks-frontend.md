# Tasks — Delete Comment (Frontend)

## Components

- [x] Add delete button to `CommentCard` (author only, `aria-label="Delete comment"`, Trash2 icon)
- [x] Create `DeleteConfirmation` inline pattern within `CommentCard` (confirmation text + Cancel + Delete buttons)
- [x] Connect `CommentCard` delete flow to `onDelete` callback prop (confirm open → confirm → loading → success/error)
- [x] Add focus management: focus to Delete button on confirm open, return to delete button on cancel, move to next comment on success
- [x] Update `CommentList` to thread `onDeleteComment` to each `CommentCard` and handle comment removal from list

## State & Data

- [x] Add `deleteComment` action thunk to `useCommentStore` (optimistic removal + API call + rollback on failure)
- [x] Add `DELETE /api/issues/:issueId/comments/:commentId` to API client
- [x] Wire error handling: show inline error on `ForbiddenError` (403) or `InternalError` (500) with retry capability
- [x] Show success toast "Comment deleted" via `useToastStore` on successful deletion

## Routing

- [x] No new routes — deletion is inline on existing `/issues/:id` page

## Integration

- [ ] Connect `CommentList` to real API data (replace any mock data)
- [x] Verify author check against `currentUserId` from auth store

## Validation

- [x] Unit test: `CommentCard` renders delete button only for author
- [x] Unit test: `CommentCard` confirmation open/close/cancel flows
- [x] Unit test: `CommentCard` shows loading state while deleting
- [x] Unit test: `CommentCard` shows error message on failure
- [ ] Unit test: `useCommentStore.deleteComment` optimistic update + rollback
- [x] Unit test: API client sends correct `DELETE` request with comment ID
- [ ] Integration test: end-to-end comment deletion flow
- [ ] E2E test: delete comment flow (Playwright)

## Review

- [x] Verify keyboard accessibility (Tab, Enter/Space, Escape)
- [x] Verify focus management (focus moves correctly on open/cancel/success)
- [x] Verify screen reader announcements (aria-live toast, aria-label on delete button)
- [x] Verify error state recovery (retry works after failure)
- [x] Verify non-author cannot see or trigger delete
- [x] Run `pnpm run lint`, `pnpm run typecheck`, `pnpm run test:run`
