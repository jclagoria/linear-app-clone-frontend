# Review — Edit Comment

## Spec Compliance

All BDD scenarios from specs-frontend are addressed by the design and tasks:

| Scenario | Covered By | Status |
|----------|-----------|--------|
| Author sees edit button on own comment | CommentCard renders edit pencil when `comment.authorId === currentUserId` | ✅ |
| Non-author does not see edit button | Conditional render — edit button omitted when not author | ✅ |
| User enters edit mode | Click edit pencil → textarea replaces body, save/cancel appear, edit pencil hidden | ✅ |
| User saves edited comment | Save button calls `updateComment`, on 200 → body updated, edit mode exits, success toast | ✅ |
| User cancels edit | Cancel button/Escape → original body restored, edit mode exits | ✅ |
| Save fails (network error) | Error toast, textarea preserved with edits, save re-enabled | ✅ |
| Save fails (403 Forbidden) | Error toast "Not the comment owner", edit mode exits | ✅ |

## Edge Cases

| Edge Case | Handled |
|-----------|---------|
| Empty body on save | Frontend validation (minLength: 1) + PATCH 400 from backend |
| Double-click save | Save button disabled + spinner during request (prevents duplicate PATCH) |
| Escape during saving | Cancel disabled during saving — user must wait for resolution |
| Comment list re-renders during edit | Edit mode is local `useState` in CommentCard — survives re-render from parent as long as card is mounted |
| Non-author never sees edit controls | Render-level check — no API permission call needed |

## Leakage Check

- No implementation details leaked into specs — specs describe behavior (Gherkin scenarios), not function calls or component internals.
- Wireframes stay structural — no pixel values, colors, or type specs.
- Design document references stack and architecture from docs/ but does not duplicate them.

## Checklist

- [x] All requirements covered
- [x] Scenarios pass (design covers all 7 BDD scenarios)
- [x] Error states handled (network error, 403, empty body)
- [x] No technical detail in specs
- [x] Wireframes reviewed and approved (VERDICT: approve)
- [x] ADR review completed — all in-force ADRs conformant, no new ADRs needed
- [x] Implementation tasks scoped and ordered for sequential development
