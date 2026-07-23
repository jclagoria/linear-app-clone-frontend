import { describe, it, expect } from 'vitest'
import {
  selectIssuesByStatus,
  selectProjectProgress,
  selectActiveCycle,
  selectUnreadCount,
  selectFilteredIssues,
} from '@/shared/stores/selectors'
import type { Issue } from '@/entities/issue/model/store'
import type { Notification } from '@/shared/stores/websocketStore'
import type { Cycle } from '@/shared/stores/selectors'

const issues: Issue[] = [
  {
    id: '1', title: 'Bug A', description: 'Fix crash', status: 'todo',
    priority: 1, assigneeId: 'u1', projectId: 'p1', cycleId: null,
    labels: [], createdAt: '', updatedAt: '',
  },
  {
    id: '2', title: 'Feature B', description: 'Add login', status: 'in_progress',
    priority: 2, assigneeId: 'u2', projectId: 'p1', cycleId: null,
    labels: [], createdAt: '', updatedAt: '',
  },
  {
    id: '3', title: 'Done C', description: 'Finished', status: 'done',
    priority: 3, assigneeId: null, projectId: 'p2', cycleId: null,
    labels: [], createdAt: '', updatedAt: '',
  },
  {
    id: '4', title: 'Bug D', description: 'UI glitch', status: 'todo',
    priority: 1, assigneeId: 'u1', projectId: null, cycleId: null,
    labels: [], createdAt: '', updatedAt: '',
  },
]

describe('selectors', () => {
  describe('selectIssuesByStatus', () => {
    it('groups issues by status', () => {
      const grouped = selectIssuesByStatus(issues)
      expect(grouped).toHaveLength(3)
      const todo = grouped.find((g) => g.status === 'todo')
      expect(todo?.count).toBe(2)
      expect(todo?.issues).toHaveLength(2)
    })

    it('returns empty array for empty issues', () => {
      expect(selectIssuesByStatus([])).toEqual([])
    })
  })

  describe('selectProjectProgress', () => {
    it('computes completion percentage', () => {
      const result = selectProjectProgress(issues, 'p1')
      expect(result?.total).toBe(2)
      expect(result?.completed).toBe(0)
      expect(result?.percentage).toBe(0)
    })

    it('returns null for unknown project', () => {
      expect(selectProjectProgress(issues, 'unknown')).toBeNull()
    })
  })

  describe('selectActiveCycle', () => {
    it('returns the cycle containing current date', () => {
      const now = new Date()
      const past = new Date(now.getTime() - 86400_000)
      const future = new Date(now.getTime() + 86400_000)

      const cycles: Cycle[] = [
        { id: 'c1', name: 'Past Cycle', startsAt: '2020-01-01', endsAt: '2020-02-01' },
        { id: 'c2', name: 'Active Cycle', startsAt: past.toISOString(), endsAt: future.toISOString() },
      ]

      const active = selectActiveCycle(cycles)
      expect(active?.id).toBe('c2')
    })

    it('returns null when no cycle is active', () => {
      const cycles: Cycle[] = [
        { id: 'c1', name: 'Old', startsAt: '2020-01-01', endsAt: '2020-02-01' },
      ]
      expect(selectActiveCycle(cycles)).toBeNull()
    })
  })

  describe('selectUnreadCount', () => {
    it('counts unread notifications', () => {
      const notifications: Notification[] = [
        { id: 'n1', type: 'test', title: 'A', message: 'msg', read: false, createdAt: '' },
        { id: 'n2', type: 'test', title: 'B', message: 'msg', read: true, createdAt: '' },
        { id: 'n3', type: 'test', title: 'C', message: 'msg', read: false, createdAt: '' },
      ]
      expect(selectUnreadCount(notifications)).toBe(2)
    })

    it('returns 0 for all read', () => {
      const notifications: Notification[] = [
        { id: 'n1', type: 'test', title: 'A', message: 'msg', read: true, createdAt: '' },
      ]
      expect(selectUnreadCount(notifications)).toBe(0)
    })
  })

  describe('selectFilteredIssues', () => {
    it('filters by status', () => {
      const result = selectFilteredIssues(issues, { statusId: 'todo', assigneeId: null, projectId: null })
      expect(result).toHaveLength(2)
      expect(result.every((i) => i.status === 'todo')).toBe(true)
    })

    it('filters by assignee', () => {
      const result = selectFilteredIssues(issues, { statusId: null, assigneeId: 'u1', projectId: null })
      expect(result).toHaveLength(2)
    })

    it('returns all issues with no filters', () => {
      const result = selectFilteredIssues(issues, { statusId: null, assigneeId: null, projectId: null })
      expect(result).toHaveLength(4)
    })
  })
})
