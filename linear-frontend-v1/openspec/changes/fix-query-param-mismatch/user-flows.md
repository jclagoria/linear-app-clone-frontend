# User Flows — Fix: Query Parameter Mismatch

## Actors

| Actor | Description |
|-------|-------------|
| User | Authenticated user who filters issues on the issues list page |

## Flow Inventory

### Issues: Filter Issues List

**Actor**: User
**Entry**: User is on the issues list page (`/issues`)
**Exit**: Filtered issue list is displayed

No new screens are introduced — this change alters the data plumbing behind the existing filter flow. The status filter now sends a `statusId` UUID instead of a `status` name string. The label filter now sends `labelIds` as comma-separated UUIDs. The `search` and `priority` params are no longer included.

#### Screen List

| Screen | States Visited | Description |
|--------|----------------|-------------|
| Issues List | loading, populated, empty, error | Existing — query param construction changed only |

#### Navigation Graph

No navigation changes. The flow remains:
Issues List → apply filters → refetch issues → display filtered results

#### State Transitions

| From | Action | To | Notes |
|------|--------|----|-------|
| Issues List | Select status filter | Issues List (refetching) | Filter sends `statusId` (UUID) instead of `status` (name) |
| Issues List | Select label filter | Issues List (refetching) | Filter sends `labelIds` param |
| Issues List | Clear search/priority filter | Issues List (refetching) | `search` and `priority` params removed from API call |

---

No other flows affected.
