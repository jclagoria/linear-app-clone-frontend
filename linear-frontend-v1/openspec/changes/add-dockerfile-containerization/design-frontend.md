# Containerization — Frontend Design

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Build stage base | `node:22-alpine` | Matches existing Node.js runtime, minimal image |
| Production stage base | `nginx:stable-alpine` | ~23MB, production-grade SPA serving |
| SPA routing | `try_files $uri $uri/ /index.html` | Standard nginx SPA fallback pattern |
| Static asset caching | 1 year immutable for `/assets/*` | Cache-busted Vite build output |
| Security headers | X-Frame-Options, X-Content-Type-Options, CSP, etc. | Security hardening over default nginx |
| Non-root user | `appuser` (UID 1001) | Docker security best practice |
| Package manager | pnpm in build stage | Matches existing project setup |
| Build command | `pnpm build` | Same as existing build (unchanged) |

## Dockerfile Structure

```
Dockerfile
├── Stage 1: build
│   Base: node:22-alpine
│   ├── Install pnpm globally
│   ├── Set WORKDIR /app
│   ├── Copy package.json + pnpm-lock.yaml
│   ├── RUN pnpm install --frozen-lockfile
│   ├── Copy source code
│   └── RUN pnpm build
│       Output: /app/dist/
│
├── Stage 2: production
│   Base: nginx:stable-alpine
│   ├── Create appuser (UID 1001)
│   ├── Copy nginx.conf
│   ├── Copy --from=build /app/dist/ /usr/share/nginx/html
│   ├── Set ownership to appuser
│   └── EXPOSE 80
│       USER appuser
│       CMD: nginx -g daemon off;
```

## Nginx Configuration Design

```
nginx.conf
├── server block
│   ├── listen 80
│   ├── root /usr/share/nginx/html
│   ├── index index.html
│   │
│   ├── Security headers (location /)
│   │   ├── X-Frame-Options: DENY
│   │   ├── X-Content-Type-Options: nosniff
│   │   ├── Referrer-Policy: strict-origin-when-cross-origin
│   │   ├── Permissions-Policy: (restrictive defaults)
│   │   └── Content-Security-Policy: (restrictive defaults)
│   │
│   ├── SPA fallback
│   │   └── try_files $uri $uri/ /index.html
│   │
│   ├── Static assets caching
│   │   └── location /assets/
│   │       └── Cache-Control: public, max-age=31536000, immutable
│   │
│   └── Deny hidden files
│       └── location ~ /\. 
│           └── deny all
│
└── http block
    ├── gzip on (optional)
    └── (other global settings)
```

## Build & Run Flow

```
Developer
  │
  ├── docker build -t linear-app-clone .
  │   ├── Sends build context (respects .dockerignore)
  │   ├── Stage 1: Install pnpm → Install deps → Build
  │   └── Stage 2: Copy nginx.conf + dist/ → Set user → Expose 80
  │
  └── docker run -p 8080:80 linear-app-clone
      ├── nginx starts (non-root)
      └── App available at http://localhost:8080
```

## File Inventory

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build definition |
| `nginx.conf` | nginx server configuration for SPA |
| `.dockerignore` | Exclude node_modules, .git, etc. from build context |

## Security Considerations

| Concern | Mitigation |
|---------|------------|
| Root process | `USER appuser` in production stage |
| Sensitive headers | nginx strips `Server` header |
| Directory traversal | SPA fallback only for non-file requests |
| Hidden file exposure | `location ~ /\.` denied |
| CSP | Added with restrictive defaults (tune per deployment) |
