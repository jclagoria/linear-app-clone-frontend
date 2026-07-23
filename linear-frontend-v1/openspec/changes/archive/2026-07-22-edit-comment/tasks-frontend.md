# Tasks — Edit Comment (Frontend)

## Scaffold

- [x] Add `updateComment` API function in `src/entities/issue/api/index.ts` — `PATCH /api/v1/issues/{issueId}/comments/{commentId}` with `{ body: string }`
- [x] Add `updateComment` action to the issue Zustand store — updates comment body in local state on success

## Components

- [x] Add edit button (tertiary variant with pencil icon) to `CommentCard` – visible only when `comment.authorId === currentUserId`; `aria-label="Edit comment"`
- [x] Add edit mode state toggle to `CommentCard` — `useState<boolean>` controlling textarea vs body display
- [x] Add textarea in edit mode — pre-filled with current body, auto-focused, min-height 3 rows, `aria-label="Edit comment body"`
- [x] Add Save button (primary sm) — disabled + spinner during save, calls `onEdit` prop, `aria-label="Save comment"`
- [x] Add Cancel button (ghost sm) — discards edits, restores original body, exits edit mode; also triggered by Escape, `aria-label="Cancel edit"`
- [x] Add saving state — Save button shows spinner, textarea and both buttons disabled
- [x] Add error state — show error toast, textarea preserved with edits, save re-enabled

## State & Data

- [x] Wire `onEditComment` callback through `CommentList` → `CommentCard` via props
- [x] Add `handleEditComment` in `IssueDetailPage` — calls `updateComment` API, updates local comments state on success, shows toast on error
- [x] Handle 403 Forbidden — exit edit mode, show "Not the comment owner" toast

## Routing

- [x] No new routes — edit is an inline interaction on existing `/issues/:id` route

## Integration

- [x] Connect `updateComment` API function to the backend `PATCH /api/v1/issues/{issueId}/comments/{commentId}` endpoint

## Validation

- [x] Unit test: `CommentCard` renders edit button only for comment author
- [x] Unit test: `CommentCard` toggles to edit mode on click, shows textarea with pre-filled body
- [x] Unit test: `CommentCard` cancel restores original body and exits edit mode
- [x] Unit test: `CommentCard` save button disabled during saving state
- [x] Unit test: `CommentCard` Escape key cancels edit
- [x] Integration test: `updateComment` API function calls correct endpoint with body payload
- [x] Integration test: successful PATCH updates comment in store
- [x] Integration test: failed PATCH (network error) shows error toast, preserves textarea edits
- [x] Integration test: failed PATCH (403) shows "Not the comment owner" toast, exits edit mode
- [x] E2E test: author edits their comment and sees updated body
- [x] E2E test: non-author does not see edit button
- [x] Accessibility: verify `aria-label` attributes on edit/save/cancel buttons

## Review

- [x] Verify all BDD scenarios from specs-frontend pass (EditButtonVisibility, EditCommentInline)
- [x] Verify keyboard flow: Tab → Enter/Space on edit → type → Tab to Save → Enter → focus returns
- [x] Verify Escape cancels edit mode
- [x] Verify state toggles match wireframes: display, editing, saving, error
- [x] Verify no regression on existing comment display for non-authors
