# Tasks — Fix: Issue Model Missing 7 Fields from API Spec (Frontend)

## Type Definition Update

- [x] Add 7 missing fields to `Issue` interface in `src/entities/issue/model/types.ts`:
  - `teamId: string`
  - `parentId: string | null`
  - `sortOrder: number`
  - `sequence: number`
  - `completedAt: string | null`
  - `canceledAt: string | null`
  - `deletedAt: string | null`
- [x] Rename `status: string` to `statusId: string` in `Issue` interface
- [x] Update `IssueFilters` to use `statusId` instead of `status` (already correct — verify)
- [x] Update `CreateIssueData` to use `statusId` instead of `status`
- [x] Update `UpdateIssueData` to use `statusId` instead of `status`

## Component Updates

- [x] Update `src/entities/issue/ui/IssueCard.tsx` — verify no direct `status` field access
- [x] Update `src/entities/issue/ui/IssueDetail.tsx` — verify no direct `status` field access
- [x] Update `src/entities/issue/ui/IssueList.tsx` — verify no direct `status` field access
- [x] Update `src/entities/issue/ui/IssueForm.tsx` — update form field mapping for `statusId`
- [x] Update `src/entities/issue/ui/IssueFilters.tsx` — verify filter uses `statusId`
- [x] Update `src/entities/issue/ui/IssueStatusBadge.tsx` — verify prop uses `statusId`
- [x] Update `src/entities/issue/ui/IssueFormModal.tsx` — verify no direct `status` field access

## State & Data Updates

- [x] Update `src/entities/issue/model/store.ts` — verify store state shape matches updated type
- [x] Update `src/entities/issue/model/selectors/index.ts` — verify selectors use `statusId`
- [x] Update `src/entities/issue/api/index.ts` — verify API responses map to updated type
- [x] Update `src/shared/stores/selectors/index.ts` — verify selectors use `statusId`

## Page Updates

- [x] Update `src/pages/IssuesPage.tsx` — verify page uses `statusId` in filters
- [x] Update `src/pages/IssueDetailPage.tsx` — verify detail page uses `statusId`

## Validation

- [x] Update `src/entities/issue/model/validation.ts` — update Zod schema field from `status` to `statusId`
- [x] Run TypeScript compiler: `pnpm typecheck`
- [x] Run linter: `pnpm lint`
- [x] Run unit tests: `pnpm test`
