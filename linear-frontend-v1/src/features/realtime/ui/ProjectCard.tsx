import { cn } from '@/shared/lib/utils'
import { useOptimisticStore } from '../lib/optimistic-store'

interface ProjectCardProps {
  projectId: string
  name: string
  icon?: string
  progress?: number
  memberNames?: string[]
  isOptimistic?: boolean
  isReverted?: boolean
  onClick?: (id: string) => void
  className?: string
  variant?: 'list-item' | 'grid' | 'compact'
}

export function ProjectCard({
  projectId,
  name,
  icon = '📁',
  progress = 0,
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

  return (
    <article
      role="article"
      aria-label={`Project: ${name}`}
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
        <h3 className={cn(
          'truncate font-medium text-[var(--text-primary)]',
          isCompact ? 'text-xs' : 'text-sm',
        )}>
          {name}
        </h3>

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

        {!isCompact && memberNames.length > 0 && (
          <div className="mt-3 flex -space-x-2">
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
      </div>
    </article>
  )
}
