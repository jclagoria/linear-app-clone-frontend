import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface WatchButtonProps {
  isWatching: boolean
  isLoading: boolean
  disabled?: boolean
  onToggle: () => void
}

export function WatchButton({
  isWatching,
  isLoading,
  disabled,
  onToggle,
}: WatchButtonProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-pressed={isWatching}
      aria-label={isWatching ? 'Unwatch this issue' : 'Watch this issue'}
      disabled={disabled || isLoading}
      onClick={onToggle}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'min-h-[44px] min-w-[44px]',
        isWatching
          ? 'bg-primary text-text-inverse hover:bg-primary-hover active:bg-primary-active'
          : 'bg-surface border border-border text-text hover:bg-surface-alt active:bg-border',
      )}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : isWatching ? (
        <EyeOff className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Eye className="h-4 w-4" aria-hidden="true" />
      )}
      <span>{isWatching ? 'Watching' : 'Watch'}</span>
    </button>
  )
}
