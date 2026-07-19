# Review — Add Dockerfile for Containerization

## Spec Compliance

All requirements from specs-frontend are covered by the tasks:

| Requirement | Covered In Tasks | Status |
|-------------|-----------------|--------|
| SPA fallback routing (`try_files`) | nginx configuration tasks | ✅ |
| Static asset caching (`/assets/*`, 1 year) | nginx configuration tasks | ✅ |
| Security headers (X-Frame-Options, etc.) | nginx configuration tasks | ✅ |
| Hidden files denied (403) | nginx configuration tasks | ✅ |
| Non-root user (`appuser`) | Production stage tasks | ✅ |
| Multi-stage build | Build + Production stage tasks | ✅ |

## Edge Cases

- **Port conflicts**: Tasks document handling port binding failures (documented in user-flows)
- **Build cache invalidation**: Layer ordering (package.json first, then source) is specified in build stage tasks
- **Missing pnpm-lock.yaml**: `--frozen-lockfile` will fail early — intentional validation
- **CSP tuning**: CSP defaults may need per-deployment adjustment — noted as tunable in design

## Leakage Check

- Specs are written in terms of observable behavior (curl responses, container state)
- No implementation-specific Dockerfile lines leaked into specs
- Design details (base image versions, UID numbers) properly live in design artifacts

## Checklist

- [x] All requirements covered (7/7 spec scenarios mapped to tasks)
- [x] Scenarios verifiable (curl-based acceptance tests in tasks)
- [x] Error states handled (build failure, port conflict, nginx misconfig)
- [x] No technical detail in specs (specs describe behavior, not Docker commands)
- [ ] Implementation pending — run `/opsx-apply` to begin
