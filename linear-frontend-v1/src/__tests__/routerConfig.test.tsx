import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { DashboardPage } from '@/pages/DashboardPage'
import { IssuesPage } from '@/pages/IssuesPage'
import { IssueDetailPage } from '@/pages/IssueDetailPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { ProjectDetailPage } from '@/pages/ProjectDetailPage'
import { CyclesPage } from '@/pages/CyclesPage'
import { SettingsPage } from '@/pages/SettingsPage'

vi.mock('@/features/auth/ui/AuthGuard', () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('Router Config', () => {
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

  it('renders IssuesPage at /issues', () => {
    render(
      <MemoryRouter initialEntries={['/issues']}>
        <Routes>
          <Route path="issues" element={<IssuesPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText(/issues/i)).toBeInTheDocument()
  })

  it('renders IssueDetailPage at /issues/:id', () => {
    render(
      <MemoryRouter initialEntries={['/issues/abc-123']}>
        <Routes>
          <Route path="issues/:id" element={<IssueDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText(/abc-123/i)).toBeInTheDocument()
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
