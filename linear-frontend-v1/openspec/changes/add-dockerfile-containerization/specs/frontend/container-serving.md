# Containerized SPA Serving — Frontend Specification

## Behaviour

**Feature:** Containerized SPA Serving via nginx

The container SHALL serve the built SPA assets via nginx with SPA routing support, security hardening, and cache optimization. The nginx server MUST handle client-side routing by serving `/index.html` for all non-asset requests.

### Requirement: SPAFallbackRouting

#### Scenario: DirectRouteRequestReturnsIndex

- **GIVEN** the container is running on port 8080
- **WHEN** a request is made to `/tasks`
- **THEN** nginx returns the content of `/index.html`
- **AND** the HTTP status code is 200

#### Scenario: AssetFileRequestReturnsFile

- **GIVEN** the container is running on port 8080
- **WHEN** a request is made to `/assets/index-abc123.js`
- **THEN** nginx returns the file content from `/usr/share/nginx/html/assets/index-abc123.js`
- **AND** the `Cache-Control` header is `public, max-age=31536000, immutable`

### Requirement: SecurityHeaders

#### Scenario: AllResponsesIncludeSecurityHeaders

- **GIVEN** the container is running
- **WHEN** any request is made to the nginx server
- **THEN** the response includes `X-Frame-Options: DENY`
- **AND** the response includes `X-Content-Type-Options: nosniff`
- **AND** the response includes `Referrer-Policy: strict-origin-when-cross-origin`
- **AND** the response includes `Permissions-Policy` with restrictive defaults

### Requirement: HiddenFilesDenied

#### Scenario: HiddenFileRequestReturns403

- **GIVEN** the container is running
- **WHEN** a request is made to a file or path starting with `.`
- **THEN** nginx returns HTTP 403 Forbidden

### Requirement: NonRootUser

#### Scenario: ContainerRunsAsNonRootUser

- **GIVEN** the Docker image is built
- **WHEN** the container starts
- **THEN** the nginx process runs as `appuser` (not root)
- **AND** `appuser` has UID 1001

## User Flow

1. Developer builds the Docker image: `docker build -t linear-app-clone:latest .`
2. Developer runs the container: `docker run -p 8080:80 linear-app-clone:latest`
3. User opens `http://localhost:8080` in browser
4. Browser loads `index.html` → Vite SPA boots
5. User navigates to `/tasks` → nginx serves `index.html` (SPA fallback)
6. Browser JS handles routing client-side
7. Static assets (`/assets/*`) are served with long-term caching

## Components

### Nginx Server Configuration

- **Purpose**: Serve built SPA assets with SPA routing, security headers, and caching
- **Configuration**: `nginx.conf` mounted or baked into the image
- **States**:
  - Running: serves requests on port 80
  - Stopped: container exit code 0
- **Events**: HTTP request → serve file or SPA fallback

### Dockerfile

- **Purpose**: Multi-stage build producing the production image
- **Stages**:
  - `build`: node:22-alpine, install deps, run build
  - `production`: nginx:stable-alpine, copy assets from build stage
- **Output**: Minimal image with built assets + nginx config

## Routing

| Request Pattern | Handler | Purpose |
|----------------|---------|---------|
| `/assets/*` | `try_files` + long cache | Cache-busted static assets |
| `/*` | `try_files $uri $uri/ /index.html` | SPA client-side routing fallback |
| `.*` (hidden files) | `return 403` | Deny access to hidden files |

## Validation Rules

| Check | Rule | Error |
|-------|------|-------|
| Docker build | Must complete with exit code 0 | Build failure |
| Container start | Must bind to port 80 internally | Port conflict |
| SPA routing | `curl http://localhost:8080/tasks` returns 200 | Returns 404 |
| Security headers | `curl -I http://localhost:8080` includes all expected headers | Missing header |
| Non-root user | `whoami` inside container returns `appuser` | Running as root |

## Accessibility

Not applicable — this is a server infrastructure change with no UI component. The nginx server serves assets that the existing SPA handles for accessibility.
