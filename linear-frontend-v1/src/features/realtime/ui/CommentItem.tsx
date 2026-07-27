import { cn } from '@/shared/lib/utils'
import { User } from 'lucide-react'

export interface CommentItemData {
  id: string
  issueId: string
  body: string
  authorId: string
  authorName: string
  createdAt: string
  updatedAt: string
}

interface CommentItemProps {
  comment: CommentItemData
  isOptimistic?: boolean
  isReverted?: boolean
  className?: string
}

export function CommentItem({
  comment,
  isOptimistic = false,
  isReverted = false,
  className,
}: CommentItemProps) {
  return (
    <div
      className={cn(
        'flex gap-3 p-4 border-b border-[var(--border-color)]',
        isOptimistic && 'animate-pulse opacity-80',
        isReverted && 'ring-2 ring-red-500',
        className,
      )}
      role="article"
      aria-label={`Comment by ${comment.authorName}`}
    >
      <div className="shrink-0">
        <div className="h-8 w-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
          <User className="h-4 w-4 text-[var(--text-secondary)]" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {comment.authorName}
          </span>
          <span className="text-xs text-[var(--text-secondary)]">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </div>
        <div className="text-sm text-[var(--text-primary)] whitespace-pre-wrap">
          {comment.body}
        </div>
      </div>
    </div>
  )
}
