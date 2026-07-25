import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { KeyboardProvider } from '@/app/providers/KeyboardProvider'
import { useKeyboardStore } from '../../model/useKeyboardStore'

function renderWithRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <KeyboardProvider>
        <div data-testid="child">App Content</div>
      </KeyboardProvider>
    </MemoryRouter>,
  )
}

describe('KeyboardProvider', () => {
  beforeEach(() => {
    useKeyboardStore.setState({
      context: 'global',
      selectedIssueId: null,
      customizations: {},
      isHelpModalOpen: false,
      pendingSequence: [],
    })
  })

  it('renders children', () => {
    renderWithRoute('/issues')
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('sets list context on /issues route', () => {
    renderWithRoute('/issues')
    expect(useKeyboardStore.getState().context).toBe('list')
  })

  it('sets list context on /projects route', () => {
    renderWithRoute('/projects')
    expect(useKeyboardStore.getState().context).toBe('list')
  })

  it('sets detail context on /issues/:id route', () => {
    renderWithRoute('/issues/123')
    expect(useKeyboardStore.getState().context).toBe('detail')
  })

  it('sets detail context on /projects/:id route', () => {
    renderWithRoute('/projects/abc')
    expect(useKeyboardStore.getState().context).toBe('detail')
  })

  it('sets global context on /settings/keyboard route', () => {
    renderWithRoute('/settings/keyboard')
    expect(useKeyboardStore.getState().context).toBe('global')
  })

  it('sets global context on root path', () => {
    renderWithRoute('/')
    expect(useKeyboardStore.getState().context).toBe('global')
  })

  it('dispatches keyboard-shortcut events via handleKeyDown', () => {
    renderWithRoute('/issues')

    const spy = vi.fn()
    window.addEventListener('keyboard-shortcut', spy)

    fireEvent.keyDown(document, { key: 'j' })

    expect(spy).toHaveBeenCalled()
    window.removeEventListener('keyboard-shortcut', spy)
  })

  it('does not dispatch keyboard-shortcut events for input elements', () => {
    renderWithRoute('/issues')

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
    renderWithRoute('/issues')

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

    render(
      <MemoryRouter initialEntries={['/']}>
        <KeyboardProvider>
          <TestConsumer />
        </KeyboardProvider>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('consumer')).toBeInTheDocument()
  })
})
