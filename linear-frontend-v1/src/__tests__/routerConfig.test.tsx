import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter, resetStores } from './test-utils'
import { DashboardPage } from '@/pages/DashboardPage'
import { IssuesPage } from '@/pages/IssuesPage'
import { IssueDetailPage } from '@/pages/IssueDetailPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { ProjectDetailPage } from '@/pages/ProjectDetailPage'
import { CyclesPage } from '@/pages/CyclesPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { useIssuesStore } from '@/entities/issue/model/store'

vi.mock('@/features/auth/ui/AuthGuard', () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mocks for IssueDetailPage API calls
vi.mock('@/entities/issue/api', () => ({
  fetchComments: vi.fn().mockResolvedValue({ data: [] }),
  updateIssue: vi.fn(),
  deleteIssue: vi.fn(),
  changeIssueStatus: vi.fn(),
}))

vi.mock('@/entities/label/api', () => ({
  fetchIssueLabels: vi.fn().mockResolvedValue({ data: [] }),
  fetchLabelDefinitions: vi.fn().mockResolvedValue({ data: [] }),
  attachLabel: vi.fn(),
  detachLabel: vi.fn(),
}))

const mockIssue = {
  id: 'abc-123',
  title: 'Test Issue',
  description: 'Test description',
  status: 'Todo',
  priority: 2,
  assigneeId: null,
  assigneeName: null,
  projectId: null,
  cycleId: null,
  labels: [],
  identifier: 'ABC-123',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

describe('Router Config', () => {
  beforeEach(() => {
    resetStores()
  })

  it('renders DashboardPage at /', () => {
    renderWithRouter(<DashboardPage />, { initialEntries: ['/'] })
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
  })

  it('renders IssuesPage at /issues', async () => {
    renderWithRouter(<IssuesPage />, {
      initialEntries: ['/issues'],
      routePath: 'issues',
    })
    expect(await screen.findByRole('heading', { name: /issues/i })).toBeInTheDocument()
  })

  it('renders IssueDetailPage at /issues/:id', async () => {
    useIssuesStore.setState({ issues: [mockIssue] })

    renderWithRouter(<IssueDetailPage />, {
      initialEntries: ['/issues/abc-123'],
      routePath: 'issues/:id',
    })

    expect(await screen.findByText(/ABC-123/i)).toBeInTheDocument()
  })

  it('renders ProjectsPage at /projects', () => {
    renderWithRouter(<ProjectsPage />, {
      initialEntries: ['/projects'],
      routePath: 'projects',
    })
    expect(screen.getByRole('heading', { level: 1, name: /projects/i })).toBeInTheDocument()
  })

  it('renders ProjectDetailPage at /projects/:id', () => {
    renderWithRouter(<ProjectDetailPage />, {
      initialEntries: ['/projects/p1'],
      routePath: 'projects/:id',
    })
    expect(screen.getByText(/p1/i)).toBeInTheDocument()
  })

  it('renders CyclesPage at /cycles', () => {
    renderWithRouter(<CyclesPage />, {
      initialEntries: ['/cycles'],
      routePath: 'cycles',
    })
    expect(screen.getByRole('heading', { level: 1, name: /cycles/i })).toBeInTheDocument()
  })

  it('renders SettingsPage at /settings', () => {
    renderWithRouter(<SettingsPage />, {
      initialEntries: ['/settings'],
      routePath: 'settings',
    })
    expect(screen.getByText(/settings/i)).toBeInTheDocument()
  })
})
