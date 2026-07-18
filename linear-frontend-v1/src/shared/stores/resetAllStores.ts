import { useAuthStore } from '@/entities/session/model/store'
import { useIssuesStore } from '@/entities/issue/model/store'
import { useWebSocketStore } from '@/shared/stores/websocketStore'
import { useCacheStore } from '@/shared/stores/cacheStore'

const AUTH_INITIAL = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

const ISSUES_INITIAL = {
  issues: [],
  selectedIssueId: null,
  filters: { status: null, assigneeId: null, priority: null, projectId: null, search: null },
  cursor: null,
  hasMore: true,
  isLoading: false,
  error: null,
}

const WEBSOCKET_INITIAL = {
  connectionStatus: 'disconnected' as const,
  reconnectAttempts: 0,
  notifications: [],
  lastEvent: null,
}

export function resetAllStores() {
  useAuthStore.setState(AUTH_INITIAL)
  useIssuesStore.setState(ISSUES_INITIAL)
  useWebSocketStore.setState(WEBSOCKET_INITIAL)
  useCacheStore.getState().clear()
}

export function resetDomainStores() {
  useIssuesStore.setState(ISSUES_INITIAL)
  useWebSocketStore.setState(WEBSOCKET_INITIAL)
  useCacheStore.getState().clear()
}
