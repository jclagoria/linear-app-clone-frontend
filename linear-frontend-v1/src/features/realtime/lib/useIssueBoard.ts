import { useMemo, useCallback } from 'react'
import { useIssuesStore } from '@/entities/issue/model/store'
import { useWebSocketStore } from '@/shared/stores/websocketStore'
import { useOptimisticStore } from './optimistic-store'
import type { BoardIssue } from '../ui/BoardColumn'

interface UseIssueBoardOptions {
  teamId?: string
  statusId?: string
}

interface UseIssueBoardReturn {
  issues: BoardIssue[]
  isLoading: boolean
  error: string | null
  moveIssue: (issueId: string, targetStatusId: string) => void
  refetch: () => void
}

export function useIssueBoard(options: UseIssueBoardOptions = {}): UseIssueBoardReturn {
  const { teamId, statusId } = options

  const issues = useIssuesStore((s) => s.issues)
  const isLoading = useIssuesStore((s) => s.isLoading)
  const error = useIssuesStore((s) => s.error)
  const loadIssues = useIssuesStore((s) => s.loadIssues)
  const updateIssue = useIssuesStore((s) => s.updateIssue)
  const autoUpdateEnabled = useWebSocketStore((s) => s.autoUpdateEnabled)

  const boardIssues = useMemo(() => {
    let filtered = issues

    if (teamId) {
      filtered = filtered.filter((issue) => issue.teamId === teamId)
    }

    if (statusId) {
      filtered = filtered.filter((issue) => issue.statusId === statusId)
    }

    return filtered.map((issue) => ({
      issueId: issue.id,
      title: issue.title,
      statusId: issue.statusId,
      statusLabel: issue.statusLabel,
      statusColor: issue.statusColor,
      priority: issue.priority,
      labels: issue.labels,
      assigneeName: issue.assigneeName,
      isOptimistic: useOptimisticStore.getState().isPending(`issues:${issue.id}`),
    }))
  }, [issues, teamId, statusId])

  const moveIssue = useCallback(
    (issueId: string, targetStatusId: string) => {
      if (!autoUpdateEnabled) return

      const issue = issues.find((i) => i.id === issueId)
      if (!issue) return

      // Optimistic update
      updateIssue(issueId, { statusId: targetStatusId })

      // TODO: Send API request to persist the change
      // If server rejects, the optimistic store will handle rollback
    },
    [issues, updateIssue, autoUpdateEnabled],
  )

  const refetch = useCallback(() => {
    loadIssues()
  }, [loadIssues])

  return {
    issues: boardIssues,
    isLoading,
    error,
    moveIssue,
    refetch,
  }
}
