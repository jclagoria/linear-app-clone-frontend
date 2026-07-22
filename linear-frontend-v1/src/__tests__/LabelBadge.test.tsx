import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LabelBadge } from '@/entities/label/ui/LabelBadge'

const mockLabel = {
  id: 'l1',
  name: 'Bug',
  color: '#ef4444',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
}

describe('LabelBadge', () => {
  it('renders the label name', () => {
    render(<LabelBadge label={mockLabel} />)
    expect(screen.getByText('Bug')).toBeInTheDocument()
  })

  it('applies the label color as text color', () => {
    render(<LabelBadge label={mockLabel} />)
    const badge = screen.getByRole('listitem')
    expect(badge).toHaveStyle({ color: '#ef4444' })
  })

  it('has correct ARIA role', () => {
    render(<LabelBadge label={mockLabel} />)
    expect(screen.getByRole('listitem')).toBeInTheDocument()
  })

  it('does not show remove button when removable is not set', () => {
    render(<LabelBadge label={mockLabel} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('does not show remove button when removable is false', () => {
    render(<LabelBadge label={mockLabel} removable={false} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  describe('when removable', () => {
    it('shows remove button', () => {
      render(<LabelBadge label={mockLabel} removable />)
      expect(
        screen.getByRole('button', { name: /Remove Bug label/i }),
      ).toBeInTheDocument()
    })

    it('calls onRemove with label id when clicked', async () => {
      const handleRemove = vi.fn()
      const user = userEvent.setup()

      render(
        <LabelBadge label={mockLabel} removable onRemove={handleRemove} />,
      )

      await user.click(screen.getByRole('button', { name: /Remove Bug label/i }))
      expect(handleRemove).toHaveBeenCalledWith('l1')
    })

    it('does not call onRemove when disabled', async () => {
      const handleRemove = vi.fn()
      const user = userEvent.setup()

      render(
        <LabelBadge
          label={mockLabel}
          removable
          onRemove={handleRemove}
          disabled
        />,
      )

      await user.click(screen.getByRole('button', { name: /Remove Bug label/i }))
      expect(handleRemove).not.toHaveBeenCalled()
    })

    it('has disabled attribute on remove button when disabled', () => {
      render(
        <LabelBadge label={mockLabel} removable disabled />,
      )

      const button = screen.getByRole('button', { name: /Remove Bug label/i })
      expect(button).toBeDisabled()
    })
  })

  describe('disabled state', () => {
    it('adds opacity class when disabled', () => {
      render(<LabelBadge label={mockLabel} disabled />)
      const badge = screen.getByRole('listitem')
      expect(badge.className).toContain('opacity-50')
    })

    it('adds pointer-events-none class when disabled', () => {
      render(<LabelBadge label={mockLabel} disabled />)
      const badge = screen.getByRole('listitem')
      expect(badge.className).toContain('pointer-events-none')
    })
  })
})
