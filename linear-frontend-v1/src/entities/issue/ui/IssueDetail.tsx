import { Button } from '@/shared/ui/Button'
import { ErrorBanner } from '@/shared/ui/ErrorBanner'
import { SkeletonLoader } from './SkeletonLoader'
import { CommentList } from './CommentList'
import { IssueStatusBadge } from './IssueStatusBadge'
import { ArrowLeft, Edit3, Trash2, AlertCircle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { Issue, Comment } from '../model/types'

interface IssueDetailProps {
  issue: Issue | undefined
  comments: Comment[]
  isLoading: boolean
  error: string | null
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
  onRetry: () => void
  onStatusChange?: (statusId: string) => void
  statusChanging?: boolean
}

const priorityLabels: Record<number, { label: string; className: string }> = {
  0: { label: 'No priority', className: 'text-text-muted' },
  1: { label: 'Urgent', className: 'text-danger' },
  2: { label: 'High', className: 'text-orange-500' },
  3: { label: 'Medium', className: 'text-yellow-500' },
  4: { label: 'Low', className: 'text-text-muted' },
}

export function IssueDetail({
  issue,
  comments,
  isLoading,
  error,
  onBack,
  onEdit,
  onDelete,
  onRetry,
  onStatusChange,
  statusChanging,
}: IssueDetailProps) {
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorBanner message={error} type="server" onDismiss={onRetry} />
        <Button variant="secondary" onClick={onRetry}>
          <AlertCircle className="h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonLoader count={3} />
      </div>
    )
  }

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="mb-4 h-12 w-12 text-text-muted" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-text">Issue not found</h2>
        <p className="mt-1 text-sm text-text-muted">
          This issue may have been deleted or you may not have access.
        </p>
        <Button variant="primary" className="mt-4" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back to issues
        </Button>
      </div>
    )
  }

  const priority = priorityLabels[issue.priority] ?? priorityLabels[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={onBack} icon={<ArrowLeft className="h-4 w-4" />}>
          Back
        </Button>
      </div>

      <div>
        <span className="font-mono text-sm text-text-muted">
          {issue.identifier}
        </span>
        <h1 className="mt-1 text-2xl font-bold text-text">{issue.title}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <IssueStatusBadge
          status={issue.status}
          loading={statusChanging}
          onStatusChange={onStatusChange ?? (() => {})}
        />
        <span className={cn('text-sm', priority.className)}>
          {priority.label}
        </span>
      </div>

      <div className="flex flex-wrap gap-6 text-sm">
        {issue.assigneeName && (
          <div>
            <span className="text-text-muted">Assignee</span>
            <p className="mt-0.5 font-medium text-text">{issue.assigneeName}</p>
          </div>
        )}
        <div>
          <span className="text-text-muted">Created</span>
          <p className="mt-0.5 font-medium text-text">
            {new Date(issue.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <div>
          <span className="text-text-muted">Updated</span>
          <p className="mt-0.5 font-medium text-text">
            {new Date(issue.updatedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      {issue.labels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {issue.labels.map((label) => (
            <span
              key={label}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {issue.description && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-text">Description</h2>
          <p className="whitespace-pre-wrap text-sm text-text">
            {issue.description}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="secondary" onClick={onEdit} icon={<Edit3 className="h-4 w-4" />}>
          Edit
        </Button>
        <Button variant="danger" onClick={onDelete} icon={<Trash2 className="h-4 w-4" />}>
          Delete
        </Button>
      </div>

      <hr className="border-border" />

      <CommentList comments={comments} />
    </div>
  )
}
