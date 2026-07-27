import { useMemo, useCallback } from 'react'
import { useNotificationsStore, type NotificationItem } from '@/shared/stores/notificationsStore'

interface UseNotificationsReturn {
  notifications: NotificationItem[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllRead: () => void
  clearAll: () => void
}

export function useNotifications(): UseNotificationsReturn {
  const notifications = useNotificationsStore((s) => s.items)
  const markAsReadStore = useNotificationsStore((s) => s.markAsRead)
  const markAllReadStore = useNotificationsStore((s) => s.markAllRead)
  const clearAllStore = useNotificationsStore((s) => s.clearAll)

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length
  }, [notifications])

  const markAsRead = useCallback(
    (id: string) => {
      markAsReadStore(id)
    },
    [markAsReadStore],
  )

  const markAllRead = useCallback(() => {
    markAllReadStore()
  }, [markAllReadStore])

  const clearAll = useCallback(() => {
    clearAllStore()
  }, [clearAllStore])

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllRead,
    clearAll,
  }
}
