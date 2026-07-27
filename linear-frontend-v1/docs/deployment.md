# Deployment — Linear App Clone Frontend

## Overview

This is a frontend-only deployment. The SPA is built with Vite and served as static files. The backend WebSocket gateway is deployed separately (handled in LAG-56).

## Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                    CDN (Cloudflare)                      │
│              Static assets + SPA routing                 │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  Vercel / Netlify                        │
│           Static site hosting + CI/CD                    │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│               WebSocket Gateway (Backend)                │
│              ws://api.example.com/ws                     │
└─────────────────────────────────────────────────────────┘
```

## Infrastructure

| Component | Service | Notes |
|-----------|---------|-------|
| Hosting | Vercel / Netlify | Static SPA hosting, automatic deployments |
| CDN | Built-in (Cloudflare edge) | Static assets, global distribution |
| Domain | Linear Clone | DNS: Cloudflare |
| SSL | Auto-provisioned | HTTPS + WSS for WebSocket |

## CI/CD

| Step | Tool | Action |
|------|------|--------|
| CI | GitHub Actions | Lint, typecheck, test, build |
| CD | Vercel / Netlify | Auto-deploy on push to main |
| Environments | dev → preview → production | Branch-based promotion |

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
      - checkout
      - setup-node (22)
      - npm ci
      - npm run lint
      - npm run typecheck
      - npm run test:run
      - npm run build
  deploy:
    needs: test
    steps:
      - deploy to Vercel/Netlify
```

## Frontend

- **Build**: Vite production build (`npm run build`)
- **Output**: `dist/` directory (static HTML, JS, CSS, assets)
- **Static files**: Served via CDN edge network
- **SPA routing**: All routes fallback to `index.html`
- **Env vars**:
  - `VITE_API_URL` — REST API base URL
  - `VITE_WS_URL` — WebSocket gateway URL
  - `VITE_APP_NAME` — Application name (optional)
- **Cache**: Static assets with content-hash filenames (immutable), `index.html` with short TTL

## Environment Configuration

| Variable | Dev | Preview | Production |
|----------|-----|---------|------------|
| `VITE_API_URL` | `http://localhost:3000` | `https://preview-api.example.com` | `https://api.example.com` |
| `VITE_WS_URL` | `ws://localhost:3000/ws` | `wss://preview-api.example.com/ws` | `wss://api.example.com/ws` |

## Build Optimization

- **Code splitting**: React Router lazy-loaded routes
- **Tree shaking**: Vite automatic tree shaking
- **Asset optimization**: Image compression, SVG inlining
- **Bundle analysis**: `npm run build -- --analyze` for bundle size inspection

## Monitoring

| Tool | Purpose |
|------|---------|
| Vercel Analytics | Core Web Vitals, performance metrics |
| Sentry (optional) | Error tracking, source maps |
| Lighthouse CI | Performance, accessibility, SEO audits |

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm run test        # Unit tests (Vitest)
npm run test:e2e    # E2E tests (Playwright)

# Build for production
npm run build

# Preview production build
npm run preview
```
