import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { IssueDetailPage } from '@/pages/IssueDetailPage'
import { useIssuesStore } from '@/entities/issue/model/store'
import { useToastStore } from '@/shared/stores/toastStore'
import type { Issue } from '@/entities/issue/model/types'

vi.mock('@/entities/issue/api', () => ({
  changeIssueStatus: vi.fn(),
  fetchComments: vi.fn().mockResolvedValue({ data: [] }),
  updateIssue: vi.fn(),
  deleteIssue: vi.fn(),
}))

const mockIssue: Issue = {
  id: '1',
  title: 'Test Issue',
  description: 'Test description',
  status: 'Todo',
  priority: 2,
  assigneeId: 'u1',
  assigneeName: 'User',
  projectId: null,
  cycleId: null,
  labels: [],
  identifier: 'TST-1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

describe('IssueDetailPage Status Integration', () => {
  beforeEach(() => {
    useIssuesStore.setState({
      issues: [mockIssue],
      selectedIssueId: null,
      filters: { status: null, assigneeId: null, priority: null, projectId: null, search: null, labelIds: [], cycleId: null },
      cursor: null,
      hasMore: true,
      isLoading: false,
      error: null,
    })
    useToastStore.setState({ toasts: [] })
    vi.clearAllMocks()
  })

  function renderPage() {
    return render(
      <MemoryRouter initialEntries={['/issues/1']}>
        <Routes>
          <Route path="issues/:id" element={<IssueDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )
  }

  it('shows success toast on valid status transition', async () => {
    const { changeIssueStatus } = await import('@/entities/issue/api')
    const updatedIssue = { ...mockIssue, status: 'In Progress' }
    vi.mocked(changeIssueStatus).mockResolvedValue({ data: updatedIssue })

    renderPage()

    await screen.findByText('Test Issue')

    const user = userEvent.setup()
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

    renderPage()

    await screen.findByText('Test Issue')

    const user = userEvent.setup()
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

    renderPage()

    await screen.findByText('Test Issue')

    const user = userEvent.setup()
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
    let resolvePromise!: (value: { data: Issue }) => void
    vi.mocked(changeIssueStatus).mockReturnValue(
      new Promise((resolve) => { resolvePromise = resolve }),
    )

    renderPage()

    await screen.findByText('Test Issue')

    const user = userEvent.setup()
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: /In Progress/i }))

    const button = screen.getByRole('combobox')
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toBeDisabled()

    resolvePromise({ data: { ...mockIssue, status: 'In Progress' } })

    await waitFor(() => {
      expect(screen.getByRole('combobox')).not.toBeDisabled()
    })
  })
})
