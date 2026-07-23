# Comment Deletion — Frontend Specification

## Behaviour

**Feature:** Delete Comment on Issue

A comment author SHALL be able to delete their own comment. The delete action MUST be hidden for non-authors. A confirmation step MUST precede deletion. On success the comment SHALL be removed from the UI immediately. On failure an error SHALL be shown and the comment SHALL remain visible.

### Requirement: DeleteButton

#### Scenario: Author sees delete button

- **GIVEN** the current user is the author of a comment
- **WHEN** the comment card is rendered
- **THEN** a delete button SHALL be visible on the comment card
- **AND** the delete button SHALL have an accessible label "Delete comment"

#### Scenario: Non-author does not see delete button

- **GIVEN** the current user is NOT the author of a comment
- **WHEN** the comment card is rendered
- **THEN** the delete button SHALL NOT be rendered

### Requirement: DeleteConfirmation

#### Scenario: User cancels delete

- **GIVEN** the user is the comment author
- **WHEN** the user clicks the delete button
- **THEN** a confirmation prompt SHALL appear asking "Are you sure you want to delete this comment?"
- **WHEN** the user clicks "Cancel"
- **THEN** the confirmation SHALL close
- **AND** the comment SHALL remain visible

#### Scenario: User confirms delete

- **GIVEN** the user is the comment author
- **WHEN** the user clicks the delete button
- **THEN** a confirmation prompt SHALL appear
- **WHEN** the user clicks "Delete"
- **THEN** the comment SHALL be removed from the UI immediately
- **AND** a toast notification "Comment deleted" SHALL be shown

### Requirement: DeleteError

#### Scenario: Delete request fails

- **GIVEN** the user has confirmed deletion
- **WHEN** the API returns an error
- **THEN** the comment SHALL remain visible
- **AND** an error message SHALL be displayed
- **AND** the user SHALL be able to retry deletion

#### Scenario: Non-author attempts delete (forbidden)

- **GIVEN** the user is NOT the comment author
- **WHEN** the delete request is made
- **THEN** a 403 Forbidden response SHALL be returned
- **AND** the comment SHALL remain visible

## User Flow

1. User navigates to issue detail page
2. Issue comments are loaded and displayed
3. For each comment by the current user, a delete button is shown alongside the existing edit button
4. User clicks delete button
5. Inline confirmation appears: "Are you sure you want to delete this comment?" with "Cancel" and "Delete" buttons
6. User clicks "Delete"
7. Comment is removed from the list; toast confirms deletion
8. If the delete API call fails, an error is shown and the comment remains

## Components

### CommentCard (modified)

- **Purpose**: Display a single comment with author info, body, and action buttons
- **Props**: `comment`, `currentUserId`, `onEdit`, `onDelete`
- **States**: default, editing, deleting (loading), confirm-delete, error
- **Events**: `onDelete(commentId: string)` — emitted after confirmed deletion

### DeleteConfirmOverlay (new — inline within CommentCard)

- **Purpose**: Confirmation prompt before destructive action
- **States**: open, closed, submitting
- **Events**: `onConfirm()`, `onCancel()`

### CommentList (modified)

- **Purpose**: Render list of CommentCard components with aggregated state
- **Props**: `comments`, `currentUserId`, `onEditComment`, `onDeleteComment`
- **Events**: passes `onDeleteComment` to each `CommentCard`

## Routing

No new routes. Deletion occurs inline on the existing issue detail page at `/issues/:id`.

## Validation Rules

| Interaction | Rule | Feedback |
|-------------|------|----------|
| Delete click | Must confirm before proceeding | Inline confirmation with Cancel/Delete buttons |
| Delete action | Author-only (enforced client-side and server-side) | 403 error displayed if server rejects |

## Accessibility

- Delete button SHALL have `aria-label="Delete comment"`
- Confirmation dialog SHALL use `role="alertdialog"` with `aria-labelledby`
- Focus SHALL move to the Confirm button when confirmation opens
- On cancel, focus SHALL return to the delete button
- On successful deletion, focus SHALL move to the next remaining comment or the comments heading
- Delete button SHALL be keyboard accessible (Enter/Space to activate)
- Escape key SHALL dismiss the confirmation without deleting
