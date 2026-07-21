# Deployment

## Overview

The Linear App Clone is deployed as a containerized frontend SPA served via a CDN, with API requests proxied to the backend server. The deployment targets cloud infrastructure with Docker containers and automated CI/CD via GitHub Actions.

## Architecture

```
User --> Cloudflare CDN --> Docker (Vite SPA) --> API Server
                                  |
                            serve static assets
                                  |
                            nginx (optional: serve + proxy)
```

## Infrastructure

| Component | Service | Notes |
|-----------|---------|-------|
| Cloud | Self-hosted / VPS | Single VM or cloud instance |
| Container | Docker | Multi-stage build for minimal image |
| Orchestration | Docker Compose | Simple multi-service setup |
| Database | PostgreSQL | Managed or containerized |
| Domain | linear-clone.example.com | DNS via Cloudflare |
| CDN | Cloudflare | Static assets caching |

## CI/CD

| Step | Tool | Action |
|------|------|--------|
| CI | GitHub Actions | Lint, typecheck, test, build |
| CD | GitHub Actions | Deploy to staging / production |
| Environments | dev → staging → production | Promotion via manual approval |

### Pipeline

```yaml
name: deploy-frontend
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - checkout
      - setup Node.js 22
      - npm ci
      - npm run lint
      - npm run typecheck
      - npm run test:run
      - npm run build
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - build Docker image
      - push to registry
      - deploy via SSH / Docker Compose
```

## Frontend

- **Build**: `vite build` — outputs to `dist/`
- **Static files**: served via nginx or CDN
- **Env vars**: `VITE_API_BASE`, `VITE_SERVER_URL`, `VITE_DEV_PORT`
- **Cache**: Static assets fingerprinted by Vite, long-lived cache headers
- **Runtime config**: API base URL configured at build time via env vars

## Monitoring

| Tool | Purpose |
|------|---------|
| Docker logs | Application logs |
| Health check | `GET /api/health` endpoint |

## Backup & Recovery

- **Code**: Git — source of truth
- **Config**: `.env.example` documents required env vars; infra config in `docker-compose.yml`
- **Recovery**: Re-deploy from clean checkout + `docker-compose up`
