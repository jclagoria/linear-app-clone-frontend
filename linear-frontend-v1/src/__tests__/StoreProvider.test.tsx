import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { StoreProvider } from '@/app/StoreProvider'
import { resetStores } from './test-utils'

describe('StoreProvider', () => {
  beforeEach(() => {
    resetStores()
  })

  it('renders children after hydration', async () => {
    const { unmount } = (
      await import('@testing-library/react')
    ).render(
      <StoreProvider>
        <div data-testid="content">App Content</div>
      </StoreProvider>,
    )

    const content = await screen.findByTestId('content')
    expect(content).toBeInTheDocument()
    unmount()
  })

  it('shows initialising state while hydrating', async () => {
    const { useAuthStore } = await import('@/entities/session/model/store')
    useAuthStore.setState({ isLoading: true })

    const { unmount } = (
      await import('@testing-library/react')
    ).render(
      <StoreProvider>
        <div data-testid="content">App Content</div>
      </StoreProvider>,
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
    unmount()
  })
})
