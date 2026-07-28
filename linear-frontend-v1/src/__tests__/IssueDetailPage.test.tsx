import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { IssueDetailPage } from '@/pages/IssueDetailPage'
import { renderWithRouter, resetStores } from './test-utils'
import { mockIssue, mockLabels, mockComments } from './fixtures'
import { useIssuesStore } from '@/entities/issue/model/store'

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

describe('IssueDetailPage Status Integration', () => {
  beforeEach(() => {
    resetStores()
    useIssuesStore.setState({
      issues: [mockIssue],
    })
  })

  it('shows success toast on valid status transition', async () => {
    const { changeIssueStatus } = await import('@/entities/issue/api')
    const updatedIssue = { ...mockIssue, statusId: 'In Progress' }
    vi.mocked(changeIssueStatus).mockResolvedValue({ data: updatedIssue })

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

  it('shows BusinessRuleError toast on 422', async () => {
    const { changeIssueStatus } = await import('@/entities/issue/api')
    const { BusinessRuleError } = await import('@/shared/lib/api-client')
    vi.mocked(changeIssueStatus).mockRejectedValue(
      new BusinessRuleError('Invalid transition: Cannot move from Todo to Done directly'),
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
      expect(toasts[0].title).toBe('Invalid transition: Cannot move from Todo to Done directly')
      expect(toasts[0].variant).toBe('error')
    })
  })

  it('shows generic error toast on network error', async () => {
    const { changeIssueStatus } = await import('@/entities/issue/api')
    vi.mocked(changeIssueStatus).mockRejectedValue(new Error('Network error'))

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
      expect(toasts[0].title).toBe('Failed to update status. Please try again.')
      expect(toasts[0].variant).toBe('error')
    })
  })

  it('sets aria-busy while status change is in flight', async () => {
    const { changeIssueStatus } = await import('@/entities/issue/api')
    let resolvePromise!: (value: { data: typeof mockIssue }) => void
    vi.mocked(changeIssueStatus).mockReturnValue(
      new Promise((resolve) => { resolvePromise = resolve }),
    )

    const { user } = renderWithRouter(<IssueDetailPage />, {
      initialEntries: ['/issues/1'],
      routePath: 'issues/:id',
    })

    await screen.findByText('Test Issue')

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: /In Progress/i }))

    const button = screen.getByRole('combobox')
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toBeDisabled()

    resolvePromise({ data: { ...mockIssue, statusId: 'In Progress' } })

    await waitFor(() => {
      expect(screen.getByRole('combobox')).not.toBeDisabled()
    })
  })
})

