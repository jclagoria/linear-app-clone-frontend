import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
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
    // Reset issues store to avoid cross-test leakage
    useIssuesStore.setState({
      issues: [],
      selectedIssueId: null,
      filters: { status: null, assigneeId: null, priority: null, projectId: null, search: null, labelIds: [], cycleId: null },
      cursor: null,
      hasMore: true,
      isLoading: false,
      error: null,
    })
  })

  it('renders DashboardPage at /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route index element={<DashboardPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
  })

  it('renders IssuesPage at /issues', async () => {
    render(
      <MemoryRouter initialEntries={['/issues']}>
        <Routes>
          <Route path="issues" element={<IssuesPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(await screen.findByRole('heading', { name: /issues/i })).toBeInTheDocument()
  })

  it('renders IssueDetailPage at /issues/:id', async () => {
    useIssuesStore.setState({
      issues: [mockIssue],
      selectedIssueId: null,
      filters: { status: null, assigneeId: null, priority: null, projectId: null, search: null, labelIds: [], cycleId: null },
      cursor: null,
      hasMore: true,
      isLoading: false,
      error: null,
    })

    render(
      <MemoryRouter initialEntries={['/issues/abc-123']}>
        <Routes>
          <Route path="issues/:id" element={<IssueDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    // Wait for comments/labels fetches to resolve, then validate issue identifier renders
    expect(await screen.findByText(/ABC-123/i)).toBeInTheDocument()
  })

  it('renders ProjectsPage at /projects', () => {
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <Routes>
          <Route path="projects" element={<ProjectsPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText(/projects/i)).toBeInTheDocument()
  })

  it('renders ProjectDetailPage at /projects/:id', () => {
    render(
      <MemoryRouter initialEntries={['/projects/p1']}>
        <Routes>
          <Route path="projects/:id" element={<ProjectDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText(/p1/i)).toBeInTheDocument()
  })

  it('renders CyclesPage at /cycles', () => {
    render(
      <MemoryRouter initialEntries={['/cycles']}>
        <Routes>
          <Route path="cycles" element={<CyclesPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText(/cycles/i)).toBeInTheDocument()
  })

  it('renders SettingsPage at /settings', () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <Routes>
          <Route path="settings" element={<SettingsPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText(/settings/i)).toBeInTheDocument()
  })
})
