import { cn } from '@/shared/lib/utils'

interface StatusCycleIndicatorProps {
  statusLabel: string
  statusColor?: string
  isCycling?: boolean
  isConfirmed?: boolean
  className?: string
}

export function StatusCycleIndicator({
  statusLabel,
  statusColor = '#6b7280',
  isCycling = false,
  isConfirmed = false,
  className,
}: StatusCycleIndicatorProps) {
  return (
    <div
      className={cn('inline-flex items-center gap-2', className)}
      aria-label={`Status: ${statusLabel}`}
      aria-busy={isCycling}
    >
      <span className="relative flex h-3 w-3">
        {isCycling && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full rounded-full opacity-75',
              'animate-spin border-2 border-current border-t-transparent',
            )}
            style={{ borderColor: statusColor, borderTopColor: 'transparent' }}
          />
        )}
        <span
          className={cn(
            'relative inline-flex h-3 w-3 rounded-full',
            isConfirmed && 'ring-2 ring-green-500 ring-offset-1',
          )}
          style={{ backgroundColor: statusColor }}
        />
      </span>
      <span className={cn(
        'text-xs font-medium',
        isConfirmed && 'text-green-600 dark:text-green-400',
      )}>
        {statusLabel}
      </span>
    </div>
  )
}
