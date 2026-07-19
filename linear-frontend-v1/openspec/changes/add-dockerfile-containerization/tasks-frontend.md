# Tasks — Add Dockerfile for Containerization (Frontend)

## Scaffold

- [ ] Create `Dockerfile` — multi-stage build
- [ ] Create `nginx.conf` — SPA serving configuration
- [ ] Create `.dockerignore` — build context exclusions
- [ ] Verify Docker is available: `docker --version`

## Build Stage (Dockerfile)

- [ ] Stage 1: Use `node:22-alpine` as base image
- [ ] Install pnpm globally: `RUN npm install -g pnpm`
- [ ] Set WORKDIR to `/app`
- [ ] Copy `package.json` and `pnpm-lock.yaml` first (for layer caching)
- [ ] Run `pnpm install --frozen-lockfile`
- [ ] Copy remaining source code
- [ ] Run `pnpm build` to produce `dist/`

## Production Stage (Dockerfile)

- [ ] Stage 2: Use `nginx:stable-alpine` as base image
- [ ] Create `appuser` with UID 1001: `RUN adduser -D -u 1001 appuser`
- [ ] Copy `nginx.conf` to `/etc/nginx/nginx.conf`
- [ ] Copy build output: `COPY --from=build /app/dist/ /usr/share/nginx/html`
- [ ] Set ownership of web root to `appuser`
- [ ] Expose port 80
- [ ] Set `USER appuser` (non-root)
- [ ] Set `CMD` to run nginx in foreground: `nginx -g daemon off;`

## Nginx Configuration

- [ ] Set root to `/usr/share/nginx/html`
- [ ] Set index file to `index.html`
- [ ] Implement SPA fallback: `try_files $uri $uri/ /index.html`
- [ ] Add per-location caching for `/assets/`:
  - `Cache-Control: public, max-age=31536000, immutable`
- [ ] Add security headers to all responses:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: (restrictive defaults)`
  - `Content-Security-Policy: (restrictive defaults)`
- [ ] Deny access to hidden files: `location ~ /\.`

## Dockerignore

- [ ] Exclude `node_modules/`
- [ ] Exclude `.git/`
- [ ] Exclude `.env` and `.env-example`
- [ ] Exclude `dist/` (rebuilt fresh)
- [ ] Exclude test files: `e2e/`, `*.test.*`, `*.spec.*`
- [ ] Exclude config files: `.husky/`, `.eslintrc*`, `.prettierrc`, `tsconfig*.json`
- [ ] Exclude `node_modules` at all levels with `**/node_modules`

## Testing

- [ ] Build the image: `docker build -t linear-app-clone:latest .`
- [ ] Verify build succeeds with exit code 0
- [ ] Run the container: `docker run -d -p 8080:80 linear-app-clone:latest`
- [ ] Verify container starts and stays running (no crash)
- [ ] Test SPA routing: `curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/some-route`
  - Expected: 200
- [ ] Test static asset serving: `curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/index.html`
  - Expected: 200
- [ ] Verify security headers present: `curl -sI http://localhost:8080 | grep -i "x-frame-options"`
- [ ] Verify hidden files denied: `curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/.env`
  - Expected: 403
- [ ] Verify cache header on assets: `curl -sI http://localhost:8080/assets/ | grep -i "cache-control"`
- [ ] Verify non-root user: `docker run --rm linear-app-clone:latest whoami`
  - Expected: `appuser`
- [ ] Stop and clean up test container

## Documentation

- [ ] Add build/run instructions to `README.md` (Docker section)

## Review

- [ ] Self-review: verify all tasks are completed
- [ ] Verify `Dockerfile` follows multi-stage best practices
- [ ] Verify `nginx.conf` has SPA routing, security headers, and caching
- [ ] Verify `.dockerignore` excludes unnecessary files
- [ ] Verify final image is minimal and runs as non-root user
- [ ] PR checklist: docker build passes, container runs, app works
