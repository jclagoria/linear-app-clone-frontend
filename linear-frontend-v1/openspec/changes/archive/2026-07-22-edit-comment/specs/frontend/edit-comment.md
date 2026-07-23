# Edit Comment — Frontend Specification

## Behaviour

**Feature:** Edit Comment

A comment author SHALL be able to edit the body of their own comment after posting. Only the comment author MUST see the edit controls. The edit MUST be saved via PATCH request and the UI MUST update optimistically on success.

### Requirement: EditButtonVisibility

#### Scenario: Author sees edit button on own comment

- **GIVEN** the current user is the author of a comment on the issue detail page
- **WHEN** the comment is displayed
- **THEN** an edit button SHALL be visible on that comment card
- **AND** the edit button SHALL display a pencil icon

#### Scenario: Non-author does not see edit button

- **GIVEN** the current user is NOT the author of a comment
- **WHEN** the comment is displayed
- **THEN** no edit button SHALL be visible on that comment card

### Requirement: EditCommentInline

#### Scenario: User enters edit mode

- **GIVEN** the user is viewing the issue detail page with their own comment
- **WHEN** the user clicks the edit button on the comment
- **THEN** the comment body SHALL be replaced with a textarea pre-filled with the current body
- **AND** a save button and a cancel button SHALL be displayed
- **AND** the edit button SHALL be hidden while in edit mode

#### Scenario: User saves edited comment

- **GIVEN** the user is in edit mode on their comment
- **WHEN** the user modifies the body and clicks save
- **THEN** the textarea SHALL be disabled during the save request
- **AND** the comment body SHALL be updated to the new text upon success
- **AND** the comment SHALL exit edit mode and display the updated body
- **AND** a success toast notification SHALL be shown

#### Scenario: User cancels edit

- **GIVEN** the user is in edit mode on their comment
- **WHEN** the user clicks cancel
- **THEN** the textarea SHALL be removed
- **AND** the original comment body SHALL be displayed unchanged
- **AND** the comment SHALL exit edit mode

#### Scenario: Save fails due to network error

- **GIVEN** the user is in edit mode on their comment
- **WHEN** the user clicks save and the request fails with a network error
- **THEN** an error toast notification SHALL be shown
- **AND** the textarea SHALL remain visible with the user's edits preserved
- **AND** the save button SHALL be re-enabled

#### Scenario: Save fails due to 403 Forbidden

- **GIVEN** the user is in edit mode on their comment
- **WHEN** the user clicks save and the server returns 403 Forbidden
- **THEN** an error toast notification SHALL be shown with "Not the comment owner"
- **AND** the comment SHALL exit edit mode

## User Flow

1. User navigates to issue detail page
2. Comments section loads with comment list
3. For each comment where `comment.authorId === currentUserId`, an edit button is rendered
4. User clicks edit button on their comment
5. Comment body text is replaced by a textarea pre-filled with current body
6. User modifies the body text
7. User clicks Save:
   - `PATCH /api/v1/issues/{issueId}/comments/{commentId}` is called with `{ body: newText }`
   - On 200: comment body in local state is updated, edit mode exits, toast shown
   - On error: error toast shown, user's edits preserved in textarea
8. User clicks Cancel: edit mode exits, original body restored

## Components

### CommentCard

- **Purpose**: Display a single comment with author avatar, name, timestamp, and body. When the current user is the author, also renders edit controls.
- **Props**: `comment: Comment`, `currentUserId: string`, `onEdit: (commentId, newBody) => Promise<void>`
- **States**:
  - **display**: Shows avatar, name, timestamp, body text, edit button (if author)
  - **editing**: Shows textarea with current body, save button (with loading state), cancel button
  - **saving**: Save button disabled, textarea disabled, spinner on save button
  - **error**: Toast notification shown; textarea remains with unsaved edits
- **Events**: `onEdit(commentId, body)` emitted on save click

### CommentList

- **Purpose**: Renders a list of CommentCard components for the current issue.
- **Props**: `comments: Comment[], currentUserId: string, onEditComment: (commentId, newBody) => Promise<void>`
- **States**: loading, empty, populated
- **Events**: Forwards `onEditComment` to each CommentCard

## Routing

No new routes. Edit comment is an inline interaction within the existing issue detail route.

| Route | Component | Purpose |
|-------|-----------|---------|
| `/issues/:id` | IssueDetailPage | Existing route; comment editing is a sub-interaction |

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| body | MUST not be empty (minLength: 1) | "Comment cannot be empty" |

## Accessibility

- Edit button SHALL have `aria-label="Edit comment"` for screen readers
- Textarea in edit mode SHALL receive focus automatically when edit mode activates
- Save button SHALL have `aria-label="Save comment"`
- Cancel button SHALL have `aria-label="Cancel edit"`
- Pressing Escape while in edit mode SHALL cancel the edit
- Focus SHALL return to the edit button after cancel or save completes
- The comment list container SHALL use `role="list"` and each comment SHALL use `role="listitem"`
