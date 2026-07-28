import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegisterForm } from '../RegisterForm'
import { useAuthStore } from '@/entities/session/model/store'

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}))

describe('RegisterForm', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      fieldErrors: null,
    })
    vi.restoreAllMocks()
  })

  it('renders all form fields', () => {
    render(<RegisterForm />)

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })

  it('renders submit button with correct text', () => {
    render(<RegisterForm />)

    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('renders sign in link when onSwitchToLogin is provided', () => {
    const onSwitchToLogin = vi.fn()
    render(<RegisterForm onSwitchToLogin={onSwitchToLogin} />)

    expect(screen.getByText(/sign in/i)).toBeInTheDocument()
  })

  it('does not render sign in link when onSwitchToLogin is not provided', () => {
    render(<RegisterForm />)

    expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument()
  })

  it('calls onSwitchToLogin when sign in link is clicked', () => {
    const onSwitchToLogin = vi.fn()
    render(<RegisterForm onSwitchToLogin={onSwitchToLogin} />)

    fireEvent.click(screen.getByText(/sign in/i))

    expect(onSwitchToLogin).toHaveBeenCalled()
  })

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)

    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
  })

  it('shows server error message when error is present', () => {
    useAuthStore.setState({ error: 'An account with this email already exists' })
    render(<RegisterForm />)

    expect(screen.getByRole('alert')).toHaveTextContent(/account with this email already exists/i)
  })

  it('disables form fields when loading', () => {
    useAuthStore.setState({ isLoading: true })
    render(<RegisterForm />)

    expect(screen.getByLabelText(/name/i)).toBeDisabled()
    expect(screen.getByLabelText(/email/i)).toBeDisabled()
    expect(screen.getByLabelText(/^password$/i)).toBeDisabled()
    expect(screen.getByLabelText(/confirm password/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled()
  })

  it('has proper accessibility attributes', () => {
    render(<RegisterForm />)

    const form = screen.getByRole('form', { name: /register/i })
    expect(form).toHaveAttribute('novalidate')
  })
})
