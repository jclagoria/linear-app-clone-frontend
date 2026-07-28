import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IssueStatusBadge } from '../IssueStatusBadge'

describe('IssueStatusBadge', () => {
  const onStatusChange = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders current status with label', () => {
    render(<IssueStatusBadge statusId="Todo" onStatusChange={onStatusChange} />)
    expect(screen.getByRole('combobox')).toHaveTextContent('Todo')
  })

  it('opens dropdown on click', async () => {
    render(<IssueStatusBadge statusId="Todo" onStatusChange={onStatusChange} />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(5)
  })

  it('calls onStatusChange when selecting a different status', async () => {
    render(<IssueStatusBadge statusId="Todo" onStatusChange={onStatusChange} />)
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: /In Progress/i }))
    expect(onStatusChange).toHaveBeenCalledWith('In Progress')
  })

  it('does not call onStatusChange when selecting the same status', async () => {
    render(<IssueStatusBadge statusId="Todo" onStatusChange={onStatusChange} />)
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: /Todo/i }))
    expect(onStatusChange).not.toHaveBeenCalled()
  })

  it('closes dropdown on Escape', async () => {
    render(<IssueStatusBadge statusId="Todo" onStatusChange={onStatusChange} />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('closes dropdown on outside click', async () => {
    render(
      <div>
        <span data-testid="outside">outside</span>
        <IssueStatusBadge statusId="Todo" onStatusChange={onStatusChange} />
      </div>,
    )
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    await user.click(screen.getByTestId('outside'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('shows spinner and disabled when loading', () => {
    render(<IssueStatusBadge statusId="Todo" loading onStatusChange={onStatusChange} />)
    const button = screen.getByRole('combobox')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('cannot open dropdown when loading', async () => {
    render(<IssueStatusBadge statusId="Todo" loading onStatusChange={onStatusChange} />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('marks current status as selected in dropdown', async () => {
    render(<IssueStatusBadge statusId="In Progress" onStatusChange={onStatusChange} />)
    await user.click(screen.getByRole('combobox'))
    const selected = screen.getByRole('option', { name: /In Progress/i })
    expect(selected).toHaveAttribute('aria-selected', 'true')
  })
})
