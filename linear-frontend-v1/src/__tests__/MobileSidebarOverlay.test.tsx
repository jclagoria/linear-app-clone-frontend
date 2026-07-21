import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { MobileSidebarOverlay } from '@/widgets/Sidebar/ui/MobileSidebarOverlay'

function renderOverlay(isOpen = false, onClose = vi.fn()) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <MobileSidebarOverlay isOpen={isOpen} onClose={onClose} />
    </MemoryRouter>,
  )
}

describe('MobileSidebarOverlay', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('renders nav items when open', () => {
    renderOverlay(true)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Issues')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Cycles')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('does not show content when closed (translate-x-negative)', () => {
    const { container } = renderOverlay(false)
    const aside = container.querySelector('[role="dialog"]')
    expect(aside?.className).toContain('-translate-x-full')
  })

  it('shows content when open (translate-x-0)', () => {
    const { container } = renderOverlay(true)
    const aside = container.querySelector('[role="dialog"]')
    expect(aside?.className).toContain('translate-x-0')
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn()
    renderOverlay(true, onClose)

    // Click the backdrop using its class/role
    const backdrop = document.querySelector('[aria-hidden="true"]')
    expect(backdrop).toBeInTheDocument()

    if (backdrop) {
      await userEvent.click(backdrop)
      expect(onClose).toHaveBeenCalled()
    }
  })

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn()
    renderOverlay(true, onClose)

    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })

  it('close buttons call onClose when clicked', async () => {
    const onClose = vi.fn()
    renderOverlay(true, onClose)

    // Multiple elements might have "Close menu" label; click the first button
    const closeElements = screen.getAllByLabelText('Close menu')
    expect(closeElements.length).toBeGreaterThanOrEqual(1)

    await userEvent.click(closeElements[0])
    expect(onClose).toHaveBeenCalled()
  })

  it('sets aria-modal on the dialog', () => {
    renderOverlay(true)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('navigates and closes when nav link is clicked', async () => {
    const onClose = vi.fn()
    renderOverlay(true, onClose)

    const issuesLink = screen.getByText('Issues')
    await userEvent.click(issuesLink)
    expect(onClose).toHaveBeenCalled()
  })
})
