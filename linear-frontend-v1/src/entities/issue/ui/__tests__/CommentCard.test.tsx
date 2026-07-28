import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommentCard } from '../CommentCard'
import type { Comment } from '../../model/types'

const mockComment: Comment = {
  id: 'c1',
  issueId: '1',
  body: 'Original comment body',
  authorId: 'u1',
  authorName: 'John Doe',
  createdAt: '2024-06-15T10:00:00Z',
  updatedAt: '2024-06-15T10:00:00Z',
}

const otherComment: Comment = {
  ...mockComment,
  id: 'c2',
  authorId: 'u2',
  authorName: 'Jane Smith',
  body: 'Other author comment',
}

describe('CommentCard', () => {
  const onEdit = vi.fn()
  const onDelete = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    onEdit.mockResolvedValue(undefined)
    onDelete.mockResolvedValue(undefined)
  })

  describe('rendering', () => {
    it('shows comment body and author name', () => {
      render(<CommentCard comment={mockComment} currentUserId="u1" onEdit={onEdit} onDelete={onDelete} />)
      expect(screen.getByText('Original comment body')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('shows author initials avatar', () => {
      render(<CommentCard comment={mockComment} currentUserId="u1" onEdit={onEdit} onDelete={onDelete} />)
      expect(screen.getByText('JD')).toBeInTheDocument()
    })
  })

  describe('edit button visibility', () => {
    it('shows edit and delete buttons for comment author', () => {
      render(<CommentCard comment={mockComment} currentUserId="u1" onEdit={onEdit} onDelete={onDelete} />)
      expect(screen.getByRole('button', { name: /edit comment/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete comment/i })).toBeInTheDocument()
    })

    it('hides edit and delete buttons for non-author', () => {
      render(<CommentCard comment={mockComment} currentUserId="u2" onEdit={onEdit} onDelete={onDelete} />)
      expect(screen.queryByRole('button', { name: /edit comment/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /delete comment/i })).not.toBeInTheDocument()
    })

    it('hides delete button when onDelete not provided', () => {
      render(<CommentCard comment={mockComment} currentUserId="u1" onEdit={onEdit} />)
      expect(screen.queryByRole('button', { name: /delete comment/i })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /edit comment/i })).toBeInTheDocument()
    })
  })

  describe('edit flow', () => {
    it('enters edit mode and saves', async () => {
      render(<CommentCard comment={mockComment} currentUserId="u1" onEdit={onEdit} onDelete={onDelete} />)
      await user.click(screen.getByRole('button', { name: /edit comment/i }))

      const textarea = screen.getByRole('textbox', { name: /edit comment body/i })
      await user.clear(textarea)
      await user.type(textarea, 'Updated body')
      await user.click(screen.getByRole('button', { name: /save comment/i }))

      await waitFor(() => {
        expect(onEdit).toHaveBeenCalledWith('c1', 'Updated body')
      })
    })

    it('cancels edit and restores original body', async () => {
      render(<CommentCard comment={mockComment} currentUserId="u1" onEdit={onEdit} onDelete={onDelete} />)
      await user.click(screen.getByRole('button', { name: /edit comment/i }))

      const textarea = screen.getByRole('textbox', { name: /edit comment body/i })
      await user.clear(textarea)
      await user.type(textarea, 'Something else')
      await user.click(screen.getByRole('button', { name: /cancel edit/i }))

      expect(screen.getByText('Original comment body')).toBeInTheDocument()
      expect(onEdit).not.toHaveBeenCalled()
    })

    it('Escape key cancels edit', async () => {
      render(<CommentCard comment={mockComment} currentUserId="u1" onEdit={onEdit} onDelete={onDelete} />)
      await user.click(screen.getByRole('button', { name: /edit comment/i }))

      await user.keyboard('{Escape}')
      expect(screen.getByText('Original comment body')).toBeInTheDocument()
    })

    it('shows error on empty body', async () => {
      render(<CommentCard comment={mockComment} currentUserId="u1" onEdit={onEdit} onDelete={onDelete} />)
      await user.click(screen.getByRole('button', { name: /edit comment/i }))

      const textarea = screen.getByRole('textbox', { name: /edit comment body/i })
      await user.clear(textarea)
      await user.click(screen.getByRole('button', { name: /save comment/i }))

      expect(screen.getByRole('alert')).toHaveTextContent('Comment cannot be empty')
      expect(onEdit).not.toHaveBeenCalled()
    })
  })

  describe('delete flow', () => {
    it('opens confirmation dialog', async () => {
      render(<CommentCard comment={mockComment} currentUserId="u1" onEdit={onEdit} onDelete={onDelete} />)
      await user.click(screen.getByRole('button', { name: /delete comment/i }))

      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
    })

    it('confirms delete and calls onDelete', async () => {
      render(<CommentCard comment={mockComment} currentUserId="u1" onEdit={onEdit} onDelete={onDelete} />)
      await user.click(screen.getByRole('button', { name: /delete comment/i }))
      await user.click(screen.getByRole('button', { name: /confirm delete/i }))

      await waitFor(() => {
        expect(onDelete).toHaveBeenCalledWith('c1')
      })
    })

    it('cancels delete', async () => {
      render(<CommentCard comment={mockComment} currentUserId="u1" onEdit={onEdit} onDelete={onDelete} />)
      await user.click(screen.getByRole('button', { name: /delete comment/i }))
      await user.click(screen.getByRole('button', { name: /cancel delete/i }))

      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
      expect(onDelete).not.toHaveBeenCalled()
    })

    it('Escape closes delete confirmation', async () => {
      render(<CommentCard comment={mockComment} currentUserId="u1" onEdit={onEdit} onDelete={onDelete} />)
      await user.click(screen.getByRole('button', { name: /delete comment/i }))

      await user.keyboard('{Escape}')
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })

    it('shows error banner on delete failure', async () => {
      onDelete.mockRejectedValue(new Error('Permission denied'))
      render(<CommentCard comment={mockComment} currentUserId="u1" onEdit={onEdit} onDelete={onDelete} />)
      await user.click(screen.getByRole('button', { name: /delete comment/i }))
      await user.click(screen.getByRole('button', { name: /confirm delete/i }))

      await waitFor(() => {
        expect(screen.getByText('Permission denied')).toBeInTheDocument()
      })
    })
  })
})
