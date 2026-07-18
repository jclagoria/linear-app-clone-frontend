import { describe, it, expect, beforeEach } from 'vitest'
import { resetAllStores, resetDomainStores } from '@/shared/stores/resetAllStores'
import { useAuthStore } from '@/entities/session/model/store'
import { useIssuesStore } from '@/entities/issue/model/store'
import { useWebSocketStore } from '@/shared/stores/websocketStore'
import { useCacheStore } from '@/shared/stores/cacheStore'
import { useUIStore } from '@/shared/stores/uiStore'
import type { Issue } from '@/entities/issue/model/store'

describe('resetAllStores', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: { id: '1', email: 'test@test.com', name: 'Test' },
      accessToken: 'token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
    })
    useIssuesStore.setState({
      issues: [{ id: '1', title: 'Test' } as Issue],
      selectedIssueId: '1',
      isLoading: false,
      error: null,
    })
    useWebSocketStore.setState({
      connectionStatus: 'connected',
      reconnectAttempts: 3,
      notifications: [{ id: 'n1', type: 'test', title: 'N', message: 'M', read: false, createdAt: '' }],
      lastEvent: 'test',
    })
    useCacheStore.getState().set('issues:1', { id: '1' })
  })

  it('resets auth store to initial state', () => {
    resetAllStores()
    const auth = useAuthStore.getState()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.user).toBeNull()
    expect(auth.accessToken).toBeNull()
  })

  it('resets domain stores (issues, websocket, cache)', () => {
    resetDomainStores()
    expect(useIssuesStore.getState().issues).toEqual([])
    expect(useIssuesStore.getState().selectedIssueId).toBeNull()
    expect(useWebSocketStore.getState().connectionStatus).toBe('disconnected')
    expect(useCacheStore.getState().get('issues:1')).toBeNull()
  })

  it('preserves UI store preferences on domain reset', () => {
    useUIStore.setState({ sidebarCollapsed: true, theme: 'dark' })
    resetDomainStores()
    expect(useUIStore.getState().sidebarCollapsed).toBe(true)
    expect(useUIStore.getState().theme).toBe('dark')
  })
})
