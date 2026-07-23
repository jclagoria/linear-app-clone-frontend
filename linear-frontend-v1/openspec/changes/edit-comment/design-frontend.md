# Edit Comment — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| Edit mode | Inline replacement (textarea in card) | Preserves comment list context; matches Linear UX; no page transition or modal overhead | Single comment editable at a time per design constraint |
| Optimistic update | Pessimistic (wait for PATCH 200) | Simpler rollback (no previous state to save); error recovery is "retain edits" per spec | Brief loading state on save; user sees disabled textarea during request |
| Local state for edit | React `useState` in CommentCard | Edit mode is component-local UI state; no store needed | Does not persist across re-renders from parent — acceptable (edit mode resets on unmount) |
| Toast notifications | Shared toast system (existing) | Consistent error/success feedback across the app | Toast library assumed (exist in `shared/ui/`) |
| Author check | `comment.authorId === currentUserId` prop comparison | Decoupled — no API call for permission; purely presentational | Prop must be passed from page/feature level |

## Component Tree

```
IssueDetailPage
  └── IssueDetail (feature)
       └── CommentList (entity composition)
            └── CommentCard (entity UI)
                 ├── [display mode] avatar, author, timestamp, body, edit button (if author)
                 └── [edit mode] textarea, save button, cancel button
```

| Component | Responsibility | Props | States |
|-----------|---------------|-------|--------|
| IssueDetailPage | Route page, owns comments state, provides edit handler | — | loading, populated, error |
| CommentList | Renders comment list | `comments`, `currentUserId`, `onEditComment` | loading, empty, populated |
| CommentCard | Single comment with inline edit | `comment`, `currentUserId`, `onEdit` | display, editing, saving, error |

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| `/issues/:id` | IssueDetailPage | protected (existing) | No new routes; edit is inline interaction |

## State Management

- **Global state**: Issue comments stored in Zustand `issueComments` store (existing). `updateComment(issueId, commentId, body)` action updates the specific comment in the store.
- **Local state**: `useState` in `CommentCard` — `isEditing` toggle, textarea value, saving/error flags. Not lifted to store because edit mode is ephemeral.
- **Server state**: No cache layer needed — PATCH updates the Zustand store directly after 200.

## Data Fetching

- **Client**: `fetch` wrapper from `shared/api/client.ts` with Bearer JWT header (existing pattern).
- **Error handling**: Network error → error toast, textarea preserved with edits, save re-enabled. 403 → error toast "Not the comment owner", exits edit mode.
- **Optimistic updates**: Pessimistic — wait for PATCH 200, then update store. On error, edits preserved in textarea unchanged (no rollback needed).

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| Pencil icon | Inline SVG or `@heroicons` (existing) | `aria-label="Edit comment"` |
| Spinner | `shared/ui/Spinner` (existing) | Loading state for save button |

## Validation Strategy

| Field | Rule | Error Message | When |
|-------|------|---------------|------|
| body | minLength: 1 (non-empty) | "Comment cannot be empty" | Frontend before PATCH; also PATCH 400 from backend |
| body | whitespace-only | "Comment cannot be empty" | Trim before length check |

## Accessibility

- **Keyboard navigation**: Edit button focusable via Tab; Tab from textarea → Save → Cancel → next comment card; Escape cancels edit; Enter/Space triggers edit button.
- **ARIA**: Edit button `aria-label="Edit comment"`, Save `aria-label="Save comment"`, Cancel `aria-label="Cancel edit"`; comment list `role="list"` with `role="listitem"` per card.
- **Screen reader**: Textarea auto-focused on edit mode activation; focus returns to edit button after cancel/save; textarea `aria-label="Edit comment body"`.
- **Focus management**: On cancel → focus returns to edit button. On save → focus stays on comment card. On edit mode open → focus moves to textarea.
