# Tasks — Fix: Create Issue Missing Required teamId Field (Frontend)

## State & Data

- [ ] Create `teamStore` (Zustand) with `currentTeamId`, `currentTeamName`, `setCurrentTeam()` in `src/entities/team/model/store.ts`
- [ ] Add `teamId: string` required field to `CreateIssueData` interface in `src/entities/issue/model/types.ts`
- [ ] Update `createIssue()` API function in `src/entities/issue/api/index.ts` — no code change needed (it already passes the full data object)

## Components

- [ ] Wire `TeamSelector` in `src/widgets/Sidebar/ui/Sidebar.tsx` to write selected team to `teamStore`
- [ ] Wire `TeamSelector` in `src/widgets/Sidebar/ui/MobileSidebarOverlay.tsx` to write selected team to `teamStore`
- [ ] Update `handleCreateIssue` in `src/pages/IssuesPage.tsx` to read `currentTeamId` from `teamStore` and pass it to `createIssue()`
- [ ] Add guard in `IssuesPage` to show error when no team is selected (disable "New Issue" button or show inline message)

## Integration

- [ ] Update MSW POST `/issues` handler in `src/mocks/handlers.ts` to accept and validate `teamId` in request body

## Validation

- [ ] Write unit test for `teamStore` (set/get current team)
- [ ] Write integration test for `handleCreateIssue` including teamId in POST body
- [ ] Update MSW test setup to verify teamId validation in issue creation

## Review

- [ ] Verify all issue creation requests include `teamId`
- [ ] Verify team selection persists across navigation (between sidebar and IssuesPage)
- [ ] Verify error state when no team is selected
- [ ] Run full test suite
