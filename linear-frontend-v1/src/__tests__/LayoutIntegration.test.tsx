import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/app/AppLayout'
import { useUIStore } from '@/shared/stores/uiStore'
import { useWebSocketStore } from '@/shared/stores/websocketStore'

vi.mock('@/app/providers/WebSocketProvider', () => ({
  useWebSocket: () => ({
    isConnected: false,
    connectionStatus: 'disconnected',
    reconnect: vi.fn(),
    disconnect: vi.fn(),
  }),
}))

function renderLayout(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            index
            element={<div data-testid="page-content">Page Content</div>}
          />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('Layout Integration', () => {
  beforeEach(() => {
    useUIStore.setState({ sidebarCollapsed: false, theme: 'light' })
    useWebSocketStore.setState({ notifications: [] })
  })

  it('renders sidebar, header, and outlet content', () => {
    renderLayout()

    // Sidebar - there are two aria-label="Main navigation" elements
    // (desktop sidebar + mobile overlay), so use getAllByLabelText
    const navElements = screen.getAllByLabelText('Main navigation')
    expect(navElements.length).toBeGreaterThanOrEqual(1)

    // Header (banner)
    expect(screen.getByRole('banner')).toBeInTheDocument()

    // Main content
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByTestId('page-content')).toHaveTextContent('Page Content')
  })

  it('renders nav items', () => {
    renderLayout()
    // Both sidebar and mobile overlay render nav items, so use getAllByText
    const dashboardLinks = screen.getAllByText('Dashboard')
    expect(dashboardLinks.length).toBeGreaterThanOrEqual(1)

    const issuesLinks = screen.getAllByText('Issues')
    expect(issuesLinks.length).toBeGreaterThanOrEqual(1)

    const projectsLinks = screen.getAllByText('Projects')
    expect(projectsLinks.length).toBeGreaterThanOrEqual(1)

    const cyclesLinks = screen.getAllByText('Cycles')
    expect(cyclesLinks.length).toBeGreaterThanOrEqual(1)
  })

  it('renders search trigger and notification bell in header', () => {
    renderLayout()
    expect(screen.getByLabelText('Open command palette')).toBeInTheDocument()
    expect(screen.getByLabelText('Toggle notifications')).toBeInTheDocument()
  })

  it('shows notification bell when notifications exist', () => {
    useWebSocketStore.setState({
      notifications: [
        {
          id: 'n1',
          type: 'mention',
          title: 'New mention',
          message: 'You were mentioned',
          read: false,
          createdAt: new Date().toISOString(),
        },
      ],
    })

    renderLayout()
    expect(screen.getByLabelText('Toggle notifications')).toBeInTheDocument()
  })
})
