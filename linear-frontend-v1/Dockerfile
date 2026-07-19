# =============================================================================
# Stage 1: Build
# =============================================================================
FROM node:22-alpine AS build

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy dependency manifests and workspace config first for layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Configure timeout for slow registry and install dependencies
# Using --frozen-lockfile for reproducibility, --ignore-scripts for Docker compat
RUN pnpm config set fetch-timeout 600000 && \
    pnpm install --frozen-lockfile --ignore-scripts

# Copy remaining source code
COPY . .

# Build the application
RUN pnpm build

# =============================================================================
# Stage 2: Production (nginx)
# =============================================================================
FROM nginx:stable-alpine AS production

# Create non-root user (UID 1001)
RUN adduser -D -u 1001 appuser

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from build stage
COPY --from=build /app/dist/ /usr/share/nginx/html

# Set ownership of web root to appuser
RUN chown -R appuser:appuser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Switch to non-root user
USER appuser

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
