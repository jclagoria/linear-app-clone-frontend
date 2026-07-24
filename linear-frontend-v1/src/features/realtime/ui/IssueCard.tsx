import { cn } from '@/shared/lib/utils'

interface IssueCardProps {
  issueId: string
  title: string
  statusId: string
  statusLabel?: string
  statusColor?: string
  priority?: number
  labels?: string[]
  assigneeName?: string | null
  assigneeAvatarUrl?: string | null
  variant?: 'list-item' | 'compact' | 'detail-header'
  isOptimistic?: boolean
  isReverted?: boolean
  onClick?: (id: string) => void
  className?: string
}

const PRIORITY_ICONS: Record<number, string> = {
  0: '',
  1: '!',
  2: '!!',
  3: '!!!',
  4: '!!!!',
}

export function IssueCard({
  issueId,
  title,
  statusLabel,
  statusColor = '#6b7280',
  priority = 0,
  labels = [],
  assigneeName,
  variant = 'list-item',
  isOptimistic = false,
  isReverted = false,
  onClick,
  className,
}: IssueCardProps) {
  const isCompact = variant === 'compact'
  const isDetail = variant === 'detail-header'

  return (
    <article
      role="article"
      aria-label={`Issue: ${title}, Status: ${statusLabel || statusId}`}
      aria-busy={isOptimistic}
      className={cn(
        'group flex items-center gap-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] p-3',
        'hover:border-[var(--border-hover)] hover:shadow-sm',
        'transition-all duration-200',
        isOptimistic && 'animate-pulse opacity-80',
        isReverted && 'ring-2 ring-red-500',
        onClick && 'cursor-pointer',
        isDetail && 'p-4',
        className,
      )}
      onClick={onClick ? () => onClick(issueId) : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick(issueId)
              }
            }
          : undefined
      }
      tabIndex={onClick ? 0 : undefined}
    >
      <span
        className={cn('shrink-0 rounded-full', isDetail ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5')}
        style={{ backgroundColor: statusColor }}
        aria-hidden="true"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'truncate text-[var(--text-primary)]',
              isDetail ? 'text-base font-medium' : 'text-sm',
            )}
          >
            {title}
          </span>
          {priority > 0 && (
            <span className="shrink-0 text-xs text-yellow-500 font-mono" aria-label={`Priority ${priority}`}>
              {PRIORITY_ICONS[priority]}
            </span>
          )}
        </div>

        {!isCompact && labels.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {labels.map((label) => (
              <span
                key={label}
                className="inline-block rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 text-[10px] text-[var(--text-secondary)]"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {assigneeName && !isCompact && (
        <div className="flex shrink-0 items-center gap-1.5">
          <div className="h-6 w-6 rounded-full bg-[var(--bg-secondary)]" aria-hidden="true" />
          <span className="hidden text-xs text-[var(--text-secondary)] sm:inline">{assigneeName}</span>
        </div>
      )}
    </article>
  )
}
