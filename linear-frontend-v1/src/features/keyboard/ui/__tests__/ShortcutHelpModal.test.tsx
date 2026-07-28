import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ShortcutHelpModal } from '../ShortcutHelpModal'
import { resetStores } from '@/__tests__/test-utils'
import { useKeyboardStore } from '../../model/useKeyboardStore'
import { useModalStore } from '@/shared/stores/modalStore'

describe('ShortcutHelpModal', () => {
  beforeEach(() => {
    resetStores()
    useKeyboardStore.setState({
      context: 'global',
      customizations: {},
    })
    useModalStore.setState({ stack: [], topId: null })
    document.body.innerHTML = ''
  })

  it('renders nothing when closed', () => {
    const { container } = render(
      <ShortcutHelpModal isOpen={false} onClose={vi.fn()} />,
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders the modal with shortcuts when open', () => {
    render(<ShortcutHelpModal isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument()
  })

  it('renders category filter tabs', () => {
    render(<ShortcutHelpModal isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByRole('tab', { name: /all/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /global/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /list/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /issue/i })).toBeInTheDocument()
  })

  it('filters shortcuts by category when tab is clicked', () => {
    render(<ShortcutHelpModal isOpen={true} onClose={vi.fn()} />)

    const globalTab = screen.getByRole('tab', { name: /global/i })
    fireEvent.click(globalTab)

    expect(globalTab).toHaveAttribute('aria-selected', 'true')

    const allTab = screen.getByRole('tab', { name: /all/i })
    expect(allTab).toHaveAttribute('aria-selected', 'false')
  })

  it('renders shortcut descriptions', () => {
    render(<ShortcutHelpModal isOpen={true} onClose={vi.fn()} />)

    expect(screen.getByText('Create new issue')).toBeInTheDocument()
    expect(screen.getByText('Open search')).toBeInTheDocument()
    expect(screen.getByText('Show keyboard shortcuts')).toBeInTheDocument()
  })

  it('renders shortcut key labels via kbd elements', () => {
    render(<ShortcutHelpModal isOpen={true} onClose={vi.fn()} />)

    const kbdElements = document.body.querySelectorAll('kbd')
    expect(kbdElements.length).toBeGreaterThan(0)
  })

  it('renders shortcut keys in the modal', () => {
    render(<ShortcutHelpModal isOpen={true} onClose={vi.fn()} />)

    expect(screen.getByText('C')).toBeInTheDocument()
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('displays close (x) button in modal', () => {
    render(<ShortcutHelpModal isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByLabelText('Close')).toBeInTheDocument()
  })
})
