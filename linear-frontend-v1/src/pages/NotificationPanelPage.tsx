import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '@/features/realtime/lib/useNotifications'
import { NotificationItem } from '@/features/realtime/ui/NotificationItem'
import { EmptyState } from '@/features/realtime/ui/EmptyState'
import { Button } from '@/shared/ui/Button'
import { CheckCheck, Trash2 } from 'lucide-react'

export function NotificationPanelPage() {
  const navigate = useNavigate()
  const { notifications, unreadCount, markAsRead, markAllRead, clearAll } = useNotifications()

  const handleNotificationClick = useCallback(
    (notification: { id: string; issueId?: string }) => {
      if (notification.issueId) {
        navigate(`/issues/${notification.issueId}`)
      }
    },
    [navigate],
  )

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-[var(--text-secondary)]">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllRead}
              icon={<CheckCheck className="h-4 w-4" />}
            >
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="outline"
              onClick={clearAll}
              icon={<Trash2 className="h-4 w-4" />}
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="You're all caught up! Notifications will appear here when there's activity."
        />
      ) : (
        <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={handleNotificationClick}
              onMarkAsRead={markAsRead}
            />
          ))}
        </div>
      )}
    </div>
  )
}
