import { AlertCircle } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/lib/utils'
import { WatcherItem } from './WatcherItem'
import type { Watcher } from '../model/types'

interface WatcherListProps {
  watchers: Watcher[]
  isLoading: boolean
  error: string | null
  currentUserId: string | null
  onRetry: () => void
}

function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center gap-2 py-1">
      <div className="h-6 w-6 rounded-full bg-border" />
      <div className="h-3 w-24 rounded bg-border" />
    </div>
  )
}

export function WatcherList({
  watchers,
  isLoading,
  error,
  currentUserId,
  onRetry,
}: WatcherListProps) {
  if (error) {
    return (
      <div
        role="alert"
        className="flex items-center gap-2 text-sm text-danger"
      >
        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="flex-1">{error}</span>
        <Button variant="ghost" onClick={onRetry} className="min-h-0 px-2 py-1 text-xs">
          Retry
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading watchers"
        className="space-y-1"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    )
  }

  if (watchers.length === 0) {
    return (
      <p className="text-sm text-text-muted">No watchers yet</p>
    )
  }

  return (
    <ul
      role="list"
      aria-label="Watchers"
      className={cn('space-y-0.5')}
    >
      {watchers.map((watcher) => (
        <WatcherItem
          key={watcher.id}
          watcher={watcher}
          isSelf={watcher.userId === currentUserId}
        />
      ))}
    </ul>
  )
}
