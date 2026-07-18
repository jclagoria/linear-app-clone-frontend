# Review — Remove localStorage Token Storage, Use HttpOnly Cookie via credentials: 'include'

## Spec Compliance

All requirements from `specs/frontend/auth-cookie-migration.md` are covered by the design and task breakdown:

| Requirement | Coverage |
|-------------|----------|
| LoginStoresCookie | `login` method changes in design-frontend + tasks |
| RefreshUsesCookie | `hydrate` + `refreshAccessToken` method changes |
| LogoutClearsCookie | `logout` method changes + MSW handler |
| NoLocalStorageTokenPersistence | All localStorage functions removed |
| MSWHandlersReflectNewContract | New MSW handler file created in tasks |

All BDD scenarios from the spec are addressed with concrete code changes in `design-frontend.md` and checkbox tasks in `tasks-frontend.md`.

## Edge Cases

| Edge Case | Handled |
|-----------|---------|
| Cookie expired on page load | `hydrate` — server error clears session, sets `isAuthenticated: false` |
| Cookie expired during silent refresh | `refreshAccessToken` — error branch clears session |
| Network failure on login | Existing error handling preserved (catch blocks unchanged) |
| Logout best-effort | Existing catch block preserved |
| No cookie exists (first visit) | `hydrate` — no early return needed, server responds with error |

## Leakage Check

No implementation details leaked into specs (`specs/frontend/auth-cookie-migration.md`). Specs stay at the behavioural/BDD level. Technical details are confined to `design-frontend.md` and `tasks-frontend.md`.

No backend details are referenced in frontend artifacts. The OpenAPI contract remains the source of truth for endpoint shapes.

## Checklist

- [x] All requirements covered — 5 requirements with 10 BDD scenarios
- [x] Scenarios pass — each maps to explicit code changes
- [x] Error states handled — server errors, expired cookies, network failures
- [x] No technical detail in specs — specs are behavioural only
- [x] No UI gaps — this is a backend-facing auth refactor with zero UI impact
- [x] Consistent change scope — all artifacts agree on in-scope/out-of-scope boundaries
