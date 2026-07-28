import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { renderWithRouter, resetStores } from './test-utils'
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

function LayoutWithRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<div data-testid="page-content">Page Content</div>} />
      </Route>
    </Routes>
  )
}

describe('Layout Integration', () => {
  beforeEach(() => {
    resetStores()
    useUIStore.setState({ sidebarCollapsed: false, theme: 'light' })
    useWebSocketStore.setState({ notifications: [] })
  })

  it('renders sidebar, header, and outlet content', () => {
    renderWithRouter(<LayoutWithRoutes />, { initialEntries: ['/'] })

    const navElements = screen.getAllByLabelText('Main navigation')
    expect(navElements.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByTestId('page-content')).toHaveTextContent('Page Content')
  })

  it('renders nav items', () => {
    renderWithRouter(<LayoutWithRoutes />, { initialEntries: ['/'] })

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
    renderWithRouter(<LayoutWithRoutes />, { initialEntries: ['/'] })

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

    renderWithRouter(<LayoutWithRoutes />, { initialEntries: ['/'] })

    expect(screen.getByLabelText('Toggle notifications')).toBeInTheDocument()
  })
})
