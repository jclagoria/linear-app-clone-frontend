import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useIssuesStore } from '@/entities/issue/model/store'
import { useCacheStore } from '@/shared/stores/cacheStore'
import { BusinessRuleError } from '@/shared/lib/api-client'
import type { Issue } from '@/entities/issue/model/store'

vi.mock('@/entities/issue/api', () => ({
  fetchIssues: vi.fn(),
  changeIssueStatus: vi.fn(),
  assignIssue: vi.fn(),
  deleteComment: vi.fn(),
}))

const mockIssues: Issue[] = [
  {
    id: '1', title: 'Issue 1', description: 'Desc 1', status: 'todo',
    priority: 2, assigneeId: 'a1', projectId: null, cycleId: null,
    labels: [], createdAt: '2024-01-01', updatedAt: '2024-01-01',
  },
  {
    id: '2', title: 'Issue 2', description: 'Desc 2', status: 'in_progress',
    priority: 1, assigneeId: 'a2', projectId: 'p1', cycleId: null,
    labels: ['bug'], createdAt: '2024-01-02', updatedAt: '2024-01-02',
  },
  {
    id: '3', title: 'Issue 3', description: 'Desc 3', status: 'done',
    priority: 3, assigneeId: null, projectId: null, cycleId: null,
    labels: [], createdAt: '2024-01-03', updatedAt: '2024-01-03',
  },
]

