# Add Dockerfile for Containerization

## Problem Statement

The app currently has no containerization. It can only run via `pnpm dev` (development) or `pnpm build && pnpm preview` (production preview). There is no reproducible deployment artifact that can be deployed to any container runtime. This limits deployment options beyond the current Vercel-only approach.

## Motivation

Containerization provides a reproducible, immutable deployment artifact that can run anywhere Docker is supported. This enables:

- Self-hosted deployment for users who want to run the app on their own infrastructure
- Consistent environments across development, staging, and production
- Easier integration with CI/CD pipelines that prefer container-based deployments
- Ability to deploy to container orchestration platforms (Kubernetes, Nomad, Docker Swarm, etc.)
- Local production-like testing without deploying to Vercel

## Scope

- **In scope**:
  - Multi-stage `Dockerfile` using `node:22-alpine` for build stage and `nginx:stable-alpine` for production serving
  - `nginx.conf` with SPA routing (`try_files`), security headers, and caching rules
  - `.dockerignore` to exclude unnecessary files from the build context
  - Build and run instructions in the project README

- **Out of scope**:
  - Docker Compose setup (can be added separately if needed)
  - CI/CD pipeline changes for Docker builds
  - Container registry setup (Docker Hub, GHCR, etc.)
  - Kubernetes manifests or Helm charts
  - Replacing the existing Vercel deployment pipeline

## Impact

- **New files**: `Dockerfile`, `nginx.conf`, `.dockerignore`
- **Documentation**: Updated `README.md` with container build/run instructions
- **No changes** to existing application code or build tooling
- **No impact** on the existing Vercel deployment pipeline — Docker is additive
- **Team**: Developers gain a new deployment option without losing existing workflows
