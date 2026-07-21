# Stack — Linear App Clone (Frontend)

## Frontend

- **Runtime**: Node.js 20 LTS
- **Package Manager**: pnpm 9
- **Framework**: React 19 + Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS + shadcn/ui
- **Testing (FE)**: Vitest (unit) + Playwright (E2E)

## Language

- **Language**: TypeScript (strict mode)
- **API Protocol**: REST (plain fetch)
- **Real-time**: SSE (future)
- **Containerization**: none (Vercel deploy)

## Shared

- **Auth**: JWT dual token (access in memory, refresh in httpOnly cookie)

## Dev & Build

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20 LTS | Runtime |
| pnpm | 9 | Package manager |
| Vite | 6 | Dev server + build |
| TypeScript | 5.x | Language |

## Testing

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | Stores, utils, validation |
| Integration | Vitest + MSW | API client, auth flows |
| E2E | Playwright | Login flow, token refresh, logout |

## Theme System

- **Mechanism**: CSS custom properties on `:root` / `[data-theme="dark"]`, toggled via `data-theme` attribute on `<html>`
- **Modes**: Light (default), Dark, System (follows `prefers-color-scheme`)
- **Persistence**: localStorage via Zustand persist middleware (UIStore)
- **Token scope**: Semantic tokens (`--bg-primary`, `--text-primary`, `--accent-color`, etc.) consumed by Tailwind classes AND inline styles

## Key Dependencies (Planned)

| Package | Purpose |
|---------|---------|
| react 19 | UI framework |
| react-dom 19 | DOM rendering |
| zustand | State management |
| tailwindcss | Utility CSS |
| @radix-ui/* | shadcn/ui primitives |
| lucide-react | Icons |
| vitest | Unit testing |
| @playwright/test | E2E testing |
| msw | API mocking (tests) |