describe('IssueDetailPage Label Attach/Detach', () => {
  beforeEach(async () => {
    resetStores()
    useIssuesStore.setState({
      issues: [mockIssue],
    })

    const { fetchLabelDefinitions } = await import('@/entities/label/api')
    vi.mocked(fetchLabelDefinitions).mockResolvedValue({ data: mockLabels })
  })

  it('displays issue labels from the labels store', async () => {
    const { fetchIssueLabels } = await import('@/entities/label/api')
    vi.mocked(fetchIssueLabels).mockResolvedValue({ data: mockLabels })

    renderWithRouter(<IssueDetailPage />, {
      initialEntries: ['/issues/1'],
      routePath: 'issues/:id',
    })

    await screen.findByText('Test Issue')

    await waitFor(() => {
      expect(screen.getByText('Bug')).toBeInTheDocument()
      expect(screen.getByText('Feature')).toBeInTheDocument()
    })
  })

  it('shows success toast on label attach', async () => {
    const { fetchIssueLabels, attachLabel } = await import('@/entities/label/api')
    vi.mocked(fetchIssueLabels).mockResolvedValue({ data: [] })
    vi.mocked(attachLabel).mockResolvedValue({ data: mockLabels[0] })

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

  it('shows success toast on label detach', async () => {
    const { fetchIssueLabels, detachLabel } = await import('@/entities/label/api')
    vi.mocked(fetchIssueLabels).mockResolvedValue({ data: mockLabels })
    vi.mocked(detachLabel).mockResolvedValue(undefined)

    const { user } = renderWithRouter(<IssueDetailPage />, {
      initialEntries: ['/issues/1'],
      routePath: 'issues/:id',
    })

    await screen.findByText('Test Issue')
    await screen.findByText('Bug')

    const removeButton = screen.getByRole('button', { name: /Remove Bug label/i })
    await user.click(removeButton)

    await waitFor(() => {
      const toasts = useToastStore.getState().toasts
      expect(toasts).toHaveLength(1)
      expect(toasts[0].title).toBe('Label removed')
      expect(toasts[0].variant).toBe('success')
    })
  })

  it('shows error toast when attach fails with network error', async () => {
    const { fetchIssueLabels, attachLabel } = await import('@/entities/label/api')
    vi.mocked(fetchIssueLabels).mockResolvedValue({ data: [] })
    vi.mocked(attachLabel).mockRejectedValue(new Error('Network error'))

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
      expect(toasts[0].title).toBe('Failed to add label. Please try again.')
      expect(toasts[0].variant).toBe('error')
    })
  })

  it('shows error toast when detach fails with network error', async () => {
    const { fetchIssueLabels, detachLabel } = await import('@/entities/label/api')
    vi.mocked(fetchIssueLabels).mockResolvedValue({ data: mockLabels })
    vi.mocked(detachLabel).mockRejectedValue(new Error('Network error'))

    const { user } = renderWithRouter(<IssueDetailPage />, {
      initialEntries: ['/issues/1'],
      routePath: 'issues/:id',
    })

    await screen.findByText('Test Issue')
    await screen.findByText('Bug')

    const removeButton = screen.getByRole('button', { name: /Remove Bug label/i })
    await user.click(removeButton)

    await waitFor(() => {
      const toasts = useToastStore.getState().toasts
      expect(toasts).toHaveLength(1)
      expect(toasts[0].title).toBe('Failed to remove label. Please try again.')
      expect(toasts[0].variant).toBe('error')
    })
  })

  it('shows BusinessRuleError toast when attach fails with 422', async () => {
    const { fetchIssueLabels, attachLabel } = await import('@/entities/label/api')
    const { BusinessRuleError } = await import('@/shared/lib/api-client')
    vi.mocked(fetchIssueLabels).mockResolvedValue({ data: [] })
    vi.mocked(attachLabel).mockRejectedValue(
      new BusinessRuleError('Label cannot be attached'),
    )

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
      expect(toasts[0].title).toBe('Label cannot be attached')
      expect(toasts[0].variant).toBe('error')
    })
  })

  it('shows BusinessRuleError toast when detach fails with 422', async () => {
    const { fetchIssueLabels, detachLabel } = await import('@/entities/label/api')
    const { BusinessRuleError } = await import('@/shared/lib/api-client')
    vi.mocked(fetchIssueLabels).mockResolvedValue({ data: mockLabels })
    vi.mocked(detachLabel).mockRejectedValue(
      new BusinessRuleError('Label cannot be removed'),
    )

    const { user } = renderWithRouter(<IssueDetailPage />, {
      initialEntries: ['/issues/1'],
      routePath: 'issues/:id',
    })

    await screen.findByText('Test Issue')
    await screen.findByText('Bug')

    const removeButton = screen.getByRole('button', { name: /Remove Bug label/i })
    await user.click(removeButton)

    await waitFor(() => {
      const toasts = useToastStore.getState().toasts
      expect(toasts).toHaveLength(1)
      expect(toasts[0].title).toBe('Label cannot be removed')
      expect(toasts[0].variant).toBe('error')
    })
  })
})

