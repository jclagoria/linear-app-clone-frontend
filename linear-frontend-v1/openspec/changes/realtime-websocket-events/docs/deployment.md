# Deployment — Realtime Module (Frontend)

## Overview

The frontend is a single-page application built with Vite and served via CDN or static file server. The WebSocket connection targets a separate backend gateway — no WebSocket server runs in the frontend build.

## Architecture

```
Browser (SPA)
  |
  |-- HTTP → API Server (REST)
  |-- WebSocket → WS Gateway (real-time events)
  |
CDN / Static Server
  |-- index.html, JS bundles, CSS
```

## Infrastructure

| Component | Service | Notes |
|-----------|---------|-------|
| Build | Vite | Produces static assets in `dist/` |
| Hosting | CDN / Vercel / Netlify | Static file serving |
| API | REST backend | Separate team; OpenAPI 3.1 contract |
| WebSocket | WS gateway | Separate team; custom protocol |

## Frontend Deployment

| Concern | Detail |
|---------|--------|
| Build output | `dist/` — static HTML, JS, CSS |
| Env vars | `VITE_API_URL`, `VITE_WS_URL` |
| Asset caching | Fingerprinted filenames; long cache TTL |
| HTML | No-cache; always serve latest `index.html` |

## WebSocket URL Configuration

| Environment | `VITE_WS_URL` | Notes |
|-------------|---------------|-------|
| Development | `ws://localhost:8080/ws` | Local backend |
| Staging | `wss://staging-api.example.com/ws` | Staging gateway |
| Production | `wss://api.example.com/ws` | Production gateway |

## CI/CD

| Step | Tool | Action |
|------|------|--------|
| Lint | ESLint + Prettier | Code quality |
| Type check | TypeScript | Type safety |
| Unit test | Vitest | Component + hook tests |
| E2E test | Playwright | Full flow validation |
| Build | Vite | Production bundle |
| Deploy | CDN / platform | Static asset upload |

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
      - setup node + pnpm
      - install deps
      - lint
      - typecheck
      - unit test
      - e2e test
  deploy:
    needs: test
    steps:
      - build (vite build)
      - upload to CDN / deploy to platform
```

## Monitoring

| Tool | Purpose |
|------|---------|
| Sentry | Frontend error tracking |
| Web Vitals | Performance monitoring |
| WebSocket metrics | Connection count, reconnect rate, event latency |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | REST API base URL |
| `VITE_WS_URL` | Yes | WebSocket gateway URL |

## Notes

- No server-side rendering — SPA only
- WebSocket connection is client-side only; no server push from the CDN
- Backend and WS gateway are deployed independently by their respective teams
- Frontend deployment does not depend on backend deployment (graceful degradation when WS is unavailable)
