import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import { KeyboardProvider } from '@/app/providers/KeyboardProvider'
import { useKeyboardStore } from '../../model/useKeyboardStore'
import { renderWithRouter, resetStores } from '@/__tests__/test-utils'

function KeyboardProviderWithChild({ route }: { route: string }) {
  return (
    <Routes>
      <Route path={route} element={
        <KeyboardProvider>
          <div data-testid="child">App Content</div>
        </KeyboardProvider>
      } />
    </Routes>
  )
}

describe('KeyboardProvider', () => {
  beforeEach(() => {
    resetStores()
    useKeyboardStore.setState({
      context: 'global',
      selectedIssueId: null,
      customizations: {},
      isHelpModalOpen: false,
      pendingSequence: [],
    })
  })

  it('renders children', () => {
    renderWithRouter(<KeyboardProviderWithChild route="/issues" />, { initialEntries: ['/issues'] })
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('sets list context on /issues route', () => {
    renderWithRouter(<KeyboardProviderWithChild route="/issues" />, { initialEntries: ['/issues'] })
    expect(useKeyboardStore.getState().context).toBe('list')
  })

  it('sets list context on /projects route', () => {
    renderWithRouter(<KeyboardProviderWithChild route="/projects" />, { initialEntries: ['/projects'] })
    expect(useKeyboardStore.getState().context).toBe('list')
  })

  it('sets detail context on /issues/:id route', () => {
    renderWithRouter(<KeyboardProviderWithChild route="/issues/:id" />, { initialEntries: ['/issues/123'] })
    expect(useKeyboardStore.getState().context).toBe('detail')
  })

  it('sets detail context on /projects/:id route', () => {
    renderWithRouter(<KeyboardProviderWithChild route="/projects/:id" />, { initialEntries: ['/projects/abc'] })
    expect(useKeyboardStore.getState().context).toBe('detail')
  })

  it('sets global context on /settings/keyboard route', () => {
    renderWithRouter(<KeyboardProviderWithChild route="/settings/keyboard" />, { initialEntries: ['/settings/keyboard'] })
    expect(useKeyboardStore.getState().context).toBe('global')
  })

  it('sets global context on root path', () => {
    renderWithRouter(<KeyboardProviderWithChild route="/" />, { initialEntries: ['/'] })
    expect(useKeyboardStore.getState().context).toBe('global')
  })

  it('dispatches keyboard-shortcut events via handleKeyDown', () => {
    renderWithRouter(<KeyboardProviderWithChild route="/issues" />, { initialEntries: ['/issues'] })

    const spy = vi.fn()
    window.addEventListener('keyboard-shortcut', spy)

    fireEvent.keyDown(document, { key: 'j' })

    expect(spy).toHaveBeenCalled()
    window.removeEventListener('keyboard-shortcut', spy)
  })

  it('does not dispatch keyboard-shortcut events for input elements', () => {
    renderWithRouter(<KeyboardProviderWithChild route="/issues" />, { initialEntries: ['/issues'] })

    const spy = vi.fn()
    window.addEventListener('keyboard-shortcut', spy)

    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()

    fireEvent.keyDown(input, { key: 'j' })

    expect(spy).not.toHaveBeenCalled()
    document.body.removeChild(input)
    window.removeEventListener('keyboard-shortcut', spy)
  })

  it('does not dispatch keyboard-shortcut events for textarea elements', () => {
    renderWithRouter(<KeyboardProviderWithChild route="/issues" />, { initialEntries: ['/issues'] })

    const spy = vi.fn()
    window.addEventListener('keyboard-shortcut', spy)

    const textarea = document.createElement('textarea')
    document.body.appendChild(textarea)
    textarea.focus()

    fireEvent.keyDown(textarea, { key: 'j' })

    expect(spy).not.toHaveBeenCalled()
    document.body.removeChild(textarea)
    window.removeEventListener('keyboard-shortcut', spy)
  })

  it('provides keyboard context via useKeyboard hook', () => {
    function TestConsumer() {
      return <div data-testid="consumer">Consumer rendered</div>
    }

    renderWithRouter(
      <KeyboardProvider>
        <TestConsumer />
      </KeyboardProvider>,
      { initialEntries: ['/'] },
    )

    expect(screen.getByTestId('consumer')).toBeInTheDocument()
  })
})
