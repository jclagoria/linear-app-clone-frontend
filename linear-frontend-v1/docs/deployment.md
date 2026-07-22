# Deployment — Linear App Clone (Frontend)

## Overview

Static SPA built with Vite, containerized with Docker, and deployed to a cloud platform. The frontend is a pure client-side application that communicates with the backend API via REST + SSE.

## Architecture

```
Browser ──HTTPS──> CDN ──> Docker (nginx) ──> Backend API
                        └──> Static files (built SPA)
```

## Infrastructure

| Component | Service | Notes |
|-----------|---------|-------|
| Hosting | Docker container (nginx) | Serves built static files + reverse proxy |
| CDN | Cloudflare | Static asset caching, SSL termination |
| Domain | linear-clone.vercel.app / custom | TBD |
| Backend | Separate deployment | REST API at `/api` |

## CI/CD

| Step | Tool | Action |
|------|------|--------|
| CI | GitHub Actions | Lint, typecheck, test, build |
| CD | GitHub Actions | Build container, push, deploy |
| Environments | dev → staging → production | Promotion: manual approval |

### Pipeline

```yaml
name: deploy-frontend
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run lint
      - run: pnpm run typecheck
      - run: pnpm run test:run
      - run: pnpm run build
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: docker build -t linear-frontend .
      - run: docker push $REGISTRY/linear-frontend:latest
      - run: kubectl set image deployment/frontend frontend=$REGISTRY/linear-frontend:latest
```

## Frontend

- **Build**: `vite build` — outputs static files to `dist/`
- **Static files**: served via nginx container (or CDN)
- **Env vars**: `VITE_API_URL` (compiled at build-time for Vite)
- **Cache**: Long-lived cache for hashed assets; `index.html` uncached

## Monitoring

| Tool | Purpose |
|------|---------|
| Browser DevTools / React DevTools | Development debugging |
| Error tracking | TBD (Sentry or equivalent) |
| Analytics | TBD |

## Backup & Recovery

- **Source**: Git repository (single source of truth)
- **Build artifacts**: CI pipeline rebuilds from source
- **Env config**: Encrypted in CI secrets, not committed
