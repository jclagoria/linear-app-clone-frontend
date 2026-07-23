# Fix: Query Parameter Mismatch — status vs statusId, extra search/priority

## Problem Statement

The frontend sends query parameters when listing issues that don't match the OpenAPI spec. The API expects `statusId` (UUID) but the frontend sends `status` (status name string). The spec defines `labelIds` for label filtering but the frontend never sends it. Additionally, the frontend sends `search` and `priority` parameters that are not defined in the spec, causing the backend to ignore them silently — creating a misleading developer experience where filters appear to work client-side but have no effect.

## Motivation

This mismatch breaks issue filtering in two ways: status filtering is completely non-functional (the backend receives a name string where it expects a UUID), and label filtering is never wired up, leaving users without a working filter experience. Aligning query params with the API spec ensures that the UI filters actually work as expected. This is a correctness fix — no new features — that restores the intended filtering behavior.

## Scope

- **In scope**: Fix `status` → `statusId` in the issues list API call; wire `labelIds` parameter; remove `search` and `priority` from query params if they are not in spec; update all call sites (API layer and store)
- **Out of scope**: Adding server-side search or priority filtering support; changing the OpenAPI spec; refactoring the API layer architecture

## Impact

- `src/entities/issue/api/index.ts` — API call signature change
- `src/entities/issue/model/store.ts` — Store integration points
- Any component or hook that constructs issue query params
- No API spec changes needed — this aligns the client with the existing contract
