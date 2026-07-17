# Deployment — Linear App Clone (Frontend)

## Overview

Vite SPA deployed to Vercel. Static asset serving with client-side routing. Backend is external (deployed separately). No containerization needed — Vercel handles build + CDN + environment management.

## Architecture

```text
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser   │────>│   Vercel     │────>│  API Backend │
│ (Vite SPA)  │     │ (CDN + SSR   │     │  (external)  │
│             │     │  fallback)   │     │              │
└─────────────┘     └──────────────┘     └──────────────┘
```

## Infrastructure

| Component | Service | Notes |
|-----------|---------|-------|
| Hosting | Vercel | SPA deploy, CDN, preview deployments |
| Domain | (TBD) | DNS via Vercel or Cloudflare |
| CDN | Vercel Edge Network | Static assets, cache-optimized |
| Env vars | Vercel Environment Variables | `VITE_API_URL`, per-environment |

## CI/CD

| Step | Tool | Action |
|------|------|--------|
| CI | GitHub Actions | Lint, type-check, unit test, build |
| CD | Vercel Git Integration | Auto-deploy on push to main/branch |
| Environments | Preview (per branch) → Production (main) | Vercel automatic |

### Pipeline (GitHub Actions)

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
  e2e:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install
      - run: pnpm exec playwright install
      - run: pnpm exec playwright test
```

## Frontend

- **Build**: `vite build` → static `dist/`
- **Static files**: Served via Vercel CDN
- **Env vars**: `VITE_API_URL` (backend base URL)
- **Cache**: `Cache-Control: public, max-age=31536000, immutable` for hashed assets
- **SPA fallback**: Vercel rewrites `/*` to `/index.html`

## Monitoring

| Tool | Purpose |
|------|---------|
| Vercel Analytics | Web vitals, page views |
| Sentry | Error tracking, source maps |

## Backup & Recovery

- **Config**: Vercel project settings + `vercel.json` in repo
- **Env vars**: Documented in project README
- **Recovery**: Re-deploy via Vercel dashboard or `git revert` + push
