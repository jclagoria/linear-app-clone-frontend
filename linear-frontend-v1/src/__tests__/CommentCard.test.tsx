import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommentCard } from '@/entities/issue/ui/CommentCard'
import type { Comment } from '@/entities/issue/model/types'

const authorComment: Comment = {
  id: 'c1',
  issueId: 'i1',
  body: 'This is a test comment body',
  authorId: 'u1',
  authorName: 'John Doe',
  createdAt: '2024-01-01T12:00:00Z',
  updatedAt: '2024-01-01T12:00:00Z',
}

const nonAuthorComment: Comment = {
  ...authorComment,
  authorId: 'u2',
  authorName: 'Jane Smith',
}

describe('CommentCard', () => {
  const onEdit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('edit button visibility', () => {
    it('renders edit button for comment author', () => {
      render(
        <CommentCard comment={authorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      expect(screen.getByRole('button', { name: /edit comment/i })).toBeInTheDocument()
    })

    it('does not render edit button for non-author', () => {
      render(
        <CommentCard comment={nonAuthorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      expect(screen.queryByRole('button', { name: /edit comment/i })).not.toBeInTheDocument()
    })

    it('does not render edit button when currentUserId is null', () => {
      render(
        <CommentCard comment={authorComment} currentUserId={null} onEdit={onEdit} />,
      )

      expect(screen.queryByRole('button', { name: /edit comment/i })).not.toBeInTheDocument()
    })
  })

  describe('edit mode toggle', () => {
    it('shows textarea with pre-filled body on edit click', async () => {
      const user = userEvent.setup()
      render(
        <CommentCard comment={authorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      await user.click(screen.getByRole('button', { name: /edit comment/i }))

      const textarea = screen.getByRole('textbox', { name: /edit comment body/i })
      expect(textarea).toBeInTheDocument()
      expect(textarea).toHaveValue(authorComment.body)
    })

    it('hides edit button while editing', async () => {
      const user = userEvent.setup()
      render(
        <CommentCard comment={authorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      await user.click(screen.getByRole('button', { name: /edit comment/i }))

      expect(screen.queryByRole('button', { name: /edit comment/i })).not.toBeInTheDocument()
    })
  })

  describe('cancel', () => {
    it('restores original body and exits edit mode on cancel', async () => {
      const user = userEvent.setup()
      render(
        <CommentCard comment={authorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      await user.click(screen.getByRole('button', { name: /edit comment/i }))

      const textarea = screen.getByRole('textbox', { name: /edit comment body/i })
      await user.clear(textarea)
      await user.type(textarea, 'Modified body')

      await user.click(screen.getByRole('button', { name: /cancel edit/i }))

      expect(screen.getByText(authorComment.body)).toBeInTheDocument()
      expect(screen.queryByRole('textbox', { name: /edit comment body/i })).not.toBeInTheDocument()
    })

    it('returns focus to edit button after cancel', async () => {
      const user = userEvent.setup()
      render(
        <CommentCard comment={authorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      const editButton = screen.getByRole('button', { name: /edit comment/i })
      await user.click(editButton)
      await user.click(screen.getByRole('button', { name: /cancel edit/i }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /edit comment/i })).toHaveFocus()
      })
    })
  })

  describe('save', () => {
    it('calls onEdit with comment id and trimmed body', async () => {
      onEdit.mockResolvedValue(undefined)
      const user = userEvent.setup()
      render(
        <CommentCard comment={authorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      await user.click(screen.getByRole('button', { name: /edit comment/i }))

      const textarea = screen.getByRole('textbox', { name: /edit comment body/i })
      await user.clear(textarea)
      await user.type(textarea, 'Updated body')

      await user.click(screen.getByRole('button', { name: /save comment/i }))

      expect(onEdit).toHaveBeenCalledWith('c1', 'Updated body')
    })

    it('is disabled during saving state', async () => {
      let resolvePromise!: (value: unknown) => void
      onEdit.mockReturnValue(new Promise((resolve) => { resolvePromise = resolve }))

      const user = userEvent.setup()
      render(
        <CommentCard comment={authorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      // Click edit and wait for the textarea to appear
      await user.click(screen.getByRole('button', { name: /edit comment/i }))

      // Wait for edit mode - textarea should appear
      const textarea = await screen.findByRole('textbox', { name: /edit comment body/i })
      expect(textarea).toBeInTheDocument()

      // Click save
      const saveButton = screen.getByRole('button', { name: /save comment/i })
      await user.click(saveButton)

      // Button should be disabled during save
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /save comment/i })).toBeDisabled()
      })

      // Resolve the save
      resolvePromise(undefined)

      // Wait for save to complete and edit mode to exit
      await waitFor(() => {
        expect(screen.queryByRole('textbox', { name: /edit comment body/i })).not.toBeInTheDocument()
      })
    })

    it('exits edit mode on successful save', async () => {
      onEdit.mockResolvedValue(undefined)
      const user = userEvent.setup()
      render(
        <CommentCard comment={authorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      await user.click(screen.getByRole('button', { name: /edit comment/i }))
      await user.click(screen.getByRole('button', { name: /save comment/i }))

      await waitFor(() => {
        expect(screen.queryByRole('textbox', { name: /edit comment body/i })).not.toBeInTheDocument()
      })
    })

    it('returns focus to edit button after save completes', async () => {
      onEdit.mockResolvedValue(undefined)
      const user = userEvent.setup()
      render(
        <CommentCard comment={authorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      await user.click(screen.getByRole('button', { name: /edit comment/i }))
      await user.click(screen.getByRole('button', { name: /save comment/i }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /edit comment/i })).toHaveFocus()
      })
    })
  })

  describe('save button disabled state', () => {
    it('save button is not disabled when body is empty (validation shows instead)', async () => {
      const user = userEvent.setup()
      render(
        <CommentCard comment={{ ...authorComment, body: '' }} currentUserId="u1" onEdit={onEdit} />,
      )

      await user.click(screen.getByRole('button', { name: /edit comment/i }))

      expect(screen.getByRole('button', { name: /save comment/i })).not.toBeDisabled()
    })

    it('save button is not disabled when body is only whitespace', async () => {
      const user = userEvent.setup()
      render(
        <CommentCard comment={authorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      await user.click(screen.getByRole('button', { name: /edit comment/i }))

      const textarea = screen.getByRole('textbox', { name: /edit comment body/i })
      await user.clear(textarea)
      await user.type(textarea, '   ')

      expect(screen.getByRole('button', { name: /save comment/i })).not.toBeDisabled()
    })
  })

  describe('empty body validation', () => {
    it('shows error message when trying to save empty body', async () => {
      const user = userEvent.setup()
      render(
        <CommentCard comment={authorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      await user.click(screen.getByRole('button', { name: /edit comment/i }))

      const textarea = screen.getByRole('textbox', { name: /edit comment body/i })
      await user.clear(textarea)

      await user.click(screen.getByRole('button', { name: /save comment/i }))

      expect(screen.getByText('Comment cannot be empty')).toBeInTheDocument()
      expect(onEdit).not.toHaveBeenCalled()
    })

    it('clears error when user types into textarea', async () => {
      const user = userEvent.setup()
      render(
        <CommentCard comment={authorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      await user.click(screen.getByRole('button', { name: /edit comment/i }))

      const textarea = screen.getByRole('textbox', { name: /edit comment body/i })
      await user.clear(textarea)
      await user.click(screen.getByRole('button', { name: /save comment/i }))

      expect(screen.getByText('Comment cannot be empty')).toBeInTheDocument()

      await user.type(textarea, 'a')

      expect(screen.queryByText('Comment cannot be empty')).not.toBeInTheDocument()
    })

    it('marks textarea as invalid when empty body error is shown', async () => {
      const user = userEvent.setup()
      render(
        <CommentCard comment={authorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      await user.click(screen.getByRole('button', { name: /edit comment/i }))

      const textarea = screen.getByRole('textbox', { name: /edit comment body/i })
      await user.clear(textarea)
      await user.click(screen.getByRole('button', { name: /save comment/i }))

      expect(textarea).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('Escape key', () => {
    it('cancels edit mode on Escape key', async () => {
      const user = userEvent.setup()
      render(
        <CommentCard comment={authorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      await user.click(screen.getByRole('button', { name: /edit comment/i }))

      const textarea = screen.getByRole('textbox', { name: /edit comment body/i })
      await user.clear(textarea)
      await user.type(textarea, 'Modified body')
      await user.keyboard('{Escape}')

      expect(screen.getByText(authorComment.body)).toBeInTheDocument()
      expect(screen.queryByRole('textbox', { name: /edit comment body/i })).not.toBeInTheDocument()
    })
  })

  describe('author name and timestamp', () => {
    it('displays author name', () => {
      render(
        <CommentCard comment={authorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('displays initials avatar', () => {
      render(
        <CommentCard comment={authorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('displays comment body text', () => {
      render(
        <CommentCard comment={authorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      expect(screen.getByText(authorComment.body)).toBeInTheDocument()
    })
  })

  describe('aria labels', () => {
    it('has aria-label on edit button', () => {
      render(
        <CommentCard comment={authorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      expect(screen.getByRole('button', { name: /edit comment/i })).toHaveAttribute('aria-label', 'Edit comment')
    })

    it('has aria-label on textarea', async () => {
      const user = userEvent.setup()
      render(
        <CommentCard comment={authorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      await user.click(screen.getByRole('button', { name: /edit comment/i }))

      expect(screen.getByRole('textbox', { name: /edit comment body/i })).toHaveAttribute('aria-label', 'Edit comment body')
    })

    it('has aria-label on save button', async () => {
      const user = userEvent.setup()
      render(
        <CommentCard comment={authorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      await user.click(screen.getByRole('button', { name: /edit comment/i }))

      expect(screen.getByRole('button', { name: /save comment/i })).toHaveAttribute('aria-label', 'Save comment')
    })

    it('has aria-label on cancel button', async () => {
      const user = userEvent.setup()
      render(
        <CommentCard comment={authorComment} currentUserId="u1" onEdit={onEdit} />,
      )

      await user.click(screen.getByRole('button', { name: /edit comment/i }))

      expect(screen.getByRole('button', { name: /cancel edit/i })).toHaveAttribute('aria-label', 'Cancel edit')
    })
  })
})
