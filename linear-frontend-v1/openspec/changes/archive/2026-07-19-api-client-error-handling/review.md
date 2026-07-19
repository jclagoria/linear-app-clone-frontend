# Review — API Client & Error Handling

## Spec Compliance

All requirements from `specs/frontend/api-client.md` are covered across the planning artifacts:

- **AuthTokenInjection** → Covered in design-frontend (auth interceptor), tasks-frontend (interceptor implementation)
- **TokenRefreshOn401** → Covered in design-frontend (single-flight promise), spec (concurrent 401 dedup), tasks-frontend
- **ErrorTaxonomy** → Full class hierarchy from spec maps to ADR-0008 and design-frontend error mapper
- **ErrorHandlerInterface** → Subscriber pattern in design-frontend, tasks-frontend
- **RateLimitTracking** → RateLimitStore (Zustand) in design-frontend, per-endpoint tracking in spec, tasks-frontend
- **InterceptorPipeline** → Ordered auth→error→rate-limit pipeline in design-frontend, tasks-frontend

## Edge Cases

- **Unauthenticated requests** (`Authorization` header omitted) → auth interceptor handles via `accessToken` check
- **Concurrent 401 dedup** → single-flight `refreshPromise` prevents multiple refresh calls
- **Refresh failure** → queue drained with `UnauthorizedError`, user redirected to login
- **Network error** (no response) → `ApiError` base class fallback via `onNetworkError` callback
- **Rate limit per endpoint** → `Map<endpoint, State>` in RateLimitStore maintains independent tracking
- **Unknown HTTP status** → `InternalError` for unhandled 5xx; `onUnknown` callback for unregistered error codes
- **ErrorBanner dismiss** → `onDismiss` prop per design; focus management when re-shown

## Leakage Check

- Specs (`api-client.md`) describe behaviours in Gherkin scenarios — no implementation detail
- Mockups are HTML/CSS with no JS framework code
- Design doc stays at architectural level (no inline implementation)
- ADR captures durable decision (error taxonomy), not implementation steps
- Tasks reference concrete file paths but are checkboxes, not code

## Checklist

- [x] All requirements covered
- [x] Scenarios pass (spec coverage verified above)
- [x] Error states handled (full error taxonomy + fallback)
- [x] No technical detail in specs
- [x] Design-to-spec traceability — every scenario maps to a design decision
- [x] ADR recorded — ADR-0008 captures the error taxonomy decision with alternatives and trade-offs
- [x] Task breakdown is actionable and covers scaffold → components → state → interceptors → tests → review