describe('IssueDetailPage Edit Comment', () => {
  beforeEach(async () => {
    vi.resetModules()
    resetStores()
    useAuthStore.setState({
      user: { id: 'u1', name: 'User', email: 'user@test.com' },
      accessToken: 'token',
      isAuthenticated: true,
    })
    useIssuesStore.setState({
      issues: [mockIssue],
    })
  })

  it('shows edit button only for comment author', async () => {
    const { fetchComments } = await import('@/entities/issue/api')
    vi.mocked(fetchComments).mockResolvedValue({ data: mockComments })

    renderWithRouter(<IssueDetailPage />, {
      initialEntries: ['/issues/1'],
      routePath: 'issues/:id',
    })

    await screen.findByText('Test Issue')

    const editButtons = await screen.findAllByRole('button', { name: /edit comment/i })
    expect(editButtons).toHaveLength(1)
  })

  it('shows success toast on successful comment edit', async () => {
    const { fetchComments, updateComment } = await import('@/entities/issue/api')
    vi.mocked(fetchComments).mockResolvedValue({ data: mockComments })
    vi.mocked(updateComment).mockResolvedValue({
      data: { ...mockComments[0], body: 'Updated body content', updatedAt: '2024-01-01T13:00:00Z' },
    })

    const { user } = renderWithRouter(<IssueDetailPage />, {
      initialEntries: ['/issues/1'],
      routePath: 'issues/:id',
    })

    await screen.findByText('Test Issue')
    await screen.findByText('Original comment body')

    const editButton = await screen.findByRole('button', { name: /edit comment/i })
    await user.click(editButton)

    const textarea = await screen.findByRole('textbox', { name: /edit comment body/i })
    await user.clear(textarea)
    await user.type(textarea, 'Updated body content')

    await user.click(await screen.findByRole('button', { name: /save comment/i }))

    await waitFor(() => {
      expect(updateComment).toHaveBeenCalledWith('1', 'c1', 'Updated body content')
    })

    await waitFor(() => {
      const toasts = useToastStore.getState().toasts
      expect(toasts).toHaveLength(1)
      expect(toasts[0].title).toBe('Comment updated')
      expect(toasts[0].variant).toBe('success')
    })
  })

  it('updates comment in store after successful edit', async () => {
    const { fetchComments, updateComment } = await import('@/entities/issue/api')
    vi.mocked(fetchComments).mockResolvedValue({ data: mockComments })
    vi.mocked(updateComment).mockResolvedValue({
      data: { ...mockComments[0], body: 'Updated body content', updatedAt: '2024-01-01T13:00:00Z' },
    })

    const { user } = renderWithRouter(<IssueDetailPage />, {
      initialEntries: ['/issues/1'],
      routePath: 'issues/:id',
    })

    await screen.findByText('Test Issue')
    await screen.findByText('Original comment body')

    await user.click(await screen.findByRole('button', { name: /edit comment/i }))

    const textarea = await screen.findByRole('textbox', { name: /edit comment body/i })
    await user.clear(textarea)
    await user.type(textarea, 'Updated body content')

    await user.click(await screen.findByRole('button', { name: /save comment/i }))

    await waitFor(() => {
      const comments = useIssuesStore.getState().commentsByIssue['1']
      const updatedComment = comments.find((c) => c.id === 'c1')
      expect(updatedComment?.body).toBe('Updated body content')
    })
  })

  it('shows error toast on 403 ForbiddenError', async () => {
    const { fetchComments, updateComment } = await import('@/entities/issue/api')
    const { ForbiddenError } = await import('@/shared/lib/api-client/errors')
    vi.mocked(fetchComments).mockResolvedValue({ data: mockComments })
    vi.mocked(updateComment).mockRejectedValue(new ForbiddenError())

    const { user } = renderWithRouter(<IssueDetailPage />, {
      initialEntries: ['/issues/1'],
      routePath: 'issues/:id',
    })

    await screen.findByText('Test Issue')
    await screen.findByText('Original comment body')

    const editButton = await screen.findByRole('button', { name: /edit comment/i })
    await user.click(editButton)

    const textarea = await screen.findByRole('textbox', { name: /edit comment body/i })
    await user.clear(textarea)
    await user.type(textarea, 'Updated body')

    await user.click(await screen.findByRole('button', { name: /save comment/i }))

    await waitFor(() => {
      const toasts = useToastStore.getState().toasts
      expect(toasts).toHaveLength(1)
      expect(toasts[0].title).toBe('Not the comment owner')
      expect(toasts[0].variant).toBe('error')
    })
  })

  it('shows generic error toast on network error', async () => {
    const { fetchComments, updateComment } = await import('@/entities/issue/api')
    vi.mocked(fetchComments).mockResolvedValue({ data: mockComments })
    vi.mocked(updateComment).mockRejectedValue(new Error('Network error'))

    const { user } = renderWithRouter(<IssueDetailPage />, {
      initialEntries: ['/issues/1'],
      routePath: 'issues/:id',
    })

    await screen.findByText('Test Issue')
    await screen.findByText('Original comment body')

    const editButton = await screen.findByRole('button', { name: /edit comment/i })
    await user.click(editButton)

    const textarea = await screen.findByRole('textbox', { name: /edit comment body/i })
    await user.clear(textarea)
    await user.type(textarea, 'Updated body')

    await user.click(await screen.findByRole('button', { name: /save comment/i }))

    await waitFor(() => {
      const toasts = useToastStore.getState().toasts
      expect(toasts).toHaveLength(1)
      expect(toasts[0].title).toBe('Failed to update comment. Please try again.')
      expect(toasts[0].variant).toBe('error')
    })
  })

  it('non-author does not see edit button', async () => {
    useAuthStore.setState({
      user: { id: 'u3', name: 'Non Author', email: 'non@test.com' },
    })

    const { fetchComments } = await import('@/entities/issue/api')
    vi.mocked(fetchComments).mockResolvedValue({ data: mockComments })

    renderWithRouter(<IssueDetailPage />, {
      initialEntries: ['/issues/1'],
      routePath: 'issues/:id',
    })

    await screen.findByText('Test Issue')

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /edit comment/i })).not.toBeInTheDocument()
    })
  })
})

