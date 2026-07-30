# Org Sidebar — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| API client | `apiClient` from `@/shared/lib/api-client` | Reuse existing singleton with auth + error interceptors; no new API module |
| State | Zustand store for team data | Matches existing pattern (authStore, issueStore); server data cached with manual invalidation |
| Data fetching | Custom hook (`useTeams`) wrapping `apiClient.get` | Consistent with existing hooks pattern; simple fetch + group logic doesn't need React Query |
| Component placement | `widgets/OrgSidebar/` | FSD: widget layer — composes entities into a self-contained sidebar unit |
| Team entity | `entities/team/` | FSD: team model with types + store, reusable across features |
| Sidebar persistence | URL query param + localStorage fallback | Active team ID persisted so deep-linking and refresh both work |

## Component Tree

```
AppLayout
 +-- Header (existing)
 +-- OrgSidebar (widget)
      +-- SkeletonLoader (loading state)
      +-- ErrorBanner (error state)
      +-- EmptyState (empty state)
      +-- OrgSection (per org, populated state)
           +-- OrgHeader (collapsible button)
           +-- TeamItem (per team)
                +-- TeamKeyBadge
 +-- MainContent
```

| Component | Responsibility | Props | State |
|-----------|---------------|-------|-------|
| `OrgSidebar` | Orchestrates states, fetches teams | — | loading, empty, error, populated |
| `OrgSection` | Collapsible org group | orgName, teams, onToggle | collapsed, expanded |
| `OrgHeader` | Clickable org header with chevron | name, isExpanded, onToggle | — |
| `TeamItem` | Team row with key badge | name, key, isActive, onClick | active, inactive |
| `TeamKeyBadge` | Small uppercase key pill | key | — |
| `ErrorBanner` | Inline error with retry | onRetry | — |
| `SkeletonLoader` | Shimmer placeholder | — | — |

## Routing

| Route | Component | Auth | Notes |
|-------|-----------|------|-------|
| `/` | AppLayout | protected | Main shell with sidebar |
| `/?team=<id>` | AppLayout | protected | Pre-selects team from URL |
| `/login` | LoginPage | public | Redirect on 401 |

## State Management

- **Global state** (`entities/team/model/store.ts`): Zustand store for `teams[]`, `activeTeamId`, `loading`, `error`. Persisted `activeTeamId` to localStorage.
- **Local state**: `OrgSection` collapse state (React `useState`).
- **Server state**: Teams fetched on mount, cached in store. No real-time sync — stale-while-revalidate on navigation.

## Data Fetching

- **Client**: `apiClient.get<Team[]>('/me/teams')` — uses existing singleton with auth interceptor.
- **Error handling**: 401 → `UnauthorizedError` → redirect to `/login`. 5xx/timeout → `ErrorBanner` with retry.
- **Optimistic updates**: Not applicable (read-only fetch).

## Asset Map

| Asset | Path | Notes |
|-------|------|-------|
| OrgSidebar | `widgets/OrgSidebar/ui/` | Main widget component |
| Team types | `entities/team/model/types.ts` | Team + OrgGroup interfaces |
| Team store | `entities/team/model/store.ts` | Zustand store |
| useTeams hook | `entities/team/lib/useTeams.ts` | Fetch + group logic |
| Team API | `entities/team/api/teams.ts` | `fetchMyTeams()` calling `apiClient` |

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| API response | MUST be array of Team objects with `id`, `name`, `key`, `orgId`, `orgName` | "Could not load teams." |
| Token | MUST be valid (401 handled by apiClient) | Redirect to /login |

## Accessibility

- **Keyboard navigation**: Tab between sidebar and main. Arrow Up/Down within sidebar tree items. Enter/Space to select team. Escape collapses org section. Focus trapped in error banner to retry on appear.
- **ARIA**: `aside` with `aria-label="Organization navigation"`. `aria-expanded` on org headers. `aria-current="page"` on active team. `role="alert"` on error banner. `role="status"` with `aria-busy="true"` on skeleton.
- **Screen reader**: Skeleton announces "Loading teams". Error banners announced via `aria-live="assertive"`. Team names read by `aria-label`.
