# Edit Comment

## Problem Statement

Users can view and create comments on issues, but once a comment is posted, there is no way to edit it. If a user makes a typo, wants to clarify their thought, or needs to update information in an existing comment, they must delete and re-create the comment — a poor UX that discards the original timestamp and context.

## Motivation

Enables users to correct or refine their comments after posting, matching the UX of Linear and other modern collaboration tools. This improves communication quality on issues and reduces friction for users who need to update their feedback without losing the comment thread's continuity.

## Scope

- **In scope**:
  - `PATCH /api/v1/issues/{id}/comments/{commentId}` frontend API function
  - Edit button on a user's own comments in `CommentCard`
  - Inline edit UI: textarea to modify the comment body with save/cancel controls
  - Local state update after successful edit (no full comments re-fetch)
  - Error handling: show toast on failure (network, 403 Forbidden)
  - Author-only: only the comment author sees the edit button
- **Out of scope**:
  - Comment deletion (separate concern, separate endpoint)
  - Edit history / "edited" indicator on comments
  - Rich text / markdown editing (plain text only, matching current `createComment`)
  - Comment editing via keyboard shortcuts
  - Backend implementation

## Impact

- **`src/entities/issue/api/index.ts`**: Add `updateComment(issueId, commentId, body)` function
- **`src/entities/issue/ui/CommentCard.tsx`**: Add edit button, edit mode toggle, inline textarea with save/cancel
- **`src/entities/issue/ui/CommentList.tsx`**: Pass through edit callback from parent
- **`src/entities/issue/ui/IssueDetail.tsx`**: Wire edit callback through to `CommentList`
- **`src/pages/IssueDetailPage.tsx`**: Add `handleEditComment` callback using `updateComment`, local `comments` state update
