import { cn } from '@/shared/lib/utils'

interface NotificationBadgeProps {
  count: number
  className?: string
}

export function NotificationBadge({ count, className }: NotificationBadgeProps) {
  if (count <= 0) return null

  const display = count > 99 ? '99+' : String(count)

  return (
    <span
      className={cn(
        'absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white',
        className,
      )}
      aria-label={`${count} unread notifications`}
    >
      {display}
    </span>
  )
}
