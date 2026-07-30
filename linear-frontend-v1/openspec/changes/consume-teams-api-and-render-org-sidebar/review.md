# Review — Consume Teams API and Render Org Sidebar

## Spec Compliance

| Requirement | Covered By | Status |
|-------------|-----------|--------|
| LoadTeamsOnAuth | `entities/team/lib/useTeams.ts` + `entities/team/api/teams.ts` | ✅ tasks specify fetch + hook |
| Multiple org grouping | `groupTeamsByOrg` in types, `OrgSection` per org group | ✅ logic in types, component per org |
| Single org collapsed | `OrgSection` default `collapsed` when only one org | ✅ in spec |
| Loading skeleton | `SkeletonLoader` with `aria-busy` | ✅ component + 2s timeout message |
| 401 redirect | Handled by `apiClient` auth interceptor | ✅ existing infra, noted in design |
| 5xx retry banner | `ErrorBanner` with retry | ✅ component + re-fetch wiring |
| Network timeout | 10s timeout → same retry banner | ✅ in spec, tasks mention timeout |
| Empty state | "You are not a member of any team" + CTA | ✅ EmptyState in design |
| Team selection | `activeTeamId` click → highlight + persist | ✅ store action + URL/localStorage |
| Persist on reload | URL `?team=<id>` + localStorage | ✅ hydrate on mount task |
| Keyboard nav | Tab, Arrow Up/Down, Enter/Space, Escape | ✅ ARIA spec in design |
| ARIA | `aside`, `aria-expanded`, `aria-current`, `role=alert`, `role=treeitem` | ✅ all specified |

## Edge Cases

- **Network offline**: User loses connection before teams load → timeout fires after 10s → retry banner. Adequate.
- **Malformed API response**: `Team` type validation at parse boundary — missing fields should surface as "Could not load teams." Covered by validation spec.
- **Multiple rapid retry clicks**: No debounce specified — tasks should say if needed. Low risk for read-only fetch.
- **Zero orgs**: Mapped to empty state — covered by spec (empty array).
- **Active team deleted**: `activeTeamId` no longer in `teams` array → store handles gracefully by clearing activeTeamId on stale hydration. Add: task to handle this case (clear if not found).
- **Single-team single-org**: Default-collapsed org header — spec has this but think through: "collapsed by default" but still visually indicates the org exists. OK.

## Leakage Check

- Specs: no implementation details, only BDD scenarios and component responsibilities ✅
- Wireframes: structural only, no CSS values or framework references ✅
- Design: appropriate level — component tree, data flow, file paths, but not full implementation ✅
- Tasks: concrete actions with file paths as expected ✅

## Checklist

- [x] All requirements covered
- [x] Scenarios pass (verifiable from spec → task mapping)
- [x] Error states handled (loading, empty, 401, 5xx, timeout)
- [x] No technical detail in specs
- [x] ADR review completed — no new durable ADRs needed
- [x] Wireframes approved (VERDICT: approve)
