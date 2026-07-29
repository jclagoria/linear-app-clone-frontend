import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter, resetStores } from '@/__tests__/test-utils'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { useProjectsStore } from '@/features/realtime/lib/project-store'

vi.mock('@/shared/api/projects', () => ({
  listProjects: vi.fn(),
}))

beforeAll(() => {
  vi.stubGlobal('IntersectionObserver', vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })))
})

const mockProjects = [
  { id: 'p1', name: 'Project Alpha', description: 'First project', icon: '🚀', status: 'active', teamId: 't1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'p2', name: 'Project Beta', description: 'Second project', icon: '📊', status: 'planned', teamId: 't1', createdAt: '2024-01-02', updatedAt: '2024-01-02' },
]

describe('ProjectsPage', () => {
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

  it('shows loading spinner on mount then renders projects', async () => {
    const { listProjects } = await import('@/shared/api/projects')
    vi.mocked(listProjects).mockResolvedValue({
      data: mockProjects,
      pagination: { nextCursor: null, hasMore: false },
    })

    renderWithRouter(<ProjectsPage />, { initialEntries: ['/projects'] })

    expect(screen.getByText('Loading projects')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Project Alpha')).toBeInTheDocument()
    })

    expect(screen.getByText('Project Beta')).toBeInTheDocument()
    expect(screen.getByText('No more projects to show')).toBeInTheDocument()
  })

  it('shows error message with retry on failure', async () => {
    const { listProjects } = await import('@/shared/api/projects')
    vi.mocked(listProjects).mockRejectedValue(new Error('Failed to fetch'))

    renderWithRouter(<ProjectsPage />)

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument()
    })

    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('shows empty state when no projects exist', async () => {
    const { listProjects } = await import('@/shared/api/projects')
    vi.mocked(listProjects).mockResolvedValue({
      data: [],
      pagination: { nextCursor: null, hasMore: false },
    })

    renderWithRouter(<ProjectsPage />)

    await waitFor(() => {
      expect(screen.getByText('No projects yet')).toBeInTheDocument()
    })
  })

  it('shows filtered empty state when filter yields no results', async () => {
    const { listProjects } = await import('@/shared/api/projects')
    vi.mocked(listProjects).mockResolvedValue({
      data: [],
      pagination: { nextCursor: null, hasMore: false },
    })

    renderWithRouter(<ProjectsPage />)

    await waitFor(() => {
      expect(screen.getByText('No projects yet')).toBeInTheDocument()
    })

    const filterButton = screen.getByRole('combobox', { name: /filter projects by status/i })
    await userEvent.click(filterButton)

    const completedOption = screen.getByText('Completed')
    await userEvent.click(completedOption)

    await waitFor(() => {
      expect(screen.getByText('No projects match this filter')).toBeInTheDocument()
    })
  })

  it('calls fetchProjects with status filter when filter changes', async () => {
    const { listProjects } = await import('@/shared/api/projects')
    vi.mocked(listProjects).mockResolvedValue({
      data: mockProjects,
      pagination: { nextCursor: null, hasMore: false },
    })

    renderWithRouter(<ProjectsPage />)

    await waitFor(() => {
      expect(screen.getByText('Project Alpha')).toBeInTheDocument()
    })

    const filterButton = screen.getByRole('combobox', { name: /filter projects by status/i })
    await userEvent.click(filterButton)

    const plannedOption = screen.getByText('Planned')
    await userEvent.click(plannedOption)

    await waitFor(() => {
      expect(listProjects).toHaveBeenCalledWith(expect.objectContaining({ status: 'planned' }))
    })
  })
})
