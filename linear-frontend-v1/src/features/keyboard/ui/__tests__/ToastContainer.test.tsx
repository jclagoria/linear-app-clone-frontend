import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { useToastStore } from '@/shared/stores/toastStore'
import { ToastContainer } from '../ToastContainer'
import { renderWithRouter, resetStores } from '@/__tests__/test-utils'

describe('ToastContainer', () => {
  beforeEach(() => {
    resetStores()
  })

  it('renders children', () => {
    renderWithRouter(
      <ToastContainer>
        <div data-testid="child">Content</div>
      </ToastContainer>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('adds toast on keyboard-shortcut event', () => {
    renderWithRouter(
      <ToastContainer>
        <div />
      </ToastContainer>,
    )

    window.dispatchEvent(
      new CustomEvent('keyboard-shortcut', { detail: { action: 'create-issue' } }),
    )

    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0].title).toBe('Creating new issue…')
    expect(toasts[0].variant).toBe('info')
  })

  it('adds multiple toasts for multiple events', () => {
    renderWithRouter(
      <ToastContainer>
        <div />
      </ToastContainer>,
    )

    window.dispatchEvent(
      new CustomEvent('keyboard-shortcut', { detail: { action: 'navigate-down' } }),
    )
    window.dispatchEvent(
      new CustomEvent('keyboard-shortcut', { detail: { action: 'navigate-up' } }),
    )

    expect(useToastStore.getState().toasts).toHaveLength(2)
  })

  it('shows delete-issue toast with error variant', () => {
    renderWithRouter(
      <ToastContainer>
        <div />
      </ToastContainer>,
    )

    window.dispatchEvent(
      new CustomEvent('keyboard-shortcut', { detail: { action: 'delete-issue' } }),
    )

    const toasts = useToastStore.getState().toasts
    expect(toasts[0].title).toBe('Delete issue?')
    expect(toasts[0].variant).toBe('error')
  })

  it('removes toast on dismiss', async () => {
    const { user } = renderWithRouter(
      <ToastContainer>
        <div />
      </ToastContainer>,
    )

    window.dispatchEvent(
      new CustomEvent('keyboard-shortcut', { detail: { action: 'search' } }),
    )

    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(1)

    const { removeToast } = useToastStore.getState()
    removeToast(toasts[0].id)

    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('cleans up event listener on unmount', () => {
    const { unmount } = renderWithRouter(
      <ToastContainer>
        <div />
      </ToastContainer>,
    )

    unmount()

    window.dispatchEvent(
      new CustomEvent('keyboard-shortcut', { detail: { action: 'create-issue' } }),
    )

    expect(useToastStore.getState().toasts).toHaveLength(0)
  })
})
