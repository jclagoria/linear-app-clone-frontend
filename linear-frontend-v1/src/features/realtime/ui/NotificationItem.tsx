import { cn } from '@/shared/lib/utils'
import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react'

export interface NotificationItemData {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
  issueId?: string
}

interface NotificationItemProps {
  notification: NotificationItemData
  onClick?: (notification: NotificationItemData) => void
  onMarkAsRead?: (id: string) => void
  className?: string
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  info: <Info className="h-4 w-4 text-blue-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  success: <CheckCircle className="h-4 w-4 text-green-500" />,
  error: <AlertTriangle className="h-4 w-4 text-red-500" />,
}

export function NotificationItem({
  notification,
  onClick,
  onMarkAsRead,
  className,
}: NotificationItemProps) {
  const icon = TYPE_ICONS[notification.type] || <Bell className="h-4 w-4 text-[var(--text-secondary)]" />

  const handleClick = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id)
    }
    onClick?.(notification)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset',
        !notification.read && 'bg-[var(--bg-surface)]',
        className,
      )}
      aria-label={`${notification.read ? '' : 'Unread: '}${notification.title}`}
    >
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm',
            notification.read
              ? 'text-[var(--text-secondary)]'
              : 'font-medium text-[var(--text-primary)]',
          )}
        >
          {notification.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">
          {notification.message}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-[var(--text-secondary)]">
          {new Date(notification.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
        {!notification.read && (
          <span
            className="h-2 w-2 rounded-full bg-primary"
            aria-hidden="true"
          />
        )}
      </div>
    </button>
  )
}
