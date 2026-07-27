import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTeamStore } from '@/entities/team/model/store'
import { useIssueBoard } from '@/features/realtime/lib/useIssueBoard'
import { BoardColumn } from '@/features/realtime/ui/BoardColumn'
import { EmptyState } from '@/features/realtime/ui/EmptyState'
import { Button } from '@/shared/ui/Button'
import { Plus, RefreshCw } from 'lucide-react'

const STATUS_COLUMNS = [
  { id: 'backlog', label: 'Backlog', color: '#6b7280' },
  { id: 'todo', label: 'Todo', color: '#3b82f6' },
  { id: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  { id: 'done', label: 'Done', color: '#10b981' },
  { id: 'cancelled', label: 'Cancelled', color: '#ef4444' },
]

export function IssueBoardPage() {
  const navigate = useNavigate()
  const currentTeamId = useTeamStore((s) => s.currentTeamId)

  const { issues, isLoading, error, moveIssue, refetch } = useIssueBoard({
    teamId: currentTeamId ?? undefined,
  })

  const handleIssueClick = useCallback(
    (issueId: string) => {
      navigate(`/issues/${issueId}`)
    },
    [navigate],
  )

  const handleCreateIssue = useCallback(() => {
    navigate('/issues/create')
  }, [navigate])

  if (!currentTeamId) {
    return (
      <div className="p-6">
        <EmptyState
          title="No team selected"
          description="Please select a team from the sidebar to view the issue board."
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <EmptyState
          title="Error loading issues"
          description={error}
          actionLabel="Retry"
          onAction={refetch}
        />
      </div>
    )
  }

  if (issues.length === 0 && !isLoading) {
    return (
      <div className="p-6">
        <EmptyState
          title="No issues yet"
          description="Create your first issue to get started with the board."
          actionLabel="Create Issue"
          onAction={handleCreateIssue}
        />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Issue Board</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={refetch}
            icon={<RefreshCw className="h-4 w-4" />}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button
            onClick={handleCreateIssue}
            icon={<Plus className="h-4 w-4" />}
          >
            New Issue
          </Button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUS_COLUMNS.map((column) => {
          const columnIssues = issues.filter(
            (issue) => issue.statusId === column.id,
          )
          return (
            <BoardColumn
              key={column.id}
              statusId={column.id}
              statusLabel={column.label}
              statusColor={column.color}
              issues={columnIssues}
              onIssueClick={handleIssueClick}
              onIssueDrop={moveIssue}
            />
          )
        })}
      </div>
    </div>
  )
}
