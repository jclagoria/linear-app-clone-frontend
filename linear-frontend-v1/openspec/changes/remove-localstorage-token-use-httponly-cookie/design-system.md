# Design System — Linear App Clone

**No changes.** This change is a pure backend-facing auth refactor with zero UI impact. No new components, layout tokens, typography, color semantics, or accessibility contracts are introduced or modified.

## Rationale

- All changes are confined to the session store (`src/entities/session/model/store.ts`), auth types (`src/entities/session/model/types.ts`), and MSW handlers
- No UI components, screens, or visual elements are added, removed, or altered
- User-facing behaviour is identical — auth flows work the same way from the user's perspective
- The existing design system continues to apply unchanged

Refer to `user-flows.md` for the auth state transitions that drive the existing UI.
