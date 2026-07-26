import { cn } from '@/shared/lib/utils'
import { useOptimisticStore } from '../lib/optimistic-store'

interface ProjectCardProps {
  projectId: string
  name: string
  icon?: string
  status?: string
  progress?: number
  memberCount?: number
  memberNames?: string[]
  isOptimistic?: boolean
  isReverted?: boolean
  onClick?: (id: string) => void
  className?: string
  variant?: 'list-item' | 'grid' | 'compact'
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  planned: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
  archived: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500',
}

export function ProjectCard({
  projectId,
  name,
  icon = '📁',
  status,
  progress = 0,
  memberCount,
  memberNames = [],
  isOptimistic = false,
  isReverted = false,
  onClick,
  className,
  variant = 'grid',
}: ProjectCardProps) {
  const isGrid = variant === 'grid'
  const isCompact = variant === 'compact'
  const isStoreBusy = useOptimisticStore((s) => s.isPending(`projects:${projectId}`))

  const displayMemberCount = memberCount ?? memberNames.length
  const statusStyle = status ? (STATUS_STYLES[status.toLowerCase()] ?? STATUS_STYLES.planned) : null

  return (
    <article
      role="article"
      aria-label={`Project: ${name}${status ? `, Status: ${status}` : ''}${displayMemberCount > 0 ? `, ${displayMemberCount} members` : ''}`}
      aria-busy={isStoreBusy || isOptimistic}
      className={cn(
        'group rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)]',
        'hover:border-[var(--border-hover)] hover:shadow-sm',
        'transition-all duration-200',
        isOptimistic && 'animate-pulse opacity-80',
        isReverted && 'ring-2 ring-red-500',
        onClick && 'cursor-pointer',
        isGrid ? 'p-4' : 'flex items-center gap-3 p-3',
        className,
      )}
      onClick={onClick ? () => onClick(projectId) : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick(projectId)
              }
            }
          : undefined
      }
      tabIndex={onClick ? 0 : undefined}
    >
      <span className={cn(isGrid ? 'text-2xl' : 'text-lg')} aria-hidden="true">
        {icon}
      </span>

      <div className={cn('min-w-0', isGrid ? 'mt-3' : 'flex-1')}>
        <div className="flex items-center gap-2">
          <h3 className={cn(
            'truncate font-medium text-[var(--text-primary)]',
            isCompact ? 'text-xs' : 'text-sm',
          )}>
            {name}
          </h3>
          {status && !isCompact && (
            <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium', statusStyle)}>
              {status}
            </span>
          )}
        </div>

        {!isCompact && (
          <>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-secondary)]">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-[var(--text-secondary)]">{progress}% complete</p>
          </>
        )}

        {!isCompact && displayMemberCount > 0 && (
          <div className="mt-3 flex items-center gap-2">
            {memberNames.length > 0 && (
              <div className="flex -space-x-2">
                {memberNames.slice(0, 5).map((name, i) => (
                  <div
                    key={name}
                    className="h-6 w-6 rounded-full border-2 border-[var(--bg-surface)] bg-[var(--bg-secondary)] text-[10px] font-medium flex items-center justify-center"
                    title={name}
                    style={{ zIndex: 5 - i }}
                  >
                    {name[0]?.toUpperCase()}
                  </div>
                ))}
                {memberNames.length > 5 && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--bg-surface)] bg-[var(--bg-secondary)] text-[10px] text-[var(--text-secondary)]">
                    +{memberNames.length - 5}
                  </div>
                )}
              </div>
            )}
            <span className="text-[10px] text-[var(--text-secondary)]">
              {displayMemberCount} {displayMemberCount === 1 ? 'member' : 'members'}
            </span>
          </div>
        )}
      </div>
    </article>
  )
}
