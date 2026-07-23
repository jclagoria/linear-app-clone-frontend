# Comment Deletion — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| Inline confirmation | Embedded in CommentCard, no modal | Keeps context; lightweight for a small destructive action vs full modal | Must handle focus trap within card |
| Optimistic removal | Remove from UI immediately on confirm, roll back on error | Instant feedback; matches Linear UX | Requires saving previous comment list for rollback |
| Author check | Client-side check on `currentUserId === comment.authorId` | No extra API call; SSR not needed | Must still enforce server-side (defense in depth) |
| Toast via existing system | Reuse existing Toast component (shared/ui) | Consistency, no new component | Toast auto-dismiss timing must be configurable per variant |

## Component Tree

```
pages/IssueDetailPage (existing — modified)
  └── features/comment/CommentList (existing — modified)
       └── entities/comment/ui/CommentCard (existing — modified)
            ├── avatar, name, timestamp
            ├── comment body
            ├── edit button (existing)
            ├── delete button (new — author only)
            └── DeleteConfirmation (new — inline)
                 ├── confirmation text
                 ├── Cancel button (secondary variant)
                 └── Delete button (danger variant, loading state)
```

| Component | Responsibility | Props | State |
|-----------|---------------|-------|-------|
| CommentCard | Display single comment + actions | `comment`, `currentUserId`, `onDelete` | default, confirm-delete, deleting, error |
| DeleteConfirmation | Inline confirmation prompt | `onConfirm`, `onCancel`, `isSubmitting` | open, closed, submitting |
| CommentList | Render comment list + heading | `comments`, `currentUserId`, `onDeleteComment` | loading, empty, populated |
| Toast | Transient feedback (existing) | `variant`, `message`, `duration` | info, success, error |

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| `/issues/:id` | IssueDetailPage | protected | Existing route; delete is inline action, no new route |

## State Management

- **Global state**: Zustand store for comments — `useCommentStore` with `comments` array, `deleteComment(id)` action thunk.
- **Local state**: `isConfirmOpen`, `isDeleting`, `error` — local to CommentCard via `useState`.
- **Optimistic update flow**:
  1. Save current comments snapshot
  2. Remove comment from local array
  3. Call API
  4. On success: show toast, keep removed state
  5. On failure: restore snapshot, show error alert, keep comment visible

## Data Fetching

- **Client**: Fetch via existing API client in `shared/api/client.ts` (restful, Bearer token).
- **Endpoint**: `DELETE /api/issues/:issueId/comments/:commentId` — returns `204 No Content` on success.
- **Error handling**:
  - `403` — show "You don't have permission to delete this comment."
  - `500` — show "Failed to delete comment. Please try again."
- **Optimistic updates**: Pessimistic UI update with rollback on failure (see state management above).

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| Delete icon (trash) | `lucide-react` `Trash2` icon | 16×16px, existing dependency |
| Check icon (toast) | `lucide-react` `Check` icon | 16×16px, for success toast |
| Spinner | CSS animation in `shared/ui/Spinner` | Replaces button content while deleting |

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| Delete action | Author only (client + server check) | "Failed to delete comment. Please try again." |
| Confirmation | Must click "Delete" to proceed | N/A — confirmation prompt prevents accidental trigger |

## Accessibility

- **Keyboard navigation**: Tab through comment actions (edit, delete); Enter/Space to activate delete; Escape to dismiss confirmation.
- **ARIA**: Delete button uses `aria-label="Delete comment"`; confirmation uses `role="alertdialog"` with `aria-labelledby` pointing to the heading.
- **Focus management**:
  - On open: focus moves to "Delete" button in confirmation
  - On cancel/Escape: focus returns to delete button
  - On delete success: focus moves to next comment card or Comments heading
- **Screen reader**: Toast with `role="status"` and `aria-live="polite"` announces "Comment deleted".
- **Target size**: Delete button at least 24×24px (meets SC 2.5.8).
- **Non-color intent**: Trash icon + `aria-label` conveys action independent of color.