describe('IssueDetailPage Delete Comment', () => {
  beforeEach(async () => {
    vi.resetModules()
    resetStores()
    useAuthStore.setState({
      user: { id: 'u1', name: 'User', email: 'user@test.com' },
      accessToken: 'token',
      isAuthenticated: true,
    })
    useIssuesStore.setState({
      issues: [mockIssue],
    })
  })

  it('shows delete button only for comment author', async () => {
    const { fetchComments } = await import('@/entities/issue/api')
    vi.mocked(fetchComments).mockResolvedValue({ data: mockComments })

    renderWithRouter(<IssueDetailPage />, {
      initialEntries: ['/issues/1'],
      routePath: 'issues/:id',
    })

    await screen.findByText('Test Issue')

    const deleteButtons = await screen.findAllByRole('button', { name: /delete comment/i })
    expect(deleteButtons).toHaveLength(1)
  })

  it('removes comment from store on successful delete', async () => {
    const { fetchComments, deleteComment } = await import('@/entities/issue/api')
    vi.mocked(fetchComments).mockResolvedValue({ data: mockComments })
    vi.mocked(deleteComment).mockResolvedValue(undefined)

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
      expect(comments).toHaveLength(1)
      expect(comments[0].id).toBe('c2')
    })
  })

  it('shows success toast on successful delete', async () => {
    const { fetchComments, deleteComment } = await import('@/entities/issue/api')
    vi.mocked(fetchComments).mockResolvedValue({ data: mockComments })
    vi.mocked(deleteComment).mockResolvedValue(undefined)

    const { user } = renderWithRouter(<IssueDetailPage />, {
      initialEntries: ['/issues/1'],
      routePath: 'issues/:id',
    })

    await screen.findByText('Test Issue')
    await screen.findByText('Original comment body')

    await user.click(await screen.findByRole('button', { name: /delete comment/i }))
    await user.click(await screen.findByRole('button', { name: /confirm delete/i }))

    await waitFor(() => {
      const toasts = useToastStore.getState().toasts
      expect(toasts).toHaveLength(1)
      expect(toasts[0].title).toBe('Comment deleted')
      expect(toasts[0].variant).toBe('success')
    })
  })

  it('shows error toast on 403 ForbiddenError', async () => {
    const { fetchComments, deleteComment } = await import('@/entities/issue/api')
    const { ForbiddenError } = await import('@/shared/lib/api-client/errors')
    vi.mocked(fetchComments).mockResolvedValue({ data: mockComments })
    vi.mocked(deleteComment).mockRejectedValue(new ForbiddenError())

    const { user } = renderWithRouter(<IssueDetailPage />, {
      initialEntries: ['/issues/1'],
      routePath: 'issues/:id',
    })

    await screen.findByText('Test Issue')
    await screen.findByText('Original comment body')

    await user.click(await screen.findByRole('button', { name: /delete comment/i }))
    await user.click(await screen.findByRole('button', { name: /confirm delete/i }))

    await waitFor(() => {
      const toasts = useToastStore.getState().toasts
      expect(toasts).toHaveLength(1)
      expect(toasts[0].title).toBe("You don't have permission to delete this comment.")
      expect(toasts[0].variant).toBe('error')
    })
  })

  it('shows generic error toast on network error', async () => {
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
      const toasts = useToastStore.getState().toasts
      expect(toasts).toHaveLength(1)
      expect(toasts[0].title).toBe('Failed to delete comment. Please try again.')
      expect(toasts[0].variant).toBe('error')
    })
  })

  it('restores comment in store on delete failure (rollback)', async () => {
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

// Import stores used in tests
import { useIssuesStore } from '@/entities/issue/model/store'
import { useToastStore } from '@/shared/stores/toastStore'
import { useAuthStore } from '@/entities/session/model/store'
