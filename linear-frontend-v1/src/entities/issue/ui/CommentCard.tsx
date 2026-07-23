import { useCallback, useRef, useState } from 'react'
import { Pencil } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/lib/utils'
import type { Comment } from '../model/types'

interface CommentCardProps {
  comment: Comment
  currentUserId: string | null
  onEdit: (commentId: string, body: string) => Promise<void>
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

export function CommentCard({ comment, currentUserId, onEdit }: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editBody, setEditBody] = useState(comment.body)
  const [saving, setSaving] = useState(false)
  const [emptyBodyError, setEmptyBodyError] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const editButtonRef = useRef<HTMLButtonElement>(null)

  const isAuthor = currentUserId !== null && comment.authorId === currentUserId

  const handleStartEdit = useCallback(() => {
    setEditBody(comment.body)
    setIsEditing(true)
    setEmptyBodyError(false)
    requestAnimationFrame(() => textareaRef.current?.focus())
  }, [comment.body])

  const handleCancel = useCallback(() => {
    setEditBody(comment.body)
    setIsEditing(false)
    setEmptyBodyError(false)
    requestAnimationFrame(() => editButtonRef.current?.focus())
  }, [comment.body])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel()
      }
    },
    [handleCancel],
  )

  const handleSave = useCallback(async () => {
    const trimmed = editBody.trim()
    if (trimmed.length === 0) {
      setEmptyBodyError(true)
      return
    }

    setSaving(true)
    setEmptyBodyError(false)
    try {
      await onEdit(comment.id, trimmed)
      setIsEditing(false)
      requestAnimationFrame(() => editButtonRef.current?.focus())
    } catch {
      setSaving(false)
    }
  }, [editBody, comment.id, onEdit])

  return (
    <div className="flex gap-3 rounded-lg border border-border bg-surface p-4">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-text-inverse"
        aria-hidden="true"
      >
        {initials(comment.authorName)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-text">
            {comment.authorName}
          </span>
          <span className="text-xs text-text-muted">
            {formatTimestamp(comment.createdAt)}
          </span>
          {isAuthor && !isEditing && (
            <button
              ref={editButtonRef}
              type="button"
              onClick={handleStartEdit}
              className={cn(
                'ml-auto inline-flex items-center justify-center rounded p-1 text-text-muted transition-colors',
                'hover:bg-surface-alt hover:text-text',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
              )}
              aria-label="Edit comment"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2 space-y-2" onKeyDown={handleKeyDown}>
            <textarea
              ref={textareaRef}
              value={editBody}
              onChange={(e) => {
                setEditBody(e.target.value)
                if (emptyBodyError && e.target.value.trim().length > 0) {
                  setEmptyBodyError(false)
                }
              }}
              disabled={saving}
              rows={3}
              className={cn(
                'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text placeholder-text-muted',
                'focus:outline-none focus:ring-2 focus:ring-primary',
                'disabled:pointer-events-none disabled:opacity-50',
                emptyBodyError && 'border-danger focus:ring-danger',
              )}
              aria-label="Edit comment body"
              aria-invalid={emptyBodyError}
              aria-describedby={emptyBodyError ? 'comment-empty-error' : undefined}
            />
            {emptyBodyError && (
              <p id="comment-empty-error" className="text-xs text-danger" role="alert">
                Comment cannot be empty
              </p>
            )}
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                loading={saving}
                disabled={saving}
                onClick={handleSave}
                aria-label="Save comment"
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={saving}
                onClick={handleCancel}
                aria-label="Cancel edit"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-1 whitespace-pre-wrap text-sm text-text">
            {comment.body}
          </p>
        )}
      </div>
    </div>
  )
}
