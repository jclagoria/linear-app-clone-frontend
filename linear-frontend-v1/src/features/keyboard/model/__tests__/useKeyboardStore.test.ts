import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useKeyboardStore } from '../useKeyboardStore'

describe('useKeyboardStore', () => {
  beforeEach(() => {
    useKeyboardStore.setState({
      context: 'global',
      selectedIssueId: null,
      customizations: {},
      isHelpModalOpen: false,
      pendingSequence: [],
    })
    localStorage.clear()
  })

  it('sets context', () => {
    useKeyboardStore.getState().setContext('list')
    expect(useKeyboardStore.getState().context).toBe('list')
  })

  it('sets selected issue', () => {
    useKeyboardStore.getState().setSelectedIssue('issue-1')
    expect(useKeyboardStore.getState().selectedIssueId).toBe('issue-1')
  })

  it('clears selected issue', () => {
    useKeyboardStore.getState().setSelectedIssue('issue-1')
    useKeyboardStore.getState().setSelectedIssue(null)
    expect(useKeyboardStore.getState().selectedIssueId).toBeNull()
  })

  it('toggles help modal', () => {
    useKeyboardStore.getState().setHelpModalOpen(true)
    expect(useKeyboardStore.getState().isHelpModalOpen).toBe(true)

    useKeyboardStore.getState().setHelpModalOpen(false)
    expect(useKeyboardStore.getState().isHelpModalOpen).toBe(false)
  })

  it('updates customization', () => {
    useKeyboardStore.getState().updateCustomization('create-issue', 'X')
    expect(useKeyboardStore.getState().customizations['create-issue']).toBe('X')
  })

  it('saves customization to localStorage', () => {
    useKeyboardStore.getState().updateCustomization('create-issue', 'X')
    const stored = JSON.parse(localStorage.getItem('keyboard-shortcuts-customizations') ?? '{}')
    expect(stored['create-issue']).toBe('X')
  })

  it('loads customizations from localStorage', () => {
    localStorage.setItem(
      'keyboard-shortcuts-customizations',
      JSON.stringify({ 'create-issue': 'X' }),
    )

    const stored = JSON.parse(localStorage.getItem('keyboard-shortcuts-customizations') ?? '{}')
    useKeyboardStore.setState({ customizations: stored })
    const store = useKeyboardStore.getState()
    expect(store.customizations['create-issue']).toBe('X')
  })

  it('resets customizations', () => {
    useKeyboardStore.getState().updateCustomization('create-issue', 'X')
    useKeyboardStore.getState().resetCustomizations()
    expect(useKeyboardStore.getState().customizations).toEqual({})
  })

  it('handles keydown event for help modal', () => {
    const event = new KeyboardEvent('keydown', { key: '?' })
    useKeyboardStore.getState().handleKeyDown(event)
    expect(useKeyboardStore.getState().isHelpModalOpen).toBe(true)
  })

  it('handles escape to close help modal', () => {
    useKeyboardStore.getState().setHelpModalOpen(true)
    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    useKeyboardStore.getState().handleKeyDown(event)
    expect(useKeyboardStore.getState().isHelpModalOpen).toBe(false)
  })

  it('dispatches keyboard-shortcut event', () => {
    const spy = vi.fn()
    window.addEventListener('keyboard-shortcut', spy)

    const event = new KeyboardEvent('keydown', { key: 'c' })
    useKeyboardStore.getState().handleKeyDown(event)

    expect(spy).toHaveBeenCalled()
    window.removeEventListener('keyboard-shortcut', spy)
  })
})