describe('issuesStore', () => {
  beforeEach(() => {
    useIssuesStore.setState({
      issues: [],
      selectedIssueId: null,
      filters: { status: null, assigneeId: null, priority: null, projectId: null, search: null },
      cursor: null,
      hasMore: true,
      isLoading: false,
      error: null,
    })
    useCacheStore.getState().clear()
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('starts with empty issues and no selection', () => {
      const state = useIssuesStore.getState()
      expect(state.issues).toEqual([])
      expect(state.selectedIssueId).toBeNull()
      expect(state.isLoading).toBe(false)
    })
  })

  describe('loadIssues', () => {
    it('sets loading state and populates issues', async () => {
      const { fetchIssues } = await import('@/entities/issue/api')
      vi.mocked(fetchIssues).mockResolvedValue({
        data: mockIssues,
        meta: { cursor: 'cursor-2', hasMore: true },
      })

      const promise = useIssuesStore.getState().loadIssues()
      expect(useIssuesStore.getState().isLoading).toBe(true)

      await promise

      const state = useIssuesStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.issues).toHaveLength(3)
      expect(state.cursor).toBe('cursor-2')
      expect(state.hasMore).toBe(true)
    })

    it('sets error on failure', async () => {
      const { fetchIssues } = await import('@/entities/issue/api')
      vi.mocked(fetchIssues).mockRejectedValue(new Error('Network error'))

      await useIssuesStore.getState().loadIssues()

      const state = useIssuesStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBe('Network error')
    })
  })

  describe('changeStatus', () => {
    it('calls API and updates issue on success', async () => {
      const { changeIssueStatus } = await import('@/entities/issue/api')
      const updatedIssue = { ...mockIssues[0], status: 'In Progress' }
      vi.mocked(changeIssueStatus).mockResolvedValue({ data: updatedIssue })

      useIssuesStore.setState({ issues: mockIssues })
      useCacheStore.getState().set('issues:list?', { data: mockIssues, meta: { cursor: null, hasMore: false } })

      const result = await useIssuesStore.getState().changeStatus('1', 'status-2')

      expect(changeIssueStatus).toHaveBeenCalledWith('1', 'status-2')
      expect(result.status).toBe('In Progress')
      expect(useIssuesStore.getState().issues[0].status).toBe('In Progress')
      expect(useCacheStore.getState().get('issues:list?')).toBeNull()
    })

    it('reverts issue status on BusinessRuleError', async () => {
      const { changeIssueStatus } = await import('@/entities/issue/api')
      vi.mocked(changeIssueStatus).mockRejectedValue(new BusinessRuleError('Invalid transition'))

      useIssuesStore.setState({ issues: mockIssues })
      const previousStatus = useIssuesStore.getState().issues[0].status

      await expect(useIssuesStore.getState().changeStatus('1', 'status-done')).rejects.toThrow(BusinessRuleError)

      const state = useIssuesStore.getState()
      expect(state.issues[0].status).toBe(previousStatus)
    })

    it('reverts issue status on network error', async () => {
      const { changeIssueStatus } = await import('@/entities/issue/api')
      vi.mocked(changeIssueStatus).mockRejectedValue(new Error('Network error'))

      useIssuesStore.setState({ issues: mockIssues })
      const previousStatus = useIssuesStore.getState().issues[0].status

      await expect(useIssuesStore.getState().changeStatus('1', 'status-done')).rejects.toThrow('Network error')

      const state = useIssuesStore.getState()
      expect(state.issues[0].status).toBe(previousStatus)
    })
  })

  describe('assignIssue', () => {
    it('calls API and updates issue assignee on success', async () => {
      const { assignIssue } = await import('@/entities/issue/api')
      const updatedIssue = { ...mockIssues[0], assigneeId: 'user-1', assigneeName: 'John Doe' }
      vi.mocked(assignIssue).mockResolvedValue({ data: updatedIssue })

      useIssuesStore.setState({ issues: mockIssues })
      useCacheStore.getState().set('issues:list?', { data: mockIssues, meta: { cursor: null, hasMore: false } })

      const result = await useIssuesStore.getState().assignIssue('1', 'user-1')

      expect(assignIssue).toHaveBeenCalledWith('1', 'user-1')
      expect(result.assigneeId).toBe('user-1')
      expect(useIssuesStore.getState().issues[0].assigneeId).toBe('user-1')
      expect(useCacheStore.getState().get('issues:list?')).toBeNull()
    })

    it('optimistically updates assignee before API response', async () => {
      const { assignIssue } = await import('@/entities/issue/api')
      let resolvePromise: (value: { data: Issue }) => void
      const promise = new Promise<{ data: Issue }>((resolve) => {
        resolvePromise = resolve
      })
      vi.mocked(assignIssue).mockReturnValue(promise)

      useIssuesStore.setState({ issues: mockIssues })

      const promiseResult = useIssuesStore.getState().assignIssue('1', 'user-1')

      expect(useIssuesStore.getState().issues[0].assigneeId).toBe('user-1')

      resolvePromise!({ data: { ...mockIssues[0], assigneeId: 'user-1', assigneeName: 'John Doe' } })
      await promiseResult
    })

    it('reverts assignee on BusinessRuleError', async () => {
      const { assignIssue } = await import('@/entities/issue/api')
      vi.mocked(assignIssue).mockRejectedValue(new BusinessRuleError('Not a team member'))

      useIssuesStore.setState({ issues: mockIssues })
      const previousAssigneeId = useIssuesStore.getState().issues[0].assigneeId

      await expect(useIssuesStore.getState().assignIssue('1', 'user-3')).rejects.toThrow(BusinessRuleError)

      const state = useIssuesStore.getState()
      expect(state.issues[0].assigneeId).toBe(previousAssigneeId)
    })

    it('reverts assignee on network error', async () => {
      const { assignIssue } = await import('@/entities/issue/api')
      vi.mocked(assignIssue).mockRejectedValue(new Error('Network error'))

      useIssuesStore.setState({ issues: mockIssues })
      const previousAssigneeId = useIssuesStore.getState().issues[0].assigneeId

      await expect(useIssuesStore.getState().assignIssue('1', 'user-1')).rejects.toThrow('Network error')

      const state = useIssuesStore.getState()
      expect(state.issues[0].assigneeId).toBe(previousAssigneeId)
    })

    it('sets assigneeId to null for unassign', async () => {
      const { assignIssue } = await import('@/entities/issue/api')
      const updatedIssue = { ...mockIssues[0], assigneeId: null, assigneeName: null }
      vi.mocked(assignIssue).mockResolvedValue({ data: updatedIssue })

      useIssuesStore.setState({ issues: mockIssues })

      await useIssuesStore.getState().assignIssue('1', null)

      expect(assignIssue).toHaveBeenCalledWith('1', null)
      expect(useIssuesStore.getState().issues[0].assigneeId).toBeNull()
    })
  })

  describe('loadNextPage', () => {
    it('appends issues on next page', async () => {
      useIssuesStore.setState({
        issues: mockIssues,
        cursor: 'cursor-1',
        hasMore: true,
      })

      const moreIssues: Issue[] = [
        {
          id: '4', title: 'Issue 4', description: 'Desc 4', status: 'todo',
          priority: 2, assigneeId: null, projectId: null, cycleId: null,
          labels: [], createdAt: '2024-01-04', updatedAt: '2024-01-04',
        },
      ]

      const { fetchIssues } = await import('@/entities/issue/api')
      vi.mocked(fetchIssues).mockResolvedValue({
        data: moreIssues,
        meta: { cursor: null, hasMore: false },
      })

      await useIssuesStore.getState().loadNextPage()

      const state = useIssuesStore.getState()
      expect(state.issues).toHaveLength(4)
      expect(state.hasMore).toBe(false)
      expect(state.cursor).toBeNull()
    })

    it('does nothing if hasMore is false', async () => {
      useIssuesStore.setState({ hasMore: false })

      await useIssuesStore.getState().loadNextPage()

      const { fetchIssues } = await import('@/entities/issue/api')
      expect(fetchIssues).not.toHaveBeenCalled()
    })
  })

  describe('selectIssue / deselectIssue', () => {
    it('selects and deselects an issue', () => {
      useIssuesStore.getState().selectIssue('1')
      expect(useIssuesStore.getState().selectedIssueId).toBe('1')

      useIssuesStore.getState().deselectIssue()
      expect(useIssuesStore.getState().selectedIssueId).toBeNull()
    })
  })

  describe('filters', () => {
    it('sets and clears filters', () => {
      useIssuesStore.getState().setFilters({ status: 'todo', priority: 2 })
      expect(useIssuesStore.getState().filters.status).toBe('todo')
      expect(useIssuesStore.getState().filters.priority).toBe(2)

      useIssuesStore.getState().clearFilters()
      expect(useIssuesStore.getState().filters.status).toBeNull()
      expect(useIssuesStore.getState().filters.priority).toBeNull()
    })
  })

  describe('CRUD', () => {
    it('adds an issue', () => {
      useIssuesStore.getState().addIssue(mockIssues[0])
      expect(useIssuesStore.getState().issues).toHaveLength(1)
    })

    it('updates an issue', () => {
      useIssuesStore.setState({ issues: mockIssues })
      useIssuesStore.getState().updateIssue('1', { title: 'Updated' })
      expect(useIssuesStore.getState().issues[0].title).toBe('Updated')
    })

    it('removes an issue and clears selection', () => {
      useIssuesStore.setState({ issues: mockIssues, selectedIssueId: '1' })
      useIssuesStore.getState().removeIssue('1')
      expect(useIssuesStore.getState().issues).toHaveLength(2)
      expect(useIssuesStore.getState().selectedIssueId).toBeNull()
    })
  })

  describe('deleteCommentFromStore', () => {
    const mockComments = [
      { id: 'c1', issueId: 'i1', body: 'First', authorId: 'u1', authorName: 'A', createdAt: '', updatedAt: '' },
      { id: 'c2', issueId: 'i1', body: 'Second', authorId: 'u2', authorName: 'B', createdAt: '', updatedAt: '' },
    ]

    beforeEach(() => {
      useIssuesStore.setState({
        commentsByIssue: { i1: mockComments },
      })
    })

    it('removes comment optimistically before API resolves', async () => {
      const { deleteComment: deleteCommentApi } = await import('@/entities/issue/api')
      let resolvePromise!: () => void
      vi.mocked(deleteCommentApi).mockReturnValue(new Promise((resolve) => { resolvePromise = resolve }))

      const promise = useIssuesStore.getState().deleteCommentFromStore('i1', 'c1')

      const state = useIssuesStore.getState()
      expect(state.commentsByIssue['i1']).toHaveLength(1)
      expect(state.commentsByIssue['i1'][0].id).toBe('c2')

      resolvePromise()
      await promise
    })

    it('keeps comment removed after API succeeds', async () => {
      const { deleteComment: deleteCommentApi } = await import('@/entities/issue/api')
      vi.mocked(deleteCommentApi).mockResolvedValue(undefined)

      await useIssuesStore.getState().deleteCommentFromStore('i1', 'c1')

      const state = useIssuesStore.getState()
      expect(state.commentsByIssue['i1']).toHaveLength(1)
      expect(state.commentsByIssue['i1'][0].id).toBe('c2')
    })

    it('rolls back comment on API error', async () => {
      const { deleteComment: deleteCommentApi } = await import('@/entities/issue/api')
      vi.mocked(deleteCommentApi).mockRejectedValue(new Error('Network error'))

      await expect(useIssuesStore.getState().deleteCommentFromStore('i1', 'c1')).rejects.toThrow('Network error')

      const state = useIssuesStore.getState()
      expect(state.commentsByIssue['i1']).toHaveLength(2)
      expect(state.commentsByIssue['i1'][0].id).toBe('c1')
    })

    it('calls deleteComment API with correct params', async () => {
      const { deleteComment: deleteCommentApi } = await import('@/entities/issue/api')
      vi.mocked(deleteCommentApi).mockResolvedValue(undefined)

      await useIssuesStore.getState().deleteCommentFromStore('i1', 'c1')

      expect(deleteCommentApi).toHaveBeenCalledWith('i1', 'c1')
    })
  })
})
