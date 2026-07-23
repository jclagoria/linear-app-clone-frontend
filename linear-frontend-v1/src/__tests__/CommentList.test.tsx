import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommentList } from '@/entities/issue/ui/CommentList'
import type { Comment } from '@/entities/issue/model/types'

const mockComments: Comment[] = [
  {
    id: 'c1',
    issueId: 'i1',
    body: 'First comment',
    authorId: 'u1',
    authorName: 'Alice',
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-01T12:00:00Z',
  },
  {
    id: 'c2',
    issueId: 'i1',
    body: 'Second comment',
    authorId: 'u2',
    authorName: 'Bob',
    createdAt: '2024-01-02T12:00:00Z',
    updatedAt: '2024-01-02T12:00:00Z',
  },
]

describe('CommentList', () => {
  const onEditComment = vi.fn()

  describe('empty state', () => {
    it('renders empty state when no comments', () => {
      render(
        <CommentList comments={[]} currentUserId="u1" onEditComment={onEditComment} />,
      )

      expect(screen.getByText('No comments yet')).toBeInTheDocument()
      expect(screen.getByText('Be the first to share your thoughts.')).toBeInTheDocument()
    })

    it('does not render comment count heading when empty', () => {
      render(
        <CommentList comments={[]} currentUserId="u1" onEditComment={onEditComment} />,
      )

      expect(screen.queryByText(/Comments \(\d+\)/i)).not.toBeInTheDocument()
    })
  })

  describe('with comments', () => {
    it('renders comment count heading', () => {
      render(
        <CommentList comments={mockComments} currentUserId="u1" onEditComment={onEditComment} />,
      )

      expect(screen.getByText('Comments (2)')).toBeInTheDocument()
    })

    it('renders all comments', () => {
      render(
        <CommentList comments={mockComments} currentUserId="u1" onEditComment={onEditComment} />,
      )

      expect(screen.getByText('First comment')).toBeInTheDocument()
      expect(screen.getByText('Second comment')).toBeInTheDocument()
    })

    it('renders author names', () => {
      render(
        <CommentList comments={mockComments} currentUserId="u1" onEditComment={onEditComment} />,
      )

      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
    })
  })

  describe('edit button for current user', () => {
    it('shows edit button for current user on their own comment', () => {
      render(
        <CommentList comments={mockComments} currentUserId="u1" onEditComment={onEditComment} />,
      )

      expect(screen.getAllByRole('button', { name: /edit comment/i })).toHaveLength(1)
    })

    it('does not show edit button for non-author', () => {
      render(
        <CommentList comments={mockComments} currentUserId="u3" onEditComment={onEditComment} />,
      )

      expect(screen.queryByRole('button', { name: /edit comment/i })).not.toBeInTheDocument()
    })
  })

  describe('aria attributes', () => {
    it('has role="list" on the container', () => {
      render(
        <CommentList comments={mockComments} currentUserId="u1" onEditComment={onEditComment} />,
      )

      expect(screen.getByRole('list')).toBeInTheDocument()
    })

    it('has aria-label on the list', () => {
      render(
        <CommentList comments={mockComments} currentUserId="u1" onEditComment={onEditComment} />,
      )

      expect(screen.getByRole('list')).toHaveAttribute('aria-label', 'Comments')
    })

    it('each comment has role="listitem"', () => {
      render(
        <CommentList comments={mockComments} currentUserId="u1" onEditComment={onEditComment} />,
      )

      expect(screen.getAllByRole('listitem')).toHaveLength(2)
    })
  })
})
