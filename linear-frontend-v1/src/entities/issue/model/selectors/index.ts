import type { Issue, IssueFilters } from '../types'

export function selectIssuesByStatus(issues: Issue[]): Record<string, Issue[]> {
  return issues.reduce(
    (groups, issue) => {
      const status = issue.statusId || 'unknown'
      if (!groups[status]) groups[status] = []
      groups[status].push(issue)
      return groups
    },
    {} as Record<string, Issue[]>,
  )
}

export function selectIssueById(
  issues: Issue[],
  id: string | null,
): Issue | undefined {
  if (!id) return undefined
  return issues.find((issue) => issue.id === id)
}

export function selectFilteredIssues(
  issues: Issue[],
  filters: IssueFilters,
): Issue[] {
  return issues.filter((issue) => {
    if (filters.statusId && issue.statusId !== filters.statusId) return false
    if (filters.assigneeId && issue.assigneeId !== filters.assigneeId)
      return false
    if (filters.projectId && issue.projectId !== filters.projectId) return false
    if (filters.cycleId && issue.cycleId !== filters.cycleId) return false
    if (filters.labelIds.length > 0) {
      const hasAllLabels = filters.labelIds.every((label) =>
        issue.labels.includes(label),
      )
      if (!hasAllLabels) return false
    }
    return true
  })
}
