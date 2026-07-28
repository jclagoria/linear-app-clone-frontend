import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { IssueDetailPage } from '@/pages/IssueDetailPage'
import { renderWithRouter, resetStores } from './test-utils'
import { mockIssue, mockLabels, mockComments } from './fixtures'
import { useIssuesStore } from '@/entities/issue/model/store'
import { useToastStore } from '@/shared/stores/toastStore'
import { useAuthStore } from '@/entities/session/model/store'

vi.mock('@/entities/issue/api', () => ({
  fetchIssues: vi.fn().mockResolvedValue({ data: [], pagination: { nextCursor: null, hasMore: false } }),
  createIssue: vi.fn().mockResolvedValue({ data: { id: '1', title: 'New Issue' } }),
  updateIssue: vi.fn().mockResolvedValue({ data: { id: '1', title: 'Updated Issue' } }),
  deleteIssue: vi.fn().mockResolvedValue(undefined),
  fetchComments: vi.fn().mockResolvedValue({ data: [] }),
  changeIssueStatus: vi.fn().mockResolvedValue({ data: { id: '1', statusId: 'In Progress' } }),
  assignIssue: vi.fn().mockResolvedValue({ data: { id: '1', assigneeId: 'u1' } }),
  createComment: vi.fn().mockResolvedValue({ data: { id: 'c1', body: 'New comment' } }),
  updateComment: vi.fn().mockResolvedValue({ data: { id: 'c1', body: 'Updated comment' } }),
  deleteComment: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/entities/label/api', () => ({
  fetchIssueLabels: vi.fn().mockResolvedValue({ data: [] }),
  attachLabel: vi.fn().mockResolvedValue({ data: { id: 'l1', name: 'Bug' } }),
  detachLabel: vi.fn().mockResolvedValue(undefined),
  fetchLabelDefinitions: vi.fn().mockResolvedValue({ data: [] }),
}))

describe('IssueDetailPage integration', () => {
  beforeEach(() => {
    resetStores()
    useIssuesStore.setState({ issues: [mockIssue] })
  })

  it('loads issue and shows status', async () => {
    renderWithRouter(<IssueDetailPage />, {
      initialEntries: ['/issues/1'],
      routePath: 'issues/:id',
    })
    await screen.findByText('Test Issue')
    expect(screen.getByText('Test Issue')).toBeInTheDocument()
    expect(screen.getByText('Todo')).toBeInTheDocument()
  })

  it('status change shows success toast via store', async () => {
    const { changeIssueStatus } = await import('@/entities/issue/api')
    vi.mocked(changeIssueStatus).mockResolvedValue({ data: { ...mockIssue, statusId: 'In Progress' } })

    const { user } = renderWithRouter(<IssueDetailPage />, {
      initialEntries: ['/issues/1'],
      routePath: 'issues/:id',
    })

    await screen.findByText('Test Issue')
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: /In Progress/i }))

    await waitFor(() => {
      const toasts = useToastStore.getState().toasts
      expect(toasts).toHaveLength(1)
      expect(toasts[0].title).toBe('Status updated to In Progress')
      expect(toasts[0].variant).toBe('success')
    })
  })

  it('status change shows BusinessRuleError toast on 422', async () => {
    const { changeIssueStatus } = await import('@/entities/issue/api')
    const { BusinessRuleError } = await import('@/shared/lib/api-client')
    vi.mocked(changeIssueStatus).mockRejectedValue(
      new BusinessRuleError('Invalid transition'),
    )

    const { user } = renderWithRouter(<IssueDetailPage />, {
      initialEntries: ['/issues/1'],
      routePath: 'issues/:id',
    })

    await screen.findByText('Test Issue')
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: /Done/i }))

    await waitFor(() => {
      const toasts = useToastStore.getState().toasts
      expect(toasts).toHaveLength(1)
      expect(toasts[0].title).toBe('Invalid transition')
      expect(toasts[0].variant).toBe('error')
    })
  })

  it('label attach shows success toast via store', async () => {
    const { fetchLabelDefinitions } = await import('@/entities/label/api')
    vi.mocked(fetchLabelDefinitions).mockResolvedValue({ data: mockLabels })

    const { user } = renderWithRouter(<IssueDetailPage />, {
      initialEntries: ['/issues/1'],
      routePath: 'issues/:id',
    })

    await screen.findByText('Test Issue')
    const addButton = screen.getByRole('button', { name: /Add label to issue/i })
    await user.click(addButton)

    const bugOption = await screen.findByText('Bug')
    await user.click(bugOption)

    await waitFor(() => {
      const toasts = useToastStore.getState().toasts
      expect(toasts).toHaveLength(1)
      expect(toasts[0].title).toBe('Label "Bug" added')
      expect(toasts[0].variant).toBe('success')
    })
  })

  it('comment edit shows success toast and updates store', async () => {
    useAuthStore.setState({
      user: { id: 'u1', name: 'User', email: 'user@test.com' },
      accessToken: 'token',
      isAuthenticated: true,
    })

    const { fetchComments, updateComment } = await import('@/entities/issue/api')
    vi.mocked(fetchComments).mockResolvedValue({ data: mockComments })
    vi.mocked(updateComment).mockResolvedValue({
      data: { ...mockComments[0], body: 'Updated body', updatedAt: '2024-01-01T13:00:00Z' },
    })

    const { user } = renderWithRouter(<IssueDetailPage />, {
      initialEntries: ['/issues/1'],
      routePath: 'issues/:id',
    })

    await screen.findByText('Test Issue')
    await screen.findByText('Original comment body')

    await user.click(await screen.findByRole('button', { name: /edit comment/i }))
    const textarea = screen.getByRole('textbox', { name: /edit comment body/i })
    await user.clear(textarea)
    await user.type(textarea, 'Updated body')
    await user.click(screen.getByRole('button', { name: /save comment/i }))

    await waitFor(() => {
      expect(updateComment).toHaveBeenCalledWith('1', 'c1', 'Updated body')
    })

    await waitFor(() => {
      const toasts = useToastStore.getState().toasts
      expect(toasts).toHaveLength(1)
      expect(toasts[0].title).toBe('Comment updated')
    })

    await waitFor(() => {
      const comments = useIssuesStore.getState().commentsByIssue['1']
      expect(comments.find((c) => c.id === 'c1')?.body).toBe('Updated body')
    })
  })

  it('comment delete rollback restores comment on failure', async () => {
    useAuthStore.setState({
      user: { id: 'u1', name: 'User', email: 'user@test.com' },
      accessToken: 'token',
      isAuthenticated: true,
    })

    const { fetchComments, deleteComment } = await import('@/entities/issue/api')
    vi.mocked(fetchComments).mockResolvedValue({ data: mockComments })
    vi.mocked(deleteComment).mockRejectedValue(new Error('Network error'))

    const { user } = renderWithRouter(<IssueDetailPage />, {
      initialEntries: ['/issues/1'],
      routePath: 'issues/:id',
    })

    await screen.findByText('Test Issue')
    await screen.findByText('Original comment body')

    await user.click(await screen.findByRole('button', { name: /delete comment/i }))
    await user.click(await screen.findByRole('button', { name: /confirm delete/i }))

    await waitFor(() => {
      const comments = useIssuesStore.getState().commentsByIssue['1']
      expect(comments).toHaveLength(2)
      expect(comments.find((c) => c.id === 'c1')?.body).toBe('Original comment body')
    })
  })
})
