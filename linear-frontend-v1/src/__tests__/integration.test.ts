import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { useIssuesStore } from '@/entities/issue/model/store'
import { useAuthStore } from '@/entities/session/model/store'
import { useCacheStore } from '@/shared/stores/cacheStore'
import { useWebSocketStore } from '@/shared/stores/websocketStore'
import { useUIStore } from '@/shared/stores/uiStore'
import { selectFilteredIssues } from '@/shared/stores/selectors'
import type { Issue } from '@/entities/issue/model/store'

const API_BASE = '/api/v1'

const mockIssues: Issue[] = [
  { id: '1', title: 'Bug fix', description: 'Fix the bug', status: 'todo', priority: 1, assigneeId: 'u1', projectId: null, cycleId: null, labels: ['bug'], createdAt: '', updatedAt: '' },
  { id: '2', title: 'Add feature', description: 'New feature', status: 'in_progress', priority: 2, assigneeId: 'u1', projectId: 'p1', cycleId: null, labels: [], createdAt: '', updatedAt: '' },
  { id: '3', title: 'Documentation', description: 'Write docs', status: 'done', priority: 3, assigneeId: null, projectId: null, cycleId: null, labels: ['docs'], createdAt: '', updatedAt: '' },
]

describe('Auth → Guard Integration', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
  afterAll(() => server.close())
  afterEach(() => {
    server.resetHandlers()
    useAuthStore.setState({ user: null, accessToken: null, isAuthenticated: false, isLoading: false, error: null })
  })

  it('login → store update → authenticated state', async () => {
    await useAuthStore.getState().login('valid@example.com', 'password123')
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    expect(useAuthStore.getState().user?.email).toBe('valid@example.com')
  })

  it('logout → resetAllStores clears domain stores', async () => {
    useAuthStore.setState({ isAuthenticated: true, user: { id: '1', email: 'a@b.com', name: 'A' }, accessToken: 't' })
    useIssuesStore.setState({ issues: mockIssues })
    useWebSocketStore.setState({ connectionStatus: 'connected', notifications: [{ id: 'n1', type: 't', title: 'N', message: 'M', read: false, createdAt: '' }] })

    useUIStore.setState({ sidebarCollapsed: true, theme: 'dark' })
    await useAuthStore.getState().logout()

    const auth = useAuthStore.getState()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.user).toBeNull()
    expect(useIssuesStore.getState().issues).toEqual([])
    expect(useWebSocketStore.getState().connectionStatus).toBe('disconnected')
    expect(useUIStore.getState().sidebarCollapsed).toBe(true)
  })
})

describe('Issue List + Cache Integration', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
  afterAll(() => server.close())
  afterEach(() => {
    server.resetHandlers()
    useIssuesStore.setState({ issues: [], cursor: null, hasMore: true, isLoading: false, error: null })
    useCacheStore.getState().clear()
  })

  it('loadIssues → populates store and caches data', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    await useIssuesStore.getState().loadIssues()

    const state = useIssuesStore.getState()
    expect(state.isLoading).toBe(false)
    expect(state.issues).toHaveLength(3)
    expect(state.hasMore).toBe(true)

    const cached = useCacheStore.getState().get<{ data: Issue[] }>('issues:list?')
    expect(cached).not.toBeNull()
    expect(cached!.data.data).toHaveLength(3)

    fetchSpy.mockRestore()
  })

  it('cache hit returns without fetch call', async () => {
    useCacheStore.getState().set('issues:list?', { data: mockIssues, meta: { cursor: null, hasMore: false } })
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    useIssuesStore.setState({ isLoading: true })
    await useIssuesStore.getState().loadIssues()

    const state = useIssuesStore.getState()
    expect(state.issues).toHaveLength(3)
    expect(fetchSpy).not.toHaveBeenCalled()

    fetchSpy.mockRestore()
  })

  it('mutation invalidates cache', async () => {
    useIssuesStore.setState({ issues: mockIssues })
    useCacheStore.getState().set('issues:list?', { data: mockIssues, meta: { cursor: null, hasMore: false } })

    useIssuesStore.getState().addIssue({
      id: '5', title: 'New', description: 'New issue', status: 'todo', priority: 1,
      assigneeId: null, projectId: null, cycleId: null, labels: [], createdAt: '', updatedAt: '',
    })

    expect(useCacheStore.getState().get('issues:list?')).toBeNull()
  })
})

describe('Filter → Selector Integration', () => {
  beforeEach(() => {
    useIssuesStore.setState({ issues: mockIssues })
  })

  it('applied filters produce correct derived data', () => {
    useIssuesStore.getState().setFilters({ status: 'todo' })
    const { filters, issues } = useIssuesStore.getState()

    const filtered = selectFilteredIssues(issues, filters)
    expect(filtered).toHaveLength(1)
    expect(filtered[0].title).toBe('Bug fix')

    useIssuesStore.getState().clearFilters()
    useIssuesStore.getState().setFilters({ assigneeId: 'u1' })
    const { filters: f2, issues: i2 } = useIssuesStore.getState()
    expect(selectFilteredIssues(i2, f2)).toHaveLength(2)
  })

  it('clear filters returns all issues', () => {
    useIssuesStore.getState().setFilters({ status: 'done' })
    useIssuesStore.getState().clearFilters()

    const { filters, issues } = useIssuesStore.getState()
    const result = selectFilteredIssues(issues, filters)
    expect(result).toHaveLength(3)
  })

  it('search filter matches title and description', () => {
    useIssuesStore.getState().setFilters({ search: 'bug' })
    const { filters, issues } = useIssuesStore.getState()

    const result = selectFilteredIssues(issues, filters)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('1')
  })
})