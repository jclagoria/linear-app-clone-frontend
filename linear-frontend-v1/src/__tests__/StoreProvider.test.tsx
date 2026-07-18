import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StoreProvider } from '@/app/StoreProvider'
import { useAuthStore } from '@/entities/session/model/store'

describe('StoreProvider', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  })

  it('renders children after hydration', async () => {
    render(
      <StoreProvider>
        <div data-testid="content">App Content</div>
      </StoreProvider>,
    )

    const content = await screen.findByTestId('content')
    expect(content).toBeInTheDocument()
  })

  it('shows initialising state while hydrating', () => {
    useAuthStore.setState({ isLoading: true })

    render(
      <StoreProvider>
        <div data-testid="content">App Content</div>
      </StoreProvider>,
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
