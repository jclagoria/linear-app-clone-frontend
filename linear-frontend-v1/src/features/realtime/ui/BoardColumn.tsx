import { useCallback } from 'react'
import { cn } from '@/shared/lib/utils'
import { IssueCard } from './IssueCard'
import type { WSEvent } from '../lib/event-schema'

export interface BoardIssue {
  issueId: string
  title: string
  statusId: string
  statusLabel?: string
  statusColor?: string
  priority?: number
  labels?: string[]
  assigneeName?: string | null
  assigneeAvatarUrl?: string | null
  isOptimistic?: boolean
  isReverted?: boolean
}

interface BoardColumnProps {
  statusId: string
  statusLabel: string
  statusColor: string
  issues: BoardIssue[]
  onIssueClick?: (issueId: string) => void
  onIssueDrop?: (issueId: string, targetStatusId: string) => void
  className?: string
}

export function BoardColumn({
  statusId,
  statusLabel,
  statusColor,
  issues,
  onIssueClick,
  onIssueDrop,
  className,
}: BoardColumnProps) {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const issueId = e.dataTransfer.getData('text/plain')
      if (issueId && onIssueDrop) {
        onIssueDrop(issueId, statusId)
      }
    },
    [statusId, onIssueDrop],
  )

  return (
    <div
      className={cn(
        'flex flex-col min-w-[280px] max-w-[320px] bg-[var(--bg-surface)] rounded-lg border border-[var(--border-color)]',
        className,
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-color)]">
        <span
          className="h-2.5 w-2.5 rounded-full shrink-0"
          style={{ backgroundColor: statusColor }}
          aria-hidden="true"
        />
        <h3 className="text-sm font-medium text-[var(--text-primary)]">{statusLabel}</h3>
        <span className="ml-auto text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded">
          {issues.length}
        </span>
      </div>

      <div className="flex-1 p-2 overflow-y-auto max-h-[calc(100vh-200px)]">
        {issues.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-sm text-[var(--text-secondary)]">
            No issues
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {issues.map((issue) => (
              <div
                key={issue.issueId}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', issue.issueId)
                  e.dataTransfer.effectAllowed = 'move'
                }}
              >
                <IssueCard
                  issueId={issue.issueId}
                  title={issue.title}
                  statusId={issue.statusId}
                  statusLabel={issue.statusLabel}
                  statusColor={issue.statusColor}
                  priority={issue.priority}
                  labels={issue.labels}
                  assigneeName={issue.assigneeName}
                  isOptimistic={issue.isOptimistic}
                  isReverted={issue.isReverted}
                  onClick={onIssueClick}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
