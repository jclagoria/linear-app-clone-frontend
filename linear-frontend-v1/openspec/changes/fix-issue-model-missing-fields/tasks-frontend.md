# Tasks — Fix: Issue Model Missing 7 Fields from API Spec (Frontend)

## Type Definition Update

- [ ] Add 7 missing fields to `Issue` interface in `src/entities/issue/model/types.ts`:
  - `teamId: string`
  - `parentId: string | null`
  - `sortOrder: number`
  - `sequence: number`
  - `completedAt: string | null`
  - `canceledAt: string | null`
  - `deletedAt: string | null`
- [ ] Rename `status: string` to `statusId: string` in `Issue` interface
- [ ] Update `IssueFilters` to use `statusId` instead of `status` (already correct — verify)
- [ ] Update `CreateIssueData` to use `statusId` instead of `status`
- [ ] Update `UpdateIssueData` to use `statusId` instead of `status`

## Component Updates

- [ ] Update `src/entities/issue/ui/IssueCard.tsx` — verify no direct `status` field access
- [ ] Update `src/entities/issue/ui/IssueDetail.tsx` — verify no direct `status` field access
- [ ] Update `src/entities/issue/ui/IssueList.tsx` — verify no direct `status` field access
- [ ] Update `src/entities/issue/ui/IssueForm.tsx` — update form field mapping for `statusId`
- [ ] Update `src/entities/issue/ui/IssueFilters.tsx` — verify filter uses `statusId`
- [ ] Update `src/entities/issue/ui/IssueStatusBadge.tsx` — verify prop uses `statusId`
- [ ] Update `src/entities/issue/ui/IssueFormModal.tsx` — verify no direct `status` field access

## State & Data Updates

- [ ] Update `src/entities/issue/model/store.ts` — verify store state shape matches updated type
- [ ] Update `src/entities/issue/model/selectors/index.ts` — verify selectors use `statusId`
- [ ] Update `src/entities/issue/api/index.ts` — verify API responses map to updated type
- [ ] Update `src/shared/stores/selectors/index.ts` — verify selectors use `statusId`

## Page Updates

- [ ] Update `src/pages/IssuesPage.tsx` — verify page uses `statusId` in filters
- [ ] Update `src/pages/IssueDetailPage.tsx` — verify detail page uses `statusId`

## Validation

- [ ] Update `src/entities/issue/model/validation.ts` — update Zod schema field from `status` to `statusId`
- [ ] Run TypeScript compiler: `pnpm typecheck`
- [ ] Run linter: `pnpm lint`
- [ ] Run unit tests: `pnpm test`
