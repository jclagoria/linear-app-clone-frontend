# Issue Creation — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Team state sharing | New Zustand store (`teamStore`) | Fits existing Zustand pattern; no context provider overhead; accessible outside React tree |
| teamId in API type | Required field on `CreateIssueData` | API contract requires it; prevents accidental omission |
| Team availability check | Guard in `IssuesPage` before opening modal | Prevents submission failure; gives clear UX feedback |

## Component Tree

```
App
├── Sidebar
│   └── TeamSelector
│       └── onSelect → teamStore.setCurrentTeamId()
└── IssuesPage
    ├── IssueList
    └── IssueFormModal
        └── onSubmit → handleCreateIssue()
            └── reads teamStore.currentTeamId
            └→ createIssue({ ...data, teamId })
```

| Component | Responsibility | Props | State |
|-----------|---------------|-------|-------|
| TeamSelector | Team selection dropdown | teams, currentTeamId, onSelect | open, closed |
| IssuesPage | Issue list + orchestrate creation | none | loading, empty, populated, error |
| IssueFormModal | Create/edit form | isOpen, mode, onClose, onSubmit | open, submitting, error |

## State Management

- **Global state**: TeamStore (new) — holds `currentTeamId` and `setCurrentTeamId()`
- **Existing**: IssuesStore — unchanged; `addIssue()` receives data with teamId
- **Form state**: react-hook-form — unchanged; `IssueFormSchema` doesn't need teamId field

### TeamStore

```typescript
interface TeamState {
  currentTeamId: string | null
  currentTeamName: string | null
  setCurrentTeam: (id: string, name: string) => void
}
```

Created with Zustand. Default: first team in sidebar list or `null`.

## Data Fetching

- **Client**: apiClient (fetch wrapper) — unchanged
- **createIssue()**: POST body now includes `{ ...data, teamId }`
- **Error handling**: Existing toast pattern — unchanged; error may now include teamId validation errors
- **Optimistic updates**: None for creation — wait for API response

## Asset Map

No new assets. Existing components reused.

## Validation Strategy

| Field | Rule | Error Message |
|-------|------|---------------|
| teamId | Required, must be non-empty string | (guarded at page level: "Select a team before creating issues") |
| title | Required, max 255 chars | "Title is required" (existing) |

## Accessibility

No changes needed. Existing keyboard nav, ARIA roles, and focus management on IssueFormModal and TeamSelector unaffected.
