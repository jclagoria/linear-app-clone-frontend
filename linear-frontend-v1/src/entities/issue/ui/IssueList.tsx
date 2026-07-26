import { IssueCard } from './IssueCard'
import { SkeletonLoader } from './SkeletonLoader'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorBanner } from '@/shared/ui/ErrorBanner'
import { Button } from '@/shared/ui/Button'
import { AlertCircle, Inbox } from 'lucide-react'
import type { Issue } from '../model/types'

interface IssueListProps {
  issues: Issue[]
  isLoading: boolean
  error: string | null
  selectedIssueId: string | null
  hasMore: boolean
  onIssueClick: (id: string) => void
  onLoadMore: () => void
  onRetry: () => void
  hasActiveFilters: boolean
  onCreateIssue?: () => void
}

export function IssueList({
  issues,
  isLoading,
  error,
  selectedIssueId,
  hasMore,
  onIssueClick,
  onLoadMore,
  onRetry,
  hasActiveFilters,
  onCreateIssue,
}: IssueListProps) {
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorBanner
          message={error}
          type="server"
          onDismiss={onRetry}
        />
        <Button variant="secondary" onClick={onRetry}>
          <AlertCircle className="h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  if (isLoading && issues.length === 0) {
    return <SkeletonLoader count={5} />
  }

  if (!isLoading && issues.length === 0) {
    return (
      <EmptyState
        icon={<Inbox className="h-12 w-12" />}
        title={hasActiveFilters ? 'No issues match your filters' : 'No issues yet'}
        description={
          hasActiveFilters
            ? 'Try adjusting your filter criteria.'
            : 'Create your first issue to get started.'
        }
        actionLabel={!hasActiveFilters ? 'Create issue' : undefined}
        onAction={!hasActiveFilters ? onCreateIssue : undefined}
      />
    )
  }

  return (
    <div>
      <ul className="space-y-2" role="list" aria-label="Issues list" aria-live="polite">
        {issues.map((issue) => (
          <li key={issue.id}>
            <IssueCard
              issue={issue}
              selected={selectedIssueId === issue.id}
              onClick={onIssueClick}
            />
          </li>
        ))}
      </ul>

      {isLoading && issues.length > 0 && (
        <div className="mt-4">
          <SkeletonLoader count={2} />
        </div>
      )}

      {hasMore && !isLoading && (
        <div className="mt-6 flex justify-center">
          <Button variant="secondary" onClick={onLoadMore}>
            Load more
          </Button>
        </div>
      )}
    </div>
  )
}
