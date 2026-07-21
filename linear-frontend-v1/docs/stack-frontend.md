# Stack — Frontend

## Frontend

- **Runtime**: Node.js 22 LTS
- **Build Tool**: Vite 8
- **Framework**: React 19
- **Routing**: react-router-dom v7
- **State Management**: Zustand v5
- **Styling**: Tailwind CSS v4
- **Component Variants**: class-variance-authority + tailwind-merge
- **Form Validation**: react-hook-form v7 + Zod v4
- **Icons**: lucide-react
- **API Client**: Custom fetch-based ApiClient with interceptor pipeline
- **Testing (Unit)**: Vitest + Testing Library + MSW v2
- **Testing (E2E)**: Playwright

## Shared

- **Language**: TypeScript 6.0 (strict mode)
- **API Protocol**: REST (JSON)
- **Auth**: JWT dual token (access + refresh via httpOnly cookie)
- **Real-time**: SSE (planned)
- **Containerization**: Docker
- **Code Quality**: ESLint + Prettier + Husky + lint-staged + commitlint

## Dev & Build

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 22 LTS | Runtime |
| npm | 11+ | Package manager |
| Vite | 8 | Build dev server |
| TypeScript | 6.0 | Type checking |
| Docker | latest | Containerization |

## Testing

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest + Testing Library | Components, stores, utils |
| Integration | Vitest + MSW | API client, store flows |
| E2E | Playwright | Full user flows |
