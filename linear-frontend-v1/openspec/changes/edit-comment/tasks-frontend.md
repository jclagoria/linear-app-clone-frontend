# Tasks — Edit Comment (Frontend)

## Scaffold

- [ ] Add `updateComment` API function in `src/entities/issue/api/index.ts` — `PATCH /api/v1/issues/{issueId}/comments/{commentId}` with `{ body: string }`
- [ ] Add `updateComment` action to the issue Zustand store — updates comment body in local state on success

## Components

- [ ] Add edit button (tertiary variant with pencil icon) to `CommentCard` – visible only when `comment.authorId === currentUserId`; `aria-label="Edit comment"`
- [ ] Add edit mode state toggle to `CommentCard` — `useState<boolean>` controlling textarea vs body display
- [ ] Add textarea in edit mode — pre-filled with current body, auto-focused, min-height 3 rows, `aria-label="Edit comment body"`
- [ ] Add Save button (primary sm) — disabled + spinner during save, calls `onEdit` prop, `aria-label="Save comment"`
- [ ] Add Cancel button (ghost sm) — discards edits, restores original body, exits edit mode; also triggered by Escape, `aria-label="Cancel edit"`
- [ ] Add saving state — Save button shows spinner, textarea and both buttons disabled
- [ ] Add error state — show error toast, textarea preserved with edits, save re-enabled

## State & Data

- [ ] Wire `onEditComment` callback through `CommentList` → `CommentCard` via props
- [ ] Add `handleEditComment` in `IssueDetailPage` — calls `updateComment` API, updates local comments state on success, shows toast on error
- [ ] Handle 403 Forbidden — exit edit mode, show "Not the comment owner" toast

## Routing

- [ ] No new routes — edit is an inline interaction on existing `/issues/:id` route

## Integration

- [ ] Connect `updateComment` API function to the backend `PATCH /api/v1/issues/{issueId}/comments/{commentId}` endpoint

## Validation

- [ ] Unit test: `CommentCard` renders edit button only for comment author
- [ ] Unit test: `CommentCard` toggles to edit mode on click, shows textarea with pre-filled body
- [ ] Unit test: `CommentCard` cancel restores original body and exits edit mode
- [ ] Unit test: `CommentCard` save button disabled during saving state
- [ ] Unit test: `CommentCard` Escape key cancels edit
- [ ] Integration test: `updateComment` API function calls correct endpoint with body payload
- [ ] Integration test: successful PATCH updates comment in store
- [ ] Integration test: failed PATCH (network error) shows error toast, preserves textarea edits
- [ ] Integration test: failed PATCH (403) shows "Not the comment owner" toast, exits edit mode
- [ ] E2E test: author edits their comment and sees updated body
- [ ] E2E test: non-author does not see edit button
- [ ] Accessibility: verify `aria-label` attributes on edit/save/cancel buttons

## Review

- [ ] Verify all BDD scenarios from specs-frontend pass (EditButtonVisibility, EditCommentInline)
- [ ] Verify keyboard flow: Tab → Enter/Space on edit → type → Tab to Save → Enter → focus returns
- [ ] Verify Escape cancels edit mode
- [ ] Verify state toggles match wireframes: display, editing, saving, error
- [ ] Verify no regression on existing comment display for non-authors
