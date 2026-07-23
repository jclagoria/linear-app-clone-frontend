# Delete Comment on Issue

## Problem Statement

Users currently cannot delete their own comments on an issue. Once a comment is posted, there is no way to remove it — even if it contains a mistake, is no longer relevant, or the user simply changes their mind.

## Motivation

Comment deletion is a standard feature of any collaborative discussion system. It gives users control over their own content, reduces noise from outdated or incorrect comments, and aligns with the pattern established by edit (already implemented). The API contract already defines the endpoint — the frontend needs to wire it up.

## Scope

- **In scope**:
  - Add `deleteComment(issueId, commentId)` API call
  - Add delete action to the comments Zustand store
  - Add delete button with confirmation flow to `CommentCard`
  - Enforce author-only deletion (only the comment author can delete)
  - Handle loading/error states during deletion

- **Out of scope**:
  - Admin/moderator deletion (future)
  - Bulk delete
  - Undelete / trash recovery
  - Real-time SSE sync for deletion events
  - Comment deletion from the issue list view

## Impact

- `src/entities/issue/api/index.ts` — new `deleteComment` function
- `src/entities/issue/model/store.ts` — new `deleteCommentFromStore` action, `removeComment` action
- `src/entities/issue/ui/CommentCard.tsx` — delete button with confirmation
- `src/entities/issue/ui/CommentList.tsx` — pass `onDeleteComment` prop
- Existing tests in `src/__tests__/` may need updating; new tests for delete flow
