import { useCallback } from 'react'
import { cn } from '@/shared/lib/utils'
import type { Issue } from '../model/types'

interface IssueCardProps {
  issue: Issue
  selected?: boolean
  onClick?: (id: string) => void
}

const priorityLabels: Record<number, { label: string; className: string }> = {
  0: { label: 'No priority', className: 'text-text-muted' },
  1: { label: 'Urgent', className: 'text-danger' },
  2: { label: 'High', className: 'text-orange-500' },
  3: { label: 'Medium', className: 'text-yellow-500' },
  4: { label: 'Low', className: 'text-text-muted' },
}

const statusColors: Record<string, string> = {
  Todo: 'bg-neutral text-text-muted',
  'In Progress': 'bg-blue-100 text-blue-700',
  Done: 'bg-green-100 text-green-700',
  Cancelled: 'bg-neutral text-text-muted',
}

export function IssueCard({ issue, selected, onClick }: IssueCardProps) {
  const handleClick = useCallback(() => {
    onClick?.(issue.id)
  }, [issue.id, onClick])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick?.(issue.id)
      }
    },
    [issue.id, onClick],
  )

  const priority = priorityLabels[issue.priority] ?? priorityLabels[0]
  const statusColor = statusColors[issue.status] ?? statusColors.Todo
  const initials = issue.assigneeName
    ? issue.assigneeName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : null

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'cursor-pointer rounded-lg border bg-surface p-4 transition-colors',
        'hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        selected
          ? 'border-primary bg-primary/5'
          : 'border-border',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <span className="font-mono text-xs text-text-muted">
            {issue.identifier}
          </span>
          <h3 className="truncate text-sm font-medium text-text">
            {issue.title}
          </h3>
        </div>
        {issue.assigneeName && (
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-text-inverse"
            title={issue.assigneeName}
            aria-label={`Assigned to ${issue.assigneeName}`}
          >
            {initials}
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
            statusColor,
          )}
        >
          {issue.status}
        </span>
        <span className={cn('text-xs', priority.className)}>
          {priority.label}
        </span>
        {issue.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {issue.labels.slice(0, 3).map((label) => (
              <span
                key={label}
                className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
              >
                {label}
              </span>
            ))}
            {issue.labels.length > 3 && (
              <span className="text-xs text-text-muted">
                +{issue.labels.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
