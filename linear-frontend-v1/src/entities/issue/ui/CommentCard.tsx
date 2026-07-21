import type { Comment } from '../model/types'

interface CommentCardProps {
  comment: Comment
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

export function CommentCard({ comment }: CommentCardProps) {
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
        </div>
        <p className="mt-1 whitespace-pre-wrap text-sm text-text">
          {comment.body}
        </p>
      </div>
    </div>
  )
}
