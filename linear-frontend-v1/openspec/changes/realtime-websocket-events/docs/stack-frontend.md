# Stack — Realtime Module (Frontend)

## Frontend

| Aspect | Choice | Version |
|--------|--------|---------|
| Runtime | Node.js | 20+ LTS |
| Framework | React | 19.x |
| Build Tool | Vite | 8.x |
| State Management | Zustand | 5.x |
| Styling | Tailwind CSS | 4.x |
| Routing | React Router | 7.x |
| Forms | React Hook Form + Zod | 7.x / 4.x |
| Real-time Transport | Native WebSocket API | Browser built-in |
| Language | TypeScript | 6.x |

## Dev & Build

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ LTS | Runtime |
| pnpm | 8+ | Package manager |
| Vite | 8.x | Dev server + bundler |
| TypeScript | 6.x | Type checking |
| ESLint | 9.x | Linting |
| Prettier | 3.x | Formatting |
| Husky | 9.x | Git hooks |
| Commitlint | 19.x | Commit message enforcement |

## Testing

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest + Testing Library | Components, hooks, stores |
| Integration | MSW (websocket handler) | API + WebSocket mocking |
| E2E | Playwright | Full user flows |
| Lint | eslint-plugin-boundaries | Module boundary enforcement |

## WebSocket Integration

| Concern | Decision | Rationale |
|---------|----------|-----------|
| API | Native `WebSocket` | No extra protocol; backend owns the server |
| Reconnection | Custom exponential backoff | Spec requires 1s–30s backoff, 10 max attempts |
| Heartbeat | Custom ping/pong over WS frames | 30s interval, 10s timeout |
| Auth | Token in handshake header | JWT passed on connection open |
| Event parsing | JSON.parse with schema validation | 15 typed event payloads |
| Deduplication | Set-based eventId tracking | Prevents double-processing from retries |

## State Architecture

| Store | Responsibility | Notes |
|-------|---------------|-------|
| `useWebSocketStore` | Connection status, events, notifications | New store for WS lifecycle |
| `useOptimisticStore` | Pending updates, revert data | Tracks in-flight optimistic ops |
| `useIssuesStore` | Issue list + real-time mutations | Existing, extended with WS handlers |
| `useProjectsStore` | Project list + real-time mutations | Existing, extended with WS handlers |
| `useCyclesStore` | Cycle list + real-time mutations | Existing, extended with WS handlers |
