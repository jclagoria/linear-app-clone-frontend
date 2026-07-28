import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RegisterPage } from '../RegisterPage'
import { useAuthStore } from '@/entities/session/model/store'
import { useAuth } from '@/features/auth/hooks/useAuth'

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to} />,
  useNavigate: () => vi.fn(),
}))

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
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
    vi.clearAllMocks()
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    })
  })

  it('renders register form when not authenticated', () => {
    render(<RegisterPage />)

    expect(screen.getByTestId('register-form')).toBeInTheDocument()
  })

  it('renders page heading', () => {
    render(<RegisterPage />)

    expect(screen.getByText('Create your account')).toBeInTheDocument()
    expect(screen.getByText('Get started with your free account')).toBeInTheDocument()
  })

  it('redirects to dashboard when already authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    })

    render(<RegisterPage />)

    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/')
  })

  it('shows loading state when hydrating', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    })

    render(<RegisterPage />)

    expect(screen.getByText('Checking session...')).toBeInTheDocument()
    expect(screen.queryByTestId('register-form')).not.toBeInTheDocument()
  })

  it('passes onSwitchToLogin to RegisterForm', () => {
    render(<RegisterPage />)

    const switchButton = screen.getByText('Switch to Login')
    expect(switchButton).toBeInTheDocument()
  })
})
