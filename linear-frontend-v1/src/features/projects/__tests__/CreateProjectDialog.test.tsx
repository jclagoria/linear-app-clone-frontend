import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { renderWithRouter, resetStores } from '@/__tests__/test-utils'
import { CreateProjectDialog } from '../ui/CreateProjectDialog'
import { useProjectsStore } from '@/features/realtime/lib/project-store'
import { useToastStore } from '@/shared/stores/toastStore'
import * as projectsApi from '@/shared/api/projects'

vi.mock('@/shared/api/projects', () => ({
  createProject: vi.fn(),
}))

const teamId = '550e8400-e29b-41d4-a716-446655440000'

const mockProject = {
  id: 'new-p1',
  name: 'Test Project',
  description: 'A test project',
  icon: '',
  status: 'planned',
  teamId,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
}

function fillAndSubmit() {
  const nameInput = screen.getByLabelText('Name')
  fireEvent.change(nameInput, { target: { value: 'Test Project' } })
  fireEvent.click(screen.getByText('Create Project'))
}

describe('CreateProjectDialog', () => {
  beforeEach(() => {
    resetStores()
    useProjectsStore.setState({
      projects: [],
      isLoading: false,
      error: null,
      cursor: null,
      hasMore: true,
      teamId: null,
      statusFilter: null,
    })
    vi.clearAllMocks()
  })

  it('opens and renders the form when isOpen is true', () => {
    renderWithRouter(
      <CreateProjectDialog teamId={teamId} isOpen={true} onClose={vi.fn()} />,
    )

    expect(screen.getByText('New Project')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Start date')).toBeInTheDocument()
    expect(screen.getByLabelText('Target date')).toBeInTheDocument()
    expect(screen.getByText('Create Project')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    renderWithRouter(
      <CreateProjectDialog teamId={teamId} isOpen={false} onClose={vi.fn()} />,
    )

    expect(screen.queryByText('New Project')).not.toBeInTheDocument()
  })

  it('calls onClose when cancel is clicked', () => {
    const onClose = vi.fn()

    renderWithRouter(
      <CreateProjectDialog teamId={teamId} isOpen={true} onClose={onClose} />,
    )

    fireEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('creates a project and updates the store on success', async () => {
    vi.mocked(projectsApi.createProject).mockResolvedValue(mockProject)

    renderWithRouter(
      <CreateProjectDialog
        teamId={teamId}
        isOpen={true}
        onClose={vi.fn()}
      />,
    )

    fillAndSubmit()

    await waitFor(() => {
      expect(useProjectsStore.getState().projects).toHaveLength(1)
    })

    expect(useProjectsStore.getState().projects[0]).toEqual(mockProject)
  })

  it('shows error toast on ForbiddenError', async () => {
    vi.mocked(projectsApi.createProject).mockRejectedValue(
      new (await import('@/shared/lib/api-client/errors')).ForbiddenError(
        "You don't have permission to create projects",
      ),
    )

    renderWithRouter(
      <CreateProjectDialog
        teamId={teamId}
        isOpen={true}
        onClose={vi.fn()}
      />,
    )

    fillAndSubmit()

    await waitFor(() => {
      const toasts = useToastStore.getState().toasts
      expect(toasts.length).toBeGreaterThan(0)
      expect(toasts[toasts.length - 1].title).toBe(
        "You don't have permission to create projects",
      )
    })
  })

  it('shows inline server error on BusinessRuleError', async () => {
    vi.mocked(projectsApi.createProject).mockRejectedValue(
      new (await import('@/shared/lib/api-client/errors')).BusinessRuleError(
        'Project limit reached for this team',
      ),
    )

    renderWithRouter(
      <CreateProjectDialog
        teamId={teamId}
        isOpen={true}
        onClose={vi.fn()}
      />,
    )

    fillAndSubmit()

    await waitFor(() => {
      expect(
        screen.getByText('Project limit reached for this team'),
      ).toBeInTheDocument()
    })
  })
})
