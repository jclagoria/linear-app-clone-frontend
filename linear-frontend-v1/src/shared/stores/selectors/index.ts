import { createMemoizedSelector } from './memoize'
import type { Issue } from '@/entities/issue/model/store'

export interface StatusGroup {
  status: string
  issues: Issue[]
  count: number
}

export const selectIssuesByStatus = createMemoizedSelector(
  (issues: Issue[]) => {
    const grouped: Record<string, Issue[]> = {}
    for (const issue of issues) {
      if (!grouped[issue.status]) grouped[issue.status] = []
      grouped[issue.status].push(issue)
    }
    return Object.entries(grouped).map(([status, items]) => ({
      status,
      issues: items,
      count: items.length,
    }))
  },
)

export interface ProjectProgress {
  total: number
  completed: number
  percentage: number
}

export const selectProjectProgress = createMemoizedSelector(
  (issues: Issue[], projectId: string): ProjectProgress | null => {
    const projectIssues = issues.filter((i) => i.projectId === projectId)
    if (projectIssues.length === 0) return null

    const completed = projectIssues.filter((i) => i.status === 'done').length
    return {
      total: projectIssues.length,
      completed,
      percentage: Math.round((completed / projectIssues.length) * 100),
    }
  },
)

export interface Cycle {
  id: string
  name: string
  startsAt: string
  endsAt: string
}

export const selectActiveCycle = createMemoizedSelector(
  (cycles: Cycle[]): Cycle | null => {
    const now = Date.now()
    return (
      cycles.find((cycle) => {
        const start = new Date(cycle.startsAt).getTime()
        const end = new Date(cycle.endsAt).getTime()
        return now >= start && now <= end
      }) ?? null
    )
  },
)

import type { Notification } from '@/shared/stores/websocketStore'

export const selectUnreadCount = createMemoizedSelector(
  (notifications: Notification[]): number =>
    notifications.filter((n) => !n.read).length,
)

export interface ActiveFilters {
  status: string | null
  assigneeId: string | null
  priority: number | null
  projectId: string | null
  search: string | null
}

export const selectFilteredIssues = createMemoizedSelector(
  (issues: Issue[], filters: ActiveFilters): Issue[] => {
    return issues.filter((issue) => {
      if (filters.status && issue.status !== filters.status) return false
      if (filters.assigneeId && issue.assigneeId !== filters.assigneeId) return false
      if (filters.priority !== null && issue.priority !== filters.priority) return false
      if (filters.projectId && issue.projectId !== filters.projectId) return false
      if (filters.search) {
        const query = filters.search.toLowerCase()
        if (
          !issue.title.toLowerCase().includes(query) &&
          !issue.description.toLowerCase().includes(query)
        ) {
          return false
        }
      }
      return true
    })
  },
)
