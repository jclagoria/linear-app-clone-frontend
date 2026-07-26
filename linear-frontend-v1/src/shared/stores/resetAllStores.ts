import { useAuthStore, initialAuthState } from '@/entities/session/model/store'
import { useIssuesStore, initialIssuesState } from '@/entities/issue/model/store'
import { useWebSocketStore, initialWebSocketState } from '@/shared/stores/websocketStore'
import { useNotificationsStore, initialNotificationsState } from '@/shared/stores/notificationsStore'
import { useCacheStore } from '@/shared/stores/cacheStore'
import { useRateLimitStore } from '@/shared/stores/rate-limit'

export function resetAllStores() {
  useAuthStore.setState(initialAuthState)
  useIssuesStore.setState(initialIssuesState)
  useWebSocketStore.setState(initialWebSocketState)
  useNotificationsStore.setState(initialNotificationsState)
  useCacheStore.getState().clear()
  useRateLimitStore.getState().clear()
}

export function resetDomainStores() {
  useIssuesStore.setState(initialIssuesState)
  useWebSocketStore.setState(initialWebSocketState)
  useNotificationsStore.setState(initialNotificationsState)
  useCacheStore.getState().clear()
}
