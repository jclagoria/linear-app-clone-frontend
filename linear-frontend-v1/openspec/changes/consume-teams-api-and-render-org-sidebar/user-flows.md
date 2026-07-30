# User Flows — Consume Teams API and Render Org Sidebar

## Actors

| Actor | Description |
|-------|-------------|
| Authenticated User | User with a valid session who can view and switch between their teams |
| Unauthenticated User | User with expired/missing token, redirected to login |

## Flow Inventory

### Navigation: Org Sidebar

**Actor**: Authenticated User  
**Entry**: User lands on the app after authentication completes  
**Exit**: User selects a team (stays in app), or is redirected to login on 401

#### Screen List

| Screen | States Visited | Description |
|--------|----------------|-------------|
| App Shell with Sidebar | empty, loading, populated, error | Main layout; sidebar shows teams grouped by org on the left |
| Login | — | Redirect target when token is expired/invalid |

#### Navigation Graph

```mermaid
graph TD
    Login -->|auth success| AppShell
    AppShell -->|sidebar mounts| Loading
    Loading -->|fetch ok, has teams| Populated
    Loading -->|fetch ok, empty| Empty
    Loading -->|401| Login
    Loading -->|5xx / timeout| Error
    Error -->|retry| Loading
    Populated -->|click team| ActiveTeam
    Empty -->|click "Create a team"| CreateTeamFlow
```

#### State Transitions

| From | Action | To | Notes |
|------|--------|----|-------|
| Login | User authenticates | AppShell | Token stored; sidebar about to mount |
| AppShell | Sidebar mount triggers fetch | Loading | Skeleton shown; "Loading your teams…" after 2s |
| Loading | GET /me/teams returns 200 with teams | Populated | Teams grouped by orgId, org sections rendered |
| Loading | GET /me/teams returns 200 with [] | Empty | "You are not a member of any team" + CTA |
| Loading | GET /me/teams returns 401 | Login | Token expired, redirect |
| Loading | GET /me/teams returns 5xx | Error | Inline banner "Could not load teams." |
| Loading | Timeout after 10s | Error | Same retry banner |
| Error | User clicks "Retry" | Loading | Re-fetch GET /me/teams |
| Populated | User clicks team item | ActiveTeam | Team highlighted; selection persisted to URL/localStorage |
| Populated | Page reload | ActiveTeam | Same team active from persisted state |
| Empty | User clicks "Create a team" | CreateTeamFlow | Out of scope for this change; CTAs stub |
