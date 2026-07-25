import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ShortcutSettingsRow } from '../ShortcutSettingsRow'
import { useKeyboardStore } from '../../model/useKeyboardStore'

describe('ShortcutSettingsRow', () => {
  beforeEach(() => {
    useKeyboardStore.setState({
      customizations: {},
      context: 'global',
      selectedIssueId: null,
      isHelpModalOpen: false,
      pendingSequence: [],
    })
    localStorage.clear()
  })

  it('renders the label and default keys', () => {
    render(
      <ShortcutSettingsRow
        shortcutId="create-issue"
        label="Create new issue"
        defaultKeys="C"
      />,
    )
    expect(screen.getByText('Create new issue')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('renders an edit button', () => {
    render(
      <ShortcutSettingsRow
        shortcutId="create-issue"
        label="Create new issue"
        defaultKeys="C"
      />,
    )
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
  })

  it('enters editing mode when edit is clicked', () => {
    render(
      <ShortcutSettingsRow
        shortcutId="create-issue"
        label="Create new issue"
        defaultKeys="C"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(screen.getByText(/press keys/i)).toBeInTheDocument()
  })

  it('shows cancel button when editing', () => {
    render(
      <ShortcutSettingsRow
        shortcutId="create-issue"
        label="Create new issue"
        defaultKeys="C"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('updates customization on key press', () => {
    render(
      <ShortcutSettingsRow
        shortcutId="create-issue"
        label="Create new issue"
        defaultKeys="C"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))

    fireEvent.keyDown(document, { key: 'x' })

    const customizations = useKeyboardStore.getState().customizations
    expect(customizations['create-issue']).toBe('x')
  })

  it('shows error on conflict', () => {
    useKeyboardStore.setState({
      customizations: { 'navigate-down': 'j' },
    })

    render(
      <ShortcutSettingsRow
        shortcutId="create-issue"
        label="Create new issue"
        defaultKeys="C"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))

    fireEvent.keyDown(document, { key: 'j' })

    expect(
      screen.getByText(/this key combination is already in use/i),
    ).toBeInTheDocument()
  })

  it('shows reset button when customized', () => {
    useKeyboardStore.setState({
      customizations: { 'create-issue': 'x' },
    })

    render(
      <ShortcutSettingsRow
        shortcutId="create-issue"
        label="Create new issue"
        defaultKeys="C"
      />,
    )

    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('resets customization when reset is clicked', () => {
    useKeyboardStore.setState({
      customizations: { 'create-issue': 'x' },
    })

    render(
      <ShortcutSettingsRow
        shortcutId="create-issue"
        label="Create new issue"
        defaultKeys="C"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /reset/i }))

    const customizations = useKeyboardStore.getState().customizations
    expect(customizations['create-issue']).toBe('C')
  })

  it('cancels editing on Escape key', () => {
    render(
      <ShortcutSettingsRow
        shortcutId="create-issue"
        label="Create new issue"
        defaultKeys="C"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(screen.queryByText(/press keys/i)).not.toBeInTheDocument()
  })
})
