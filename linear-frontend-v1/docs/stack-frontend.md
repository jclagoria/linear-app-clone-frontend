# Stack — Linear App Clone (Frontend)

## Frontend

- **Runtime**: Node.js 20+ LTS
- **Framework**: React 19 + Vite 8 (CSR)
- **State Management**: Zustand 5
- **Routing**: react-router-dom v7
- **Forms**: react-hook-form + Zod 4
- **Styling**: Tailwind CSS v4
- **Testing (Unit)**: Vitest + Testing Library + MSW
- **Testing (E2E)**: Playwright

## Shared

- **Language**: TypeScript 6
- **API Protocol**: REST (OpenAPI 3.1 — Design-First)
- **Real-time**: SSE (Server-Sent Events)
- **Containerization**: Docker
- **Package Manager**: pnpm

## Dev & Build

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ LTS | Runtime |
| pnpm | latest | Package manager |
| Vite | 8 | Build tool |
| Docker | latest | Container |
| ESLint | 9 | Linting |
| Prettier | 3 | Formatting |

## Testing

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest + Testing Library | Components, hooks, utils |
| Integration | MSW | API mocking, store actions |
| E2E | Playwright | Full user flows |
