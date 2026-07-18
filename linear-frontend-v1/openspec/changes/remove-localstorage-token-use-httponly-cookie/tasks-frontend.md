# Tasks — Remove localStorage Token Storage, Use HttpOnly Cookie (Frontend)

## Types

- [ ] Remove `refreshToken` from `LoginResponse.data` in `src/entities/session/model/types.ts`
- [ ] Remove `refreshToken` from `RefreshResponse.data` in `src/entities/session/model/types.ts`

## Session Store

- [ ] Remove `REFRESH_TOKEN_KEY` constant from `src/entities/session/model/store.ts`
- [ ] Remove `getStoredRefreshToken()` function from `src/entities/session/model/store.ts`
- [ ] Remove `setStoredRefreshToken(token)` function from `src/entities/session/model/store.ts`

### login method

- [ ] Add `credentials: 'include'` to POST `/auth/login` fetch call
- [ ] Remove `refreshToken` from response destructure (`const { user, accessToken } = json.data`)
- [ ] Remove `setStoredRefreshToken(refreshToken)` call

### logout method

- [ ] Add `credentials: 'include'` to POST `/auth/logout` fetch call
- [ ] Remove `setStoredRefreshToken(null)` call

### hydrate method

- [ ] Remove `getStoredRefreshToken()` localStorage read and early-return guard
- [ ] Replace fetch body with `credentials: 'include'` and remove `Content-Type` header
- [ ] Remove `refreshToken` from response destructure (`const { accessToken } = json.data`)
- [ ] Remove `setStoredRefreshToken(newRefreshToken)` call
- [ ] Remove `setStoredRefreshToken(null)` in error branch and catch block

### refreshAccessToken method

- [ ] Remove `getStoredRefreshToken()` localStorage read and early-return guard
- [ ] Replace fetch body with `credentials: 'include'` and remove `Content-Type` header
- [ ] Remove `refreshToken` from response destructure (`const { accessToken: newToken } = json.data`)
- [ ] Remove `setStoredRefreshToken(newRefreshToken)` call
- [ ] Remove `setStoredRefreshToken(null)` in error branch and catch block

## MSW Handlers

- [ ] Create `src/mocks/handlers.ts` with MSW handlers for auth endpoints
- [ ] POST `/auth/login` handler returns `{ data: { user, accessToken } }` without `refreshToken`
- [ ] POST `/auth/refresh` handler returns `{ data: { accessToken } }` without `refreshToken`
- [ ] POST `/auth/logout` handler returns `{ data: { success: true } }`

## Testing

- [ ] Update existing auth unit/integration tests for new response shapes
- [ ] Verify `localStorage` is never called for refresh token in any test
- [ ] Run full test suite: `pnpm vitest run`

## Validation

- [ ] Manual smoke test: login flow works end-to-end
- [ ] Manual smoke test: page refresh restores session
- [ ] Manual smoke test: logout clears session
