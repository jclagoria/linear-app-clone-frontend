# Tech Selection — Add Dockerfile for Containerization

## Decision Summary

| Category | Existing | Change | Rationale |
|----------|----------|--------|-----------|
| Container Runtime | none | Docker | Industry standard, widely available, multi-stage build support |
| Base Image (Build) | none | `node:22-alpine` | Matches existing Node.js 22 runtime, small image, fast builds |
| Base Image (Production) | none | `nginx:stable-alpine` | Production-grade web server, small footprint, SPA routing support |
| Build Tool | Vite (via `vite build`) | Same — baked into Dockerfile | No change in build process |
| Package Manager | pnpm | Same — installed in build stage | No change |
| Production Server | Vercel CDN | nginx (additional option) | nginx is self-hostable, well-documented, SPA-ready |

## Stack Changes

### Added

| Component | Version | Purpose |
|-----------|---------|---------|
| Docker | Latest | Container build and runtime |
| nginx | stable-alpine | Production HTTP server in the container |
| Docker BuildKit | Built-in | Efficient layer caching during builds |

### Unchanged

All existing frontend stack (React 19, Vite, Zustand, Tailwind CSS, shadcn/ui, TypeScript, Vitest, Playwright, pnpm, Node.js 20+) remains exactly the same. The Dockerfile wraps the existing build and serves the existing output.

## Deployment Architecture

```
┌──────────────────────────────────────────┐
│           Docker Container               │
│                                          │
│  ┌──────────────────────────────────────┐│
│  │          nginx (port 80)            ││
│  │  - SPA routing (try_files)          ││
│  │  - Security headers                 ││
│  │  - Long cache for /assets/          ││
│  └──────────────┬───────────────────────┘│
│                 │                         │
│  ┌──────────────▼───────────────────────┐│
│  │    Static files (/usr/share/nginx/   ││
│  │        html/)                        ││
│  │  - index.html                        ││
│  │  - assets/* (cache-busted)           ││
│  └──────────────────────────────────────┘│
│                                          │
│  User: appuser (UID 1001)               │
└──────────────────────────────────────────┘
         │
         │ port mapping (e.g., 8080:80)
         ▼
    Host / Orchestrator
```

## Container Image Details

| Aspect | Choice | Rationale |
|--------|--------|-----------|
| Base (build) | `node:22-alpine` | Alpine for small size, Node 22 for pnpm compatibility |
| Base (production) | `nginx:stable-alpine` | ~23MB base, security-hardened, SPA-friendly |
| User | `appuser` (UID 1001) | Non-root, security best practice |
| Workdir | `/app` | Standard convention |
| Exposed port | 80 | Default HTTP, user maps externally |
