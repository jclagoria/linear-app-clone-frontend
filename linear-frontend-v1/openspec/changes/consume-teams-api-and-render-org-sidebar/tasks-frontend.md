# Tasks — Consume Teams API and Render Org Sidebar (Frontend)

## Scaffold

- [x] `entities/team/` directory exists
- [x] Create `entities/team/model/types.ts` — `Team { id, name, key, orgId, orgName }`, `OrgGroup { orgId, orgName, teams }`
- [x] Create `entities/team/model/store.ts` — expand Zustand store to include `teams: Team[]`, `loading, error`, `activeTeamId`, actions: `setTeams, setActiveTeamId, setLoading, setError`
- [x] Create `entities/team/api/teams.ts` — `fetchMyTeams(): Promise<Team[]>` wrapping `apiClient.get<Team[]>('/me/teams')`
- [x] Create `entities/team/lib/useTeams.ts` — custom hook with fetch + `useEffect` on mount, returns grouped teams + loading/error state
- [x] Export barrel `entities/team/index.ts`

## Components

- [x] Create `widgets/OrgSidebar/ui/OrgSidebar.tsx` — orchestrator: renders skeleton/error/empty/populated based on hook state; desktop + mobile variants
- [x] Create `widgets/OrgSidebar/ui/OrgSection.tsx` — collapsible org group with `aria-expanded`, chevron rotation, `onToggle`
- [x] Create `widgets/OrgSidebar/ui/OrgHeader.tsx` — clickable button showing org name + expand indicator
- [x] Create `widgets/OrgSidebar/ui/TeamItem.tsx` — team row with name, key badge, active highlight, `aria-current`
- [x] Create `widgets/OrgSidebar/ui/TeamKeyBadge.tsx` — small uppercase key pill (text + styling only)
- [x] Create `widgets/OrgSidebar/ui/ErrorBanner.tsx` — inline "Could not load teams." + "Retry" button, `role="alert"`
- [x] Create `widgets/OrgSidebar/ui/SkeletonLoader.tsx` — shimmer placeholder with `aria-busy`, "Loading teams" label
- [x] Create `widgets/OrgSidebar/index.ts` — barrel export

## State & Data

- [x] Integrate `useTeams` hook into `OrgSidebar` — fetch on mount, re-fetch on retry
- [x] Wire `activeTeamId` persistence: URL query param (`?team=<id>`) on select + localStorage fallback, hydrate on mount
- [x] Remove hardcoded `teams` array from `src/widgets/Sidebar/ui/Sidebar.tsx` — replace TeamSelector with OrgSidebar
- [x] Remove hardcoded `teams` array from `src/widgets/Sidebar/ui/MobileSidebarOverlay.tsx` — replace TeamSelector with OrgSidebar
- [x] Ensure existing `useTeamStore` `currentTeamId`/`setCurrentTeamId` are preserved or migrated (other features depend on them)

## Routing

- [x] `AppLayout.tsx`: replace `<Sidebar>` desktop import with `<OrgSidebar>`, keep collapse/nav wiring
- [x] `AppLayout.tsx`: replace `<MobileSidebarOverlay>` with mobile variant of OrgSidebar

## Integration

- [x] Connect `fetchMyTeams` to live `apiClient` — verify 401 redirects to `/login`, 5xx shows retry banner
- [x] Remove old `widgets/Sidebar/ui/TeamSelector.tsx` if fully replaced, or prune unused code

## Validation

- [ ] Unit: test `groupTeamsByOrg` grouping logic, store actions, hook fetch lifecycle (mock `apiClient`)
- [ ] Unit: render tests for each component state (loading skeleton, error banner with retry, empty, populated, collapsed/expanded org sections, active team highlight)
- [ ] Verify 401 redirect works end-to-end (stale token → `/login`)
- [ ] Verify active team persists across page reload (URL + localStorage)

## Review

- [x] Run `tsc --noEmit` — no type errors in new or modified files
- [x] Run linter on changed files
- [ ] Manual: open page → confirm team list loads grouped by org → select team → reload → same team active → collapse org → expand org → error state with retry
