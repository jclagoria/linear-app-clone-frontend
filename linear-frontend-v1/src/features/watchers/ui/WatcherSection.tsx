import { useEffect, useCallback } from 'react'
import { useAuthStore } from '@/entities/session/model/store'
import { useWatchersStore } from '@/features/watchers/model/store'
import { WatcherList } from '@/entities/watcher/ui/WatcherList'
import { WatchButton } from './WatchButton'

interface WatcherSectionProps {
  issueId: string
}

export function WatcherSection({ issueId }: WatcherSectionProps) {
  const user = useAuthStore((s) => s.user)

  const watchers = useWatchersStore((s) => s.watchersByIssue[issueId] ?? [])
  const isLoading = useWatchersStore((s) => s.isLoading)
  const error = useWatchersStore((s) => s.error)
  const fetchWatchers = useWatchersStore((s) => s.fetchWatchers)
  const addWatcher = useWatchersStore((s) => s.addWatcher)
  const removeWatcher = useWatchersStore((s) => s.removeWatcher)

  useEffect(() => {
    fetchWatchers(issueId)
  }, [issueId, fetchWatchers])

  const handleRetry = useCallback(() => {
    fetchWatchers(issueId)
  }, [issueId, fetchWatchers])

  const isWatching = user
    ? watchers.some((w) => w.userId === user.id)
    : false

  const handleToggle = useCallback(() => {
    if (!user) return
    if (isWatching) {
      removeWatcher(issueId, user.id)
    } else {
      addWatcher(issueId, user.id)
    }
  }, [user, isWatching, issueId, removeWatcher, addWatcher])

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-text">Watchers</h3>
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <WatcherList
            watchers={watchers}
            isLoading={isLoading && watchers.length === 0}
            error={error}
            currentUserId={user?.id ?? null}
            onRetry={handleRetry}
          />
        </div>
        <WatchButton
          isWatching={isWatching}
          isLoading={false}
          disabled={!user}
          onToggle={handleToggle}
        />
      </div>
    </div>
  )
}
