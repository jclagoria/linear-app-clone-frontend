import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DeleteConfirmModal } from '../DeleteConfirmModal'
import { useModalStore } from '@/shared/stores/modalStore'

describe('DeleteConfirmModal', () => {
  beforeEach(() => {
    useModalStore.setState({ stack: [], topId: null })
    document.body.innerHTML = ''
  })

  it('renders nothing when closed', () => {
    const { container } = render(
      <DeleteConfirmModal
        isOpen={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete item"
        message="Are you sure?"
      />,
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders the modal when open', () => {
    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete item"
        message="Are you sure?"
      />,
    )
    expect(screen.getByText('Delete item')).toBeInTheDocument()
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  })

  it('calls onConfirm and onClose when delete is clicked', () => {
    const onConfirm = vi.fn()
    const onClose = vi.fn()

    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Delete"
        message="Are you sure?"
      />,
    )

    const deleteBtn = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteBtn)

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when cancel is clicked', () => {
    const onClose = vi.fn()

    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={vi.fn()}
        title="Delete"
        message="Are you sure?"
      />,
    )

    const cancelBtn = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelBtn)

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
