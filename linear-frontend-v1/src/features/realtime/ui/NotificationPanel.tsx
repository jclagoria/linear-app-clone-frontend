import { useCallback } from 'react'
import { Bell } from 'lucide-react'
import type { Notification } from '@/shared/stores/websocketStore'

interface NotificationPanelProps {
  isOpen: boolean
  notifications: Notification[]
  onToggle: () => void
  onMarkAsRead: (id: string) => void
  onMarkAllRead: () => void
  onClose: () => void
  onItemClick: (notification: Notification) => void
}

export function NotificationPanel({
  isOpen,
  notifications,
  onToggle,
  onMarkAllRead,
  onClose,
  onItemClick,
}: NotificationPanelProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="relative rounded-md p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Toggle notifications"
        aria-expanded={isOpen}
      >
        <Bell className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          role="region"
          aria-label="Notifications"
          className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-auto rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-xl"
          onKeyDown={handleKeyDown}
        >
          <div className="flex items-center justify-between border-b border-[var(--border-color)] px-4 py-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Notifications</h3>
            <button
              onClick={onMarkAllRead}
              className="text-xs text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Mark all read
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-[var(--text-secondary)]">
              No notifications
            </div>
          ) : (
            <ul className="divide-y divide-[var(--border-color)]">
              {notifications.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => onItemClick(n)}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                    aria-label={n.title}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${n.read ? 'text-[var(--text-secondary)]' : 'font-medium text-[var(--text-primary)]'}`}>
                        {n.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">
                        {n.message}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-[var(--text-secondary)]">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
