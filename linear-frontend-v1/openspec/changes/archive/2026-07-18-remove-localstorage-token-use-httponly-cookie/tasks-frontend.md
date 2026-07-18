# Tasks — Remove localStorage Token Storage, Use HttpOnly Cookie (Frontend)

## Types

- [x] Remove `refreshToken` from `LoginResponse.data` in `src/entities/session/model/types.ts`
- [x] Remove `refreshToken` from `RefreshResponse.data` in `src/entities/session/model/types.ts`

## Session Store

- [x] Remove `REFRESH_TOKEN_KEY` constant from `src/entities/session/model/store.ts`
- [x] Remove `getStoredRefreshToken()` function from `src/entities/session/model/store.ts`
- [x] Remove `setStoredRefreshToken(token)` function from `src/entities/session/model/store.ts`

### login method

- [x] Add `credentials: 'include'` to POST `/auth/login` fetch call
- [x] Remove `refreshToken` from response destructure (`const { user, accessToken } = json.data`)
- [x] Remove `setStoredRefreshToken(refreshToken)` call

### logout method

- [x] Add `credentials: 'include'` to POST `/auth/logout` fetch call
- [x] Remove `setStoredRefreshToken(null)` call

### hydrate method

- [x] Remove `getStoredRefreshToken()` localStorage read and early-return guard
- [x] Replace fetch body with `credentials: 'include'` and remove `Content-Type` header
- [x] Remove `refreshToken` from response destructure (`const { accessToken } = json.data`)
- [x] Remove `setStoredRefreshToken(newRefreshToken)` call
- [x] Remove `setStoredRefreshToken(null)` in error branch and catch block

### refreshAccessToken method

- [x] Remove `getStoredRefreshToken()` localStorage read and early-return guard
- [x] Replace fetch body with `credentials: 'include'` and remove `Content-Type` header
- [x] Remove `refreshToken` from response destructure (`const { accessToken: newToken } = json.data`)
- [x] Remove `setStoredRefreshToken(newRefreshToken)` call
- [x] Remove `setStoredRefreshToken(null)` in error branch and catch block

## MSW Handlers

- [x] Create `src/mocks/handlers.ts` with MSW handlers for auth endpoints
- [x] POST `/auth/login` handler returns `{ data: { user, accessToken } }` without `refreshToken`
- [x] POST `/auth/refresh` handler returns `{ data: { accessToken } }` without `refreshToken`
- [x] POST `/auth/logout` handler returns `{ data: { success: true } }`

## Testing

- [x] Update existing auth unit/integration tests for new response shapes
- [x] Verify `localStorage` is never called for refresh token in any test
- [x] Run full test suite: `pnpm vitest run`

## Validation

- [ ] Manual smoke test: login flow works end-to-end
- [ ] Manual smoke test: page refresh restores session
- [ ] Manual smoke test: logout clears session
