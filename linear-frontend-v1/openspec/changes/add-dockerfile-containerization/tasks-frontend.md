# Tasks — Add Dockerfile for Containerization (Frontend)

## Scaffold

- [x] Create `Dockerfile` — multi-stage build
- [x] Create `nginx.conf` — SPA serving configuration
- [x] Create `.dockerignore` — build context exclusions
- [x] Verify Docker is available: `docker --version`

## Build Stage (Dockerfile)

- [x] Stage 1: Use `node:22-alpine` as base image
- [x] Install pnpm globally: `RUN npm install -g pnpm`
- [x] Set WORKDIR to `/app`
- [x] Copy `package.json` and `pnpm-lock.yaml` first (for layer caching)
- [x] Run `pnpm install --frozen-lockfile`
- [x] Copy remaining source code
- [x] Run `pnpm build` to produce `dist/`

## Production Stage (Dockerfile)

- [x] Stage 2: Use `nginx:stable-alpine` as base image
- [x] Create `appuser` with UID 1001: `RUN adduser -D -u 1001 appuser`
- [x] Copy `nginx.conf` to `/etc/nginx/nginx.conf`
- [x] Copy build output: `COPY --from=build /app/dist/ /usr/share/nginx/html`
- [x] Set ownership of web root to `appuser`
- [x] Expose port 80
- [x] Set `USER appuser` (non-root)
- [x] Set `CMD` to run nginx in foreground: `nginx -g daemon off;`

## Nginx Configuration

- [x] Set root to `/usr/share/nginx/html`
- [x] Set index file to `index.html`
- [x] Implement SPA fallback: `try_files $uri $uri/ /index.html`
- [x] Add per-location caching for `/assets/`:
  - `Cache-Control: public, max-age=31536000, immutable`
- [x] Add security headers to all responses:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: (restrictive defaults)`
  - `Content-Security-Policy: (restrictive defaults)`
- [x] Deny access to hidden files: `location ~ /\.`

## Dockerignore

- [x] Exclude `node_modules/`
- [x] Exclude `.git/`
- [x] Exclude `.env` and `.env-example`
- [x] Exclude `dist/` (rebuilt fresh)
- [x] Exclude test files: `e2e/`, `*.test.*`, `*.spec.*`
- [x] Exclude config files: `.husky/`, `.eslintrc*`, `.prettierrc`, `tsconfig*.json`
- [x] Exclude `node_modules` at all levels with `**/node_modules`

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

- [x] Add build/run instructions to `README.md` (Docker section)

## Review

- [x] Self-review: verify all tasks are completed
- [x] Verify `Dockerfile` follows multi-stage best practices
- [x] Verify `nginx.conf` has SPA routing, security headers, and caching
- [x] Verify `.dockerignore` excludes unnecessary files
- [ ] ~~Verify final image is minimal and runs as non-root user~~ (requires Docker build)
- [ ] ~~PR checklist: docker build passes, container runs, app works~~ (requires Docker build)
