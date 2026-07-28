import { type ReactNode, type ReactElement } from 'react'
import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi, afterEach } from 'vitest'
import { useIssuesStore } from '@/entities/issue/model/store'
import { useIssueLabelsStore } from '@/entities/label/model/store'
import { useLabelDefinitionsStore } from '@/entities/label/model/store'
import { useAuthStore } from '@/entities/session/model/store'
import { useToastStore } from '@/shared/stores/toastStore'
import { useCacheStore } from '@/shared/stores/cacheStore'

// Default initial states for stores
const defaultIssueStoreState = {
  issues: [],
  selectedIssueId: null,
  commentsByIssue: {},
  commentsLoading: false,
  commentsError: null,
  filters: { statusId: null, assigneeId: null, projectId: null, cycleId: null, labelIds: [] },
  cursor: null,
  hasMore: true,
  isLoading: false,
  error: null,
}

const defaultAuthStoreState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

const defaultLabelStoreState = {
  labelsByIssue: {},
  isLoading: false,
  error: null,
}

const defaultLabelDefinitionsState = {
  labels: [],
  isLoading: false,
  error: null,
}

const defaultToastState = {
  toasts: [],
}

/**
 * Resets all Zustand stores to their initial states.
 * Call in beforeEach to ensure test isolation.
 */
export function resetStores(): void {
  useIssuesStore.setState(defaultIssueStoreState)
  useIssueLabelsStore.setState(defaultLabelStoreState)
  useLabelDefinitionsStore.setState(defaultLabelDefinitionsState)
  useAuthStore.setState(defaultAuthStoreState)
  useToastStore.setState(defaultToastState)
  useCacheStore.getState().clear()
}

interface RenderWithRouterOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
  routePath?: string
  wrapper?: React.ComponentType<{ children: ReactNode }>
}

interface RenderWithRouterResult extends RenderResult {
  user: UserEvent
}

/**
 * Renders a component wrapped in MemoryRouter with optional route configuration.
 *
 * @example
 * ```tsx
 * // Basic usage - renders at default path /
 * const { user } = renderWithRouter(<MyComponent />)
 *
 * // With specific route and params
 * const { user } = renderWithRouter(<IssueDetailPage />, {
 *   initialEntries: ['/issues/1'],
 *   routePath: 'issues/:id',
 * })
 * ```
 */
export function renderWithRouter(
  ui: ReactElement,
  options: RenderWithRouterOptions = {},
): RenderWithRouterResult {
  const { initialEntries = ['/'], routePath, wrapper: CustomWrapper, ...renderOptions } = options

  function Wrapper({ children }: { children: ReactNode }) {
    const content = CustomWrapper ? <CustomWrapper>{children}</CustomWrapper> : children

    return (
      <MemoryRouter initialEntries={initialEntries}>
        {routePath ? (
          <Routes>
            <Route path={routePath} element={content} />
          </Routes>
        ) : (
          content
        )}
      </MemoryRouter>
    )
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    user: userEvent.setup(),
  }
}

/**
 * Sets up fake timers with a deterministic system time.
 * Returns a restore function to revert to real timers.
 *
 * @example
 * ```tsx
 * beforeEach(() => {
 *   setSystemTime('2024-06-15T12:00:00Z')
 * })
 *
 * afterEach(() => {
 *   vi.useRealTimers()
 * })
 * ```
 */
export function setSystemTime(time: string | number | Date): void {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(time))
}

/**
 * Clears all mocks and resets stores. Use in beforeEach.
 */
export function setupTest(): void {
  vi.clearAllMocks()
  resetStores()
}
