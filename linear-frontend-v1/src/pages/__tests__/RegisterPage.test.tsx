import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { RegisterPage } from '../RegisterPage'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { renderWithRouter, resetStores } from '../../__tests__/test-utils'

// Mock react-router-dom (partial mock - keep MemoryRouter for renderWithRouter)
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to} />,
    useNavigate: () => vi.fn(),
  }
})

// Mock the useAuth hook
vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    isAuthenticated: false,
    isLoading: false,
  })),
}))

// Mock the RegisterForm component
vi.mock('@/features/auth/ui/RegisterForm', () => ({
  RegisterForm: ({ onSwitchToLogin }: { onSwitchToLogin?: () => void }) => (
    <div data-testid="register-form">
      <button onClick={onSwitchToLogin}>Switch to Login</button>
    </div>
  ),
}))

describe('RegisterPage', () => {
  beforeEach(() => {
    resetStores()
    vi.clearAllMocks()
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    })
  })

  it('renders register form when not authenticated', () => {
    renderWithRouter(<RegisterPage />)

    expect(screen.getByTestId('register-form')).toBeInTheDocument()
  })

  it('renders page heading', () => {
    renderWithRouter(<RegisterPage />)

    expect(screen.getByText('Create your account')).toBeInTheDocument()
    expect(screen.getByText('Get started with your free account')).toBeInTheDocument()
  })

  it('redirects to dashboard when already authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    })

    renderWithRouter(<RegisterPage />)

    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/')
  })

  it('shows loading state when hydrating', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    })

    renderWithRouter(<RegisterPage />)

    expect(screen.getByText('Checking session...')).toBeInTheDocument()
    expect(screen.queryByTestId('register-form')).not.toBeInTheDocument()
  })

  it('passes onSwitchToLogin to RegisterForm', () => {
    renderWithRouter(<RegisterPage />)

    const switchButton = screen.getByText('Switch to Login')
    expect(switchButton).toBeInTheDocument()
  })
})
