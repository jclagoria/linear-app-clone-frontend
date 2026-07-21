import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IssueStatusBadge } from '@/entities/issue/ui/IssueStatusBadge'

describe('IssueStatusBadge', () => {
  it('renders the current status label', () => {
    render(<IssueStatusBadge status="Todo" onStatusChange={() => {}} />)
    expect(screen.getByRole('combobox')).toHaveTextContent('Todo')
  })

  it('renders with correct ARIA attributes', () => {
    render(<IssueStatusBadge status="In Progress" onStatusChange={() => {}} />)
    const button = screen.getByRole('combobox')
    expect(button).toHaveAttribute('aria-haspopup', 'listbox')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-label', 'Status: In Progress. Click to change')
  })

  it('shows loading state with aria-busy', () => {
    render(<IssueStatusBadge status="Todo" loading onStatusChange={() => {}} />)
    const button = screen.getByRole('combobox')
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toBeDisabled()
  })

  it('opens dropdown on click', async () => {
    const user = userEvent.setup()
    render(<IssueStatusBadge status="Todo" onStatusChange={() => {}} />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(5)
  })

  it('calls onStatusChange when selecting a different status', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    render(<IssueStatusBadge status="Todo" onStatusChange={handleChange} />)

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByText('In Progress'))

    expect(handleChange).toHaveBeenCalledWith('In Progress')
  })

  it('does not call onStatusChange when selecting the same status', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    render(<IssueStatusBadge status="Todo" onStatusChange={handleChange} />)

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: /Todo/ }))

    expect(handleChange).not.toHaveBeenCalled()
  })
})
