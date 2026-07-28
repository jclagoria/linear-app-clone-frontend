import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import { renderWithRouter } from './test-utils'
import { AuthGuard } from '@/features/auth/ui/AuthGuard'

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '@/features/auth/hooks/useAuth'
const mockedUseAuth = vi.mocked(useAuth)

function ProtectedPage() {
  return <div>Protected Content</div>
}

function AuthGuardWithRoutes() {
  return (
    <Routes>
      <Route element={<AuthGuard />}>
        <Route path="/protected" element={<ProtectedPage />} />
        <Route path="/issues" element={<ProtectedPage />} />
      </Route>
    </Routes>
  )
}

describe('AuthGuard', () => {
  beforeEach(() => {
    mockedUseAuth.mockReset()
  })

  it('renders outlet when authenticated', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: '1', email: 'test@example.com', name: 'Test' },
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    renderWithRouter(<AuthGuardWithRoutes />, { initialEntries: ['/protected'] })
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects to /login when unauthenticated', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    renderWithRouter(<AuthGuardWithRoutes />, { initialEntries: ['/issues'] })
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('shows loading state during auth check', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
    })

    renderWithRouter(<AuthGuardWithRoutes />, { initialEntries: ['/protected'] })
    expect(screen.getByText(/checking authentication/i)).toBeInTheDocument()
  })
})
