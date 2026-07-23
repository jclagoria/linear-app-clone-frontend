# Fix: Delete Issue Response Type Mismatch

## Problem Statement

The `deleteIssue()` API function declares a return type of `Promise<{ data: { success: boolean } }>`, but the backend `DELETE /api/v1/issues/{id}` endpoint returns **204 No Content** with no response body. The `apiClient.parseResponse()` returns `undefined` for 204 responses, creating a type mismatch between the declared return type and the actual runtime value.

## Motivation

While the current caller (`IssueDetailPage.tsx`) ignores the return value, any future caller expecting `result.data.success` will crash with `Cannot read properties of undefined`. Fixing this now prevents a latent bug from surfacing in production and aligns the TypeScript types with the actual API contract.

## Scope

- **In scope**: Fix the return type of `deleteIssue()` in `src/entities/issue/api/index.ts` from `Promise<{ data: { success: boolean } }>` to `Promise<void>`, matching the pattern already used by `deleteComment()`.
- **Out of scope**: Changes to the API backend, other delete endpoints, or caller components.

## Impact

- **Files affected**: `src/entities/issue/api/index.ts` (lines 48-52)
- **Callers**: `IssueDetailPage.tsx` — currently ignores return value, no breakage expected
- **Type safety**: Eliminates a type mismatch that could cause runtime errors in future code
