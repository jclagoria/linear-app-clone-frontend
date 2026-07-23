# Review — Fix: Create Issue Missing Required teamId Field

## Spec Compliance

- `CreateIssueData` includes `teamId` — addressed in design-frontend tasks
- `handleCreateIssue` reads team ID from shared store — addressed
- `createIssue()` POST body includes teamId — addressed
- MSW handler validates teamId — addressed in tasks

## Edge Cases

- **No team selected**: Guard disables issue creation with clear message — designed
- **Invalid teamId (API rejection)**: Error toast shown, modal stays open — existing pattern
- **Team switch mid-session**: TeamStore updates propagate to IssuesPage on next open — Zustand reactivity handles this

## Leakage Check

- No implementation details leaked into specs or proposal
- Wireframes/mockups correctly document only structural UI aspects
- Design document references specific files but does not include code

## Checklist

- [x] All requirements covered
- [x] Scenarios defined (specs-frontend)
- [x] Error states handled
- [x] No technical detail in specs
- [x] Tasks are concrete and actionable
- [x] Design decisions have rationale
