import { cn } from '@/shared/lib/utils'
import { Inbox, Plus } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  title = 'No issues yet',
  description = 'Create your first issue to get started.',
  actionLabel = 'Create Issue',
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4',
        className,
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-secondary)] mb-4">
        <Inbox className="h-8 w-8 text-[var(--text-secondary)]" />
      </div>
      <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] mb-6 text-center max-w-sm">
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          {actionLabel}
        </button>
      )}
    </div>
  )
}
