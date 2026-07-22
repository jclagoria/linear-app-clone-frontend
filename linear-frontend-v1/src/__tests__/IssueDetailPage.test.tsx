import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { IssueDetailPage } from '@/pages/IssueDetailPage'
import { useIssuesStore } from '@/entities/issue/model/store'
import { useIssueLabelsStore } from '@/entities/label/model/store'
import { useToastStore } from '@/shared/stores/toastStore'
import { useCacheStore } from '@/shared/stores/cacheStore'
import type { Issue } from '@/entities/issue/model/types'
import type { Label } from '@/entities/label/model/types'

vi.mock('@/entities/issue/api', () => ({
  changeIssueStatus: vi.fn(),
  fetchComments: vi.fn().mockResolvedValue({ data: [] }),
  updateIssue: vi.fn(),
  deleteIssue: vi.fn(),
}))

vi.mock('@/entities/label/api', () => ({
  fetchIssueLabels: vi.fn(),
  attachLabel: vi.fn(),
  detachLabel: vi.fn(),
  fetchLabelDefinitions: vi.fn(),
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

const mockLabels: Label[] = [
  { id: 'l1', name: 'Bug', color: '#ef4444', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'l2', name: 'Feature', color: '#22c55e', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
]

describe('IssueDetailPage Label Attach/Detach', () => {
  beforeEach(async () => {
    useIssuesStore.setState({
      issues: [mockIssue],
      selectedIssueId: null,
      filters: { status: null, assigneeId: null, priority: null, projectId: null, search: null, labelIds: [], cycleId: null },
      cursor: null,
      hasMore: true,
      isLoading: false,
      error: null,
    })
    useIssueLabelsStore.setState({
      labelsByIssue: {},
      isLoading: false,
      error: null,
    })
    useToastStore.setState({ toasts: [] })
    useCacheStore.getState().clear()
    vi.clearAllMocks()

    // Set up label definitions so LabelPicker can show labels
    const { fetchLabelDefinitions } = await import('@/entities/label/api')
    vi.mocked(fetchLabelDefinitions).mockResolvedValue({ data: mockLabels })
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

  it('displays issue labels from the labels store', async () => {
    const { fetchIssueLabels } = await import('@/entities/label/api')
    vi.mocked(fetchIssueLabels).mockResolvedValue({ data: mockLabels })

    renderPage()

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

    renderPage()

    await screen.findByText('Test Issue')

    const user = userEvent.setup()
    const addButton = screen.getByRole('button', { name: /Add label to issue/i })
    await user.click(addButton)

    // LabelPicker opens — pick "Bug"
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

    renderPage()

    await screen.findByText('Test Issue')

    // Wait for labels to render
    await screen.findByText('Bug')

    const user = userEvent.setup()
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

    renderPage()

    await screen.findByText('Test Issue')

    const user = userEvent.setup()
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

    renderPage()

    await screen.findByText('Test Issue')

    await screen.findByText('Bug')

    const user = userEvent.setup()
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

    renderPage()

    await screen.findByText('Test Issue')

    const user = userEvent.setup()
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

    renderPage()

    await screen.findByText('Test Issue')

    await screen.findByText('Bug')

    const user = userEvent.setup()
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
