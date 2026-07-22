# Review — Issue Watchers

## Spec Compliance

The tasks and design fully cover both requirements from the spec:

- **ViewWatchers**: WatcherSection/WatcherList/WatcherItem components handle loaded, empty, loading (skeleton), and error (retry) states as specified. WatcherList renders inline below issue metadata on `/issues/:id`.
- **ToggleWatch**: WatchButton implements optimistic add/remove with toast feedback. 409 conflict triggers re-fetch, 422 business rule errors surface via toast with state revert.

All scenarios in the spec have matching task items and design states.

## Edge Cases

- **409 Conflict**: Specified in `ToggleWatch` scenario; handled via re-fetch in store. Task item confirms this.
- **422 Business Rule Error**: Specified in spec; covered by store error handling in tasks.
- **Unauthenticated user**: WatchButton disabled state is called out in tasks but not explicitly in the spec. Consider adding to spec if this is a product requirement.
- **Issue ID change**: WatcherSection re-fetches when `issueId` changes (task item). Good.
- **Parallel rapid toggles**: Not explicitly addressed. The optimistic pattern with sequential API calls could race. Consider debouncing or disabling the button while a request is in flight.

## Leakage Check

No implementation details (library names, file paths, Zustand specifics) leak into specs/frontend/issue-watchers.md. The spec stays at the behaviour level.

## Checklist

- [x] All requirements covered — ViewWatchers and ToggleWatch both have full task coverage
- [x] Scenarios pass — each scenario is testable and covered by tasks
- [x] Error states handled — loading, empty, error, 409, 422, network failure all accounted for
- [x] No technical detail in specs — specs remain behaviour-only
